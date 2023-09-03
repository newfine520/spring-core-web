var dd = new Date();
dd.setTime(dd.getTime() - 24 * 60 * 60 * 1000);
var y = dd.getFullYear();
var m = dd.getMonth()+1;
var d = dd.getDate();
var newtitle = y + "-" + m + "-" + d;
//定义全局的折线option
var option = {
    title: {
        text: '',
        left: 'center'
    },
    legend: {
        data: [],
        top: 30,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'roundRect'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        formatter: function(params) {
            var res = '<div><p>' + params[0].name + '</p></div>';
            for (var i = 0; i < params.length; i++) {
                res += '<p>' + params[i].seriesName + ':' + params[i].data + '%</p>';
            }
            return res;
        }
    },
    toolbox: {
        x: "right",
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '20',
        right: '20',
        top: '110',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        splitLine: {
            show: false
        },
        axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [10, 15],
            lineStyle: {
                color: '#02A093',
                width: 2
            }
        },
        axisTick: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: true
        },
        axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [10, 15],
            lineStyle: {
                color: '#02A093',
                width: 2
            }
        },
        axisLabel: {
            formatter: function (value) {
                return value + "%";
            }
        },
        axisTick: {
            show: false
        }
    },
    series: []
};

//定义全局的柱状option
var baroption = {
    color: ['#0000FF'],
    title: {
        text: '',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        formatter: '{b}: {c}%'
    },
    grid: {
        left: '20',
        right: '20',
        top: '110',
        containLabel: true
    },
    toolbox: {
        x: "right",
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        splitLine: {
            show: false
        }
    },
    yAxis: {
        axisLabel: {
            formatter: function (value) {
                return value + "%";
            }
        },
        type: 'value'
    },
    series: []
};
$(function () {
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });
    $(".datepicker").val(getNowFormatDate());
    //加载图数据
    LoadCharts();
    //加载表格数据
    LoadTable();
    //加载饼图
    LoadDayChart();
    //导出
    $("#btnExport").on("click", function () {
        ExportAvgStoreRow();
    });
    //查询
    $("#btnSearch").on("click", function () {
        //加载表格数据
        $('#dataTable').bootstrapTable("destroy");
        if ($("#Begin").val() !== "") {
            newtitle = $("#Begin").val();
        }
        LoadTable();
        //加载当日排面份额
        LoadDayChart();
    });
});

//折线图加载
function LoadCharts() {
    //获取数据
    $.ajax({
        type: "GET",
        data: { datevalue: $("#Begin").val() },
        url: "/DataImport/AvgStoreRow/GetStoreRowWeekChart",
        success: function (msg) {
            if (msg.IsSuccess) {
                setOption(msg.Data, 1);
                var dom = document.getElementById("LineChart");
                var myChart = echarts.init(dom);
                myChart.setOption(option);
            }
        }
    });
}

//折线赋值
function setOption(data, type) {
    if (type === 1) {
        option.title.text = "排面份额";
        option.xAxis.data = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
        option.legend.data = data.SkuDatalegend;
        option.series = data.WeekRateLists;
    } else {
        baroption.title.text = "当日排面份额(" + newtitle + ")";
        baroption.xAxis.data = data.SubBrandDatalegend;
        baroption.series = data.ShortageDayRates;
    }
}

function LoadDayChart() {
    //获取数据
    $.ajax({
        type: "GET",
        data: { datevalue: $("#Begin").val() },
        url: "/DataImport/AvgStoreRow/GetStoreRowDayChart",
        success: function (msg) {
            if (msg.IsSuccess) {
                setOption(msg.Data, 0);
                var dom = document.getElementById("BarChart");
                var myChart = echarts.init(dom);
                myChart.setOption(baroption);
            }
        }
    });
}

//表格加载
function LoadTable() {
    var columns = [
       {
           field: 'SubBrandName',
           title: '牌面份额'

       }, {
           field: 'Week1',
           title: 'W1'
       }, {
           field: 'Week2',
           title: 'W2'
       }, {
           field: 'Week3',
           title: 'W3'
       }, {
           field: 'Week4',
           title: 'W4'
       }, {
           field: 'Week5',
           title: 'W5'
       }, {
           field: 'Week6',
           title: 'W6'
       }, {
           field: 'Week7',
           title: 'W7'
       }, {
           field: 'Week8',
           title: 'W8'
       }, {
           field: 'Week9',
           title: 'W9'
       }, {
           field: 'Week10',
           title: 'W10'
       }
    ];
    columns.push({
        field: 'Today',
        title: newtitle
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/AvgStoreRow/GetStoreRowWeekTable",
        queryParams: { datevalue: $("#Begin").val() },
        pagination: false, //分页
        sidePagination: "server",
        columns: columns
    });
}


//导出数据
function ExportAvgStoreRow() {
    $.SubAjax({
        data: { datevalue: $("#Begin").val() },
        url: '/DataImport/AvgStoreRow/ExportAvgStoreRowwData',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=排面份额";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    });
}


//分页参数
function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        SkipCount: params.offset
    };
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}