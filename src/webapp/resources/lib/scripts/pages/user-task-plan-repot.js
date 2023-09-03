$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/TaskPlanRepot/GetUserTaskPlanReport",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: '姓名',
                title: '姓名'
            },
            {
                field: '工号',
                title: '工号'
            },
            {
                field: '周一',
                title: '周一'
            },
            {
                field: '周二',
                title: '周二'
            },
            {
                field: '周三',
                title: '周三'
            },
            {
                field: '周四',
                title: '周四'
            },
            {
                field: '周五',
                title: '周五'
            },
            {
                field: '周六',
                title: '周六'
            },
            {
                field: '周日',
                title: '周日'
            }

        ]
    });

   
})


$("#btnSearch").on("click", function () {
    if ($("#CycleWeek").val() == null || $("#CycleWeek").val() == "") {
        $.ShowMessage("warning", "请选择周期！");
        return false;
    }
    $('#dataTable').bootstrapTable("refresh");
})

function queryParams(params) {
    return {
        WeekString: $("#CycleWeek").val(),
        UserNo: $("#UserNo").val(),
        PositionId: $("#selPosition").val(),
        StatusCode: $("#selTaskStatusCode").val(),
        TaskPlanType: $("#selTaskPlanType").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            WeekString: $("#CycleWeek").val(),
            UserNo: $("#UserNo").val(),
            PositionId: $("#selPosition").val(),
            StatusCode: $("#selTaskStatusCode").val(),
            TaskPlanType: $("#selTaskPlanType").val(),
        },
        url: "/DataImport/TaskPlanRepot/ExportUserTaskPlan",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=人员拜访报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})





