function loadSuveryData() {

    loadSuveryStore("/DataImport/StoreOutOfStatistics/GetStoreOutOfSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    })

    //loadSuverySku()
} 

Number.prototype.toFixedBug = function (s) {
    var changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
    index = changenum.indexOf(".");
    if (index < 0 && s > 0) {
        changenum = changenum + ".";
        for (i = 0; i < s; i++) {
            changenum = changenum + "0";
        }
    } else {
        index = changenum.length - index;
        for (i = 0; i < (s - index) + 1; i++) {
            changenum = changenum + "0";
        }
    }
    return changenum;
}  
// 概况 - 门店
function loadSuveryStore(loaduUrl, data) {

    var storeEcharts = echarts.init(document.getElementById('surveryStore'));
    var skuEchart = echarts.init(document.getElementById('surverySKU'));
    $.get(loaduUrl, data, function (data) {

        var ofsku = data.StoreOutOfSkuCount || 0;
        var ofstore = data.StoreTotalOutOfCount || 0;
        var keySku = data.StoreKeySkuCount || 0;
        var skuofmoney = data.StoreOutOfMoney || 0;
        var totalStore = data.StoreTotalCount || 0;
        $("#p_ofsku").html(ofsku);
        $("#p_ofstore").html(ofstore);
        $("#p_skuofmoney").html(parseFloat(Math.round(skuofmoney)).toLocaleString());

        var storeSuveryData = [{
            value: ofstore, name: '缺货门店数:' + ofstore, label: {
                normal: {
                    show: true,
                    formatter: function (itm) {
                        var changenum = (parseInt(itm.percent * Math.pow(10, 1) + 0.5) / Math.pow(10, 1)).toString();
                        index = changenum.indexOf(".");
                        if (index < 0 && 1 > 0) {
                            changenum = changenum + ".";
                            for (i = 0; i < 1; i++) {
                                changenum = changenum + "0";
                            }
                        } else {
                            index = changenum.length - index;
                            for (i = 0; i < (1 - index) + 1; i++) {
                                changenum = changenum + "0";
                            }
                        }
                        return ['{b|' + changenum + "%" + '}', '缺货门店占比'].join('\n');
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
                                align: 'center',
                                color: 'red',
                                fontSize: 20
                            }
                        }
                    },
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
                            padding: [10, 10, 28, 0],
                            align: 'center',
                            color: 'red',
                            fontSize: 25
                        }
                    }
                },
            }
        }, { value: totalStore - ofstore, name: '所辖门店数:' + totalStore }];
        var storeOptions = {
            tooltip: {
                show: false,
                showContent: false
            },

            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比

                    textStyle: {
                        align: 'center',
                        baseline: 'middle',
                        fontFamily: '微软雅黑',
                        fontSize: 15,
                        fontWeight: 'bolder'
                    }
                },
            },
            legend: {
                orient: 'horizontal',
                bottom: 10,
                data: ['缺货门店数:' + ofstore, '所辖门店数:' + totalStore],
                itemHeight: 7,
                itemWidth:7,
                formatter: function (series) {
                    var itmArry = series.split(':');

                    var arr = [
                        itmArry[0] + " ",
                        '{b|' + itmArry[1] + '}'
                    ]
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
                },

            },

            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    // 设置值域的标签
                    label: {
                        show: false,
                        position: 'center'
                    },

                    emphasis: {
                        label: {
                            show: false,
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: storeSuveryData
                }
            ]
        };
        storeEcharts.setOption(storeOptions);
        //
        loadSuverySku(ofsku, keySku, skuEchart);


    }, "json");

}


//其中getDpr()为一个方法，根据屏幕大小去加载不同字体大小
//图表根据屏幕大小去判断字体大小
var getDpr = function getDpr() {
    var windowWidth = $(window).width();
    if (windowWidth < 1920) {
        return 12
    }
    if (windowWidth >= 1920 && windowWidth <= 3840) {
        return 18
    }
    if (windowWidth > 3840 && windowWidth <= 5760) {
        return 30
    }
}
// 概况 - sku
function loadSuverySku(outofSku, keySku, skuEchart) {
    //var skuEchart = echarts.init(document.getElementById('surverySKU'));
    var skuOptions = {
        tooltip: {
            show: false
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            itemHeight: 7,
            itemWidth: 7,
            data: ['缺货sku数:' + outofSku
                , 'KEY SKU数:' + keySku],
            formatter: function (series) {
                var itmArry = series.split(':');

                var arr = [
                    itmArry[0] + " ",
                    '{b|' + itmArry[1] + '}'
                ]
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
            },

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
                    fontSize: 14,
                    align: 'center',
                    padding: [0, 10, 0, 0],
                    lineHeight: 25
                }
            }
        },
        series: [
            {
                tooltip: {
                    show: false
                },
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {
                        value: outofSku, name: '缺货sku数:' + outofSku,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (itm) {
                                    return ['{b|' + itm.percent.toFixed(1) + "%" + '}', '缺货sku占比'].join('\n');
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
                                            align: 'center',
                                            color: 'red',
                                            fontSize: 20
                                        }
                                    }
                                },
                            }
                        }
                    },
                    { value: keySku - outofSku, name: 'KEY SKU数:' + keySku }
                ]
            }
        ]
    };
    skuEchart.setOption(skuOptions);
}