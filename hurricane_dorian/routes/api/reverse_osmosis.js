const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const mysql2 = require("mysql2");
const db = require("../../middleware/db");
//const Store = require("../../models/stores");
const reverseOsmosis = require("../../models/reverse_osmosis");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Joi = require("@hapi/joi");
const multer = require("multer");
const path = require("path");
 
//Reading docs for queries using sequelize
//https://sequelize.readthedocs.io/en/v3/docs/models-usage/
//https://sequelize.org/master/manual/querying.html
//http://zetcode.com/javascript/sequelize/
 
/*const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "love",
  database: "smalldata"
});*/
 
//app.use("/api/alldata", require("./routes/api/stations"));
//  / = "/api/alldata"
 
//(1)getting all Boiler House information
router.get("/alldatareverse_osmosis", (req, res) => 
   
reverseOsmosis.findAll()
    .then(reverse_osmosis => {
      res.render('gigs', {
        gigs:reverse_osmosis
      })
      //console.log(stores);
      //res.send(stores);
    //res.sendStatus(200);
  })
    .catch(err => console.log(err)));
   
  
  /* MYSQL APPROACH
  router.get("/alldata", (req, res) => 
  db.query("SELECT * FROM stores", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
    next();
      });
  });
*/
 
//(2)Getting all stations names in an object
 
router.get("/stationNames", (req, res) => 
  Store.findAll({ attributes: ['Station'], raw: true })
   .then(stores =>{
   res.json(stores);
})
.catch(err => {
  console.log(err);
  res.status(500).json({msg: "error", details:err});
}));
    
   /*SECOND APPROACH
   router.get("/stationNames", (req, res) => 
   Store.aggregate('Station', 'DISTINCT', { plain: false })
   .then(stores =>{
    res.json(stores);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details:err});
  }));
 
 
/* MYSQL APPROACH
app.get("/stationNames", (req, res) => {
    db.query("SELECT station FROM stores", (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
    });
});
 
//OR
//Getting all stations names in an array
/*app.get('/stationNames',(req,res)=>{
let sql = 'SELECT station FROM stores';
  let query = db.query(sql, (err, results) =>{
    const allStations = results.map(e=>e.station);
    if (err)throw err;
    //console.log('Checking if this works, allStations');
    res.send(allStations);
 
    });
});*/
 
//(3) Getting info by id number
 
router.get("/station/number/:id", (req, res) =>
 
Store.findByPk(req.params.id)
   .then(stores =>{
     res.json(stores);
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({msg: "error", details:err});
   }));
 
 
/* MYSQL APPROACH
app.get("/station/number/:id", (req, res) => {
    db.query(
        "SELECT * FROM stores WHERE id = ?",
        [req.params.id],
        (err, rows, fields) => {
            if (!err) res.send(rows);
            else console.log(err);
        }
    );
});
*/
 
 
//(4)Getting info for a specific station by name
  
    
   router.get("/stationInfo/:name", (req, res) =>
   Store.findAll({ where: { Station: { [Op.in]: [req.params.name] } } })
   //Store.findAll({ where: { Station: { [Op.like]: '%' + term + '%' } } })

   .then(stores =>{
   res.json(stores);
})
.catch(err => {
  console.log(err);
  res.status(500).json({msg: "error", details:err});
}));
 
/* MYSQL APPROACH
app.get("/stationNames/:name", (req, res) => {
    const nameToLookup = req.params.name;
    console.log(nameToLookup);
    db.query(
        "SELECT * FROM stores WHERE station = ?",
        [nameToLookup],
        (err, rows, fields) => {
            //db.query('SELECT * FROM stores WHERE station = $station';
            //{
            // $station = nameToLookup
            //}
            if (!err) res.send(rows);
            else console.log(err);
        }
    );
});
*/
 
