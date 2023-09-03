// 年度重点单品销量贡献

//var myChart2_1 = echarts.init(document.getElementById('chart2_1'));
//var myChart2_2 = echarts.init(document.getElementById('chart2_2'));
//var myChart2_3 = echarts.init(document.getElementById('chart2_3'));
function drawChart2(res, cssId) {
   
    var myChart2 = echarts.init(document.getElementById(cssId));

    option = {
        title: {
            text: res.Total,
            x: 'center',
            y: '15%',
            textStyle: {
                fontSize: 30
            },
            subtext: res.subtext,
            subtextStyle: {
                fontSize: 18,
                color: '#999999'
            }
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: '40%',
            data: res.SkuName,
            textStyle: {
                fontSize: 12,
                color: '#2d3142'
            },
            itemWidth: 20,
            itemHeight: 20,
            itemGap: 20
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                center: ['50%', '20%'],
                radius: ['40%', '52%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: res.ValueDecList
            }
        ],
        //color: ['#FF6567', '#27B6F6', '#F5DF29']
    };

    myChart2.setOption(option);
    //myChart2_2.setOption(option);
    //myChart2_3.setOption(option);
}