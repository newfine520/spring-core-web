var now = new Date();
var salestile = "销量(箱)";
var searchcode = "0";
var targettitle = "目标(箱)";
Year = now.getFullYear();
Month = now.getMonth() + 1;
if (Month <= 9) {
    Month = '0' + Month;
}
YearMonthSta = Year + '-01-01';
YearMonthEnd = Year + '-' + Month + '-01';
$(document).ready(function () {
    //初始化品类
    GetCateroyList();

    //加载sku
    MainSku();

    // 初始化日历
    initTime();

    //加载数据
    LoadAllData();

    // 绑定查询按钮点击
    $('#searchbtn').on('click', function () {
        var s = new Date(YearMonthSta);
        var e = new Date(YearMonthEnd);
        if (e - s < 0) {
            $.ShowMessage("error", "开始月份必须小于结束月份");
        } else if (e.getTime() - s.getTime() > (1000 * 60 * 60 * 24 * 365)) {
            $.ShowMessage("error", "月份选择不超过12个月 ");
        } else {
            $('#dataTable').bootstrapTable("destroy");
            LoadAllData();
        }
    });

    //按钮单选
    $("#salestotal").on("click", function () {
        $("#radiocheckvalue").val($("#salestotal").val());
        $("#salescount").attr("checked", false);
    });
    $("#salescount").on("click", function () {
        $("#radiocheckvalue").val($("#salescount").val());
        $("#salestotal").attr("checked", false);
    });
    $("#allsku").on("click", function () {
        $("#mainsku").attr("checked", false);
        $("#IsMansku").val($("#allsku").val());
        $("#Sku").html("");
        MainSku();
    });
    $("#mainsku").on("click", function () {
        $("#allsku").attr("checked", false);
        $("#IsMansku").val($("#mainsku").val());
        MainSku();
    });


    //初始化页面选中
    $("#tab-item1").css('width', '150px');
    $("#tab-item1").css('height', '150px');
    $("#tab-item1").css('background-color', '#FFA84A');
    $("#tab-item1").css('color', '#000');

    //切换查询按钮
    $('.tab-item').on('click', function () {
        $(".tab-item").css('width', '130px');
        $(".tab-item").css('height', '130px');
        $(".tab-item").css('background-color', '#2C2F40');
        $(".tab-item").css('color', '#fff');
        $(this).css('width', '150px');
        $(this).css('height', '150px');
        $(this).css('background-color', '#FFA84A');
        $(this).css('color', '#000');
        $("#datatype").val($(this).attr("value"));
        $('#dataTable').bootstrapTable("destroy");
        if ($(this).attr("value") === '5') {
            $("#storeinfo").attr("style", "display:block;");
        } else {
            $("#storeinfo").attr("style", "display:none;");
            $("#storeinfo").val("");  
        }
        LoadAllData();
    });

    //详细数据切换
    $('.lineCart').on('click', function () {
        $(this).toggleClass('reverse');
        $(this).parent().find('.line-content').toggleClass('heightAuto');
    });

    //checkbox切换
    $('#Category .i-checks').on('ifChecked', function (event) {
        if ($("#IsMansku").val === "1") {
            MainSku();
        }
    });
});

// 初始化时间和日历
function initTime() {
    var nowTime = new Date();
    nowYear = nowTime.getFullYear();
    nowMonth = nowTime.getMonth() + 1;
    if (nowMonth <= 9) {
        nowMonth = '0' + nowMonth;
    }

    YearMonthSta = nowYear + '-01-01';
    YearMonthEnd = nowYear + '-' + nowMonth + '-01';

    laydate.render({
        elem: '#startTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-01',
        done: function (value, date, endDate) {
            YearMonthSta = value + '-01';
        }
    });
    laydate.render({
        elem: '#endTime',
        type: 'month',
        trigger: 'click',
        value: nowYear + '-' + nowMonth,
        done: function (value, date, endDate) {
            YearMonthEnd = value + '-01'
        }
    });
};


