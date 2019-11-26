const ContributorService = require('./ContributorService.js');
const settings = require('./settings.js');
const cors = require('cors');

const appRouter = function(app){

    app.get('/contributors',cors(),async (req,res)=>{
        res.status(200).send(await ContributorService.getContributorByOrganisation(settings.organisation));
    });
    app.delete('/flushAll',cors(),(req,res)=>{
        ContributorService.flushAll();
        res.status(200).send("Successfully flushed the cache");
    });
}
module.exports = appRouter;