// ��һ�� ������
var express= require('express');// ����expressģ��

var router= express.Router()
//������������
router.get('/user',function(req,res,next){
    res.send('user')
})


module.exports = router;  //��router��¶��ȥ