const moment = require('moment');

const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get('host')}${req.originalUrl}:${moment().format()}`
  );
  next();
};

module.exports = logger;

//example: http://localhost:5000/api/members: 2019-02-21T20:46:27-05:00