const {userModel} = require('../model/user-model')


exports.signupMw = async(req,res,next) => {
    try{  
         let user ;
        // for email validations 
        if(!req.body.email){
            return res.status(400).send(`Email cant be empty`);
        }

        if(!isValidEmail(req.body.email)){
            return res.status(400).send(`failed ! invalid email id`);
        }

         user = await userModel.findOne({where:{email : req.body.email}});

        if(user !== null){
            return res.status(400).send(`Email is already registered`);
          }
    
          // check if user filled the name or not
        if(!req.body.name){
         return res.status(400).send(`Name is not provided`);
        }

          // password validations  
          if(!req.body.password){
          return res.status(400).send(`Password should be provided`);
          }

 next();
 
}catch(err){
    res.status(500).send(`error in signupMw`);
}
}

const isValidEmail = (email)=>{
    return String(email).toLowerCase().
    match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

exports.signinMw = async(req,res,next) => {

    try{
    
    if(!req.body.email){
    return res.status(400).send(`Email is must for signin`);
    }
   
    if(!req.body.password){
        return res.status(400).send(`Password is must for signin`);
    }
    

   next();

}catch(err){
    res.status(500).send(`error in signinMw ${err}`);
}
}
 

exports.verifyJwtToken = async (req,res,next)=>{
    try{
        const user = await userModel.findOne({where:{email:req.body.email}})
          const token = req.headers["x-access-token"];
       
        /**
         * check if the token is present
         */
        if(!token){
            return res.status(403).send({
                message:"token is not provided"
            })
        }
        
        /**
         * go and validate the token
         */

         jwt.verify(token , process.env.secret , (err,decoded)=>{
            if(err){
                return res.status(401).send({
                    message:"Unauthorized ! Access is prohibited"
                })
            }

            req.email = decoded.id

            if(req.email !== user.email){
             return res.status(401).send({
                message:"only user has permission"
             })
            }
        })
        next()     
    }catch(err){
        console.log("error in verifying jwt token in  middleware ",err);
        res.status(500).send({message:"internal server error"})
    }
  } 












