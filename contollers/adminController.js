const Admin = require('../models/Admin');
const EE = require('../helpers/EnhancedError');
const jwt = require('jsonwebtoken');
const cw = require('../helpers/controlerWrapper');
const ec = require('../helpers/errorClasses');

exports.signIn = cw(async function(req,res,next){
    if(req.body.email&&req.body.password){
        const user = await Admin.findOne({email:req.body.email}).select('+password');
            if (user && await user.verifyPassword(req.body.password)){
                const token = await jwt.sign(user.id,process.env.JWT_SecRET);
                res.cookie('jwt',token,{maxAge:(60000*24*90)}).status(200).json({
                    email:user.email
                })
            }
            else next(new EE('Invalid Credentials!',404,ec.InvalidCredentials));
    }
    else next(new EE('Please provide email and password',400,ec.MissingFields))
})

exports.authenticate = cw(async function(req,res,next){
    if(req.cookies.jwt){
        const id = await jwt.verify(req.cookies.jwt,process.env.JWT_SecRET);
        if(id){
            req.id=id;
            next()
        }
        else next(new EE('Invalid JWT', 400, ec.InvalidJWT))
    }
    else next(new EE('Missing JWT',400,ec.MissingJWT))
})

exports.changeEmail = cw(async function(req,res,next){
    const admin = await Admin.findById(req.id);
    admin.email= req.body.email;
    admin.save();
    res.json({admin:admin});
})

exports.changePassword = cw(async function (req,res,next){
    if(req.body.oldPassword && req.body.newPassword && req.body.verifyNewPassword){
        const admin = await Admin.findById(req.id);
        if(admin.verifyPassword(req.body.oldPassword)){
            if(req.body.newPassword === req.body.verifyNewPassword){
                try{
                    admin.password = req.body.newPassword;
                    admin.save();
                }
                finally{}
            }
            else next(new EE('New passwords donot match', 400, ec.UnmatchedPasswords))
        }
        else next(new EE('oldPassword is not correct',400,ec.InvalidCredentials))
    }
    else next(new EE('Please provide "oldPassword, newPassword and verfiyNewPassword"',400,ec.MissingFields))
    const admin = await Admin.findById(req.id);
})