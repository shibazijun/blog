// Ӧ�ó�������


var express= require('express');// ����expressģ��
var swig= require('swig');      //����ģ��
var app=express();              // ����appӦ��=> Nodejs HeateServer()

//��̬�ļ����� ���þ�̬�ļ��й�Ŀ¼
//���û����ʵ�URL��public��ʼ�ģ��򷵻ض�Ӧ��__dirname + public �µ��ļ�
app.use('/public',express.static(__dirname + '/public'));

// ����Ӧ��ģ��
//���嵱ǰӦ����ʹ�õ�ģ������
app.engine('html',swig.renderFile);
// ��һ��������ģ����������ƣ�ͬʱҲ��ģ���ļ��ĺ�׺
// �ڶ�����������ʾ���ڽ�������ģ�����ݵķ���


app.set('views','./views'); //����ģ���ŵ�Ŀ¼����һ������������views���ڶ���������Ŀ¼
app.set('view engine','html'); //ע��ģ�����棬��һ������������view engine���ڶ���������app.engine��������еĵڸ�����������һ�µ�

swig.setDefaults({cache:false});   //���������йرջ���

// ��̬�ļ�����������ҳ
// req request����
// res response ����
// next ����
app.get("/",function(req,res,next){
    // res.send('<h1>hello word</h1>')
    // ��ȡviewsĿ¼��ָ�����ļ�������������ظ��ͻ���
    // ��һ����������ʾģ����ļ��������viewsĿ¼
    // �ڶ������������ݸ�ģ��ʹ�õ�����
    res.render('index')
})


//·��
/*app.get("/main.css",function(req,res,next){
   res.setHeader('content-type','text/css');
    res.send('body{background:red}');
})*/




// ����http����
app.listen(8088);

// �û�����http����-> URL->  ����·��->  �ҵ�ƥ��Ĺ��� -> ִ��ָ���󶨵ĺ��������ض�Ӧ�����ݸ��ͻ���
// public -> ��̬ -> ֱ�Ӷ�ȡָ��Ŀ¼�µ��ļ� -> ���ظ��ͻ���
// ��̬ ->  ����ҵ���߼�������ģ�壬����ģ�� -> �������ݸ��ͻ���