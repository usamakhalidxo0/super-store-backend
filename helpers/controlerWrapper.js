module.exports= function(fn){
    return function(req,res,next){
        try {fn(req,res,next);}
        catch(err){next(err)}
    }
}