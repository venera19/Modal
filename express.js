const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();

app.use(upload.array()); 

app.post('/', function(req, res){
  console.log(req.body);
  res.send("Received your request!");
});

app.listen(3000);
