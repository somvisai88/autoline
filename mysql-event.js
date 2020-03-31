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

function timezoneConv(timezone, localTimeZone){
    
    

    console.log('----' + timezone);

    var _timezone = timezone.split(' ');
    console.log(_timezone[0]);
    console.log(_timezone[1]);
    
	var _date = _timezone[0];
	var _splitDate = _date.split('-');	

	var _splitTime = _timezone[1].split(':');	
	var _hour   	=	parseInt(_splitTime[0]);
	var _minute	=	_splitTime[1];
	var _second	=	_splitTime[2];
    
  
    _hour		=	_hour + localTimeZone;  
    

	var _timezoneConv = [_splitDate[0],_splitDate[1],_splitDate[2],_hour,
                _minute,_second];
                
    return _timezoneConv;
	}	


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("select * from gs_user_events_data ORDER BY event_id DESC LIMIT 1", function (err, result, fields) {
    if (err) throw err;
    var _dt_server = new Date(result[0].dt_server).toISOString().slice(0, 19).replace('T', ' ');    
    
    //console.log(timezoneConv(_dt_server,7));
    var _timezone = timezoneConv(_dt_server,7); 
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

});

