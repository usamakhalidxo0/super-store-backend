const Admin = require('../models/Admin');
const EE = require('../helpers/EnhancedError');
const jwt = require('jsonwebtoken');
const cw = require('../helpers/controlerWrapper');
const ec = require('../helpers/errorCodes');


exports.signIn = cw(async function(req,res,next){

    if(!(req.body.email&&req.body.password))
        return next(new EE('Please provide "email" and "password"',400,ec.MissingFields));

    const user = await Admin.findOne({email:req.body.email}).select('+password');

    // refactor reminder
    if (!(user && await user.verifyPassword(req.body.password)))
        return next(new EE('Invalid Credentials!',404,ec.InvalidCredentials));

    const token = await jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_AGE});
    user.password=undefined;

    //refactor cookie options
    res.cookie('jwt',token,{maxAge:(60000*24*90)}).status(200).json({
        jwt:token,
        data:user
    })
})

exports.authenticate = cw(async function(req,res,next){

    if(!(req.cookies.jwt || req.headers.jwt))
        return next(new EE('Missing JWT',400,ec.MissingJWT));

    let token;
    if(req.cookies.jwt)
        token=req.cookies.jwt;
    else token=req.headers.jwt;

    const decoded = await jwt.verify(token,process.env.JWT_SECRET);
    const id = decoded.id;

    if(!id)
        return next(new EE('Invalid JWT', 400, ec.InvalidJWT));

    req.id = id;
    next()
})

exports.changeEmail = cw(async function(req,res,next){

    user= await Admin.findById(req.id).select('+password');

    if(!(req.body.password&&req.body.newEmail))
        return next(new EE('Please provide "password" and "newEmail"',400, ec.MissingFields));

    if(!user.verifyPassword(req.body.password))
        return next(new EE('Incorrect password', 404, ec.InvalidCredentials));

    try{
        user.email= req.body.newEmail;
        await user.save();
        user.password=undefined;
        res.status(200).json({data:user});
    }
    catch(err){
        next(err)
    }
})

exports.changePassword = cw(async function (req,res,next){

    if(!(req.body.oldPassword && req.body.newPassword && req.body.verifyNewPassword))
        return next(new EE('Please provide "oldPassword", "newPassword" and "verfiyNewPassword"',400,ec.MissingFields));

    const user = await Admin.findById(req.id).select('+password');
    if(!user.verifyPassword(req.body.oldPassword))
        return next(new EE('"oldPassword" is not correct',400,ec.InvalidCredentials));

    if(!(req.body.newPassword === req.body.verifyNewPassword))
        return next(new EE('New passwords donot match', 400, ec.UnmatchedPasswords));

    try{
        user.password = req.body.newPassword;
        await user.save();
        user.password=undefined;
        res.status(200).json({
            data:user
        })
    }
    catch(err){
        next(err);
    }
})