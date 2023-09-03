function loadTrendData() {

    var url = "/DataImport/StoreOutOfStatistics/getStoreOutofTrendSummery";


    $.get(url, {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {

        var dataX = [];
        var outofSkyArry = [];
        var outofstoreArry = [];
        var outofmoneyArry = [];
        var outofStorePerArry = [];
        var outofSkuPerArry = [];

        if (data != null && data != undefined && data) {
            data.forEach(function (item) {
                //date
                dataX.push(item.SDateString + "-" + item.EDateString);
                //out of sku
                outofSkyArry.push(item.StoreOutOfSkuCount || 0);
                //
                outofstoreArry.push(item.StoreTotalOutOfCount || 0);
                //
                outofmoneyArry.push(item.StoreOutOfMoney || 0);
                //
                var outofStore = item.StoreTotalOutOfCount || 0;
                var totalStore = item.StoreTotalCount || 0;
                var ouofStorePercentage = 0;
                if (totalStore > 0) {
                    ouofStorePercentage = (outofStore * 100 / totalStore).toFixed(1);
                }

                outofStorePerArry.push(ouofStorePercentage);

                //
                var outofsku = item.StoreOutOfSkuCount || 0;
                var keysku = item.StoreKeySkuCount || 0;

                var outofSkuPercentage = 0;
                if (keysku > 0) {

                    outofSkuPercentage = (outofsku * 100/ keysku).toFixed(1);
                }


                outofSkuPerArry.push(outofSkuPercentage);

            });

        }

        var trendEchart = echarts.init(document.getElementById('stockTrend'));


        var trendOptionBySkuNum = {
            legend: {
                itemHeight: 7,
                itemWidth: 7,
                selectedMode: 'single',
                x: 'center',
                y:'20',
                padding: 0,
                selected: {
                    '缺货sku数': false,
                    '缺货门店数': false,
                    '缺货金额': true,
                    '缺货门店占比': false,
                    '缺货sku占比': false
                },
                data: ['缺货sku数', '缺货门店数', '缺货金额', '缺货门店占比', '缺货sku占比']
            },
            xAxis: {
                type: 'category',
                data: dataX,
                //x轴文字旋转
                axisLabel: {
                    rotate: 0,
                    interval: 0,
                    textStyle: {
                        fontSize: '8',
                        itemSize: ''

                    }

                },

            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontSize: '8',
                        itemSize: ''

                    }
                },
                min: function (value) {
                    return value.min;
                },
                max: function (value) {
                    return value.max;
                }
            }

            ],
            series: [
                {
                    name: '缺货sku数',
                    data: outofSkyArry,
                    type: 'line',
                    showAllSymbol: true,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                             textStyle: {
                            fontSize: '8',
                            itemSize: ''

                        }
                        },
                        textStyle: {
                            fontSize: '8',
                            itemSize: ''

                        }
                    }

                },
                {
                    name: '缺货门店数',
                    data: outofstoreArry,
                    type: 'line',
                    showAllSymbol: true,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                            textStyle: {
                                fontSize: '8',
                                itemSize: ''

                            }
                        },
                        textStyle: {
                            fontSize: '8',
                            itemSize: ''

                        }
                    }

                }
                ,
                {
                    name: '缺货金额',
                    data: outofmoneyArry,
                    type: 'line',
                    showAllSymbol: true,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                            formatter: (params) => {
                                return parseFloat(Math.round(params.value)).toLocaleString();

                            },
                            textStyle: {
                                fontSize: '8',
                                itemSize: ''

                            }
                        },
                       
                    }

                }
                ,
                {
                    name: '缺货门店占比',
                    data: outofStorePerArry,
                    type: 'line',
                    showAllSymbol: true,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                            formatter: (params) => {
                                return params.value + "%";

                            },
                            textStyle: {
                                fontSize: '8',
                                itemSize: ''

                            }
                        }

                    }
                }
                ,
                {
                    name: '缺货sku占比',
                    data: outofSkuPerArry,
                    type: 'line',
                    showAllSymbol: true,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                            formatter: (params) => {
                                return params.value + "%";

                            },
                            textStyle: {
                                fontSize: '8',
                                itemSize: ''

                            }
                        }

                    }

                }
            ]
        };
        trendEchart.setOption(trendOptionBySkuNum);

        trendEchart.off("legendselectchanged").on('legendselectchanged', function (params) {
            var taht = this;

            var dic = {};
            var isSelect = false;

            if (params.name == '全部') {
                isSelect = true;
            }

            for (var key in params.selected) {
                dic[key] = isSelect;
            }

            trendOptionBySkuNum.legend.selected = dic;
            trendOptionBySkuNum.legend.selected[params.name] = true;

            trendEchart.setOption(option);
        })


    }, "json");









}