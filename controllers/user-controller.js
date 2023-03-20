


const {userModel} = require('../models/user-model')
const {showData}= require('../utils/map-data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {produce} = require('../utils/kafka');

const redis = require('redis');
const client = redis.createClient();
const keyname = "keyname"
const field = "field"

const redisConnection = async(err)=>{
    if(err){
        console.log("error while connecting to redis");
        process.exit(1)
    }
    
         await client.connect();
         console.log("successfully connected to redis");
    }
redisConnection();



const storeData = []

exports.signup = async (req,res)=>{
    try{
        const userObj = {
            name:req.body.name,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password,8)
        }

        const user = await userModel.create(userObj);
        storeData.push(user)
        await client.hSet(keyname,field,JSON.stringify(storeData));
        console.log('set cache');
       
        const message="user added"
         produce(user,message)
        
        res.status(201).send(showData(user))

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error")
    }
}


exports.signin = async (req,res)=>{
    try{
        const user = await userModel.findOne({where:{email:req.body.email}});

        if(!user){
            return res.status(500).send("invalid email")
        }

        const validPass = bcrypt.compareSync(req.body.password,user.password)

        if(!validPass){
            return res.status(500).send("invalid password")
        }

        const accessToken = jwt.sign(
            {id:user.email},
            process.env.secret,
            {expiresIn:600});

            
        res.status(200).send({data:showData(user),token:accessToken});

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error")
    }
}


exports.findAll = async (req,res)=>{
    try{
        const nameQ = req.query.name
        let user;

       const data= await client.hGet(keyname,field) 

        if(data){
            user = JSON.parse(data);
            console.log("get cache");
         }
        else if(nameQ){
          user = await userModel.findAll({where:{name:nameQ}})
        }
        else{
         user = await userModel.findAll() 
        }

        const message="all users list"
         produce(user,message);

    
        res.status(200).send(user.map((datas)=>{
            return {
                id:datas.id,
                name:datas.name,
                email:datas.email,
                createdAt:datas.createdAt,
                updatedAt:datas.updatedAt
            };

        }))

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error");
    }
}


exports.findById = async (req,res)=>{
    try{
        const user = await userModel.findOne({where:{id:req.params.id}})
        produce(user);
        res.status(200).send(showData(user))

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error")
    }
}


exports.update = async (req,res)=>{
    try{
        let user = await userModel.findOne({where:{id:req.params.id}})

        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? bcrypt.hashSync(req.body.password,8) : user.password

        const data = await user.save();

        const message="user updated"
         produce(user,message)

        res.status(201).send(showData(data))

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error")
    }
}


exports.deleted = async (req,res)=>{
    try{
        const user = await userModel.destroy({where:{id:req.params.id}});

        const message="user deleted";
         produce(user,message)
        console.log("user deleted successfully");
        res.status(200).send("user deleted successfully")

    }catch(err){
        console.log("internal server error",err);
        res.status(500).send("internal server error")
    }
}


