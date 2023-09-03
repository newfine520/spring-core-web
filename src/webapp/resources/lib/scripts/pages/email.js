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
    $('#dataTable').bootstrapTable({
        url: "/System/Email/GetEmailList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        columns: [
            {
                title: '操作',
                field: 'Id',
                formatter: 'actionFormatter',
                //events: 'storeOperate',
                events: 'Operate',
                width: "80px"
            },
            {
                field: 'Recipient',
                title: '收件人'
            },
            //{
            //    field: 'CCsend',
            //    title: 'CC'
            //},
            {
                field: 'SendStatus',
                title: '发送状态',
                formatter: function returnStatus(data) {
                    if (data == "未发送")
                        return "<span class='label label-warning'>" + data + "</span>"
                    if (data == "发送成功")
                        return "<span class='label label-success'>" + data + "</span>"
                    if (data == "发送失败")
                        return "<span class='label label-danger '>" + data + "</span>"
                }

            }, {
                field: 'StrCreateTime',
                title: '发送时间',
            }, {
                field: 'CreateBy',
                title: '创建人',
            }, {
                field: 'Title',
                title: '标题'
            }, {
                field: 'Text',
                title: '内容'
            },
        ],
    });

});
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})
function queryParams(params) {
    return {
        Status: $("#txtStatus").val(),
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        SendTimeSta: $("#SendTimeSta").val(),
        SendTimeEnd: $("#SendTimeEnd").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=ReSend("' + row.Id + '","' + row.Recipient + '") data-role="Admin" >发送</a>'
    return results;
}
function ReSend(id, Recipient) {
    if (Recipient == null || Recipient == "") {
        $.ShowMessage("error", "收件人为空");
        return false;
    }
    else {
        $.SubAjax({
            type: 'post',
            url: '/System/Email/ReSend',
            data: { Id: id },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                }
            }
        });
    }
}