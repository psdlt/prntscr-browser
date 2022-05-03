const express = require('express');
const app = express();
app.listen(3000);
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
try { fs.mkdirSync(path.join(__dirname, "img")) } catch(e) {};
console.log('Running on http://localhost:3000/')

app.get('/', (req,res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/static/:id', (req,res) => {
	res.sendFile(path.join(__dirname, "static", req.params.id));
});

app.get('/img/:id', async(req,res) => {
	let page = await fetch("https://prnt.sc/"+req.params.id).then(x => x.text());	
	return res.send(page);
});

app.get('/save', async(req,res) => {
	try {
		let buffer = await fetch(req.query.link).then(x => x.buffer());	
		fs.writeFileSync(path.join(__dirname, "img", req.query.id+".png"), buffer);
		
		return res.send("");
	} catch(e) {
		return res.send(""+e);
	}
});