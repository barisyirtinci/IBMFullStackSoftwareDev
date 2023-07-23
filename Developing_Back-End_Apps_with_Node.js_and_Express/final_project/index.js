const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

let users = []

const checkExist = (username)=>{
    //User existence check
    let sameNameUsers = users.filter((user)=>{
      return user.username === username
    });
    if(sameNameUsers.length > 0){
      return true;
    } else {
      return false;
    }
}

const checkAuthenticatedUser = (username,password)=>{
    //User authentication check
    let validatedUsers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validatedUsers.length > 0){
      return true;
    } else {
      return false;
    }
  }

const app = express();


app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //get authorization
    if(req.session.authorization){
        //get token
        authToken = req.session.authorization['accessToken'];
        //verify the token with jwt.verify()
        jwt.verify(authToken,'access',(err,user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                return res.status(403).json({message: "User identity not authenticated"})
            }
        });
    }else{
        return res.status(403).json({message: "User not logged in"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
