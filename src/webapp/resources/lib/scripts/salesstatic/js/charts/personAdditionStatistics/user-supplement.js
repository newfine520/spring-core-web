//$(function () {
var now = new Date();
Year = now.getFullYear();
Month = now.getMonth() + 1;
if (Month <= 9) {
    Month = '0' + Month
}
YearMonthSta = Year + '-01-01';
YearMonthEnd = Year + '-' + Month + '-01'
var searchCondition = {
    YearMonthSta: YearMonthSta,
    YearMonthEnd: YearMonthEnd,
    Area: '-1',
    SubArea: '-1',
    Province: '-1',
    City: '-1',
    Distributor: '-1',
    StoreNo: null

};

$(function () {

    

    // 获取查询条件列表
    getCheckBoxList();

    // 初始化日历
    initTime();

    // 渲染初始报表数据
    renderAllData();

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
            renderAllData();
        }
    })

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
        nowMonth = '0' + nowMonth
    }

    YearMonthSta = nowYear + '-01-01';
    YearMonthEnd = nowYear + '-' + nowMonth + '-01'

    laydate.render({
        elem: '#startTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-01',
        done: function (value, date, endDate) {
            YearMonthSta = value + '-01';;
        }
    });
    laydate.render({
        elem: '#endTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-' + nowMonth,
        done: function (value, date, endDate) {
            YearMonthEnd = value + '-01';;
        }
    });
}

// 获取全部查询条件列表
function getCheckBoxList() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/SalesDataStatistics/GetCheckBoxList',
        success: function (res) {
            if (res.IsSuccess) {
                var data = res.Data;
                for (var j in data) {
                    for (var i in data[j]) {
                        if (j == 'subArea') {
                            $('#' + j).html('请选择大区');
                        } else if (j == 'city') {
                            $('#' + j).html('请选择省份');
                        } else {
                            $('#' + j).append('<label class="checkbox-inline i-checks"><input type="checkbox" value="' + data[j][i].value + '">' + data[j][i].text + '</label>')
                        }

                    }
                }

                $('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                });

                checkFirst($('#area .i-checks'));
                checkFirst($('#province .i-checks'));
                checkFirst($('#distributor .i-checks'));

                // checkbox无限与其他互斥
                $('.line-content').each(function (i, ele) {
                    checkboxXOR($(ele));
                })

                // 根据大区筛选小区
                getSubAreaByArea('area', 'subArea', '/DataImport/SalesDataStatistics/GetSubAreaList');
                // 根据省份筛选城市
                getSubAreaByArea('province', 'city', '/DataImport/SalesDataStatistics/GetCityList');
            }

        }
    })
}

// checkbox默认选中第一个
function checkFirst(ele) {
    ele.first().iCheck('check');
}

// checkbox无限与其他互斥
function checkboxXOR(ele) { // 传入DOM对象
    ele.find('.i-checks').on('ifChecked', function (event) {
        var val = $(this).find('input').val();
        if (val != -1) {
            ele.find('.i-checks').first().iCheck('uncheck');
        } else {
            // ele.find('.i-checks').iCheck('uncheck');
        }
    })
}

