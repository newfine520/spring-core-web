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
                data: ['ȱ��sku��', 'ȱ���ŵ���', 'ȱ�����', 'ȱ���ŵ�ռ��', 'ȱ��skuռ��']
            },
            xAxis: {
                type: 'category',
                data: dataX,
                //x��������ת
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
                    name: 'ȱ��sku��',
                    data: outofSkyArry,
                    type: 'line',
                    showAllSymbol: true ,
                    label: {
                        normal: {
                            show: true,// �Ƿ���ʾ�յ�
                            textStyle: { color: '#000' },//�յ�������ʽ
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
                    name: 'ȱ���ŵ���',
                    data: outofstoreArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }

                }
                ,
                {
                    name: 'ȱ�����',
                    data: outofmoneyArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }
                }
                ,
                {
                    name: 'ȱ���ŵ�ռ��',
                    data: outofStorePerArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }

                }
                ,
                {
                    name: 'ȱ��skuռ��',
                    data: outofSkuPerArry,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }
                }
            ]
        };
        trendEchart.setOption(trendOptionBySkuNum);

    }, "json");









}