//(5) Deleting info by id number 
router.delete('/removestation/:id', (req, res) => {
  const id = req.params.id;
  Store.destroy({ 
   where: {id: id }
})
  .then(result => {
      res.status(200).json({
          message: "Station deleted"
      });
  })
  .catch(err =>{
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});
 
/* MYSQL APPROACH
app.delete("/stationNames/number/:id", (req, res) => {
    db.query(
        "DELETE FROM stores WHERE id = ?",
        [req.params.id],
        (err, rows, fields) => {
            if (!err) res.send(rows);
            else console.log(err);
            //return;
        }
    );
});
*/
 
//(6)Inserting information within the database - checked with postman.
 
/////////////////////////////////////////////////////////////////////////////////////
//Setting Storage Engine
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //cb(null, "./public/uploads/");
    //let destination = path.join(__dirname, 'uploads');
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        //cb(null, new Date().toISOString() + file.originalname);-not working
        cb(
            null,
            `${new Date().toISOString().replace(/:/g, "-")}${file.originalname}`
        );
        //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));-it works
        //(null, file.fieldname + '-' + new Date().toISOString() + path.extname(file.originalname));
        //cb(null, file.originalname);
    }
    /*
    path: function(req, file, cb) {
             cb(null, path.replace(/\\/g, "/"));
        },
*/
});
 
const fileFilter = function (req, file, cb) {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, png or gifs files are accepted"), false);
    }
};
 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
///////////////////////////////////////////////////////////////////////////////
//Displaying a form
router.get("/station",upload.single("image"), (req, res, next) => res.render('add'));



//////////////////////////////////////////////////////////////////////////////
 
router.post("/station",upload.single("image"), (req, res, next) => {
  let Station = req.body.station;
  let Image = null;
  if(req.file && req.file.path) {
      Image = req.file.path.replace(/\\/g, "/");
  }
  let Address = req.body.address;
  let Monthlycstoresales = req.body.monthlycstoresales;
  let Operator = req.body.operator;
  let Topsku = req.body.topsku;
 
 
 
  const schema = Joi.object().keys({
      // ID: Joi.number().integer().required(),
      Station: Joi.string().alphanum().min(1).max(30).required(),
      Image: Joi.string().required(),
      Address: Joi.string().alphanum().min(1).max(50).required(),
      Monthlycstoresales: Joi.number().integer().required(),
      Operator: Joi.string().alphanum().min(1).max(30).required(),
      Topsku: Joi.string().alphanum().min(1).max(30).required(),
  });
  //password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  //access_token: [Joi.string(), Joi.number()],
  //birthyear: Joi.number().integer().min(1900).max(2013),
  //username: Joi.string().alphanum().min(3).max(30).required(),
  // Define password complexity requirements through regex (consider more complex regex)
  //password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  // Force passwords to match
  //password_confirmation: Joi.any().equal(Joi.ref('password')).required(),
  // Accept different Joi types.  Optional, unconstrainted string or number
  //access_token: [Joi.string(), Joi.number()],
  // Required birthyear to be an int between range
  //birthyear: Joi.number().integer().min(1900).max(2013).required(),
  // Validate email address from example.com (remember spoofing considerations)
  //email: Joi.string().email().regex(/example\.com$/),
  //marketing_opt_out: Joi.boolean(),
  //csrf_token: Joi.string().guid({version: 'uuidv4',}).required(),
  //sex: Joi.string().equal(['M', 'F', 'MALE', 'FEMALE', 'DECLINE']).require(),
  //time: Joi.date().timestamp('javascript'),
  //roles: Joi.object()
  //.keys(),
//})
// email must be accompanied by marketing_opt_out
//.with('email', 'marketing_opt_out');
 
  //}).with('username', 'birthyear').without('password', 'access_token');
 
  let data = { Station, Image, Address, Monthlycstoresales , Operator, Topsku };
 
  //let data = {newStation: newStation, newImage: newImage, newAddress: newAddress, newMonthlycstoresales:newMonthlycstoresales, newOperator: newOperator, newTopsku: newTopsku };
 
  let options = { abortEarly: false };
  //Joi.validate(data, schema, options, (err,value) => {
  const result = Joi.validate(data, schema, options);
      //if(err) {
        // If result.error === null, payload is valid
        console.log(`The validation error is: ${result.error}`);
          res.send(`The validation error is: ${result.error}`);
      //}
   
  if(result.error === null) {
  Store.create(data)
      .then(stores => {
          console.log('Station record was successfully created: ' + stores);
          res.send('Station record was successfully created: ' + stores);
      })
  }
  //.catch(err => {
  // res.send('error: ' + err)
  //return err;
});
          
