const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage : storage,
    fileFilter:function(req, file, cb){
        checkFileType(file,cb);
    }
}).single('myImage');
// Check File Type
function checkFileType(file, cb){
    // Allowed extension
    const fileTypes = /jpeg|jpg|png|gif/;
    //check the extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error : Please Upload Images only!');
    }
}
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
app.post('/upload',function(req,res){
    upload(req, res, function(err){
        if(err){
            res.render('index',{
                msg: err
            });
        } else{
            if(req.file == undefined){
                res.render('index',{
                    msg: 'Error : No File Selected!'
                });
            } else{
                res.render('index',{
                    msg: 'File Uploaded',
                    file : 'uploads/'+req.file.filename
                });
            }
        }
    });
})
app.listen(port, ()=>console.log('Server Started on Port '+port));