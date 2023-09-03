$(function () {
    $(".datepicker").val(getNowFormatDate());
    $("#StartTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#EndTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $(".select2").select2();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    })
    $('#dataTable').bootstrapTable({
        url: "/System/User/GetUserLoginList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                field: 'UserName',
                title: '姓名',
                sortable: "true"
            }, {
                field: 'UserNo',
                title: '工号',
                sortable: "true"
            },
            {
                field: 'PositionName',
                title: '职位名'
            },
            {
                field: 'Mobile',
                title: '手机号'
            }
,
            {
                field: 'LoginFrom',
                title: '登录来源'
            }
            ,
            {
                field: 'LoginTimeString',
                title: '登录时间'
            }
                 ,
            {
                field: 'UniqueCode',
                title: '唯一码'
            }
        ]
    });
    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                UserName: $("#txtUserName").val(),
                UserNo: $("#txtUserNo").val(),
                PositionCode: $("#selPosition").val(),
                StartTime: $("#StartTime").val(),
                EndTime: $("#EndTime").val(),
            },
            url: '/System/User/ExportUserLogin',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=登录日志";
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })
})
function queryParams(params) {
    return {
        UserName: $("#txtUserName").val(),
        UserNo: $("#txtUserNo").val(),
        PositionCode: $("#selPosition").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate;
}