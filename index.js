var express=require('express');
var app=express();
var port=3001;
var dirty=require('dirty');
var db = dirty('user.db');
/**
* dbToArray
*
* place all records to array
*
* arr - array to hold objects
* db - database
*
**/
var dbToArray = function(arr,db){
    var obj=null;
    db.forEach(function(key,val){
        obj=new Object();
        obj["key"]=key;
        obj["val"]=val;
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

db.on('load',function(){
    db.set('john',{likes:5});
    db.set('jane',{likes:7});
    db.set('abe',{likes:11});
    db.set('martha',{likes:17});
    db.set('lisa',{likes:23});
    db.set('anthony',{likes:1});
    db.set('mark',{likes:2});
    db.set('beth',{likes:3});
    db.set('jill',{likes:29});
    db.set('bob',{likes:31});
    db.set('xavier',{likes:37});
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
    var arr=new Array();
    dbToArray(arr,db);
    res.send(JSON.stringify(arr));
    arrClear(arr);
    arr=null;
});

app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});

// TODO empty db on exit
