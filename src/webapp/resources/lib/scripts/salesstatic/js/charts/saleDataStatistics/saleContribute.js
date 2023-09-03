// 年度重点单品销量贡献

var myChart3 = echarts.init(document.getElementById('chart3'));

function drawChart3(res,unicode){
	option = {
		title : {
	        text: '年度重点单品销量贡献',
	        x: 'center',
	        textStyle:{
	        	fontSize: 30      	
	        },
	        subtext: res.Total+unicode,
	        subtextStyle: {
	        	fontSize: 26, 
	        	color: '#999999'
	        }
	   },
	    legend: {
	        orient: 'horizontal',
	        x: 'center',
	        y: '50%',
	        data: res.SkuName,
	        textStyle:{
	        	fontSize: 12,
	        	color: '#2d3142'
	        },
	        itemWidth: 20,
	        itemHeight: 20,
	        itemGap: 30
	    },
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            center: ['50%', '30%'],
	            radius: ['30%', '42%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'outside'
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data: res.MainSkuList
	        }
	    ],
	    color: ['#FE393B', '#00B050', '#D99694', '#4BACC6', '#7030A0', '#FFC000'
            , '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463'
            , '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD'
        ]
	};
	
	myChart3.setOption(option);
}