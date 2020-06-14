const express = require('express');
const ejs = require('ejs');
const path = require('path');
var OCRScanner = require('./routes/ocrscan.js');
var AutoScanner = require('./routes/upload.js');
var Translater = require('./routes/translate.js');
//Init App
const app = express();
const port = 23023;
// EJS
app.set('view engine', 'ejs');
//Public Folder
app.use(express.static('./public'));

app.get('/', function(req,res){
    res.render('index');
});
app.use('/ocrscan',OCRScanner);
app.use('/upload',AutoScanner);
app.use('/translate',Translater);

app.listen(port, ()=>console.log('Server Started on Port '+port));