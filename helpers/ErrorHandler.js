module.exports=function(err,req,res,next){
    console.log(err);
    res.status(err.status).json({
        code:err.code,
        message:err.message
    });
}