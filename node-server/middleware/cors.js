'use strict';

var middleware = function(req,res,next){
    res.header('Access-Control-Allow-Origin','http://localhost:8082');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Max-Age', 3600);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = middleware;