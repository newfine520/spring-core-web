function loadAreaStockRate() {


    var areaStockRateEchart = echarts.init(document.getElementById('areaStockRate'));

    $.get("/DataImport/StoreOutOfStatistics/getStoreOutofConsequentWeekSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {
        if (data) {
            var xAxisArry = data.WeekList;
            var seriesData = [];
            var lendData = [];
            if (data.Data) {
                if (data.Data.length > 0) {
                    data.Data.forEach(function (itm, index) {

                        lendData.push(itm.AreaName);



                        var subItem =
                        {
                            name: itm.AreaName,
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: false,
                                position: 'insideTop'
                            },
                            data: [],
                            barWidth: 30,
                        }


                        var subItemData = [];
                        if (itm.AreaList && itm.AreaList.length > 0) {


                            data.WeekList.forEach(function (it) {

                                var itemF = itm.AreaList.find(function (x) {
                                    return x.GroupKey == it;
                                })
                                if (itemF) {
                                    subItemData.push(Math.round(itemF.Value))
                                } else {
                                    subItemData.push(0);
                                }


                            });


                        } else {

                            subItemData = [0, 0, 0, 0, 0, 0, 0, 0];
                        }

                        subItem.data = subItemData;
                        seriesData.push(subItem);

                    });


                    var totaldata = [];
                    let itemdataLen = xAxisArry.length;
                    for (var i = 0; i < itemdataLen; i++) {
                        totaldata[i] = 0;
                    };
                    seriesData.forEach((item, index) => {
                        item.data.forEach((im, ix) => {
                            totaldata[ix] = commonUtilsNS.accAdd(totaldata[ix], Number(im))
                        });
                    });


                    var totalS = {
                        name: '总量',
                        type: 'line',
                        stack: 'sum',
                        itemStyle: {
                            normal: {
                                label: {
                                    formatter: function (a) {

                                        return parseFloat(a.data).toLocaleString();
                                    }
                                }

                            }

                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                // textStyle:{ color:'#000' }
                            },
                          
                        },
                        data: totaldata
                    };
                    seriesData.push(totalS);



                }

            }


            var areaStockRateOption = {
                legend: {
                    itemHeight: 7,
                    itemWidth: 7,
                    data: xAxisArry
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: lendData,
                    x: "center",
                    itemHeight: 7,
                    itemWidth: 7,
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom: {
                    show: false,
                    start: 0,
                    end: 100
                },
                xAxis: {
                    type: 'category',
                    data: xAxisArry,
                    //x轴文字旋转
                    axisLabel: {
                        rotate: 0,
                        interval: 0
                    },
                },
                yAxis: [{
                    type: 'value',
                }, {
                    type: 'value',
                    scale: false,
                    name: '总量',
                    boundaryGap: [0.2, 0.2],
                    min: 0,
                    boundaryGap: true,
                    splitLine: {
                        show: false
                    }
                }
                ],
                series: seriesData
            };
            areaStockRateEchart.setOption(areaStockRateOption, true);
        }

    }, "json");

}