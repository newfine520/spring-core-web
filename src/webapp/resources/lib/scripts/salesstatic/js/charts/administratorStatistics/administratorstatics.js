var unit = "箱";
var totalcount = 0;
var now = new Date();
Year = now.getFullYear();
Month = now.getMonth() + 1;
if (Month <= 9) {
    Month = '0' + Month;
}
YearMonthSta = Year + '-01-01';
YearMonthEnd = Year + '-' + Month + '-01';
var searchCondition = {
    StartTime: YearMonthSta,
    EndTime: YearMonthEnd,
    DateType: 0,
    DealerId: '-1',
    Distributors: '-1'
};


$(document).ready(function () {
    //初始化经销商
    getDistributorList();
    // 初始化日历
    initTime();

    //初始化数据
    allReportData();

    // 绑定查询按钮点击
    $('#searchbtn').on('click', function () {
        searchCondition = getSearchCondition();
        var s = new Date(YearMonthSta);
        var e = new Date(YearMonthEnd);
        if (e - s < 0) {
            $.ShowMessage("error", "开始月份必须小于结束月份");
        } else if (e.setMonth(e.getMonth() + 1) - s.getTime() > (1000 * 60 * 60 * 24 * 365)) {
            $.ShowMessage("error", "月份选择不超过12个月 ");
        } else {
            allReportData();
        }
    });

    //按钮单选
    $("#salestotal").click(function () {
        unit = "元";
        $("#radiocheckvalue").val($("#salestotal").val());
        $("#salescount").attr("checked", false);
    });
    $("#salescount").click(function () {
        unit = "箱";
        $("#radiocheckvalue").val($("#salescount").val());
        $("#salestotal").attr("checked", false);
    });

    $('.lineCart').on('click', function () {
        $(this).toggleClass('reverse');
        $(this).parent().find('.line-content').toggleClass('heightAuto');
    })
});

// 初始化时间和日历
function initTime() {
    var nowTime = new Date();
    nowYear = nowTime.getFullYear();
    nowMonth = nowTime.getMonth() + 1;
    if (nowMonth <= 9) {
        nowMonth = '0' + nowMonth;
    }

    YearMonthSta = nowYear + '-01-01';
    YearMonthEnd = nowYear + '-' + nowMonth + '-01';

    laydate.render({
        elem: '#startTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-01',
        done: function (value, date, endDate) {
            YearMonthSta = value + '-01';
        }
    });
    laydate.render({
        elem: '#endTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-' + nowMonth,
        done: function (value, date, endDate) {
            YearMonthEnd = value + '-01'
        }
    });
};
//加载经销商
function getDistributorList() {
    $.SubAjax({
        type: 'GET',
        url: '/DataImport/SalesDataStatistics/GetDistributorList',
        success: function (res) {
            if (res.IsSuccess) {
                var data = res.Data;
                $("#distributor").html('');
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        $("#distributor").append('<label class="checkbox-inline i-checks"><input type="checkbox" value="' + data[i].value + '">' + data[i].text + '</label>');
                    }
                }
                $('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                });
                checkFirst($('#distributor .i-checks'));

                // checkbox无限与其他互斥
                $('.line-content').each(function (i, ele) {
                    checkboxXOR($(ele));
                })
            }

        }
    });
}

// checkbox默认选中第一个
function checkFirst(ele) {
    ele.first().iCheck('check');
};
// checkbox无限与其他互斥
function checkboxXOR(ele) { // 传入DOM对象
    ele.find('.i-checks').on('ifChecked', function (event) {
        var val = $(this).find('input').val();
        if (val != -1) {
            ele.find('.i-checks').first().iCheck('uncheck');
        } else {
            // ele.find('.i-checks').iCheck('uncheck');
        }
    });
};

// 组装查询条件
function getSearchCondition() {
    var searchCondition = {
        StartTime: YearMonthSta,
        EndTime: YearMonthEnd,
        DateType: $("#radiocheckvalue").val(),
        DealerId: eachConditionLine('distributor'),
        Distributors: eachConditionLine('distributor'),
    };

    return searchCondition;
};

//获取筛选条件
function eachConditionLine(mainId) {
    var str = '';
    if ($('#' + mainId + ' .i-checks input').length > 0) {
        $('#' + mainId + ' .i-checks input').each(function () {
            if (true == $(this).is(':checked')) {
                str = str + $(this).val() + ',';
            }
        });
    } else {
        str = '-1,';
    }
    return str.substring(0, str.length - 1);
};

//页面加载数据
function allReportData() {
    getReportStore();
    ReportsSkuSalesVolume();
}

//加载柱形图
function getReportStore() {
    $.SubAjax({
        type: 'post',
        url: '/DataImport/AdminStatistics/ReportStore',
        data: searchCondition,
        success: function (data) {
            if (data.IsSuccess) {
                Chart1(data.Data);
                //console.log(data.Data);
                //for (i in data.Data) {
                //    if (data.Data.hasOwnProperty(i)) {
                //        Chart1(data.Data[i]);
                //    }
                //}
            }

        }
    });
};

