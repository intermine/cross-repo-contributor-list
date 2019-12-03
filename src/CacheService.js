const NodeCache = require('node-cache');

class Cache {
    constructor(ttlSeconds) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
        });
    }
    // get contributors from cache 
    get(key, gitHubApi) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }
    // or get it from github
        return gitHubApi.then((result) => {
            this.cache.set(key, result);
            return result;
        }).catch(error=>{
            return error;
        });
    }

    flush(){
        this.cache.flushAll();
    }
    
}
module.exports = Cache;