const express = require('express');
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const mysql2 = require("mysql2");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("../../middleware/db");
const User = require("../../models/user");
const tokenValidator = require("../../middleware/tokenValidator");
const Joi = require("@hapi/joi");
 
//Reading docs for queries using sequelize
//https://sequelize.readthedocs.io/en/v3/docs/models-usage/
 
 
/*
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "love",
  database: "smalldata"
});*/
 
users.use(cors())
 
process.env.SECRET_KEY = 'secret'
 
//app.use("/api/users", require("./routes/api/users"));
//  / = "/api/users".
 
 
 
//REGISTER
users.post('/register', (req, res) => {
     
    //how items are stored in database
    //const today = new Date()
    const userData = {
      //id = req.params.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
      //created: today
    }
     
     
 
    //Validate to ensure fields were put in.(old way, replace by joi)
    /*
    let errors = []
 
    if(!first_name) {
        errors.push({ text: 'Please add your first name'});
    }
    if(!last_name) {
        errors.push({ text: 'Please add your last name'});
    }
    if(!email) {
        errors.push({ text: 'Please add your email'});
    }
    if(!password) {
        errors.push({ text: 'Please add your password'});
    }
 
    //Check for errors
    if(errors.length > 0) {
        res.render('user', {
            errors,
            first_name,
            last_name,
            email,
            password
 
        });
    }else{
        */
 
       const schema = Joi.object().keys({
        first_name: Joi.string().alphanum().min(1).max(30).required(),
        last_name: Joi.string().alphanum().min(1).max(30).required(),
        email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().alphanum().min(1).max(30).required()
        });
        //password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        //access_token: [Joi.string(), Joi.number()],
        //birthyear: Joi.number().integer().min(1900).max(2013),
         
        //}).with('username', 'birthyear').without('password', 'access_token');
        let options = { abortEarly: false };
        Joi.validate(userData, schema, options, (err,value) => {
        //Joi.validate(req.body, schema, (err,res) => {
            if (err) {
                console.log(err.details);
                res.json('error: ' + err.details)
                return;
            } else {
                console.log(value);
          // }
        //})
        /*
            if(err) {
                res.send('An error has occurred: ' + err);
            } else {
               // res.send('Information was successfully posted: ' + res);
        */
  //Trying to determine if the user already exist by checking the email address   
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            //if the registered email is not matching other emails..continue to add the new user and hash the password they gave with "10" salting value(random strings). Makes it difficult to use rainbow dictionary tables.
            if (!user) {
               const hash = bcrypt.hashSync(userData.password, 10) 
               userData.password = hash
               User.create(userData)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {expiresIn: 1440
                        }) // token expires in 1 hour   
                        res.json({ token: token })
                   })
                   .catch(err => {
                       res.send('error: ' + err)
                       return;
                   })
                   //I added this:
                   if(!err){
                       res.json({ "error": false, "message": "New user has been added" });
                       return;
                   }
        } else {
            console.log('User already exist');
           res.json({ error: 'User already exist' })
           return;
        }
    }) //then user - ln.114
   
}  //else user - ln.98
 
}); //Joi validate - ln.94
 
}); //Users.post -line 37
     
 
 
 
 
  //LOGIN
  users.post('/login', (req, res) => {
    
      User.findOne({
          where: {
              email: req.body.email
          }
      })
          .then(user => {
              //comparing password entered, to password in database
             if (bcrypt.compareSync(req.body.password, user.password)) {
                 let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, 
                 //let token = jwt.sign(user.email, user.id, process.env.SECRET_KEY,
                 {expiresIn: 1440 //1 Hour expiration - seconds
                 })    
                 res.json({ token: token })
 
                 //https://jwt.io - to view token details (encoded based 64)
          } else {
             res.send({ error: 'Password is incorrect' })
          }
      })
      .catch(err => {
         res.send('error: User not found ' + err)
      })
    })
 
//PROFILE
 
users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
 
    User.findOne({
          where: {
              id: decoded.id
          }
    })
          .then(user => {
              if (user) {
                  res.json(user)
              }else{
             res.send('User does not exist')
              }
          })
          .catch(err => {
              res.send('error: ' + err)
          })
})
 
//DELETING A USER
users.delete('/removeuser:id', (req, res) => {
     const id = req.params.id;
      User.destroy({ 
         where: {id: id }
      })
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
      });
 
 
/*
router.get("/signup", (req, res, next) => {
  db.query("SELECT * FROM users", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
    next();
  });
});*/
 
module.exports = users;