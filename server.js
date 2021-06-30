const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

if(process.env.NODE_ENV=='dev')
    dotenv.config();

const PORT = process.env.PORT;

(async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.buxi5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{useNewUrlParser:true, useUnifiedTopology:true});
    console.log('DB connection sucessfull');

    app.listen(PORT,function(){
        console.log(`listen at port ${PORT}`)
    });
})();