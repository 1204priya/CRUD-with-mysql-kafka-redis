const redis = require('redis');
const client = redis.createClient()

const redisConnection = async(err)=>{
if(err){
    console.log("error while connecting to redis");
    process.exit(1)
}

     await client.connect();
     console.log("successfully connected to redis");
}

module.exports = {
    redisConnection , client
}





