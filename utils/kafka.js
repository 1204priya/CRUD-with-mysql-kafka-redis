const {Kafka} = require('kafkajs')
const {showData} = require('./map-data')

const clientId ="priyanka"
const brokers = ["localhost:9092"]
const topic = "tata-sky"

const kafka = new Kafka({brokers,clientId});

const producer = kafka.producer()

exports.produce = async(user,message)=>{

    try{
     await producer.connect()

     await producer.send({
             topic,
             messages:[{
                 value : `${message} :  ${JSON.stringify(showData(user))}`
             }]
         })
    }catch(err){
     console.log("error in producer",err);
    }
 }

