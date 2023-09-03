// 

var myChart1 = echarts.init(document.getElementById('chart1'));

option = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
    	show: true,
        containLabel: true
    },
    legend: {
        data: ['增速1','增速2','增速3', '销量']
    },
    xAxis: [{
        type: 'category',
        axisTick: {
            alignWithLabel: true
        },
        axisLine:{
        	show: true,
        	lineStyle:{
        		color: '#009f92',
        		width: 5
        	}
        },
        axisLabel: {
        	color: '#333333'
        },
        data: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
    }],
    yAxis: [{
        type: 'value',
        name: '增速',
        min: 0,
        max: 50,
        position: 'right',
        axisLabel: {
        	color: '#333333'
        },
        axisLine:{
        	show: true,
        	lineStyle:{
        		color: '#009f92',
        		width: 5
        	}
        },
    }, {
        type: 'value',
        name: '销量',
        axisLabel: {
        	color: '#333333'
        },
        min: 0,
        max: 1000,
        position: 'left',
        axisLine:{
        	show: true,
        	lineStyle:{
        		color: '#009f92',
        		width: 5
        	}
        }
    }],
    series: [
        {
        name: '增速1',
        type: 'line',
        stack: '总量',
        label: {
            normal: {
                show: false,
                position: 'top',
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
                color: '#FF6567'
            }
        },
        data: [10, 13, 37, 35, 15, 13, 25, 21, 6, 45, 32, 2, 4, 13, 6, 4, 11]
    },
    {
        name: '增速2',
        type: 'line',
        stack: '总量',
        label: {
            normal: {
                show: false,
                position: 'top',
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
                color: '#27B6F6'
            }
        },
        data: [31, 13, 37, 35, 15, 13, 25, 21, 6, 45, 32, 2, 4, 13, 6, 4, 11]
    },
    {
        name: '增速3',
        type: 'line',
        stack: '总量',
        label: {
            normal: {
                show: false,
                position: 'top',
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
                color: '#9789EF'
            }
        },
        data: [51, 13, 37, 35, 15, 13, 25, 21, 6, 45, 32, 2, 4, 13, 6, 4, 11]
    },
    {
        name: '销量',
        type: 'bar',
        yAxisIndex: 1,
        stack: '总量',
        color: "#FFA84A",
        data: [209, 236, 325, 439, 507, 576, 722, 879, 938, 364, 806, 851, 931, 198, 349, 460, 735]
    }]
};

myChart1.setOption(option);