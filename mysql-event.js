var mysql = require('mysql');

const Geocoder = require('pickpoint-geocoder');
const geocoder = new Geocoder('RoThxrMEAx74F38zHYuZ');

var con = mysql.createConnection({
  host: "localhost",
  user: "Visai",
  password: "Visai@MANGO20180801",
  database: "mangotracking"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("select *from gs_user_events_data ORDER BY event_id DESC LIMIT 1", function (err, result, fields) {
    if (err) throw err;
    //console.log(result[0].event_id);
    geocoder.reverse(result[0].lat,result[0].lng).then(res => {
      console.log(res.display_name);
    });
  });

});

