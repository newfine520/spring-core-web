$(function () {
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN',
    });

    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreSellPlan/GetStoreSellUserList",
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
            },{
                field: 'UserName',
                title: '姓名'
            }, {
                field: 'UserMobile',
                title: '用户手机号'
            }, {
                field: 'strTrainingBegin',
                title: '培训开始时间',
            },{
                field: 'strTrainingEnd',
                title: '培训结束时间',
            },{
                field: 'StoreName',
                title: '所属门店'
            }
        ],
    });

    
})


function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        TrainingBegin: $("#StoreSellTrainTimeSta").val(),
        TrainingEnd: $("#StoreSellTrainTimeEnd").val(),
        IsPage: true,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

