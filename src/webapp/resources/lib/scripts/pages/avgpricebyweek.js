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
        axisTick: {
            show: false
        }
    },
    series: []
};

$(function () {
    //加载图数据
    LoadCharts();
    //加载表格数据
    LoadTable();
    //导出
    $("#btnExport").on("click", function () {
        ExportAvgPrice();
    });
});

//折线图加载
function LoadCharts() {
    //获取数据
    $.ajax({
        type: "GET",
        url: "/DataImport/AvgMainPrice/GetChartList",
        success: function (msg) {
            console.log(msg.Data);
            if (msg.IsSuccess) {
                var classfirst = $(".form-height").children(".row");
                classfirst.innerHTML = "";
                var a = 1;
                for (var i in msg.Data) {
                    if (msg.Data.hasOwnProperty(i)) {
                        classfirst.append("<div class='form-group col-md-6'><div id='mainChart" + i + "' style='width: 500px; height: 400px;'></div></div>");
                        var data = msg.Data[i];
                        setOption(data);
                        var dom = document.getElementById("mainChart" + i + "");
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
function LoadTable() {
    var columns = [
       {
           field: 'SkuName',
           title: 'Sku名称'
       }, {
           field: 'W1',
           title: 'W1'
       }, {
           field: 'W2',
           title: 'W2'
       }, {
           field: 'W3',
           title: 'W3'
       }, {
           field: 'W4',
           title: 'W4'
       }, {
           field: 'W5',
           title: 'W5'
       }, {
           field: 'W6',
           title: 'W6'
       }, {
           field: 'W7',
           title: 'W7'
       }, {
           field: 'W8',
           title: 'W8'
       }, {
           field: 'W9',
           title: 'W9'
       }, {
           field: 'W10',
           title: 'W10'
       }
    ];
    $('#dataTable').bootstrapTable({
        url: "/DataImport/AvgMainPrice/GetDataList",
        pagination: false, //分页
        sidePagination: "server",
        columns: columns
    });
}

//导出数据
function ExportAvgPrice() {
    $.SubAjax({
        type: 'post',
        data: {},
        url: '/DataImport/AvgMainPrice/ExportAvgPriceData',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=近十周重点单品平均价格";
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