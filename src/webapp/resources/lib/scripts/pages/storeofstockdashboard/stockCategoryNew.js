
var colorDef = {};
function loadByCategory(type) {
    var byData = []


    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
    function colorRgb(sColor) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = sColor.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    };


    // 将rgb表示方式转换为hex表示方式
    function colorHex(rgb) {
        var _this = rgb;
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(_this)) {
            var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            var aNum = _this.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    }

    function gradientColor(startColor, endColor, step) {
        startRGB = colorRgb(startColor);//转换为rgb数组模式
        startR = startRGB[0];
        startG = startRGB[1];
        startB = startRGB[2];

        endRGB = colorRgb(endColor);
        endR = endRGB[0];
        endG = endRGB[1];
        endB = endRGB[2];

        sR = (endR - startR) / step;//总差值
        sG = (endG - startG) / step;
        sB = (endB - startB) / step;

        var colorArr = [];
        for (var i = 0; i < step; i++) {
            //计算每一步的hex值 
            var hex = colorHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');



            colorArr.push(hex);
        }
        return colorArr;
    }

    function getItemColors(number) {

        let color = number;
        const blue = parseInt(color % 0x100, 10);
        color = color >>> 8;
        const green = parseInt(color % 0x100, 10);
        color = color >>> 8;
        const red = parseInt(color % 0x100, 10);
        const alpha = 0.8;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
    var defualtColor = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#1E90FF", "#20B2AA", "#228B22", "#2F4F4F", "#32CD32", "#3CB371", "#40E0D0", "#483D8B", "#48D1CC", "#556B2F", "#5F9EA0", "#6495ED", "#66CDAA","#696969"]

    String.prototype.hashCode = function () {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    function mock(data) {


        var temp = [];
        for (var i = 0; i < 1; i++) {
            var ary2 = JSON.parse(JSON.stringify(data));


            ary2.forEach(function (itm) {
                itm.GroupName = itm.GroupName + i
            });

            temp=temp.concat(ary2);
        }
  
        return data.concat(temp);
    }
    $.get("/DataImport/StoreOutOfStatistics/getStoreOutofConsequentSummeryByGroup", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        GroupType: type,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {

        if (data) {
            if (data.length > 0) {
                var groupNameArry = [];

             
                for (var i = 0; i < data.length; i++) {

                    //mock
                    //data[i].OutOfDetail = mock(data[i].OutOfDetail);
                    if (data[i].OutOfDetail != undefined && data[i].OutOfDetail.length > 0) {

                        data[i].OutOfDetail.forEach(function (itm) {
                            if (!groupNameArry.includes(itm.GroupName)) {
                                groupNameArry.push(itm.GroupName);
                            }

                        });
                    }
                   

                }
                //计算颜色
                if (groupNameArry.length > 0) {
                    var cls = null;
                    for (var j = 0; j < groupNameArry.length; j++) {
                        if (defualtColor.length >= j + 1) {
                            colorDef[groupNameArry[j].hashCode()] = defualtColor[j];
                        } else {
                            var cutLength = j + 1 - defualtColor.length;
                            if (cls == null) {

                                cls = gradientColor("#6A5ACD", "#FFFFE0", cutLength + 1);
                            } else {
                                colorDef[groupNameArry[j].hashCode()] = cls[cutLength];
                            }
                        }
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    var outfoStr = `连续缺货${data[i].WeekGroup}周`;
                    if (data[i].WeekGroup.trim() == "9-") {
                        var outfoStr = `连续缺货8周以上`;
                    }
                    loadBy('stockBy' + (i + 1), data[i].OutOfDetail, outfoStr,i)
                }
            }

        }

    }, "json");

}



// by-1
function loadBy(elementID, byData, title,index) {


    var byCategoryEchart = echarts.init(document.getElementById(elementID));

    var sData = [];
    var legenData = [];
    if (byData && byData.length > 0) {
        
        byData.forEach(function (itm,ind) {

            
            legenData.push(itm.GroupName);
            var pieColor = '';

            pieColor = colorDef[itm.GroupName.hashCode()];

            sData.push({
                value: itm.TotalMoney,
                name: itm.GroupName,
               itemStyle: { color: pieColor }
            });
            
        });
    }


    var lengendData = {
        itemHeight: 7,
        itemWidth: 7,
        orient: 'vertical',  //垂直显示            
        data: legenData,
        right: '-2',
        y: 'center',
        formatter: function (name) {
            // 获取legend显示内容
            let data = sData;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
                total += data[i].value;
                if (data[i].name == name) {
                    tarValue = data[i].value;
                }
            }
            let p = 0;
            if (total > 0) {
                p = (tarValue / total * 100).toFixed(1);
                if (p == 100) {
                    p = "100";
                }
            }

            return name + '{b| ' + p + '%' + '}';
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
                    color: 'red',
                    fontSize: 12,
                }
            }
        },
    };

    var byCategoryOption = {
        title: {
            text: title,
            x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
            y: 'bottom', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
            textStyle: {
               // fontWeight: '100',
                fontSize: '12'
            }


        },
        legend: lengendData,
        series: {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            center: ['50%', '50%'],
            emphasis: {
                label: {
                    show: true,
                    fontSize: '10',
                    formatter: function (itm) {
                        let name = itm.data.name;
                        let p = parseFloat(Math.round(itm.data.value)).toLocaleString();

                        return name + ' ' + '{b| ' + p + '}' + '元';
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
                }
            },
            labelLine: {
                show: false
            },
            data: sData
        }
    };
    byCategoryEchart.setOption(byCategoryOption);

    if (byData && byData.length > 0) {
        var opt = byCategoryEchart.getOption();
        var cls = opt.color;
    }

}