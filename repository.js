const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const url = require('url');

const params = url.parse(process.env.DATABASE_URL || 'postgres://localhost:5432/postgres');

const config = {
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1]
};

const Pool = require('pg-pool')
const pool = new Pool(config);

function getCrimesInRange(req, res, next) {

  var startDate = req.query.start;
  var endDate = req.query.end;

  pool.query('select st_X(dispatch_location) as x, st_Y(dispatch_location) as y, census_ref as tractId from public.philly_crime_incidents where to_timestamp(' + startDate + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+ endDate + ')')
    .then(function (data) {
      res.status(200)
        .json(data.rows);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getCrimesInRange: getCrimesInRange,
};
