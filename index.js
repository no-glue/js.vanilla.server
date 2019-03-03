var express=require('express');
var app=express();
var port=3001;
var sqlite=require('sqlite3').verbose();
var db = new sqlite.Database(':memory:');
var md5=require('md5');
var errorStatus=500;
var errorSignupMessage='User already exists';
var successSignupMessage='Signup';
var errorLoginMessage='User does not exists';
var errorLoginMessageB='User already logged in';
var successLoginMessage='Login';
var errorMeMessage='User is not logged in';
var errorMeMessageB='User token does not match';
var errorPassMessage='User is not logged in';
var errorPassMessageB='User token does not match';
var loggedIn={};
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
"CREATE TABLE users (uname TEXT PRIMARY KEY, pass TEXT, likes INTEGER)",
"SELECT uname FROM users WHERE uname=?",
"INSERT INTO users(uname,pass,likes) VALUES (?,?,?)",
"SELECT likes FROM users WHERE uname=?",
"UPDATE users SET pass=? WHERE uname=?"
];
var objs = [
    ["uname","likes"],
    [],
    [],
    [],
    [],
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
* tableSeed
*
* seed a table
*
* db - database to use
* stmt - statement to use
* arr - array to use
*
**/
var tableSeed = function(db,stmt,arr){
    var stmt = db.prepare(stmt);
    var i = 0;
    for(;i<arr.length;i++){
        stmt.run(arr[i]);
        console.log(arr[i]);
    }
    stmt.finalize();
}
/**
* tableCreate
*
* create table
*
* db - database to use
* stmt - statement to use
*
**/
var tableCreate = function(db,stmt){
    db.run(stmt);
}

db.serialize(function(){
    console.log("table seed");
    tableCreate(db,stmts[2]);
    tableSeed(db,stmts[1],users);
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
app.get('/signup',function(req,res){
    var uname = '';
    var pass = '';
    uname=req.query.uname;
    pass=req.query.pass;
    pass=md5(pass);
    db.get(stmts[3],[uname],function(err,ro){
        if(ro){
            res.status(errorStatus).send(
                JSON.stringify({"message":errorSignupMessage})
            );
        } else {
            tableSeed(db,stmts[4],[[uname,pass,0]]);
            res.send(
                JSON.stringify({"message":successSignupMessage})
            );
        }
    });
});
app.get('/login',function(req,res){
    var uname='';
    var pass='';
    uname=req.query.uname;
    pass=req.query.pass;
    pass=md5(pass);
    if(loggedIn[uname]){
        res.status(errorStatus).
            send(JSON.stringify({"message":errorLoginMessageB}));
    }
    db.get(stmts[3],[uname],function(err,ro){
        if(ro){
            loggedIn[uname]=md5(Date.now()+uname);
            res.send(
                JSON.stringify({
                    "message":successLoginMessage,
                    "token":loggedIn[uname]
                    })
            );
        } else {
            res.status(errorStatus).send(
                JSON.stringify({"message":errorLoginMessage})
            );
        }
    });
});
app.get('/me',function(req,res){
    var uname=req.query.uname;
    var token=req.query.token;
    if(!loggedIn[uname]){
        res.status(errorStatus).send(JSON.stringify({
            "message":errorMeMessage
        }));
    }
    if(loggedIn[uname]!=token){
        res.status(errorStatus).send(
            JSON.stringify({"message":errorMeMessageB})
        );
    }
    db.get(stmts[5],[uname],function(err,ro){
        console.log('me',ro);
        res.send(
            JSON.stringify({
                "likes":ro.likes
            })
        );
    });
});
app.get('/pass',function(req,res){
    var oldpass=req.query.oldpass;
    var pass=req.query.pass;
    var uname=req.query.uname;
    var token=req.query.token;
    if(!loggedIn[uname]){
        res.status(errorStatus).send(JSON.stringify({
            "message":errorPassMessage
        }));
    }
    if(loggedIn[uname]!=token){
        res.status(errorStatus).send(
            JSON.stringify({"message":errorPassMessageB})
        );
    }
    db.run(stmts[6],[pass,uname],function(err){
    });
});

app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});

// TODO DONE empty db on exit
// TODO DONE modular seed users
// TODO DONE modular create users
// TODO auth token
// TODO not sure tableCreate function is required
