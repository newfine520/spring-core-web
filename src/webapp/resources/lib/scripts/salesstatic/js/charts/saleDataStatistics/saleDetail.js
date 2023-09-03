// 门店重点单品销量明细（箱）

var myChart2 = echarts.init(document.getElementById('chart2'));

function drawChart2(res,title){
	var series = initSeries(res.value);
	
	option = {
		title : {
		    text: title,
	        x: 'center',
	        textStyle:{
	        	fontSize: 30      	
	        }
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	    	top:50,
	        data: res.SkuName
	    },
	    grid: {
	        left: '3%',
            right: '4%',
            top: '20%',
	        containLabel: true
	    },
	    yAxis:  {
	    	show:false,
	        type: 'value'
	    },
	    xAxis: {
	        type: 'category',
	        axisLine:{
	        	show: true,
	        	lineStyle:{
	        		color: '#009f92',
	        		width: 5
	        	}
	        },
	        data: res.xAxisData
	    },
	    series:series,
        color: ['#FE393B', '#00B050', '#D99694', '#4BACC6', '#7030A0', '#FFC000'
            , '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463'
            , '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD'
        ]
        //[
        //'#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
        //'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
        //'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
        //]
	};
	
	myChart2.setOption(option);
	
}

function initSeries(data){
	var series = [];
	//for(var i in data){
    for (var i = 0; i < data.length-1; i++){
		var item = data[i];
		var obj = {
            name: item.name,
            type: item.type,
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: item.data,
        }
		series.push(obj);
    }
    var obj = {
        name: data[data.length - 1].name,
        type: data[data.length - 1].type,
        stack: '折线',
        label: {
            normal: {
                show: false,
                position: 'insideRight'
            }
        },
        data: data[data.length - 1].data,
    }
    series.push(obj);
	return series
}
