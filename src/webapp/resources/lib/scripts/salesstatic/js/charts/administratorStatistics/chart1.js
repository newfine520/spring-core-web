// 门店单产统计
var myChart1 = echarts.init(document.getElementById('chart1'));

var option = {
    color: ['#FFA84A', '#27B6F6', '#FF6567', '#2CC58F', '#00FFFF', '#FF00FF', '#C0C0C0'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: []
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#009f92',
                    width: 5
                }
            },
            axisLabel: {
                color: '#333333'
            },
            axisTick: { show: false },
            data:[]
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#009f92',
                    width: 5
                }
            },
            axisLabel: {
                color: '#333333'
            }
        }, {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#009f92',
                    width: 5
                }
            },
            axisLabel: {
                color: '#333333'
            }
        }
    ],
    series: []
};

function Chart1(data) {
    var newseries = Createseries(data.listallcountry, data.listAreaStatisctical);
    option.legend.data = data.listArea;
    option.series = newseries;
    option.xAxis[0].data = data.listdt;
    myChart1.setOption(option, true);
};

//处理数据
function Createseries(listallcountry, listAreaStatisctical) {
    var series = [];
    for (var i in listallcountry) {
        if (listallcountry.hasOwnProperty(i)) {
            var datavalue = 
                {
                    name: listallcountry[i].name,
                    type: 'line',
                    label: {
                        normal: {
                            show: false,
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        color: '#9789EF',
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                    lineStyle: {
                        normal: {
                            width: 4,
                            color: '#2d3142'
                        }
                    },
                    data: listallcountry[i].data
                };
            series.push(datavalue);
        }
    }
    for (var m in listAreaStatisctical) {
        if (listAreaStatisctical.hasOwnProperty(m)) {
            series.push(listAreaStatisctical[m]);
        }
    }
    return series;
};