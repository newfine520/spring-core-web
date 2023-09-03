import { param } from "jquery";

function loadTrendData() {

    var url = "/DataImport/StoreOutOfStatistics/getStoreOutofTrendSummery";


    $.get(url, {
        StartDate: "2020-12-23",
        EndDate: "2020-12-27"
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
                outofSkyArry.push(item.StoreOutOfSkuCount | 0);
                //
                outofstoreArry.push(item.StoreTotalOutOfCount | 0);
                //
                outofmoneyArry.push(item.StoreOutOfMoney | 0);
                //
                var outofStore = item.StoreTotalOutOfCount | 0;
                var totalStore = item.StoreTotalCount | 0;
                var ouofStorePercentage = 0;
                if (totalStore > 0) {
                    ouofStorePercentage = (outofStore * 100 / totalStore).toFixed(1);
                }

                outofStorePerArry.push(ouofStorePercentage);

                //
                var outofsku = item.StoreOutOfSkuCount | 0;
                var keysku = item.StoreKeySkuCount | 0;

                var outofSkuPercentage = 0;
                if (keysku > 0) {

                    outofSkuPercentage = (outofsku / keysku).toFixed(1);
                }


                outofSkuPerArry.push(outofSkuPercentage);

            });

        }

        var trendEchart = echarts.init(document.getElementById('stockTrend'));


        var trendOptionBySkuNum = {
            legend: {
                data: ['缺货sku数', '缺货门店数', '缺货金额', '缺货门店占比', '缺货sku占比']
            },
            xAxis: {
                type: 'category',
                data: dataX,
                //x轴文字旋转
                axisLabel: {
                    rotate: 30,
                    interval: 0
                },
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: function (value) {
                    return value.min;
                },
                max: function (value) {
                    return value.max;
                }
            }

            ],
            showAllSymbol: true ,
            itemStyle: { normal: { label: { show: true } } },
            series: [
                {
                    name: '缺货sku数',
                    data: outofSkyArry,
                    type: 'line',
                    showAllSymbol: true ,
                    label: {
                        normal: {
                            show: true,// 是否显示拐点
                            textStyle: { color: '#000' },//拐点文字样式
                            formatter: (params) => {
                                return params.value;

                            }
                        }
                    },
                    formatter: (params) => {
                        return params.value;

                    }
                },
                {
                    name: '缺货门店数',
                    data: outofstoreArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }

                }
                ,
                {
                    name: '缺货金额',
                    data: outofmoneyArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }
                }
                ,
                {
                    name: '缺货门店占比',
                    data: outofStorePerArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }

                }
                ,
                {
                    name: '缺货sku占比',
                    data: outofSkuPerArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }
                }
            ]
        };
        trendEchart.setOption(trendOptionBySkuNum);

    }, "json");









}