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
  database: params.pathname.split('/')[1],
  idleTimeoutMillis: 1000
};

const Pool = require('pg-pool')
const pool = new Pool(config);

function getFilterGIDs(req, res, next) {

  var medianAge = parseInt(req.query.medianAge);
  //18-24 =1
  //25-34 =2
  //35-44 =3
  //45-54 =4
  //55+ =5
  //ALL =0
    var medAge;
    switch(medianAge) {
      case 1:
        medAge = "18 <= c.median_age AND c.median_age <= 24"
        break;
      case 2:
          medAge = "25 <= c.median_age AND c.median_age <= 34"
        break;
      case 3:
          medAge = "35 <= c.median_age AND c.median_age <= 44"
        break;
      case 4:
          medAge = "45 <= c.median_age AND c.median_age <= 54"
        break;
      case 5:
          medAge = "18 <= c.median_age"
        break;
      case 0:
          medAge = '18 <= c.median_age AND c.median_age <= 99'
          break;
      default:
          medAge = "18 <= c.median_age AND c.median_age <= 99"
          break;
      }



  var unemploymentPercent = parseInt(req.query.unemployment);
  //0-4.9 =1
  //5-14.9 =2
  //15-24.9 =3
  //25+ =4
  //ALL =0
  var unemp;
  switch(unemploymentPercent) {
    case 1:
       unemp = '0.0 <= b."HC03_VC13" AND b."HC03_VC13" <= 4.9'
       break;
    case 2:
        unemp = '5.0 <= b."HC03_VC13" AND b."HC03_VC13" <= 14.9'
       break;
    case 3:
        unemp = '15 <= b."HC03_VC13" AND b."HC03_VC13" <= 24.9'
       break;
    case 4:
        unemp = '25 <= b."HC03_VC13"'
       break;
    case 0:
        unemp = '0.0 <= b."HC03_VC13" AND b."HC03_VC13" <= 100'
        break;
    default:
        unemp = '0.0 <= b."HC03_VC13" AND b."HC03_VC13" <= 100'
        break;
}
  

  var medianIncome = parseInt(req.query.medianIncome);
  //9K-20K =1
  //20K-40K =2
  //40K-60K =3
  //60K-75K =4
  //75K+ =5
  //ALL =0
  var medinc;
  switch(medianIncome) {
    case 1:
        medinc = '9000 <= b."HC01_VC85" AND b."HC01_VC85" <= 20000'
        break;
    case 2:
        medinc = '20000 <= b."HC01_VC85" AND b."HC01_VC85" <= 40000'
        break;
    case 3:
        medinc = '40000 <= b."HC01_VC85" AND b."HC01_VC85" <= 60000'
        break;
    case 4:
        medinc = '60000 <= b."HC01_VC85" AND b."HC01_VC85" <= 75000'
        break;
    case 5:
        medinc = '7500 <= b."HC01_VC85"'
        break;
    case 0:
        medinc = '0 <= b."HC01_VC85" AND b."HC01_VC85" <= 700000'
        break;
    default:
        medinc = '0 <= b."HC01_VC85" AND b."HC01_VC85" <= 700000'
        break;
  }
  

  var vacancyRate = parseInt(req.query.vacancyRate);
  //0-1.9 =1
  //2-3.9 =2
  //4-9.9 =3
  //10+ =4
  //ALL =0
  var vacrate;
  switch(vacancyRate) {
    case 1:
        vacrate = '0 <= c.homeowner_vacancy_rate_percentage AND c.homeowner_vacancy_rate_percentage <= 1.9'
        break;
    case 2:
        vacrate = '2 <= c.homeowner_vacancy_rate_percentage AND c.homeowner_vacancy_rate_percentage <= 3.9'
        break
    case 3:
        vacrate = '4 <= c.homeowner_vacancy_rate_percentage AND c.homeowner_vacancy_rate_percentage <= 9.9'
        break
    case 4:
        vacrate = '10 <= c.homeowner_vacancy_rate_percentage'
        break
    case 0:
        vacrate = '0 <= c.homeowner_vacancy_rate_percentage AND c.homeowner_vacancy_rate_percentage <= 100'
        break;
    default:
        vacrate = '0 <= c.homeowner_vacancy_rate_percentage AND c.homeowner_vacancy_rate_percentage <= 100'
        break;
}
  

  var povertyRate = parseInt(req.query.povertyRate);
  //0-3.9 =1
  //4-6.9 =2
  //7-13.9=3
  //14+ =4
  //ALL =0
  var povrate;
  switch(povertyRate) {
    case 1:
        povrate = '0 <= b."HC03_VC166" AND b."HC03_VC166" <= 3.9'
        break;
    case 2:
        povrate = '4 <= b."HC03_VC166" AND b."HC03_VC166" <= 6.9'
        break;
    case 3:
        povrate = '7 <= b."HC03_VC166" AND b."HC03_VC166" <= 13.9'
        break;
    case 4:
        povrate = '14 <= b."HC03_VC166"'
        break;
    case 0:
        povrate = '0 <= b."HC03_VC166" AND b."HC03_VC166" <= 100'
        break;
    default:
        povrate = '0 <= b."HC03_VC166" AND b."HC03_VC166" <= 100'
        break;
}
var query = 'Select a.gid as gid from census_tracts a JOIN census_tracts_economic_data b ON a.economic_data_ref = b.tract_economic_id JOIN census_tracts_demographic_data c ON a.economic_data_ref = c.tract_demographic_id where '+ medAge +' AND ' + unemp + ' AND ' + medinc + ' AND ' + vacrate + ' AND ' + povrate +'';
  

  pool.query(query)
    .then(function (data) {
      res.status(200)
        .json(data.rows);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTractSummary(req, res, next) {

  var tractGID = parseInt(req.params.tractId);

  //median age
  //unemployment rate
  //median household income
  //homeowner vacancy rate
  //poverty rate

  //total crimes in tract

  pool.query('Select a.gid as gid, a.tract_name as tractName, c.median_age as medAge, c.total_population as totalPop, b."HC03_VC13" as percentUnemployed, b."HC01_VC85" as medianHouseholdIncome, c.homeowner_vacancy_rate_percentage as homeOwnerVacancy, b."HC03_VC166" as povertyRate from census_tracts a JOIN census_tracts_economic_data b ON a.economic_data_ref = b.tract_economic_id JOIN census_tracts_demographic_data c ON a.economic_data_ref = c.tract_demographic_id where a.gid =' + tractGID +'')
    .then(function (data) {
      res.status(200)
        .json(data.rows);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCrimesInRange(req, res, next) {

  var startDate = req.query.start;
  var endDate = req.query.end;
  var philly = "Philadelphia County";

  pool.query('select st_X(dispatch_location) as x, st_Y(dispatch_location) as y, dc_number as id from public.philly_crime_incidents where to_timestamp(' + startDate + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+ endDate + ')')
    .then(function (data) {
      var firstData = data;
      pool.query('select count(dc_number) as crimeCount from public.philly_crime_incidents where to_timestamp(' + startDate + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+ endDate + ')')
        .then(function (data) {
          var secondData = data;
                pool.query("SELECT total_population as totalPop, median_age as medAge, total_housing_units as totalHousingUnits, homeowner_vacancy_rate_percentage as homeVacancyRatePercentage FROM census_tracts_demographic_data where tract = 'Philadelphia County' ")
              .then(function (data) {
                var thirdData = data;
                pool.query("SELECT a.\"HC03_VC13\" as percentUnemployed, a.\"HC01_VC85\" as medianHouseholdIncome, a.\"HC03_VC166\" as percentPovertyRate, a.\"HC01_VC115\" as perCapitaIncome FROM census_tracts_economic_data a where tract = 'Philadelphia County'")
              .then(function (data) {
                res.status(200)
                  .json({
                    points: firstData,
                    totalCrimes: secondData,
                    DemographicData: thirdData,
                    EconomicData: data
                    });
              })
            })
        })
    })
    .catch(function (err) {
      return next(err);
    });

    //Then get city wide Data
    //first get total crimes within timerange
     
  
  


  //Then select from economic data 
  //median household income
  //percent unemployed
  //poverty rate

}

module.exports = {
  getCrimesInRange: getCrimesInRange,
  getTractSummary: getTractSummary,
  getFilterGIDs: getFilterGIDs
};
