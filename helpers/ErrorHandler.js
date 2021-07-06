const EE=require('./EnhancedError')

module.exports=function(err,req,res,next){
    console.log(err);

    if(!process.env.NODE_ENV){
        if(err instanceof EE){
            res.status(err.status).json({
                code:err.code,
                message:err.message,
                errorDump:err
            });
        }
        else res.json(err)
    }
    else{
        if(err instanceof EE){
            res.status(err.status).json({
                code:err.code,
                message:err.message
            });
        }
        else res.status(500).json({message:'Internal Server Error'});
    }

}