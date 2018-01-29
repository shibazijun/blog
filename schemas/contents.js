//引入mongoose 模块
var  mongoose = require('mongoose');


//内容内容的表结构
module.exports = new mongoose.Schema({
    category:{ //关联字段
        type:mongoose.Schema.Types.ObjectId,  //字段类型
        ref: 'category' //引用
    },
    title: String,

    user:{ //关联字段
        type:mongoose.Schema.Types.ObjectId,  //字段类型
        ref: 'User' //引用
    },

    addTime:{
        type:Date,
        default:new Date()
    },

    views:{
        type:Number,
        default:0
    },


    description:{
        type:String,
        default:''
    },

    content:{
        type:String,
        default:''
    },

    comments:{
        type:Array,
        default:[]
    }
});

