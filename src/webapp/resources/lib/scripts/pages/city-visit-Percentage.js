$(function () {
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/TaskPlanRepot/GetCityVisitPercentageReport",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: '城市',
                title: '城市'
            },
            {
                field: 'Week1',
                title: 'Week1'
            },
            {
                field: 'Week2',
                title: 'Week2'
            },
            {
                field: 'Week3',
                title: 'Week3'
            },
            {
                field: 'Week4',
                title: 'Week4'
            },
            {
                field: 'Week5',
                title: 'Week5'
            },
            {
                field: 'Week6',
                title: 'Week6'
            },
            {
                field: 'Week7',
                title: 'Week7'
            },
            {
                field: 'Week8',
                title: 'Week8'
            },
            {
                field: 'Week9',
                title: 'Week9'
            },
            {
                field: 'Week10',
                title: 'Week10'
            },
            {
                field: 'Week1~Week10',
                title: 'Week1~Week10'
            }

        ]
    });
    LoadECharts();

})


$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
    LoadECharts();
})

function queryParams(params) {
    return {
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val()
        },
        url: "/DataImport/TaskPlanRepot/ExportCityVisitPercentage",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=城市拜访率统计报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})


function LoadECharts() {
    var myChart = echarts.init(document.getElementById('mainChart'));
    var option = {
        title: {
            text: "近10周前10名城市拜访率折线图",
            x: "center"
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var relVal = params[0].name;
                for (var i = 0, l = params.length; i < l; i++) {
                    relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
                }
                return relVal;
            }
        },
        legend: {
            y: "bottom",
            data: []
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '8 %',
            containLabel: true
        },
        toolbox: {
            y: "bottom",
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            //data: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6', 'Week7', 'Week8', 'Week9', 'Week10', 'Week1~Week10'],
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value) {
                    return value + "%";
                }
            }
        },
        series: []
    };


    $.SubAjax({
        type: 'post',
        dataType: 'json',
        data: {
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val()
        },
        url: '/DataImport/TaskPlanRepot/GetCharDate',
        success: function (data) {
            option.series = eval('(' + data.series + ')');
            option.legend.data = eval('(' + data.legend + ')');
            option.xAxis.data = eval('(' + data.xAxisdata + ')');
            option.title.text = "近10周前10名城市拜访率折线图";
        }
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}



