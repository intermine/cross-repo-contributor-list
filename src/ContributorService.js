/*
    Middle level service methods which interact with CacheService and ContributorRepository
*/
const ContributorRepository = require('./ContributorRepository');
const getContributors = ContributorRepository.getContributorsByOrg;
const CacheService = require('./CacheService.js');
const settings = require('./settings.js');

const cache = new CacheService(settings.timeToLive);

// Repopulate cache when ttl for key expires
cache.cache.on('expired', (key, value) => {
    ContributorService.flushAll();
    console.info("Cache flushed automatically on expiration for key ", key);
    ContributorService.getContributorByOrganisation(key).then(data => {
        console.info("Repopulated the cache");
    });
});
const ContributorService = {
    getContributorByOrganisation(organisationName) {
        /* 
            Data is fetched from Repository layer if not found in cache.
            getContributors(organisationName) is lower level Repository method, which
            can be replaced with some other data source.
        */
        return cache.get(organisationName, getContributors(organisationName).then(result => {
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