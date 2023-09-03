$(function () {
    $(".select2").select2();  
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    $(".datepicker").datepicker({
        format: 'yyyy-mm',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        minViewMode: 1,
        language: 'zh-CN'
    });

    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }
    $("#BeginTime").val(defaultYearMonthDate);
    
    LoadDatatable();
    LoadECharts();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
        LoadECharts();
    })
})


function LoadECharts() {
        var myChart = echarts.init(document.getElementById('mainChart')); 
        var option = {
            title: {
                text: "月周缺货折线图",
                x:"center"
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
                right: '4%',
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
                data: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5']
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
                BeginTime: $("#BeginTime").val()
            },
            url: '/DataImport/ShortageRateReport/GetCharDate',
            success: function (data) {
                option.series = eval('(' + data.series + ')');
                option.legend.data = eval('(' + data.legend + ')');
                option.xAxis.data = eval('(' + data.xAxisdata + ')');
                option.title.text = $("#BeginTime").val().toString().substring(5) + "月周缺货折线图";
            }
        });

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

 }



function queryParams(params) {
    return {
        BeginTime: $("#BeginTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            BeginTime: $("#BeginTime").val()
        },
        url: '/DataImport/ShortageRateReport/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=缺货率报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

function format(value, row, index)
{
    if (value == "") {
        return 0;
    } else {
        return value;
    }
}



function LoadDatatable() {
    var columns = [        
        {
            field: '年月',
            title: '年月'
        }, {
            field: '周',
            title: '周'
        },
    ];

    var get = $.SubAjax({
        type: 'post',
        data: {isgift:false},
        url: '/Common/GetPCGiftSubBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    columns.push({
                        title: value.SubBrandName,
                        field: value.SubBrandName,
                        formatter: 'format'
                    });
                })
                $('#dataTable').bootstrapTable({
                    url: "/DataImport/ShortageRateReport/GetDataList",
                    pagination: "true",
                    queryParams: queryParams,
                    sidePagination: 'server',
                    onPostBody: function () {
                        RenderRoleButton();
                    },
                    columns: columns,
                });
            }
        }
    })

}