/*MYSQL APPROACH
app.post("/station", upload.single("image"), (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.path);
 
    //The column names has to be exactly how it is in the database, with spaces, capital letters and special characters......if there are any special characters and spaces, they would be contained within backticks (`       `).
 
    var sql =
        "INSERT INTO stores (`id`, `station`, `image`, `address`, `monthly c-store sales`, `operator`, `top sku`)  VALUES (?, ?, ?, ?, ?, ?, ?)";
 
    //"INSERT INTO stores (`id`, `station`, `image`, `address`, `monthly c-store sales`, `operator`, `top sku`)  VALUES (?, ?, ?, ?, ?, ?, ?)";
 
    //"UPDATE stores SET `station` = ?, `address` = ?, `monthly c-store sales` = ?,`operator` = ?, `top sku` = ? WHERE `id` = ?";
    //Note: All spaces and special characters have to be removed.
    id = req.body.id;
    station = req.body.station;
 
    let fileUrl = req.file.path.replace(/\\/g, "/");
    image = fileUrl;
 
    address = req.body.address;
    monthlycstoresales = req.body.monthlycstoresales;
    operator = req.body.operator;
    topsku = req.body.topsku;
*/
    /*
    id = req.body.ID;
    station = req.body.Station;
    address = req.body.Address;
    monthlycstoresales = req.body.MonthlyCStoreSales;
    operator = req.body.Operator;
    topsku = req.body.TopSKU;
  */
 /*
    db.query(
        sql,
        [id, station, image, address, monthlycstoresales, operator, topsku],
        //[id, station, image, address, monthlycstoresales, operator, topsku],
        (err, results) => {
            let message = {};
            if (results !== null) {
                console.log("results is not null");
                message.status = "OK";
            } else {
                console.log("results is null");
                message.status = "KO"; // ?
            }
 
            if (sql !== null) {
                console.log("sql is not null");
            } else {
                console.log("sql is null");
            }
 
            if (req.body.station !== null) {
                console.log("req.body is not null");
            } else {
                console.log("req.body is null");
            }
 
            if (req.body.station !== undefined) {
                console.log("req.body.Station is not undefined");
            } else {
                console.log("req.body.Station is undefined");
            }
            if (req.file.path !== null) {
                console.log("req.file.path is not null");
            } else {
                console.log("req.file.path is null");
            }
 
            if (req.file.path !== undefined) {
                console.log("req.file.path is not undefined");
            } else {
                console.log("req.file.path is undefined");
            }
            if (results !== undefined) {
                console.log("results is not undefined");
            } else {
                console.log("results is undefined");
            }
 
            if (sql !== undefined) {
                console.log("sql is not undefined");
            } else {
                console.log("sql is undefined");
            }
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            } else {
                //res.send(results);
                res.redirect("/");
            }
        }
    );
});
*/
/* Note: When putting it in JSON format, all spaces and all special characters like -,',*, etc. have to be removed. Also, this format should be used in Postman.
   {
    {
    "ID": 20,
    "Station": "peace",
    "Address": "hope",
    "MonthlyCStoreSales": 10,
    "Operator": "love",
    "TopSKU": "majestic"
    }
    }*/
 
 
