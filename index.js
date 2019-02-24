var express=require('express');
var app=express();
var port=3001;
var dirty=require('dirty');
var db = dirty('user.db');

db.on('load',function{
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

app.get('/users', function(req,res){
    res.send('hello');
});
app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});
