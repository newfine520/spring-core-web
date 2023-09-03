$(function () {
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    defaultYearMonthDate += (new Date().getMonth() + 1) + "-" + (new Date().getDate());
    var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //前一天
    var preDateString = preDate.getFullYear().toString() + "-" + (preDate.getMonth() + 1) + "-" + (preDate.getDate());
    $("#TimeSta").val(preDateString);
    $("#TimeEnd").val(defaultYearMonthDate);
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Point/GetPointTotalList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                field: 'UserNo',
                title: '工号'
            },
            {
                field: 'UserName',
                title: '姓名'
            }, {
                field: 'CellPhone',
                title: '手机'
            }, {
                field: 'Position',
                title: '职位'
            },{
                field: 'TotalCount',
                title: '总积分'
            }
        ],
    });
    $('#dataTableDetail').bootstrapTable({
        url: "/DataImport/Point/GetPointDetailList",
        pagination: "true",
        queryParams: queryParamsDetail,
        sidePagination: 'server',
        clickToSelect: true,
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                field: 'UserNo',
                title: '工号'
            },
            {
                field: 'UserName',
                title: '姓名'
            }, {
                field: 'CellPhone',
                title: '手机'
            }, {
                field: 'Position',
                title: '职位'
            }, {
                field: 'CreateTime',
                title: '变动日期',
            },
            {
                field: 'DetailName',
                title: '积分详情名称',
            },
            {
                field: 'DetailPoint',
                title: '积分详情值',
            }
        ],
    });

})

function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        CellPhone: $("#txtCellPhone").val(),
        IsPage: true,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
    };
}

function queryParamsDetail(params) {
    return {
        UserNo: $("#txtUserNoDetail").val(),
        UserName: $("#txtUserNameDetail").val(),
        CellPhone: $("#txtCellPhoneDetail").val(),
        TimeSta: $("#TimeSta").val(),
        TimeEnd: $("#TimeEnd").val(),
        Status: $("#StatusCode").val(),
        IsPage: true,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$("#btnSearchDetail").on("click", function () {
    $('#dataTableDetail').bootstrapTable("refresh");
});

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#txtUserNo").val(),
            UserName: $("#txtUserName").val(),
            CellPhone: $("#txtCellPhone").val()
        },
        url: '/DataImport/Point/ExportTotal',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=总积分列表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

$("#btnExportDetail").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#txtUserNoDetail").val(),
            UserName: $("#txtUserNameDetail").val(),
            CellPhone: $("#txtCellPhoneDetail").val(),
            TimeSta: $("#TimeSta").val(),
            TimeEnd: $("#TimeEnd").val(),
            Status: $("#StatusCode").val()
        },
        url: '/DataImport/Point/ExportDetail',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=积分兑换明细列表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
