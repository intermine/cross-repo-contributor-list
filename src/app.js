const express = require('express');
const routes = require('./Routes.js');
const app = express();

routes(app);

var port = process.env.PORT || 5000;

const server = app.listen(port,function(){
    console.log("Server now listening on port: ",port);
});
