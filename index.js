var express=require('express');
var app=express();
var port=3001;

app.get('/', function(req,res){
    res.send('hello');
});
app.listen(port,function(){
    console.log('example app listening on port ${port}.');
});
