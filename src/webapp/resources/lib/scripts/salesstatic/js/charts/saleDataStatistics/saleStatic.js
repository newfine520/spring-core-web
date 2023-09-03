// 门店单店销量统计

var myChart1 = echarts.init(document.getElementById('chart1'));


function drawChart1(res, lineIndex){
    var series = initChart1Series(res.series, 0, lineIndex);
    var name = res.lengend[lineIndex];
	option = {
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data: ['门店数量', name]
	    },
	    grid: {
	    	top: '200px',
	    	bottom: '35px',
	    	width: 'auto',
            left: '45px',
            right: '20%'
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
	            interval: 0,
	            rotate: 30,
	        	color: '#333333'
	        },
	        data: res.xAxisData // x轴数据
	    }],
	    yAxis: [{
	        type: 'value',
	        name: name,
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
	        name: res.lengend[0],
	        axisLabel: {
	        	color: '#333333'
	        },
	        position: 'left',
	        axisLine:{
	        	show: true,
	        	lineStyle:{
	        		color: '#009f92',
	        		width: 5
	        	}
	        }
	    }],
	    series: series
	    
	};
	
	myChart1.setOption(option);
}

function initChart1Check(data){
	for(var i in data){		
		$('#chart1Check').append('<label class="checkbox-inline i-checks"><input type="radio" name="optionsRadios" value="'+ i +'">'+ data[i] +'</label>');
	}
	
	$('#chart1Check .i-checks').iCheck({
	    checkboxClass: 'icheckbox_square-green',
	    radioClass: 'iradio_square-green',
	});
	
	$($('#chart1Check .i-checks').get(1)).iCheck('check');
	$('#chart1Check .i-checks').first().hide();
	
	$('#chart1Check .i-checks').on('ifChecked', function(event){
	    var val = $(this).find('input').val();
		renderChart1(val);
	});

}

function initChart1Series(data, barIndex, lineIndex){
	var series = [];
	series[barIndex] = {
		name: '门店数量',
        type: 'bar',
        yAxisIndex: 1,
        color: "#FFA84A",
        data: data[barIndex].data
	}
	
	series[1] = {
        name: data[lineIndex].name,
        type: 'line',
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
        data: data[lineIndex].data
	}
	
	return series
}