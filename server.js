const express = require('express');
const {PORT} = require('./configs/server-config')
const app = express();
const {sequelize} = require('./configs/db-config');

app.use(express.json({urlEncoded:{extended:true}}));

sequelize.sync();

require('./routes/user-route')(app)
const start = async (err)=>{
    if(err){
        console.log("error while connecting to server");
        process.exit(1);
    }

    await app.listen(PORT);
    console.log(`server has started on port ${PORT}`);
}

start();
