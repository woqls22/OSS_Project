
var express = require('express');
const request = require('request');
const path = require('path');
var router = express.Router();
let  { PythonShell }  =  require ( 'python-shell' )
var fs = require('fs');
const PAPAGO_URL = 'https://openapi.naver.com/v1/papago/n2mt'
const PAPAGO_ID = 'ID'
const PAPAGO_SECRET = 'PW'
const bodyParser = require('body-parser');
router.use(bodyParser.json());
var transMessage = "";

router.post('/', function (req, res) {
    console.log('======================', new Date() ,'======================');
    console.log("한국어 번역 요청");
    var article = fs.readFileSync("./public/uploads/temp.txt", 'utf-8');
    article = article.replace(/\n/g, "          ");//행바꿈제거
    request.post(
        {
            url: PAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: 'source=en&target=ko&text=' + article,
            json:true
        },(error, response, body) => {
            var options = {
                mode: 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: '',    // 실행할 py 파일 path. 현재 nodejs파일과 같은 경로에 있어 생략
            };
            if(!error && response.statusCode == 200) {
                transMessage = body.message.result.translatedText;
                console.log('[한국어]', transMessage);
                PythonShell.run("temp_remove.py",options, function(err){ // 작업이 끝난 파일 삭제
                    if(err){
                        res.render('OcrScan',{
                            msg: 'Error : 파일 삭제 실패'
                        });
                    }
                });
                res.render('OcrScan',{
                    msg: ''+transMessage
                }); 
            }
            else{
                PythonShell.run("temp_remove.py",options, function(err){ // 작업이 끝난 파일 삭제
                    if(err){
                        res.render('OcrScan',{
                            msg: 'Error : 파일 삭제 실패'
                        });
                    }
                });
                res.render('OcrScan',{
                    msg: '파파고 API오류. 금일 사용가능한 쿼리를 모두 사용하셨습니다.'
                });
            }
        });

});
module.exports = router;