//加载饼形图-加载条形图
function ReportsSkuSalesVolume() {
    $("#mainChart").innerHTML = "";
    $.SubAjax({
        type: 'post',
        url: '/DataImport/AdminStatistics/ReportsSkuSalesVolume',
        data: searchCondition,
        success: function (msg) {
            var a = msg;
            if (msg.IsSuccess) {
                $("#mainChart").html("");
                $("#barChart").html("");
                for (var i in msg.Data) {
                    if (msg.Data.hasOwnProperty(i)) {
                        var data = msg.Data[i];
                        $("#mainChart").append("<div class='col-md-6'><div id='chart2_" + i + "'Style='width: 100%;height: " + data.heightCount + "px'></div></div>");
                        CreateBarChart(data);
                        setOption(data, i);
                        //var dom = document.getElementById("chart2_" + i + "");
                        //var myChart = echarts.init(dom);
                        //myChart.setOption(pieoption);
                    }
                }
            }

        }
    });
}

//饼图赋值
function setOption(data, i) {
    pieoption = {
        title: {
            text: data.name,
            x: '15%',
            y: '10%',
            textStyle: {
                fontSize: 30
            },
            //subtext: data.total,
            //subtextStyle: {
            //    fontSize: 26,
            //    color: '#999999',
            //    align: 'center',
            //    verticalAlign: 'middle',
            //    lineHeight: 100,
            //    height: 200
            //}
        },
        graphic: {
            type: 'text',
            left: '22%',
            top: 'center',
            style: {
                text: data.total,
                textAlign: 'center',
                fill: '#000',
                width: 30,
                height: 30
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}"
        },
        //grid:{
        //   left:'20px'
        //},
        legend: {
            orient: 'vertical',
            x: '60%',
            y:'22%',
            data: data.data1,
            formatter: function (name) {
                return echarts.format.truncateText(name,190, '14px Microsoft Yahei', '…');
            },
            tooltip: {
                show: true
            }
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                center: ['30%', '50%'],
                radius: ['35%', '52%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data.data2
            }
        ]
    };
    var dom = document.getElementById("chart2_" + i + "");
    var myChart = echarts.init(dom);
    myChart.setOption(pieoption);
}

//创建条形图
function CreateBarChart(data) {
    var html = "<div class='col-md-4'><div class='bar'><div class='bar-title'>" + data.name + "</div><div class='bar-body'>";
    var linehtml = "";
    for (var i in data.data3) {
        if (data.data3.hasOwnProperty(i)) {
            var w = data.data3[i].value;
            if (data.data3[i].value > 100)
            {
                w = 100;
            }
            linehtml = linehtml + "<div class='bar-line'><span class='line-key' title='" + data.data3[i].name + "'>" + UpdateCharacter(data.data3[i].name) + "</span>"
                                + "<span class='line-bar'><span class='line-bar-progress' style='width: " + w + "%;background: " + CreatColor(i) + ";'></span></span>"
                                + "<span class='line-num'>" + data.data3[i].value + "</span>"
                                + "</div>";
        }
    }
    $("#barChart").append(html + linehtml + "</div></div></div>");
};

//动态生成颜色
function CreatColor(i) {
    var color = "";
    switch (i) {
        case "0":
            color = "#00B050";
            break;
        case "1":
            color = "#4F81BD";
            break;
        case "2":
            color = "#7030A0";
            break;
        case "3":
            color = "#D99694";
            break;
        case "4":
            color = "#FFC000";
            break;
        case "5":
            color = "#FF44AA ";
            break;
        case "6":
            color = "#FF3333";
            break;
        case "7":
            color = "#FF7744 ";
            break;
        case "8":
            color = "#CCFF33";
            break;
        case "9":
            color = "#FFCC22";
            break;
        case "10":
            color = "#99FF33";
            break;
        case "11":
            color = "#33FF33";
            break;
        case "12":
            color = "#33FFAA";
            break;
        case "13":
            color = "#33CCFF";
            break;
        case "14":
            color = "#0066FF";
            break;
        case "15":
            color = "#5555FF";
            break;
        case "16":
            color = "#9955FF";
            break;
        case "17":
            color = "#9900FF";
            break;
        case "18":
            color = "#E93EFF";
            break;
        case "19":
            color = "#FF00FF";
            break;
        case "20":
            color = "#886600";
            break;
        case "21":
            color = "#888800";
            break;
        case "22":
            color = "#227700";
            break;
        case "23":
            color = "#008844";
            break;
        case "24":
            color = "#880000";
            break;
        default:
            color = "#EEEE00";
            break;
    }
    return color;
}

//处理字符串
function UpdateCharacter(str) {
    var newstr = "";
    if (str.length > 6) {
        newstr = str.substring(0, 6) + "...";
    } else {
        newstr = str;
    }
    return newstr;
}