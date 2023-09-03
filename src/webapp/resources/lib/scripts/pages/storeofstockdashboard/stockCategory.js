function loadByCategory(type) {
  var byData = []

    $.get("/DataImport/StoreOutOfStatistics/getStoreOutofConsequentSummeryByGroup", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        GroupType: type,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {

            if (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        loadBy('stockBy' + (i + 1), data[i].OutOfDetail)
                    }
                }
         


        }

    }, "json");
 
}

  // by-1
function loadBy(elementID, byData) {

    var byCategoryEchart = echarts.init(document.getElementById(elementID));

    var sData = [];
    var legenData = [];
    if (byData && byData.length>0) {

        byData.forEach(function (itm) {
            legenData.push(itm.GroupName);
            sData.push({
                value: itm.TotalMoney,

                name: itm.GroupName
            });


        });
    }

    var byCategoryOption = {
        tooltip: {
            trigger: 'item',
        },
        title: {
            padding: [28, 0, 0, 16],
            text: '哈哈',
            textStyle: {//标题样式
                fontWeight: "normal",
                color: "#59DAE8",
                fontSize: 14,
                left: 'center',
            },
        },
        legend: {
            orient: 'vertical',  //垂直显示
            y: 'center',    //延Y轴居中
            x: 'right' //居右显示
            ,data: legenData
        },
        series: {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            center: ['50%', '40%'],
            emphasis: {
                label: {
                    show: true,
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: sData
        }
    };
    byCategoryEchart.setOption(byCategoryOption);
}