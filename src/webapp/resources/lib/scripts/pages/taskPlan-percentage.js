$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/TaskPlanRepot/GetTaskPlanPercentageReport",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: '周',
                title: '周'
            },
            {
                field: '城市',
                title: '城市'
            },
            {
                field: '姓名',
                title: '姓名'
            },
            {
                field: '工号',
                title: '工号'
            },
            {
                field: '计划内拜访门店数',
                title: '计划内拜访门店数'
            },
            {
                field: '计划内实际拜访门店',
                title: '计划内实际拜访门店'
            },
            {
                field: '计划外拜访门店数',
                title: '计划外拜访门店数'
            },
            {
                field: '达成率',
                title: '达成率'
            }

        ]
    });


})


$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

function queryParams(params) {
    return {
        WeekString: $("#CycleWeek").val(),
        UserNo: $("#UserNo").val(),
        PositionId: $("#selPosition").val(),
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
            PositionId: $("#selPosition").val()
        },
        url: "/DataImport/TaskPlanRepot/ExportTaskPlanPercentage",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=人员拜访率统计报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})





