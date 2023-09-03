function loadProvinceRate(data) {

    var cellItemArry = [];

    if (data) {
        if (data.SmallAreaGroup) {

            if (data.SmallAreaGroup.length > 0) {

                data.SmallAreaGroup.forEach(function (item) {
                    var areaName = item.BigArea || "";
                    var cellItem = `<li>
    <div class="dashboard-province-rate">
    <p class="province-name">${areaName}</p>
    <div class="province-content-list">
      ${loadProvinceList(item.AreaData)}
    </div>
  </div></li>`;
                    cellItemArry.push(cellItem);
                });


            }

        }

    }

    $("#areaProviceRate").html(`<ul class="roll__list" style="position: absolute;left: 0px;">${cellItemArry.join('')}</ul>`);
}

function loadProvinceList(item) {


    var caculPer = function (v, t) {
        if (t == 0) {
            return "0%";
        }
        return (v * 100 / t).toFixed(1) + "%";
    }

    var provinceItem = '';
    if (item) {

        if (item.length > 0) {

            let totalMoney = 0;

            totalMoney = item.reduce((totalMoney, item) => {
                return totalMoney + (item.OutOfTotalMoney || 0)
            }
                , 0);


            totalMoney = totalMoney || 0;



            item.forEach(function (it) {

                

                provinceItem += `
    <div class="list-cell">
    <p class="list-province-name">${it.SmallArea}</p>
    <div class="list-cell-item">
      <div class="cell-progress"><span class="progress-rate" style="width:${caculPer(it.OutOfSkuNum, it.TotalSkuCount)};">${caculPer(it.OutOfSkuNum, it.TotalSkuCount)}</span></div>
      <span class="progress-des">金额:<span class="progress-price">${parseFloat(Math.round(it.OutOfTotalMoney)).toLocaleString()}</span>元 SKU:<span class="progress-price">${it.OutOfSkuNum}</span> 门店:<span class="progress-price">${it.OutOfStoreNum}</span></span>
    </div></div>
    ` ;


            });
        }
    }


    return provinceItem;
}



function loadRate(data) {

    if (data) {
        if (data.BigAreaGroup) {
            if (data.BigAreaGroup.length > 0) {

                var rateEchart = echarts.init(document.getElementById('stockRate'));

                var totalMoney = 0;
                var legendData = [];
                var seriesData = [];


                data.BigAreaGroup.forEach(function (itm) {
                    totalMoney = commonUtilsNS.accAdd(itm.TotalMoney || 0, totalMoney);
                    legendData.push(itm.BigArea + ":" + itm.TotalMoney || 0);
                    seriesData.push({ value: (itm.TotalMoney || 0), name: itm.BigArea + ":" + itm.TotalMoney || 0 });

                });

                var rateOption = {
                    title: {
            
                        text: '{a|合计金额:}' + '{b|' + parseFloat(Math.round(totalMoney)).toLocaleString() + '}' + '{a|元}',
                        left: '55%',
                        top:'10%',
                        textStyle: {
                            rich: {
                                a: {
                                    fontSize: 12,
                                },
                                b: {
                                    color: 'red',
                                    fontSize: 12
                                }
                            }

                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        //formatter: '({d}%)'
                        formatter: function (data) {
                            return data.percent.toFixed(1) + "%";
                        }
                    },
                    legend: {
                        itemHeight: 7,
                        itemWidth: 7,
                        orient: 'vertical',
                        right: '15',
                        top: '100',
                        data: legendData,
                        formatter: function (series) {
                            var itmArry = series.split(':');

                            var arr = [
                                itmArry[0] + " ",
                                '{b|' + parseFloat(Math.round(itmArry[1])).toLocaleString() + '}'+ '元'
                            ]
                            return arr.join('');
                        },
                        textStyle: {
                            rich: {
                                a: {
                                    fontSize: 20,
                                    verticalAlign: 'top',
                                    align: 'center',
                                    padding: [0, 0, 28, 0]
                                },
                                b: {
                                    color: 'red'
                                }
                            }
                        },

                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside',
                                    //formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                                    formatter: function (data) {
                                        return data.percent.toFixed(1) + "%";
                                    },
                                    textStyle: {
                                        align: 'center',
                                        baseline: 'middle',
                                        fontFamily: '微软雅黑',
                                        fontSize: 15,
                                        fontWeight: 'normal',
                                        color: '#FFF'
                                    }
                                },
                            },
                            center: ['30%', '50%'],
                            data: seriesData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                rateEchart.setOption(rateOption);
            }

        }
    }


}
// // 加载东区
// function loadEast() {

// }

// // 加载西区
// function loadWest() {

// }

// // 加载南区
// function loadSourth() {

// }
// // 加载北区
// function loadNorth() {

// }
// // 加载中区
// function loadCenter() {

// }