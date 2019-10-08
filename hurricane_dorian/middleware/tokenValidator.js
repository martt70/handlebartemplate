const jwt = require("jsonwebtoken");
const cors = require("cors");
 
//users.use(cors())
//Review Video for reference
//https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=13
process.env.SECRET_KEY = 'secret'
 
module.exports = function (req, res, next){
  var token = req.body.token || req.query.token || req.header['x-access-token'];
 
  //decode token
  if (token){
    jwt.verify(token,process.env.SECRET_KEY, function (err, decoded){
      if(err){
        return res.json ({"error": true,"message": 'Failed to authenticate token.'});
      }
      req.decoded = decoded;
      next();
    });
  }else{
 
    return res.status(403).send({"error": true,"message": 'No token provided.'});
    
  }
}