const express = require('express');
const ejs = require('ejs');
const path = require('path');
var OCRScanner = require('./routes/ocrscan.js');
var AutoScanner = require('./routes/upload.js')
//Init App
const app = express();
const port = 3000;
// EJS
app.set('view engine', 'ejs');
//Public Folder
app.use(express.static('./public'));

app.get('/', function(req,res){
    res.render('index');
});
app.use('/ocrscan',OCRScanner);
app.use('/upload',AutoScanner);
app.listen(port, ()=>console.log('Server Started on Port '+port));