// 关联两个查询条件
function getSubAreaByArea(mainId, subId, URL) {
    var areacode = '';
    $('#' + mainId + ' .i-checks').on('ifChecked', function (event) {
        var val = $(this).find('input').val();
        if (val != -1) {
            areacode = '';
            $('#' + mainId + ' .i-checks input').each(function () {
                if (true == $(this).is(':checked')) {
                    areacode = areacode + $(this).val() + ','
                }
            });
            ajax();
        }
    });

    $('#' + mainId + ' .i-checks').on('ifUnchecked', function (event) { //TODO
        var checkNum = 0;
        areacode = '';
        $('#' + mainId + ' .i-checks input').each(function () {
            if (true == $(this).is(':checked')) {
                checkNum++;
                areacode = areacode + $(this).val() + ','
            }
        });
        if (checkNum == 0) {
            areacode = '-1'
        }
        ajax();
    });

    function ajax() {
        $.SubAjax({
            type: 'GET',
            url: URL,
            data: {
                code: areacode
            },
            success: function (res) {
                if (res.IsSuccess) {
                    var data = res.Data;
                    $('#' + subId).html('');
                    for (var i in data) {
                        $('#' + subId).append('<label class="checkbox-inline i-checks"><input type="checkbox" value="' + data[i].value + '">' + data[i].text + '</label>')
                    }

                    $('#' + subId + ' .i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    });

                    checkFirst($('#' + subId + ' .i-checks'));
                    checkboxXOR($('#' + subId));
                }

            }
        });
    }
}

// 组装查询条件
function getSearchCondition() {
    var searchCondition = {
        YearMonthSta: YearMonthSta,
        YearMonthEnd: YearMonthEnd,
        Area: eachConditionLine('area'),
        SubArea: eachConditionLine('subArea'),
        Province: eachConditionLine('province'),
        City: eachConditionLine('city'),
        Distributor: eachConditionLine('distributor'),
        StoreNo: $("#storeSearch").val()
    };

    return searchCondition;

    function eachConditionLine(mainId) {
        var str = '';
        if ($('#' + mainId + ' .i-checks input').length > 0) {
            $('#' + mainId + ' .i-checks input').each(function () {
                if (true == $(this).is(':checked')) {
                    str = str + $(this).val() + ','
                }
            });
        } else {
            str = '-1,'
        }
        return str.substring(0, str.length - 1);
    }
}

function renderAllData() { // 查询全部报表数据

    renderChart1();
    getStoreTotal();
    getTbale();
    renderChart2();
    renderChart3();
    renderChart4();

}

// 折线图
function renderChart1() {
    var myChart = echarts.init(document.getElementById('chart1'));
    var option = {
        //title: {
        //    text: "近10周前10名城市拜访率折线图",
        //    x: "center"
        //},
        tooltip: {
            trigger: 'axis',
            //formatter: function (params) {
            //    var relVal = params[0].name;
            //    for (var i = 0, l = params.length; i < l; i++) {
            //        relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "%";
            //    }
            //    return relVal;
            //}
        },
        toolbox: {
            feature: {
                saveAsImage: { show: true }
            }
        },
        legend: {
            //y: "bottom",
            data: []
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '5%',
            show: true,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#009f92',
                    width: 5
                }
            },
            axisLabel: {
                color: '#333333',
                interval: 0,
                rotate: 40
            },
            //boundaryGap: false,
            data: []
        },
        yAxis: [{
             type: 'value',
             name: '人',
             axisLabel: {
                 color: '#333333'
             },
             //min: 0,
             //max: 1000,
             position: 'left',
             axisLine: {
                 show: true,
                 lineStyle: {
                     color: '#009f92',
                     width: 5
                 }
             }
         },
        {
            type: 'value',
            name: '离职率',
            //min: 0,
            //max: 100,
            position: 'right',
            axisLabel: {
                formatter: function (value) {
                    return value + "%";
                },
                color: '#333333'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#009f92',
                    width: 5
                }
            },
        }],
        series: []
    };


    $.SubAjax({
        type: 'post',
        dataType: 'json',
        data: searchCondition,
        url: '/DataImport/UserSupplement/GetChartUserSupplement',
        success: function (data) {
            option.series = eval('(' + data.series + ')');
            option.legend.data = eval('(' + data.legend + ')');
            option.xAxis.data = eval('(' + data.xAxisdata + ')');
            //option.title.text = "近10周前10名城市拜访率折线图";
        }
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// 九宫格
function getStoreTotal() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/UserSupplement/GetUserSupplementTotal',
        data: searchCondition,
        success: function (res) {
            var numL = $('#personTotal .num');
            if (res.IsSuccess) {
                var dataL = res.Data;
                for (var i = 0; i < numL.length; i++) {
                    $(numL[i]).html(dataL[i]);
                }
            }
        }
    })
}

// tabel
function getTbale() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/UserSupplement/GetUserSupplementReport',
        data: searchCondition,
        success: function (res) {
            if (res.IsSuccess) {
                $('#table').html('')
                for (var i in res.Data) {
                    var tr = $('<tr></tr>');
                    tr.append('<td>' + res.Data[i].title + '</td>');
                    for (var j in res.Data[i].value) {
                        tr.append('<td>' + res.Data[i].value[j] + '</td>');
                    }
                    $('#table').append(tr)
                }
            }
        }
    })
}

//环形图 chart2_1
function renderChart2() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/UserSupplement/PercentagePosition',
        data: searchCondition,
        success: function (res) {
            if (res.IsSuccess) {
                drawChart2(res.Data[0], 'chart2_1');
            }
        }
    })
}
//环形图 chart2_2
function renderChart3() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/UserSupplement/PercentagePosition',
        data: searchCondition,
        success: function (res) {
            if (res.IsSuccess) {
                drawChart2(res.Data[1], 'chart2_2');
            }
        }
    })
}

//环形图 chart2_3
function renderChart4() {
    $.ajax({
        type: 'GET',
        url: '/DataImport/UserSupplement/PercentagePosition',
        data: searchCondition,
        success: function (res) {
            if (res.IsSuccess) {
                drawChart2(res.Data[2], 'chart2_3');

            }
        }
    })
}