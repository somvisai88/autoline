var mysql = require("mysql");

const DateConverter = require("./functions/DateConverter.js");

const Geocoder = require("pickpoint-geocoder");
const geocoder = new Geocoder("RoThxrMEAx74F38zHYuZ");

var con = mysql.createPool({
  host: "localhost",
  user: "Visai",
  password: "Visai@MANGO20180801",
  database: "mangotracking",
  timezone: "UTC",
});

con.getConnection(function (err) {
  if (err) throw err;
  console.log("Connected!");

  con.query(
    "select * from gs_user_events_data ORDER BY event_id DESC LIMIT 1",
    function (err, result, fields) {
      if (err) throw err;
      var _dt_tracker = new Date(result[0].dt_tracker)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // console.log(result);
      var _timezone = new DateConverter(_dt_tracker, 7);
      var _geocoder;

      geocoder.reverse(result[0].lat, result[0].lng).then((_geocoder) => {
        console.log(
          "Auto Line === Alert " +
            result[0].event_desc +
            " === \n" +
            "On " +
            _timezone[0] +
            "-" +
            _timezone[1] +
            "-" +
            _timezone[2] +
            " At " +
            _timezone[3] +
            ":" +
            _timezone[4] +
            "\n" +
            result[0].name +
            "\n" +
            "Location address is " +
            _geocoder.display_name +
            "\n" +
            "Click on map link below \n" +
            "http://maps.google.com/?q=" +
            result[0].lat +
            "," +
            result[0].lng
        );
      });
    }
  );

  //=============GetDate from gs_user_events_data==================

  /* con.query("SELECT * FROM `gs_user_events_data` WHERE dt_tracker BETWEEN '2020-03-30 17:00:00' AND '2020-03-31 17:00:00' ", function (err, result, fields) {
    if (err) throw err;
    //var _dt_tracker = new Date(result[0].dt_tracker).toISOString().slice(0, 19).replace('T', ' ');    
    
    console.log('=======COUNT ROW TABLE======== ' + result.length);
    if (result.length > 0) { 
        for(var i = 0; i < result.length; i++) {
            var _dt_tracker = new Date(result[i].dt_tracker).toISOString().slice(0, 19).replace('T', ' ');
            console.log(timezoneConv(_dt_tracker,7));
            console.log(result[i]);
        }
    }
    
    //console.log(_dt_tracker);
    //var _timezone = timezoneConv(_dt_tracker,7); 
    //console.log(_timezone);
    //console.log(result);
  });
 */

  function differenceOf2Arrays(array1, array2) {
    var temp = [];
    array1 = array1.toString().split(",").map(Number);
    array2 = array2.toString().split(",").map(Number);

    for (var i in array1) {
      if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
    }
    for (i in array2) {
      if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
    }
    return temp.sort((a, b) => a - b);
  }

  var moment = require("moment");

  console.log("==== Today is " + moment().format("YYYY-MM-DD") + " =========");

  var Excel = require("exceljs");
  var fs = require("fs");

  // create workbook & add worksheet
  var workbook = new Excel.Workbook();

  if (
    !fs.existsSync("Alert_Report/" + moment().format("YYYY-MM-DD") + ".xlsx")
  ) {
    var worksheet = workbook.addWorksheet("BOT LINE");

    // add column headers
    worksheet.columns = [
      { header: "USER_ID", key: "user_id" },
      { header: "EVENT_ID", key: "event_id" },
    ];

    con.query(
      "SELECT * FROM `gs_user_events_data` WHERE dt_tracker BETWEEN '2020-03-31 17:00:00' AND '2020-04-01 17:00:00' ",
      function (err, result, fields) {
        if (err) throw err;
        //var _dt_tracker = new Date(result[0].dt_tracker).toISOString().slice(0, 19).replace('T', ' ');

        console.log("=======COUNT ROW TABLE======== " + result.length);
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var _dt_tracker = new Date(result[i].dt_tracker)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");
            //console.log(timezoneConv(_dt_tracker, 7));
            //console.log(result[i]);
            worksheet.addRow({
              user_id: result[i].user_id,
              event_id: result[i].event_id,
            });
          }
          workbook.xlsx
            .writeFile(
              "Alert_Report/" + moment().format("YYYY-MM-DD") + ".xlsx"
            )
            .then(function () {
              console.log("saved");
            });
        }
      }
    );
  } else {
    var workbook = new Excel.Workbook();
    //workbook.xlsx.readFile('Alert_Report/'+ moment().format('YYYY-MM-DD') + '.xlsx')
    workbook.xlsx.readFile("Alert_Report/2020-04-01.xlsx").then(function () {
      var worksheet = workbook.getWorksheet("BOT LINE");
      console.log(worksheet.rowCount - 1 + "");

      con.query(
        "SELECT * FROM `gs_user_events_data` WHERE dt_tracker BETWEEN '2020-03-31 17:00:00' AND '2020-04-01 17:00:00' ",
        function (err, result, fields) {
          if (err) throw err;
          // console.log("=======COUNT ROW TABLE======== " + result.length);

          if (worksheet.rowCount - 1 < result.length) {
            console.log("=== NEED TO SAVE AND SEND LINE MESSAGE===");
            var myExcelData = [];

            worksheet.eachRow(function (row, rowNumber) {
              //console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
              //  worksheet.addRow({user_id: result[i].user_id,event_id: result[i].event_id});
              if (rowNumber > 1) {
                /*      console.log(
                  "======EXCEL DATA RETRIEVE========" +
                    worksheet.getRow(rowNumber).values[2]
                ); */
                myExcelData.push(worksheet.getRow(rowNumber).values[2]);
              }
            });

            for (var i = 0; i < myExcelData.length; i++) {
              console.log("=== EXCEL CHECK ===" + myExcelData[i]);
            }

            var myDBData = [];
            if (result.length > 0) {
              for (var i = 0; i < result.length; i++) {
                myDBData.push(result[i].event_id);
              }
            }

            /* for (var i = 0; i < myDBData.length; i++) {
              console.log("=== DB CHECK ===" + myDBData[i]);
            } */

            console.log(
              "The Difference Between Excel and DB" +
                differenceOf2Arrays(myExcelData, myDBData)
            );
            var myLineSMS = differenceOf2Arrays(myExcelData, myDBData);
            var myLine = myLineSMS.toString().split(",");
            /* console.log(
              "=== Last Line SMS Index ===" + myLine[myLine.length - 1]
            );
            console.log("=== First Line SMS Index ===" + myLineSMS[0]); */

            var _myQueryArray = differenceOf2Arrays(myExcelData, myDBData);

            let _myQuery = new Map();
            console.log("=== Array === " + _myQueryArray);
            var _saveLastData = "";
            var _saveFirstOrderData = "";
            var _saveLastIndex = 1;

            var _saveArray = [];
            var _saveArrayNoIndex = [];

            if (_myQueryArray.length > 0) {
              for (var i = 0; i < _myQueryArray.length; i++) {
                if (i != 0) {
                  _saveLastData = parseInt(_myQueryArray[i]) - 1;
                  /*  console.log(
                  "== FD == " + _saveFirstOrderData + " CHECK " + _saveLastData
                ); */
                  if (_saveFirstOrderData == _saveLastData) {
                    _saveArray.push(_myQueryArray[i]);

                    // console.log("== EQUAL ARRAY LENGTH == " + _saveArray.length);
                  } else {
                    _saveLastData = parseInt(_myQueryArray[i]);
                    if (_saveArray.length >= 1) {
                      if (_saveArray.length > 1) {
                        _myQuery.set(_saveLastIndex, _saveArray);
                        _saveLastIndex++;
                      }

                      _saveArray = [];
                      // console.log("== ARRAY LENGTH == " + _saveArray.length);
                      _saveArray.push(_myQueryArray[i]);
                      if (i != _myQueryArray.length - 1) {
                        if (
                          _saveLastData != parseInt(_myQueryArray[i + 1] - 1)
                        ) {
                          _saveArrayNoIndex.push(_myQueryArray[i]);
                        }
                      } else {
                        _saveArrayNoIndex.push(_myQueryArray[i]);
                      }
                    }
                  }
                  _saveFirstOrderData = _myQueryArray[i];
                } else {
                  _saveArray.push(_myQueryArray[i]);
                  _saveLastData = _saveFirstOrderData = _myQueryArray[i];
                  if (_saveLastData != parseInt(_myQueryArray[i + 1] - 1)) {
                    _saveArrayNoIndex.push(_myQueryArray[i]);
                  }
                  //console.log("== FIRST ARRAY DATA == " + _saveArray[i]);
                }
              }
            }

            if (_saveLastIndex == 1) {
              _myQuery.set(_saveLastIndex, _saveArray);
            }

            if (_saveArrayNoIndex.length > 0) {
              _myQuery.set(0, _saveArrayNoIndex);
            }
            /* for (var i = 0; i < _saveArrayNoIndex.length; i++) {
              console.log(
                "== FOUND NO INDEX NUMBER == " + _saveArrayNoIndex[i]
              );
            } */

            //console.log(_myQuery.entries());
            if (_myQuery.size > 0) {
              for (let [key, value] of _myQuery) {
                console.log(key + " with  " + value);
                for (var i = 0; i < value.length; i++) {
                  //console.log(value[i]);
                }
              }
              _myQuery.clear();
              console.log("==== SIZE ==== " + _myQuery.size);
            } else {
              console.log("==== NO DATA =====");
            }
          }
        }
      );
    });
  }
});
