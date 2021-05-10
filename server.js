const app = require('./app')
const PORT = process.env.PORT;

app.listen(PORT,function(){
    console.log('listening at port 5000')
})