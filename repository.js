const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const config = {
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1]
};

if (process.env.NODE_ENV == 'production') {
  const auth = params.auth.split(':');
  config.user = auth[0];
  config.password = auth[1];
  config.ssl = true;
  config.max = 20;
  config.min = 4;
  config.idleTimeoutMillis = 1000;
}

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

  pool.query('select st_X(dispatch_location) as x, st_Y(dispatch_location) as y, census_ref as tractId from philly_crime_incidents where to_timestamp(' + startDate + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+ endDate + ')')
    .then(function (data) {
      var firstData = data;
      pool.query('SELECT sum(case when crime_type  = 1 then 1 else 0 end) as nonviolent, sum(case when  crime_type  = 2 then 1 else 0 end) as homicide, sum(case when  crime_type  = 3 then 1 else 0 end) as violent, sum(case when  crime_type  = 4 then 1 else 0 end) as property, sum(case when  crime_type  = 5 then 1 else 0 end) as sexualcrimes from philly_crime_incidents where to_timestamp('+ startDate + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+ endDate + ')')
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

function getTractFilters(req, res, next) {

//start time
  var startTime = req.query.startTime;
  //end time
  var endTime = req.query.endTime;

//list of GIDS
  var gidList = req.query.GID;
  var gidArray = gidList.split(',')
  var census;
  var censusLen = gidArray.length;
  if (gidArray.length >= 5){
    census = 'census_ref = '+gidArray[0]+' OR census_ref = '+gidArray[1]+' OR census_ref = '+gidArray[2]+' OR census_ref = '+gidArray[3]+' OR census_ref = '+gidArray[4]+''
  } else {
    if (censusLen == 1){
        census = 'census_ref = '+gidArray[0]+''
    } else if (censusLen == 2 ){
        census = 'census_ref = '+gidArray[0]+' OR census_ref = '+gidArray[1]+''
    } else if (censusLen == 3 ){
        'census_ref = '+gidArray[0]+' OR census_ref = '+gidArray[1]+' OR census_ref = '+gidArray[2]+''
    } else if (censusLen == 4 ){
      census = 'census_ref = '+gidArray[0]+' OR census_ref = '+gidArray[1]+' OR census_ref = '+gidArray[2]+' OR census_ref = '+gidArray[3]+''
    }
  }

  //the crimetype
  var crimeType = req.query.crimeTypes;
  var crimeArray = crimeType.split(',')

  var nonviolent = "(crime_type = 1)";
  var homicide = "(crime_type = 2)";
  var violent = "(crime_type = 3)";
  var property = "(crime_type = 4)";
  var sexcrimes = "(crime_type = 5)";

  var numTrues = 0;
  var crimeQuery;

  for (var i = 0; i < crimeArray.length; i++){
    if (crimeArray[i] == true){
      numTrues = numTrues + 1;
    }
  }

  var TruesArray = [];

  if(crimeArray[0] == true){
      TruesArray.push(nonviolent)
  } 
  if(crimeArray[1] == true){
      TruesArray.push(homicide)
  } 
  if(crimeArray[2] == true){
      TruesArray.push(violent)
  } 
  if(crimeArray[3] == true){
      TruesArray.push(property)
  } 
  if(crimeArray[4] == true){
      TruesArray.push(sexcrimes)
  } 

  if(numTrues == 1){
      crimeQuery = TruesArray[0];
  } else if (numTrues == 2){
      crimeQuery = TruesArray[0] + " OR " + TruesArray[1];
  } else if (numTrues == 3){
      crimeQuery = TruesArray[0] + " OR " + TruesArray[1] + " OR " + TruesArray[2];
  } else if (numTrues == 4){
      crimeQuery = TruesArray[0] + " OR " + TruesArray[1] + " OR " + TruesArray[2] + " OR " + TruesArray[3];
  } else if (numTrues == 5){
      crimeQuery = TruesArray[0] + " OR " + TruesArray[1] + " OR " + TruesArray[2] + " OR " + TruesArray[3] + " OR " + TruesArray[4];
  }


  //assign query to each
  //get number of trues
  //get the trues into a different array
  //check per number of trues 
    //crimeTypes
  /*
  Non-violent / Other =1 
  Homicide =2
  Violent =3
  Property =4
  Sexual Crimes =5
  */
  
  var conditions = req.query.crimeWeather;
  //condition.to
  //crimeWeather
  /*
  clear weather =1 clear 0-49
  Cloudy  =2 50+
  Rain =percipitaiton > 0
  Snow =4 snow > 0
  */
  var clear = "";
  var cloudy = "";
  var rain = "";
  var snow = "";

  var filternum = 0;
  var con;

  var condarray = conditions.split(',')
  var indecies = [4];

  if(condarray[0] == 1){
    clear = "(w.cloudavg >= 0 AND w.cloudavg <= 49)"
    filternum++;
    indecies[filternum-1] = clear;
  }
  if (condarray[1] == 1){
    cloudy = "(w.cloudavg >= 50 AND w.cloudavg <= 100)"
    filternum++;
    indecies[filternum-1] = cloudy;
  }
  if (condarray[2] == 1){
    rain = "(w.prcp > 0)"
    filternum++;
    indecies[filternum-1] = rain;
  }
  if (condarray[3] == 1){
    snow = "(w.snow > 0)"
    filternum++;
    indecies[filternum-1] = snow;
  }

  if (filternum == 4){
      con = clear + ' OR ' + cloudy + ' OR ' + rain + ' OR ' + snow;
  } else if (filternum == 3){
    var first = false;
    var second = false;
    var third = false;
      for(var i = 0; i < 4; i++){
        if(indecies[i] != null){
          if (first == false){
            con = indecies[i];
            first = true;
          } else if (second == false){
            con = con + " OR " + indecies[i];
            second = true;
          } else if (third == false){
            con = con + " OR " + indecies[i];
            third = true;
          }
        }
      }
  } else if (filternum == 2){
    var temp;
    if(condarray[0] == true){
        temp = clear;
        if (condarray[1] == true){
          con = temp + " OR " + cloudy;
        } else if (condarray [2] == true){
          con = temp + " OR " + rain;
        } else if (condarray [2] == true){
          con = temp + " OR " + snow;
        }
    } else if(condarray[1] == true){
        temp = cloudy;
    } else if(condarray[2] == true){
        temp = rain;
    } else if(condarray[3] == true){
        temp = snow;
    }
  } else if (filternum == 1){
    con = clear + cloudy + rain + snow; 
  }
  

  var dayOrNight = req.query.crimeTime;
  var dornArr = dayOrNight.split(',')
  //crimeTime
  //Day =1 06 - 20
  //Night =2 20 - 06
  //EXTRACT(HOUR FROM dispatch_date_time) > 18
    
  var day;
  var night;
  var dorn;
  //daytime
  if(dornArr[0] == true){
    day = "(EXTRACT(HOUR FROM dispatch_date_time) <= 20 AND EXTRACT(HOUR FROM dispatch_date_time) >= 06)"
  }
  //nighttime
  if(dornArr[1] == true){
    night = "(EXTRACT(HOUR FROM dispatch_date_time) <= 06 OR EXTRACT(HOUR FROM dispatch_date_time) >= 20)"
  }

  //both
  if(dornArr[0] == true && dornArr[1] == true){
    dorn = "((EXTRACT(HOUR FROM dispatch_date_time) <= 06 OR EXTRACT(HOUR FROM dispatch_date_time) >= 20) OR (EXTRACT(HOUR FROM dispatch_date_time) <= 20 AND EXTRACT(HOUR FROM dispatch_date_time) >= 06))"
  } else if (dornArr[0] == true && dornArr[1] == false){
    dorn = day;
  } else {
    dorn = night;
  }

  var finquery = 'SELECT dc_number as dcNum, st_X(dispatch_location) as x, st_Y(dispatch_location) as y, dispatch_date_time as timeOfCrime, general_crime_category as crime, w.tmax as maxTemp, w.tmin as minTemp from philly_crime_incidents, philly_weather w where (' + census + ') AND to_timestamp(' + startTime + ') <= dispatch_date_time AND dispatch_date_time <= to_timestamp('+endTime+') AND ('+ crimeQuery +') AND ('+ con +') AND ('+ dorn +') AND w.begintime = weather_ref'

  //list of GIDs 4 max, 1-5, 1-5, 1-5 
  //Day 06 - 20
  //Night 20 - 06
  /*
  SELECT dc_number as dcNum, st_X(dispatch_location) as x, st_Y(dispatch_location) as y, dispatch_date_time as timeOfCrime, general_crime_category as crime, w.tmax as maxTemp, w.tmin as minTemp
  from philly_crime_incidents, philly_weather w
  where (census_ref = 1 OR census_ref = 2) 
  AND to_timestamp(1199145600) <= dispatch_date_time AND dispatch_date_time <= to_timestamp(1230768000)
  AND (crime_type = 1 OR crime_type = 4)
  AND w.snow > 0
  AND (EXTRACT(HOUR FROM dispatch_date_time) > 18)
  AND w.begintime = weather_ref
  */

  //input: {startTime, endTime, GID[], crimeTypes[bool, bool, bool, bool, bool] , crimeWeather[bool,bool,bool,bool] , crimeTime[bool,bool]}

  //?arr[]=1&arr[]=2&arr[]=3&arr[]=4

  pool.query(finquery)
    .then(function (data) {
      res.status(200)
        .json(data.rows);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getWardInfo(req, res, next) {
  var election = parseInt(req.query.election);
  var source;
  if(election == 2016){
    source = 'election_2016'
  } else if (election == 2012){
     source = 'election_2012'
  } else if (election == 2008){
    source = 'election_2008'
  }

  var query = "select ward, sum(votes) as votes, 'republican' as source from election_2016 where party = 'REPUBLICAN' GROUP BY ward UNION ALL SELECT ward, sum(votes) as votes, 'republican' as party from " + source + " where party = 'DEMOCRATIC' GROUP BY ward"
  
  pool.query(query)
    .then(function (data) {
      res.status(200)
        .json(data.rows);
    })
    .catch(function (err) {
      return next(err);
    });
/*
  select ward, sum(votes) as votes, 'republican' as source from election_2016
where party = 'REPUBLICAN'
GROUP BY ward
UNION ALL
  SELECT ward, sum(votes) as votes, 'republican' as source from election_2016
where party = 'DEMOCRATIC'
GROUP BY ward
*/
}

module.exports = {
  getCrimesInRange: getCrimesInRange,
  getTractSummary: getTractSummary,
  getFilterGIDs: getFilterGIDs,
  getTractFilters: getTractFilters,
  getWardInfo: getWardInfo
};
