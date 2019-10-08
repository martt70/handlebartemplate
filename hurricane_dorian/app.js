const fs = require("fs");
const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
//const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql");
const mysql2 = require("mysql2");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const connectFlash = require("connect-flash");
const morgan = require("morgan");
const passport = require("passport");
const passportLocal = require("passport-local");
const Sequelize = require("sequelize");
const db = require("./middleware/db.js");

const boiler_houses = require("./models").boiler_houses;
const compressor_houses = require("./models").compressor_houses;
const engine_house_unit_33s = require("./models").engine_house_unit_33s;
const fire_houses = require("./models").fire_houses;
const hfo_separators = require("./models").hfo_separators;
const reverse_osmosis = require("./models").reverse_osmosis;
const tank_farm_unit_33s = require("./models").tank_farm_unit_33s;

const logger = require("./middleware/logger");
const tokenValidator = require("./middleware/tokenValidator");
const exphbs = require('express-handlebars');

const app = express();
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

//Initialize Middleware.
app.use(cors());
//app.use(expressLayouts)
app.use(logger);

//Handlebars view engine (Middleware) - (/views/layouts/main.handlebars).
app.engine('handlebars', exphbs({extname:'handlebars', defaultLayout: 'main', layoutsDir:__dirname + '/views/layouts/'}));

//put in 
app.set('views', path.join(__dirname, 'views'));

///
app.set('view engine', 'handlebars');
//app.set('views', __dirname + '/../views');
//app.set('views', __dirname + '/views');.


//Database authentication.
db.authenticate()
  .then(() => {
	console.log('Connection has been established successfully.');
})
  .catch(err => {
	console.error('Unable to connect to the database:', err);
});

//
//app.get("/", (req, res) => res.send("INDEX"));.
app.get("/", (req, res) => res.render("index", { layout: 'landing' }));

//Routes
//app.use("/api", require("./routes/api/stations"));.

app.use("/api", require("./routes/api/boiler_house"));
app.use("/api", require("./routes/api/compressor_house"));
app.use("/api", require("./routes/api/engine_house_unit_33"));
app.use("/api", require("./routes/api/fire_house"));
app.use("/api", require("./routes/api/hfo_separator"));
app.use("/api", require("./routes/api/reverse_osmosis"));
app.use("/api", require("./routes/api/tank_farm_unit_33"));

//Setting Static Folder
app.use(express.static(path.join(__dirname, "/public")));
//app.use(express.static(path.join(__dirname + '.../public')));

//Uploading Images Folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));