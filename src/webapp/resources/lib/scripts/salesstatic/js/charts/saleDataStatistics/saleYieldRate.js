// 年度重点单品销量达成率(%)

var myChart4 = echarts.init(document.getElementById('chart4'));

function drawChart4(res){
	option = {
		title : {
	        text: '年度重点单品销量达成率（%）',
	        x: 'center',
	        textStyle:{
	        	fontSize: 30      	
	        }
	    },
	    color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {          
	            type : 'shadow'    
	        }
	    },
	    grid: {
	        left: '20%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : res.xAxisdata, // X轴的值
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel: {
	                interval: 0,
	                rotate: 30
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'达成率',
	            type:'bar',
	            barWidth: '60%',
	            data:initBarData(res.RateData) // 柱子的值
	        }
	    ]
	};


	myChart4.setOption(option);
}

var colorList = ['#FE393B', '#00B050', '#D99694', '#4BACC6', '#7030A0', '#FFC000'
    , '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463'
    , '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD'
        ];

function initBarData(data){
	var series = [];
	for(var i in data){
		var color = ''
		//if(i < data.length){
		//	color = colorList[i];
  //      }
        color = colorList[i]
		var item = data[i];
		var obj = {
            itemStyle: {
            	color: color
            },
            value: item,
        }
		series.push(obj);
	}
	return series
}