$(function () {
    $(".select2").select2();
    //省市下拉框
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }

    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });

    $("#yearMonth").val(defaultYearMonthDate);
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
    })
})
function LoadDatatable() {
    var yearMonth = $("#yearMonth").val();
    var dayAll = 0;
    if (yearMonth.length == 7) {
        var d = new Date(yearMonth.substr(0, 4), yearMonth.substr(5, 2), 0);
        dayAll = d.getDate();
    }
    var fileName = yearMonth.substr(5, 2) + "/";
    if (fileName.substr(0, 1) == "0") {
        fileName = fileName.replace("0", "");
    }
    var columns1 = [
        {
            title: '省份',
            field: '省份',
            formatter: function (value, row, index) {
                return '<span style="min-width:50px; display: block">' + row.省份 + '</span>'
            },
            rowspan: 2,
            colspan: 1
        },
        {
            title: '城市',
            field: '城市',
            formatter: function (value, row, index) {
                return '<span style="min-width:50px; display: block">' + row.城市 + '</span>'
            },
            rowspan: 2,
            colspan: 1
        },
        {
            title: '店员',
            field: '店员',
            formatter: function (value, row, index) {
                return '<span style="min-width:50px; display: block">' + row.店员 + '</span>'
            },
            rowspan: 2,
            colspan: 1
        },
         {
             field: '门店ID',
             title: '门店ID',
             formatter: function (value, row, index) {
                 return '<span style="min-width:90px; display: block">' + row.门店ID + '</span>'
             },
             rowspan: 2,
             colspan: 1
         }, {
             field: '门店名称',
             title: '门店名称',
             formatter: function (value, row, index) {
                 return '<span style="min-width:140px; display: block">' + row.门店名称 + '</span>'
             },
             rowspan: 2,
             colspan: 1
         }
         , {
             field: '月份',
             title: '月份',
             formatter: function (value, row, index) {
                 return '<span style="min-width:50px; display: block">' + row.年月 + '</span>'
             },
             rowspan: 2,
             colspan: 1
         }
         //, {
         //    field: 'A班作息时间',
         //    title: 'A班作息时间',
         //    formatter: function (value, row, index) {
         //        return '<span style="min-width:50px; display: block">' + row.A班作息时间 + '</span>'
         //    },
         //    rowspan: 2,
         //    colspan: 1
         //}, {
         //    field: 'B班作息时间',
         //    title: 'B班作息时间',
         //    formatter: function (value, row, index) {
         //        return '<span style="min-width:50px; display: block">' + row.B班作息时间 + '</span>'
         //    },
         //    rowspan: 2,
         //    colspan: 1
         //}, {
         //    field: 'C班作息时间',
         //    title: 'C班作息时间',
         //    formatter: function (value, row, index) {
         //        return '<span style="min-width:50px; display: block">' + row.C班作息时间 + '</span>'
         //    },
         //    rowspan: 2,
         //    colspan: 1
         //}
    ];
    $.SubAjax({
        type: 'get',
        data: {
        },
        url: '/System/Schedule/GetScheduleCategory',
        success: function (data) {
            $.each(data.Data, function (index, data) {
                columns1.push({
                    field: data,
                    title: data,
                    formatter: function (value, row, index) {
                        return '<span style="min-width:50px; display: block">' + value + '</span>'
                    },
                    rowspan: 2,
                    colspan: 1
                });
            })
        }
    });

    for (var i = 1; i <= dayAll; i++) {
        var dateValue = yearMonth + "-" + i;
        columns1.push({
            title: GetWeekDay(dateValue),
            colspan: 1,
            rowspan: 1
        });
    }
    var columns2 = [{
        title: fileName + "1",
        field: "01",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "2",
        field: "02",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "3",
        field: "03",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "4",
        field: "04",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "5",
        field: "05",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "6",
        field: "06",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "7",
        field: "07",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "8",
        field: "08",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }, {
        title: fileName + "9",
        field: "09",
        formatter: function (value, row, index) {
            if (value != null) {
                return value
            }
            else {
                return ""
            }
        },
        rowspan: 1,
        colspan: 1
    }
    ];
    for (var i = 10; i <= dayAll; i++) {
        columns2.push({
            title: fileName + i,
            field: i,
            formatter: function (value, row, index) {
                if (value != null) {
                    return value
                }
                else {
                    return ""
                }
            },
        });
    }
    var columns = [];
    columns.push(columns1);
    columns.push(columns2);

    $('#dataTable').bootstrapTable({
        url: "/System/Schedule/GetScheduleList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns
    });
}
function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        YearMonth: $("#yearMonth").val(),
        StoreName: $("#txtStoreName").val(),
        StoreNo: $("#txtStoreNo").val(),
        SupversionId: $("#SupervisorId").val(),
        ProvinceCode: $("#ProvinceCode").val(),
        CityCode: $("#CityCode").val(),
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val()
    };
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            YearMonth: $("#yearMonth").val(),
            StoreName: $("#txtStoreName").val(),
            StoreNo: $("#txtStoreNo").val(),
            SupversionId: $("#SupervisorId").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val()
        },
        url: '/System/Schedule/ExportScheduleList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=排班报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

$("#btnExportSchedualSales").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            YearMonth: $("#yearMonth").val(),
            StoreName: $("#txtStoreName").val(),
            StoreNo: $("#txtStoreNo").val(),
            SupversionId: $("#SupervisorId").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val()
        },
        url: '/System/Schedule/ExportList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=排班销量报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function GetWeekDay(date) {
    var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
    var today = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    return today[day.getDay()];
}