var mysql = require('mysql');

const Geocoder = require('pickpoint-geocoder');
const geocoder = new Geocoder('RoThxrMEAx74F38zHYuZ');

var con = mysql.createConnection({
  host: "localhost",
  user: "Visai",
  password: "Visai@MANGO20180801",
  database: "mangotracking",
  timezone : "UTC"
});

var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };

function timezoneConv(timezone, localTimeZone){  
    
    //console.log('----' + timezone);
    var _timezone = timezone.split(' ');
    //console.log(_timezone[0]);
    //console.log(_timezone[1]);
    
	var _date = _timezone[0];
	var _splitDate = _date.split('-');	
	var _splitTime = _timezone[1].split(':');	
	var _hour =	parseInt(_splitTime[0]);
	var _minute	=	_splitTime[1];
	var _second	=	_splitTime[2];    
  
    _hour		=	_hour + localTimeZone;  
    if (_hour > 23){
        // console.log('===== Hour over night =====');
        _hour = _hour - 24;
        // console.log(_hour + ' ===== After mid night =====');
        var getDays = getDaysInMonth(_splitDate[1],_splitDate[0]);
        //console.log(getDays + '  days from current month  ' + _splitDate[1]);
        var getCurrentDay = parseInt(_splitDate[2]);
        
        getCurrentDay = getCurrentDay + 1;
        //console.log(getCurrentDay + '  Days');

        if (getCurrentDay > getDays){
            
            var newDay = getCurrentDay - getDays;
            _splitDate[2] = newDay + '';
            if (newDay <= 9) _splitDate[2] = '0' + newDay;

            var getCurrentMonth = parseInt(_splitDate[1]);
            getCurrentMonth = getCurrentMonth + 1;
            _splitDate[1] = getCurrentMonth + '';
          //  console.log(getCurrentMonth + ' Months');

            if(getCurrentMonth <= 9) _splitDate[1] = '0' + getCurrentMonth;

            if(getCurrentMonth > 12){
                var getCurrentYear = parseInt(_splitDate[0]);
                getCurrentYear = getCurrentYear + 1;
                getCurrentMonth = getCurrentMonth - 12;
                
                _splitDate[0] = getCurrentYear + '';
                _splitDate[1] = _splitDate[1] = '0' + getCurrentMonth;                
            }
        }        
    }    

	var _timezoneConv = [_splitDate[0],_splitDate[1],_splitDate[2],_hour,
                _minute,_second];
                
    return _timezoneConv;
	}	


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("select * from gs_user_events_data ORDER BY event_id DESC LIMIT 3", function (err, result, fields) {
    if (err) throw err;
    var _dt_server = new Date(result[0].dt_server).toISOString().slice(0, 19).replace('T', ' ');    
    
    //console.log(result);
    var _timezone = timezoneConv(_dt_server,20); 
    var _geocoder;

    geocoder.reverse(result[0].lat,result[0].lng).then(_geocoder => {
        console.log('Auto Line === Alert ' + result[0].event_desc + ' === \n' + 
                'On ' + _timezone[0] + '-' + _timezone[1] + '-' + _timezone[2] + ' At ' + _timezone[3] + ':' + _timezone[4] + '\n' +
                result[0].name + '\n' +
                'Location address is ' + _geocoder.display_name + '\n'+
                'Click on map link below \n' +
                'http://maps.google.com/?q=' + result[0].lat + ',' + result[0].lng);
    });   
    
  });

  //=============GetDate from gs_user_events_data==================

  con.query("SELECT event_id,dt_tracker FROM `gs_user_events_data` WHERE dt_tracker BETWEEN '2020-03-30 17:00:00' AND '2020-03-31 17:00:00' ", function (err, result, fields) {
    if (err) throw err;
    var _dt_tracker = new Date(result[0].dt_tracker).toISOString().slice(0, 19).replace('T', ' ');    
    
    console.log(result[0].dt_tracker);
    console.log(_dt_tracker);
    var _timezone = timezoneConv(_dt_tracker,7); 
    console.log(_timezone);
  });

});

