const octokit = require("@octokit/rest");
const githubApi = new octokit();
const async = require('async');
const Repository = require('./Repository.js');
const Profile = require('./Profile.js');
const settings = require('./settings.js');

function getContributorsByOrg(organisation) {
    return getReposByOrg(organisation).then((data) => {
        return async.mapLimit(data, 10, async function (repository) {
            const contributorPromise = await getContributorsByRepo(organisation, repository["name"]);
            return contributorPromise;
        });
    }).then(async (result) => {
        result = await preProcess(result).then(result => {
            return result;
        });
        return result;
    });
}

function getContributorsByRepo(org, repositoryName) {
    return new Promise(function (resolveContributors, rejectContributors) {
        var options = githubApi.repos.listContributors.endpoint.merge({
            owner: org,
            repo: repositoryName,
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: settings.access_token,
                "User-Agent": settings.organisation
            }
        });
        githubApi.paginate(options)
            .then(data => {
                data = data
                    .filter(p => p != undefined)
                    .map(p => (new Profile(p)));
                resolveContributors(data);
            })
            .catch(contributorPaginationError => {
                rejectContributors(contributorPaginationError);
            });
    });
}

function getReposByOrg(organisation) {
    return new Promise((resolve, reject) => {
        var options = githubApi.repos.listForOrg.endpoint.merge({
            org: organisation,
            type: "all",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: settings.access_token,
                "User-Agent": settings.organisation
            }
        });
        githubApi.paginate(options)
            .then(data => {
                data = data
                    .filter(p => p != undefined)
                    .map(p => (new Repository(p)));
                resolve(data);
            })
            .catch(repoPaginationError => {
                reject(repoPaginationError);
            });
    });
}
function preProcess(data) {
    return new Promise(async (resolve, reject) => {
        data = Array.prototype.concat.apply([], data);
        let map = new Map();
        await data.forEach((item) => {
            map.set(item['id'], item);
        });
        resolve(Array.from(map.values()));
    });
}
exports.getContributorsByOrg = getContributorsByOrg;