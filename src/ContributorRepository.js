/*
    Lower level utility methods to fetch data from github and preprocess that data
*/
const octokit = require("@octokit/rest");
const githubApi = new octokit();
const async = require('async');
const Repository = require('./Repository.js');
const Profile = require('./Profile.js');
const settings = require('./settings.js');

function getContributorsByOrg(organization) {
    return getReposByOrg(organization).then((data) => {
        return async.mapLimit(data, 10, async function (repository) {
            const contributorPromise = await getContributorsByRepo(organization, repository["name"]);
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
                "User-Agent": settings.organization
            }
        });
    // collect all contributors for a repo, map them to Profile class
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

function getReposByOrg(organization) {
    return new Promise((resolve, reject) => {
        var options = githubApi.repos.listForOrg.endpoint.merge({
            org: organization,
            type: "all",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: settings.access_token,
                "User-Agent": settings.organization
            }
        });
    // collect all repos for an organization, map the data to Repositor class and return
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
// Flatten 2D array consisting of unique users
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