//加载品类
function GetCateroyList() {
    $.SubAjax({
        type: 'GET',
        url: '/DataImport/SalesRaking/GetCateroyList',
        success: function (res) {
            if (res.IsSuccess) {
                var data = res.Data;
                $("#Category").html('');
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        $("#Category").append('<label class="checkbox-inline i-checks"><input type="checkbox" value="' + data[i].Value + '">' + data[i].Name + '</label>');
                    }
                }
                $('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                });
                checkFirst($('#Category .i-checks'));
                checkboxXOR($('#Category'), "category");
            }

        }
    });
}
//加载sku
function MainSku() {
    $.SubAjax({
        type: 'GET',
        url: '/DataImport/SalesRaking/GetMainSku',
        data: { cateryid: eachConditionLine('Category'), ismainsku: $("#IsMansku").val() },
        success: function (res) {
            if (res.IsSuccess) {
                var data = res.Data;
                $("#Sku").html('');
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        $("#Sku").append('<label class="checkbox-inline i-checks"><input type="checkbox" value="' + data[i].Value + '">' + data[i].Name + '</label>');
                    }
                }
                $('#Sku .i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                });

                checkFirst($('#Sku .i-checks'));
                checkboxXOR($('#Sku'),"sku");
            }

        }
    });
};
// checkbox默认选中第一个
function checkFirst(ele) {
    ele.first().iCheck('check');
};
// checkbox无限与其他互斥
function checkboxXOR(ele,divname) { // 传入DOM对象
    ele.find('.i-checks').on('ifChecked', function (event) {
        var val = $(this).find('input').val();
        if (val !== "0") {
            ele.find('.i-checks').first().iCheck('uncheck');
        } else {
            //ele.find('.i-checks input').each(function () { this.checked = false; });
        }
        //动态加载单品
        if (divname === "category") {
            MainSku();
        }
    });

    ele.find('.i-checks').on('ifUnchecked', function (event) {
        //动态加载单品
        if (divname === "category") {
            MainSku();
        }
    });
};

// 组装查询条件
function getSearchCondition() {
    var searchCondition = {
        StartTime: YearMonthSta,
        EndTime: YearMonthEnd,
        type: $("#radiocheckvalue").val(),
        DealerId: eachConditionLine('distributor')
    };

    return searchCondition;
};

//获取筛选条件
function eachConditionLine(mainId) {
    var str = '';
    if ($('#' + mainId + ' .i-checks input').length > 0) {
        $('#' + mainId + ' .i-checks input').each(function () {
            if (true == $(this).is(':checked')) {
                str = str + $(this).val() + ',';
            }
        });
    } else {
        str = '0,';
    }
    if (str === '') {
        str = '0,';
    }
    return str.substring(0, str.length - 1);
};

//页面数据加载
function LoadAllData() {
    LoadTopThree();
    LoadTable();
}

//加载前三名
function LoadTopThree() {
    $("#threetop1").html('');
    $("#threetop2").html('');
    $("#threetop3").html('');
    $.SubAjax({
        type: 'post',
        url: '/DataImport/SalesRaking/GetThreeTopRaking',
        data: {
            Categoryid: eachConditionLine("Category"),
            SkuType: $("#IsMansku").val(),
            Skuid: eachConditionLine("Sku"),
            Starttime: YearMonthSta, //开始时间
            Endtime: YearMonthEnd, //结束时间
            Storeinfo: $("#storeSearch").val(), //门店信息 
            Statictype: $("#radiocheckvalue").val(), //统计指标 0:销售数量  1:销售额
            Datetype: $("#datatype").val(),//数据纬度  1.大区   2.小区  3.省份  4.城市  5.门店  6.经销商
            Pagesize: 10, //页面大小
            Skipcount: 0,//跳过多少个
            Sortname: '', //排序名称
            Sorttype: '', //排序方式
            Searchcode: 1 //获取数据 
        },
        success: function (res) {
            if (res.IsSuccess) {
                var data = res.Data;
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        switch (i) {
                            case "0":
                                $("#threetop1").append("<img src='/Scripts/salesstatic/img/no.1.png'/><div class='place' title='" + data[i].name + "'>" + data[i].name + "</div><div class='num'>" + data[i].sales + "</div>");
                                break;
                            case "1":
                                $("#threetop2").append("<img src='/Scripts/salesstatic/img/no.2.png'/><div class='place' title='" + data[i].name + "'>" + data[i].name + "</div><div class='num'>" + data[i].sales + "</div>");
                                break;
                            case "2":
                                $("#threetop3").append("<img src='/Scripts/salesstatic/img/no.3.png'/><div class='place' title='" + data[i].name + "'>" + data[i].name + "</div><div class='num'>" + data[i].sales + "</div>");
                                break;
                        }
                    }
                }
            }

        }
    });
}


