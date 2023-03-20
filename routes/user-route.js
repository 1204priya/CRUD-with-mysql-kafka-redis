const {signup , signin , findAll , findById , update , deleted}= require('../controllers/user-controller');
const { signupMw, signinMw, verifyJwtToken } = require('../middlewares/auth-validations');


module.exports = (app)=>{
    app.post("/mysql/v1/users/signup",[signupMw],signup);
    app.post("/mysql/v1/users/signin",[signinMw],signin);
    app.get("/mysql/v1/users",[verifyJwtToken],findAll);
    app.get("/mysql/v1/users/:id",findById);
    app.put("/mysql/v1/users/:id",update);
    app.delete("/mysql/v1/users/:id",deleted);


}




