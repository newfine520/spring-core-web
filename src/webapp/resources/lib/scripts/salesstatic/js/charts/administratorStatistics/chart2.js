var myChart2_1 = echarts.init(document.getElementById('chart2_1'));
var myChart2_2 = echarts.init(document.getElementById('chart2_2'));
var myChart2_3 = echarts.init(document.getElementById('chart2_3'));
var myChart2_4 = echarts.init(document.getElementById('chart2_4'));

option = {
    title: {
        text: '华东',
        x: '30%',
        y: '10%',
        textStyle: {
            fontSize: 13
        }
    },
    grid: {
        left: '20%'

    },
    legend: {
        orient: 'vertical',
        x: '60%',
        y: 'middle',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '搜索引擎1', '搜索引擎2', '搜索引擎3', '搜索引擎4', '搜索引擎5', '搜索引擎6', '搜索引擎7', '搜索引擎8'],
        textStyle: {
            fontSize: 13,
            color: '#2d3142'
        },
        itemWidth: 15,
        itemHeight: 15,
        itemGap: 20
    },
    series: [
    {
        name: '访问来源',
        type: 'pie',
        center: ['30%', '50%'],
        radius: ['40%', '52%'],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        silent: true,
        label: {
            normal: {
                show: true,
                position: 'center',
                formatter: '10000000\n' + '元'
            },
            itemstyle: {
                color: 'black'
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' },
            { value: 1548, name: '搜索引擎1' },
            { value: 1548, name: '搜索引擎2' },
            { value: 1548, name: '搜索引擎3' },
            { value: 1548, name: '搜索引擎4' },
            { value: 1548, name: '搜索引擎5' },
            { value: 1548, name: '搜索引擎6' },
            { value: 1548, name: '搜索引擎7' },
            { value: 1548, name: '搜索引擎8' }
        ]
    }
    ]
};

myChart2_1.setOption(option);
myChart2_2.setOption(option);
myChart2_3.setOption(option);
myChart2_4.setOption(option);