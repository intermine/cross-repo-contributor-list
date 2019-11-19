const ContributorRepository = require('./ContributorRepository');
const contributors = ContributorRepository.getContributorsByOrg;
const CacheService = require('./CacheService.js');
const settings = require('./settings.js');

const cache = new CacheService(settings.timeToLive);

cache.cache.on('expired', (key, value) => {
    ContributorService.flushAll();
    console.info("Cache flushed automatically on expiration for key ", key);
    ContributorService.getContributorByOrganisation(key).then(data => {
        console.info("Repopulated the cache");
    });
});
const ContributorService = {
    getContributorByOrganisation(organisationName) {
        return cache.get(organisationName, contributors(organisationName).then(result=>{
            return result;
        })).then(contributors => {
            return contributors;
        });
    },
    flushAll() {
        cache.flush();
    }
}
module.exports = ContributorService;