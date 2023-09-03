function loadAnalyse() {

    var analyseEchart = echarts.init(document.getElementById('stockAnalyse'));

    $.get("/DataImport/StoreOutOfStatistics/getStoreOutofConsequentSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {

        var seriesData = [];

        if (data) {
            if (data.length > 0) {
                data.forEach(function (itm) {
                    seriesData.push({
                        value: itm.TotalMoney,
                        name: `${itm.WeekGroupName}:${itm.TotalSkuCount}:${itm.TotalStoreCount}:${parseFloat(Math.round(itm.TotalMoney)).toLocaleString()}`
                    });
                });


            }
        }

        var analyseOption = {
            tooltip: {
                trigger: 'item',
                //formatter: '{a} <br/>{b} : {c} ({d}%)'
                formatter: function (data) {
                    return data.seriesName + "<br/>" + data.name + ":" + parseFloat(Math.round(data.value)).toLocaleString() + "(" + data.percent.toFixed(1) + "%)";
                }
            },
            legend: {
                itemHeight: 7,
                itemWidth: 7,
                x:'center',
                orient: 'vertical',
                bottom: '0',
                formatter: function (series) {
                    //连续${itm.WeekGroupName}周  SKU ${itm.TotalSkuCount} 门店${itm.TotalStoreCount} 金额${itm.TotalMoney}
                    // '{b|' + parseFloat(itmArry[1]).toLocaleString() + '元' + '}'
                    var itmArry = series.split(':');

                    var arr = [
                        "连续" + itmArry[0] + "周    ",
                        "  SKU" + '{b|' + itmArry[1] + '}',
                        "  门店" + '{b|' + itmArry[2] + '}',
                        "  金额" + '{b|' + itmArry[3] + '}' + '元',
                    ]
                    if (itmArry[0].trim() == "8") {
                        arr[0] = "连续" + itmArry[0] + "周以上 ";
                    }


                    return arr.join('');
                },
                textStyle: {
                    rich: {
                        a: {
                            fontSize: 20,
                            verticalAlign: 'top',
                            align: 'center',
                            padding: [0, 0, 28, 0]
                        },
                        b: {
                            color: 'red'
                        }
                    }
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            //formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                            formatter: function (data) {
                                return data.percent.toFixed(1) + "%";
                            },
                            textStyle: {
                                align: 'center',
                                baseline: 'middle',
                                fontFamily: '微软雅黑',
                                fontSize: 15,
                                fontWeight: 'bolder',
                                color: '#FFF'
                            }
                        },
                    },
                    center: ['50%', '45%'],
                    data: seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        analyseEchart.setOption(analyseOption);

    }, "json");


}