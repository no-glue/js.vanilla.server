var express=require('express');
var app=express();
var port=3001;
var sqlite=require('sqlite3').verbose();
var db = new sqlite.Database(':memory:');
var users = [
["john","pass",1],
["jane","pass",2],
["abe","pass",3],
["martha","pass",5],
["lisa","pass",7],
["anthony","pass",11],
["mark","pass",17],
["beth","pass",19],
["jill","pass",23],
["bob","pass",29],
["xavier","pass",31]
];
var stmts = [
"SELECT uname,likes FROM users",
"INSERT INTO users VALUES (?,?,?)",
"CREATE TABLE users (uname TEXT, pass TEXT, likes INTEGER)"
];
var objs = [
    ["uname","likes"],
    [],
    []
];
/**
* arrClear
*
* clear array
*
* arr - array to clear
**/
var arrClear = function(arr){
    var i=0;
    for(;i<arr.length;i++){
        arr[i]=null;
    }
}
/**
* objPopulate
*
* populate an object
*
* obj - object to populate
* keys - keys to use
* ro - records to use
*
**/
var objPopulate = function(obj,keys,ro){
    var i = 0;
    for(;i<keys.length;i++){
        obj[keys[i]]=ro[keys[i]];
    }
}
/**
* userSeed
*
* seed users
*
* db - database to use
* stmt - statement to use
* arr - array to use
*
**/
var userSeed = function(db,stmt,arr){
    var stmt = db.prepare(stmt);
    var i = 0;
    for(;i<arr.length;i++){
        stmt.run(arr[i]);
        console.log(arr[i]);
    }
    stmt.finalize();
}
/**
* userCreate
*
* db - database to use
* stmt - statement to use
*
**/
var userCreate = function(db,stmt){
    db.run(stmt);
}

db.serialize(function(){
    console.log("table seed");
    userCreate(db,stmts[2]);
    userSeed(db,stmts[1],users);
    // TODO modular seed users
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/users', function(req,res){
    var obj=null;
    var i = 0;
    var arr = new Array();
    db.each(stmts[0],function(err,ro){
        console.log("ro",ro);
        obj=new Object();
        objPopulate(obj,objs[0],ro);
        console.log("ro obj",obj);
        arr.push(obj);
    },function(err,count){
        res.send(JSON.stringify(arr));
        arrClear(arr);
        arr=null;
    });
});

app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});

// TODO empty db on exit
