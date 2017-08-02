const express = require('express');
const uid2 = require("uid2");
const mongo =require('mongodb');
const url = require('./config').url;
const doc = require('./config').collection;
const port = require('./config').port;
const app = express();


var redirectURL,code;
app.get('/',function(req,res){
	return res.send("<h2>URL SHORTENER MS</h2>");
});

app.get('/new/*',function(req,res){
	redirectURL = req.params[0];
	code=uid2(10);
	let reqdURL = "http://localhost:"+port+""+code;
	let data = {
		"orignalURL":redirectURL,
		"code":code
	};
	const MongoClient = mongo.MongoClient;
	MongoClient.connect(url,function(err,db){
		if(err)
			{
				console.log("DATABASE CONNECTION FAILED");
			}
		else
			{
				console.log("DATABASE CONNECTION SUCCESSFUL");
				var collection = db.collection(doc);
				collection.insert(data);
			}
			db.close();
	});
	return res.send(data);
});

app.get('/:code',function (req,res) {
	var getCode=req.params.code.toString();
	const MongoClient = mongo.MongoClient;
	MongoClient.connect(url,function(err,db){
		if(err)
			{
				console.log("DATABASE CONNECTION FAILED");
			}
		else
			{
				console.log("DATABASE CONNECTION SUCCESSFUL");
				var urls = db.collection(doc);
				urls.find({"code":getCode}).toArray(function(err,docs){
					if(err)
						{
							res.send(err);
						}
					else if(docs.length > 0)
						{
							res.redirect(docs[0]["orignalURL"]);
						}
					else
						{
							res.send("NO SUCH URL");
						}
				});
				//return res.send(doc[0].orignalURL);
			}
		db.close();
	});
});
app.listen(port,function() {
	console.log("SERVER RUNNING");
})