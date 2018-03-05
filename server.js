const express = require('express');
const uid2 = require("uid2");
const mongo =require('mongodb');
const url = require('./config').url;
const doc = require('./config').collection;
const port = require('./config').port;
const test = require('./tester').validURL;
const app = express();


var redirectURL,code;
app.get('/',function(req,res){
	const MongoClient = mongo.MongoClient;
	MongoClient.connect(url,function(err,db){
		if(err)
			{
				return res.send("<h2>URL FAILED</h2>");
			}
		else
			{
				return res.send("<h2>URL CONNECT</h2>");
			}
			db.close();
	});
});

app.get('/new/*',function(req,res){
	redirectURL = req.params[0];
	if(!test(redirectURL))
	{
		return res.send('NOT A VALID URL')
	}
	code=uid2(5);
	let data = {
		"orignalURL":redirectURL,
		"code":code
	};
	const MongoClient = mongo.MongoClient;
	MongoClient.connect(url,function(err,db){
		if(err)
			{
				res.send("DATABASE CONNECTION FAILED");
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
				return res.send("DATABASE CONNECTION FAILED");
			}
		else
			{
				console.log("DATABASE CONNECTION SUCCESSFUL");
				var urls = db.collection(doc);
				urls.find({"code":getCode.toString()}).toArray(function(err,docs){
					if(err)
						{
							return res.send(err);
						}
					else if(docs.length > 0)
						{
							return res.redirect(docs[0]["orignalURL"]);
						}
					else
						{
							return res.send("NO SUCH URL");
						}
				});
			}
		db.close();
	});
});
app.listen(port,function() {
	console.log("SERVER RUNNING");
})