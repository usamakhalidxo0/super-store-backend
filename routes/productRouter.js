const express = require('express')

const router = express.Router()

router.use('*', function(req,res,next){
    res.status(404).json({
        message: 'not yet implemented!'
    })
})

module.exports = router;