//(6) Updating/editing info by id number - checked in postman
//router.put('/editstation/:id', (req, res) => {
  //const id = req.body.id;
  //Store.update(req.body,
   // { where: {id: id} }).then(() => {
      router.put('/editstation/:ID', (req, res) => {
 
             let newStation = req.body.Station;
             let newAddress = req.body.Address;
             let newMonthlycstoresales = req.body['Monthly C-Store Sales'];
             let newOperator = req.body.Operator;
             let newTopsku = req.body['Top SKU'];
             console.log(newStation);
             console.log(newTopsku);
 
                
   let values = {Station: newStation, Address: newAddress, ['Monthly C-Store Sales']: newMonthlycstoresales, Operator: newOperator, ['Top SKU']:newTopsku };
 
   let selector = {
       where: {ID: req.params.ID}
   }
   Store.update(values, selector)
   .then((updatedPost)=>{
       console.log(updatedPost);
       res.json({
           "message": updatedPost
       })
   })
   .catch(err => {
       res.json({
           "message": err
       })
   })
 
}); 
    
/* MYSQL APPROACH
// Updating/editing info by id number - checked in postman
 
app.put("/edit/:id", (req, res) => {
    //var sql = "UPDATE stores SET station = ?, address = ?, `Monthly C-Store Sales` = ?,Operator = ?, `Top SKU` = ? WHERE id = 2";
 
    //var sql = UPDATE `stores` SET `Station` = 'Baillou Hill', `Address` = '564 Jackson Ave.', `Monthly C-Store Sales` = '800', `Operator` = 'Marla Pikes', `Top SKU` = 'Burgers' WHERE `stores`.`ID` = 2;
 
    //var sql = UPDATE `stores`
    //SET `Station` = 'Baillou Hill', `Address` = '564 Jackson Ave.', `Monthly C-Store Sales` = '800', `Operator` = 'Marla Pikes', `Top SKU` = 'Burgers', WHERE `ID` = 2;
 
    //Note: All spaces and special characters have to be removed.
    /*
var query = "UPDATE `stores` SET";
    query += "`station`= '"+req.body.Station+"',";
    query += "`address`= '"+req.body.Address+"',";
    //query += "`monthly c-store sales`= '"+req.body[MonthlyCStoreSales]+"',";
    query += "`operator`= '"+req.body.Operator+"',";
    //query += "`top sku`= '"+req.body.TopSKU+"'";
    //query += " WHERE `id`= 3";
    query += " WHERE `id`= "+ req.query.ID+"";
*/
/*
station = req.body.station;
image = req.file.path;
//image = req.files.image;
address = req.body.address;
monthlycstoresales = req.body.monthlycstoresales;
operator = req.body.operator;
topsku = req.body.topsku;
//id = req.params.ID;
id = req.body.id;
 
console.log(req.body);
 
var sql =
  "UPDATE stores SET `station` = ?, `image` = ?, `address` = ?, `monthly c-store sales` = ?,`operator` = ?, `top sku` = ? WHERE `id` = ?";
*/
/*
db.query(query,(err, results) => {
*/
 
//db.query(sql, [station, address, monthlycstoresales, operator, topsku, id], (err, results, field) => {
/*
db.query(
  sql,
  [
    req.body.station,
    req.file.path,
    //req.files.image,
    req.body.address,
    req.body.monthlycstoresales,
    req.body.operator,
    req.body.topsku,
    req.body.id
  ],
  (err, results, field) => {
    let message = {};
    if (results !== null) {
      console.log("results is not null");
      message.status = "OK";
    } else {
      console.log("results is null");
      message.status = "KO"; // ?
    }
 
    if (sql !== null) {
      console.log("sql is not null");
    } else {
      console.log("sql is null");
    }
 
    if (req.body.station !== null) {
      console.log("req.body is not null");
    } else {
      console.log("req.body is null");
    }
 
    if (req.body.station !== undefined) {
      console.log("req.body.Station is not undefined");
    } else {
      console.log("req.body.Station is undefined");
    }
 
    if (results !== undefined) {
      console.log("results is not undefined");
    } else {
      console.log("results is undefined");
    }
 
    if (sql !== undefined) {
      console.log("sql is not undefined");
    } else {
      console.log("sql is undefined");
    }
 
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return callback(rows);
    } else {
      //console.log(req.body.station);
      //res.redirect("/alldata");
      //res.send(rows);
      message.results = results;
      //res.send(message);
      res.send(results);
    }
  }
);
});
*/
                
                   
 
 
module.exports = router;