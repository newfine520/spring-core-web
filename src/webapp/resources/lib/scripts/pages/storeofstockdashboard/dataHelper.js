

function autoAdd0(d) {

    if ((d+"").length == 1) {
        return "0" + d;
    }
    return d;
}
function getLastWeek() {

    var myDate = new Date();
    var weekDate = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);// 计算开始时间用
    var weekDate2 = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);// 计算结束时间用

    var day = weekDate.getDay();
    var time = weekDate.getDate() - day + (day === 0 ? -6 : 1);

    var startDate = new Date(weekDate.setDate(time));
    var month = startDate.getFullYear() + '-' + (startDate.getMonth() + 1);
    var beginTime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
    var displayBeginTime = autoAdd0(startDate.getMonth() + 1) + "" + autoAdd0(startDate.getDate());
    var endDate = new Date(weekDate2.setDate(time + 6));
    var endTime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
    var displayEndTime = autoAdd0(endDate.getMonth() + 1) + "" + autoAdd0(endDate.getDate());

    console.log(beginTime);
    console.log(endTime);
    console.log(month);
    console.log(displayBeginTime);

    console.log(displayEndTime);


    return {
        beginTime: beginTime,
        displayBeginTime: displayBeginTime,
        endTime: endTime,
        displayEndTime: displayEndTime,
        month: month
    }
}





var commonUtilsNS = commonUtilsNS || {};

commonUtilsNS.deal = function (arg) {
    var t = 0;
    try {
        t = arg.toString().split(".")[1].length
    } catch (e) { }
    return t;
}
commonUtilsNS.accAdd = function (arg1, arg2) {
    var r1 = commonUtilsNS.deal(arg1);
    var r2 = commonUtilsNS.deal(arg2);
    var m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
};

commonUtilsNS.getMonthWeek = function (year, month) { //传入  年  月  获取当月有几周 以及日期 

    var new_year = year;    //取当前的年份
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
    var weekDay = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"];

    if (month > 12) {
        new_month = 12;        //月份减
        new_year;            //年份增
    }
    var first_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天-时间格式
    var last_Data = (new Date(first_date.getTime() - 1000 * 60 * 60 * 24)).getDate() //获取当月最后一天日期
    //console.log('最后一天日期'+last_Data+'号')
    //当月第一天是周几
    var firstzhouji = new Date(new_year + '/' + new_month + '/' + 1).getDay() == 0 ? '星期天' : weekDay[new Date(new_year + '/' + new_month + '/' + 1).getDay() - 1]
    //当月最后一天是周几
    var lastzhouji = new Date(new_year + '/' + new_month + '/' + last_Data).getDay() == 0 ? '星期天' : weekDay[new Date(new_year + '/' + new_month + '/' + last_Data).getDay() - 1]

    var firsttime = '' //第一周有几天
    if (firstzhouji == '星期一') { firsttime = 7 }
    if (firstzhouji == '星期二') { firsttime = 6 }
    if (firstzhouji == '星期三') { firsttime = 5 }
    if (firstzhouji == '星期四') { firsttime = 4 }
    if (firstzhouji == '星期五') { firsttime = 3 }
    if (firstzhouji == '星期六') { firsttime = 2 }
    if (firstzhouji == '星期天') { firsttime = 1 }
    //console.log('本月第一天“'+firstzhouji+'”本月第一周有“'+firsttime+'”天')

    var lasttime = '' //最后一周有几天
    if (lastzhouji == '星期一') { lasttime = 1 }
    if (lastzhouji == '星期二') { lasttime = 2 }
    if (lastzhouji == '星期三') { lasttime = 3 }
    if (lastzhouji == '星期四') { lasttime = 4 }
    if (lastzhouji == '星期五') { lasttime = 5 }
    if (lastzhouji == '星期六') { lasttime = 6 }
    if (lastzhouji == '星期天') { lasttime = 7 }
    // console.log('本月最后一天“'+lastzhouji+'”本月最后一周有“'+lasttime+'”天')

    // 前后两周  加上 剩余周数  得出总周数
    var contime = 2 + (last_Data - lasttime - firsttime) / 7

    //得出每周对应的日期
    var zhouArry = []

    //设置开始结束时间舍弃 开始周不足7天，补充结束周不足7天的
    for (var i = 1; i <= contime; i++) {
        var strTime = ''
        var lastTime = ''
        //第一周
        if (i == 1) {
            strTime = year + '-' + autoAdd0(new_month) + '-' + 1
            lastTime = year + '-' + autoAdd0(new_month) + '-' + (1 + firsttime - 1)

        }
        else if (i == contime) {
            //最后一周
            strTime = year + '-' + new_month + '-' + (last_Data - lasttime + 1)
            lastTime = year + '-' + new_month + '-' + last_Data

            if (lasttime < 7) {
  
                lastTime = addDate(zhouArry[zhouArry.length - 1].endtime, 7);
            }
          
        } else {
            strTime = addDate(zhouArry[zhouArry.length - 1].endtime, 1)
            lastTime = addDate(zhouArry[zhouArry.length - 1].endtime, 7)
        }

        var endDate = new Date(lastTime);
        var displayEndTime = autoAdd0(endDate.getMonth() + 1) + "" + autoAdd0(endDate.getDate());
        var sDate = new Date(strTime);
        var displayBeginTime = autoAdd0(sDate.getMonth() + 1) + "" + autoAdd0(sDate.getDate());

        if (i == 1) {
            zhouArry.push({
                weeknum: i,
                begintime: strTime,
                endtime: lastTime,
                weekDay: firsttime,
                displayEndTime: displayEndTime,
                displayBeginTime: displayBeginTime
            })
        } else {
            zhouArry.push({
                weeknum: i,
                begintime: strTime,
                endtime: lastTime,
                weekDay: 7,
                displayEndTime: displayEndTime,
                displayBeginTime: displayBeginTime
            })
        }
       



        //日期增加 接受两个参数， 传入的时间，传入时间增加的天数
        function addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }

            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();

            return date.getFullYear() + '-' + autoAdd0(month) + '-' + day;
        }


        //console.log(zhouArry)//打印数据


    }

    return zhouArry.filter(function (currentValue, index, arr) {

        return currentValue.weekDay == 7;

    })
}