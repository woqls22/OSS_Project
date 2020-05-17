var express = require('express');
var router = express.Router();
var fs = require('fs');

const multer = require('multer');
const path = require('path');
let  { PythonShell }  =  require ( 'python-shell' )
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
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('OcrScan');
});
router.post('/', function(req, res, next) {
  upload(req, res, function(err){
    if(err){
        res.render('OcrScan',{
            msg: err
        });
    } else{
        if(req.file == undefined){
            res.render('OcrScan',{
                msg: 'Error : No File Selected!'
            });
        } else{
            console.log(req.file.filename);
            console.log(typeof(req.file.filename));
            var options = {
                mode: 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: '',    // 실행할 py 파일 path. 현재 nodejs파일과 같은 경로에 있어 생략
                args: [req.file.filename]
            };
            PythonShell.run("ocr.py",options, function(err){
                if(err){
                    res.render('OcrScan',{
                        msg: 'Error : '+err
                    });
                    console.log(err)
                }
                else{
                    var article = fs.readFileSync("./public/uploads/temp.txt");
                    res.render('OcrScan',{
                    msg: ''+article,
                    file : 'uploads/'+req.file.filename
                });
                PythonShell.run("remove.py",options, function(err){ // 작업이 끝난 파일 삭제
                    if(err){
                        res.render('OcrScan',{
                            msg: 'Error : 파일 삭제 실패'
                        });
                    }
                });
                }
            });

        }
    }
});
});
module.exports = router;