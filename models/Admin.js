const mongoose = require('mongoose')
const validator = require('validator').default;
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'An Email is required'],
        validate: validator.isEmail
    },
    password:{
        type:String,
        select:false,
    }
},{
     validateBeforeSave:true
})

schema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
    }
})

schema.methods.verifyPassword = async function(value){
    return await bcrypt.compare(value,this.password);
}

const Admin = mongoose.model('Admin',schema);

module.exports = Admin;