var getDaysInMonth = function (month, year) {
  // Here January is 1 based
  //Day 0 is the last day in the previous month
  return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
};

module.exports = function timezoneConv(timezone, localTimeZone) {
  //console.log('----' + timezone);
  var _timezone = timezone.split(" ");
  //console.log(_timezone[0]);
  //console.log(_timezone[1]);

  var _date = _timezone[0];
  var _splitDate = _date.split("-");
  var _splitTime = _timezone[1].split(":");
  var _hour = parseInt(_splitTime[0]);
  var _minute = _splitTime[1];
  var _second = _splitTime[2];

  _hour = _hour + localTimeZone;
  if (_hour > 23) {
    // console.log('===== Hour over night =====');
    _hour = _hour - 24;
    // console.log(_hour + ' ===== After mid night =====');
    var getDays = getDaysInMonth(_splitDate[1], _splitDate[0]);
    //console.log(getDays + '  days from current month  ' + _splitDate[1]);
    var getCurrentDay = parseInt(_splitDate[2]);

    getCurrentDay = getCurrentDay + 1;
    //console.log(getCurrentDay + '  Days');

    if (getCurrentDay > getDays) {
      var newDay = getCurrentDay - getDays;
      _splitDate[2] = newDay + "";
      if (newDay <= 9) _splitDate[2] = "0" + newDay;

      var getCurrentMonth = parseInt(_splitDate[1]);
      getCurrentMonth = getCurrentMonth + 1;
      _splitDate[1] = getCurrentMonth + "";
      //  console.log(getCurrentMonth + ' Months');

      if (getCurrentMonth <= 9) _splitDate[1] = "0" + getCurrentMonth;

      if (getCurrentMonth > 12) {
        var getCurrentYear = parseInt(_splitDate[0]);
        getCurrentYear = getCurrentYear + 1;
        getCurrentMonth = getCurrentMonth - 12;

        _splitDate[0] = getCurrentYear + "";
        _splitDate[1] = _splitDate[1] = "0" + getCurrentMonth;
      }
    }
  }

  var _timezoneConv = [
    _splitDate[0],
    _splitDate[1],
    _splitDate[2],
    _hour,
    _minute,
    _second,
  ];

  return _timezoneConv;
};
