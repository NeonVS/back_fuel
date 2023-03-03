const bodyParser = require('body-parser');

require('dotenv').config();

module.exports = (app,mongoose) =>{

    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        next();
    });

    mongoose.connect(`mongodb+srv://ujjwalchitransh:${process.env.MONGO_PASS}@cluster0.l63ztef.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`,{useUnifiedTopology:true,useNewUrlParser:true}).then(async result => {
        const port = process.env.PORT || 3000;
        const server = app.listen(port);
        console.log("SERVER STARTED AT PORT:" + port)
    }).catch(err => {
        console.log(err);
    });
}