//表格加载
function LoadTable() {
    searchcode = "0";
    if ($("#radiocheckvalue").val() === "0") {
        salestile = "销量(箱)";
        targettitle = "目标(箱)";
    } else {
        salestile = "销量(万元)";
        targettitle = "目标(万元)";
    }
    var columns = [
        {
            field: 'sales',
            title: salestile,
            valign: 'middle',
            sortable: true
        }, {
            field: 'targetvalue',
            title: targettitle,
            valign: 'middle',
            sortable: true
        }, {
            field: 'salesrate',
            title: '达成率(%)',
            valign: 'middle',
            sortable: true
        }
    ];
    var datatypevalue = $("#datatype").val();
    if (datatypevalue === "1" || datatypevalue === "2" || datatypevalue === "3" || datatypevalue === "4") {
        columns.push({
            valign: 'middle',
            field: 'id',
            title: '经销商排行',
            formatter: 'actionFormatter'
        });
    }
    switch (datatypevalue) {
        case "1":
            columns.unshift({
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'name',
                title: '大区'
            });
            break;
        case "2":
            columns.unshift({
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'name',
                title: '大区'
            }, {
                valign: 'middle',
                field: 'nextname',
                title: '小区'
            }
            );
            break;
        case "3":
            columns.unshift({
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'name',
                title: '省份'
            });
            break;
        case "4":
            columns.unshift({
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'name',
                title: '省份'
            }, {
                valign: 'middle',
                field: 'nextname',
                title: '城市'
            }
            );
            break;
        case "6":
            columns.unshift({
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'name',
                title: '经销商名称'
            });
            break;
    }
    if (datatypevalue === "5") {
        columns = [
            {
                valign: 'middle',
                field: 'RowNumber',
                title: '排行'
            }, {
                valign: 'middle',
                field: 'areaname',
                title: '大区'
            }, {
                valign: 'middle',
                field: 'subareaname',
                title: '小区'
            }, {
                valign: 'middle',
                field: 'provincename',
                title: '省份'
            }, {
                valign: 'middle',
                field: 'cityname',
                title: '城市'
            }, {
                valign: 'middle',
                field: 'storename',
                title: '门店名称'
            }, {
                field: 'storeno',
                title: '门店编号'
            }, {
                valign: 'middle',
                field: 'sales',
                title: '销量(万元)',
                sortable: true
            }, {
                valign: 'middle',
                field: 'targetvalue',
                title: '目标(万元)',
                sortable: true
            }, {
                valign: 'middle',
                field: 'salesrate',
                title: '达成率(%)',
                sortable: true
            }
        ];
    }
    $('#dataTable').bootstrapTable({
        method: 'post',
        sortOrder: "desc",
        url: "/DataImport/SalesRaking/GetSalesRaking",
        queryParams: queryParams,
        pagination: true, //分页
        sidePagination: "server",
        columns: columns
    });
}

//table中添加按钮
function actionFormatter(value, row, index) {
    var results = "<a class='like' onclick=VisitDistributor('" + value + "','" + row.name + "')  title='查看'>查看</a>";
    return results;
}

function VisitDistributor(data, name) {
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#myModalLabel").text(name);
    searchcode = data;
    $('#DistributorTable').bootstrapTable("destroy");
    if ($("#radiocheckvalue").val() === "0") {
        salestile = "销量(箱)";
        targettitle = "目标(箱)";
    } else {
        salestile = "销量(万元)";
        targettitle = "目标(万元)";
    }
    var discolumns = [{
        valign: 'middle',
        field: 'RowNumber',
        title: '排行'
    }, {
        valign: 'middle',
        field: 'name',
        title: '经销商名称'
    }, {
        field: 'sales',
        title: salestile,
        valign: 'middle',
        sortable: true
    }, {
        field: 'targetvalue',
        title: targettitle,
        valign: 'middle',
        sortable: true
    }, {
        field: 'salesrate',
        title: '达成率(%)',
        valign: 'middle',
        sortable: true
    }
    ];
    $('#DistributorTable').bootstrapTable({
        method: 'post',
        sortOrder: "desc",
        url: "/DataImport/SalesRaking/GetDistributor",
        queryParams: queryParams,
        pagination: false, //分页
        sidePagination: "server",
        columns: discolumns
    });
}

//分页参数
function queryParams(params) {
    var pagesize = 10;
    if (searchcode !== "0") {
        pagesize = 3;
    } else {
        pagesize = params.limit;
    }
    return {
        Categoryid: eachConditionLine("Category"),
        SkuType: $("#IsMansku").val(),
        Skuid: eachConditionLine("Sku"),
        Starttime: YearMonthSta, //开始时间
        Endtime: YearMonthEnd, //结束时间
        Storeinfo: $("#storeSearch").val(), //门店信息 
        Statictype: $("#radiocheckvalue").val(), //统计指标 0:销售数量  1:销售额
        Datetype: $("#datatype").val(),//数据纬度  1.大区   2.小区  3.省份  4.城市  5.门店  6.经销商
        Pagesize: pagesize, //页面大小
        Skipcount: params.offset,//跳过多少个
        Sortname: params.sort, //排序名称
        Sorttype: params.order, //排序方式
        Searchcode: searchcode //获取数据 
    };
}