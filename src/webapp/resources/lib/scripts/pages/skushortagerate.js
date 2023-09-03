//定义全局的option
var option = {
    title: {
        text: '品类1',
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
        formatter: function (params) {
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
        data: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
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

$(function () {
    //运输方式
    LoadChartsTran();
    //重点单品
    LoadChartsMainSku();
    //导出
    $("#btnExportTrans").on("click", function () {
        ExportShortSku(1,"运输方式缺货率报表");
    });
    $("#btnExportMainSku").on("click", function () {
        ExportShortSku(2, "重点单品缺货率报表");
    });
});

//运输方式
function LoadChartsTran() {
    //加载图
    LoadCharts(1, "transstyle");
    //加载table
    LoadTable(1, "dataTableTrans");
}

//重点单品
function LoadChartsMainSku() {
    //加载图
    LoadCharts(2, "mainsku");
    //加载table
    LoadTable(2, "dataTableMainsku");
}

//折线图加载
function LoadCharts(data,domid) {
    //获取数据
    $.ajax({
        type: "GET",
        data: {datatype:data},
        url: "/DataImport/SkuShortageRate/GetChartList",
        success: function (msg) {
            console.log(msg.Data);
            if (msg.IsSuccess) {
                var classfirst = $('#'+domid);
                classfirst.innerHTML = "";
                var a = 1;
                for (var i in msg.Data) {
                    if (msg.Data.hasOwnProperty(i)) {
                        classfirst.append("<div class='form-group col-md-6'><div id='"+domid+i+"' style='width: 500px; height: 400px;'></div></div>");
                        var data = msg.Data[i];
                        setOption(data);
                        var dom = document.getElementById(domid + i);
                        var myChart = echarts.init(dom);
                        myChart.setOption(option);
                    }
                }
            }
        }
    });
}

//折线赋值
function setOption(data) {
    option.title.text = data.SubBrandName;
    option.legend.data = data.SkuDatalegend;
    option.series = data.WeekRateLists;
}

//表格加载
function LoadTable(data, domid) {
    var columns = [
       {
           field: 'SkuName',
           title: '名称'
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
    $('#' + domid).bootstrapTable({
        url: "/DataImport/SkuShortageRate/GetDataList",
        queryParams: {datatype:data},
        pagination: false, //分页
        sidePagination: "server",
        columns: columns
    });
}

//导出数据
function ExportShortSku(data, title) {
    $.SubAjax({
        type: 'post',
        data: { datatype: data },
        url: '/DataImport/SkuShortageRate/ExportAvgPriceData',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=" + title;
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    });
}