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
];
var objs = [
    ["uname","likes"]
];
/**
* dbToArray
*
* place all records to array
*
* arr - array to hold objects
* db - database to use
* keys - keys for object
* stmt - statement to run
*
**/
var dbToArray = function(arr,db,keys,stmt){
    var obj=null;
    var i = 0;
    db.each(stmt,function(err,ro){
        obj=new Object();
        for(i=0;i<keys.length;i++){
            obj[keys[i]]=ro[keys[i]];
        }
        arr.push(obj);
    });
}
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

db.serialize(function(){
    db.run("CREATE TABLE users (uname TEXT, pass TEXT, likes INTEGER)");
    var stmt = db.prepare("INSERT INTO users VALUES (?,?,?)");
    var i = 0;
    for(;i<users.length;i++){
        stmt.run(users[i]);
    }
    stmt.finalize();
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
    var arr = new Array();
    dbToArray(arr,db,objs[0],stmts[0]);
    res.send(JSON.stringify(arr));
    arrClear(arr);
    arr = null;
});

app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});

// TODO empty db on exit
