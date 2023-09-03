$(function () {
    $(".select2").select2();
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: 'linked',
        pickerPosition: "bottom-left"
    })
    var columns = [
        {
            title: '编号',
            field: 'UserNo',
        }, {
            title: '姓名',
            field: 'UserName',
        }, {
            title: '电话',
            field: 'UserMobile',
        }, {
            title: '内容',
            field: 'Context',
        }, {
            field: 'Remark',
            title: '备注',
        }, {
            field: 'StrCreateTime',
            title: '时间'
        }
    ];
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Sms/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns,
    });

})

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        UserMobile: $("#txtUserMobile").val(),
        SendTimeSta: $("#SendTimeSta").val(),
        SendTimeEnd: $("#SendTimeEnd").val(),
        //FormType: "olap",
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#txtUserNo").val(),
            UserName: $("#txtUserName").val(),
            UserMobile: $("#txtUserMobile").val(),
            SendTimeSta: $("#SendTimeSta").val(),
            SendTimeEnd: $("#SendTimeEnd").val(),
        },
        url: '/DataImport/Sms/ExportSms',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=短信记录";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
