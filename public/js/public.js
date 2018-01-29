
$(function () {
    var $loginBox=$("#loginBox");
    var $registerBox=$("#registerBox");
    var $userInfo=$("#userInfo");

    $loginBox.find("a.colMint").on("click",function () {
        $registerBox.show()
        $loginBox.hide()
    })

    $registerBox.find("a.colMint").on("click",function () {
        $registerBox.hide()
        $loginBox.show()
    })

    //注册
    $registerBox.find("button").on("click",function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
              username:  $registerBox.find('[name="username"]').val(),
              password:  $registerBox.find('[name="password"]').val(),
              repassword:  $registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                $registerBox.find(".colWarning").html(result.message);

                if(!result.code){
                    setTimeout(function () {
                        $registerBox.hide()
                        $loginBox.show()
                    },1000)
                }
            }
        })
    })




    //登录
    $loginBox.find("button").on("click",function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:  $loginBox.find('[name="username"]').val(),
                password:  $loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                $loginBox.find(".colWarning").html(result.message);
                if(!result.code){
                    window.location.reload()
                }
            }
        })
    })
    
    $("#logoutBtn").on("click",function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload()
                }
            }
            
        })
    })

    $("#submit").on("click",function () {
        $.ajax({
            url:'/api/comment/post',
            data:{
                contentid:$("#contentId").val(),
                content:$("#messageContent").val()
            },
            type:"POST",
            success:function (responseData) {
                renderComment(responseData.data.comments.reverse())
            }
        })
    })



    // 每次重载是获取说有评论
    $.ajax({
        url:'/api/comment',
        data:{
            contentid:$("#contentId").val(),
        },
        success:function (responseData) {
            renderComment(responseData.data.reverse())
        }

    })



})

function  renderComment(comments){
    $("#messageCount").html(comments.length)
    var html='';
    for(var i=0 ;i<comments.length;i++){
        html+='<div class="messageBox">\n' +
            '<p><span>'+ comments[i].username +'</span> <span>'+ formatData(comments[i].postTime) +'</span></p>\n' +
            '<p>'+ comments[i].content +'</p>'
    }

    $(".messageList").html(html)
}

function formatData(d) {
    var dt=new Date(d)
    return dt.getFullYear()+'-'+ (dt.getMonth()+1)+'-'+ dt.getDate() +" " + dt.getHours() + ":"+ dt.getMinutes() +":"+ dt.getSeconds()
}