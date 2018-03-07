const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const awsConfig = require('./configuration/awsConfig');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

AWS.config.update({
    secretAccessKey: awsConfig.SECRET_ACCESS_KEY,
    accessKeyId: awsConfig.ACCESS_KEY_ID,
    region: awsConfig.REGION
});

const packages = {
    express,
    app,
    fs,
    AWS
};

require('./routes')(packages);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(8000, (err) => {
    console.log(`Server running on port: 8000`);
});
