const Admin = require('../models/Admin');
const EE = require('../helpers/EnhancedError');
const jwt = require('jsonwebtoken');
const cw = require('../helpers/controlerWrapper');

exports.signIn = cw(async function(req,res,next){
    if(req.body.email&&req.body.password){
        const user = await Admin.findOne({email:req.body.email}).select('+password');
            if (user && await user.verifyPassword(req.body.password)){
                const token = await jwt.sign(user.id,process.env.JWT_SECRET);
                res.cookie('jwt',token,{maxAge:(60000*24*90)}).status(200).json({
                    email:user.email
                })
            }
            else next(new EE('Invalid Credentials!',404));
    }
    else next(new EE('Please provide email and password'))
})

exports.changeEmail = cw(async function(req,res,next){
    let id;
    if(req.cookies.jwt)
        id = await jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
    if(id){
        const admin = await Admin.findById(id);
        admin.email= req.body.email;
        admin.save();
        res.json({admin:admin});
    }
})

exports.changePassword = cw(async function (req,res,next){
    let id;
    if(req.cookies.jwt)
        id = await jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
})