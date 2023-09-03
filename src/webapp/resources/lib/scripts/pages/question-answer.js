$(function () {
    $(".select2").select2();
    $("#StartTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: "linked",
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#StartTime").datepicker("setEndDate", $("#EndTime").val());
    });
    $("#EndTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: "linked",
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#EndTime").datepicker("setStartDate", $("#StartTime").val());
    });

    $('#dataTable').bootstrapTable({
        url: "/DataImport/QuestionAnswer/GetQuestionAnswerList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: [
            {
                title: '操作',
                formatter: 'actionFormatter',
                events: 'questionOperate',
            },{
                field: 'StoreNo',
                title: '门店编号'
            },{
                field: 'StoreName',
                title: '门店名称',
            }, {
                field: 'QuestionName',
                title: '问卷名称',
            }, {
                field: 'QuestionWorkType',
                title: '问卷类型',
            },{
                field: 'UserNo',
                title: '人员工号',
            },{
                field: 'UserName',
                title: '人员姓名',
            },{
                field: 'Status',
                title: '问卷状态',
            },{
                field: 'StrCreateTime',
                title: '提交日期',
            },
        ],

    });
}
);
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});
function queryParams(params)
{
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        QuestionName: $("#QuestionName").val(),
        QuestionWorkType: $("#QuestionWorkType").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };

}
function actionFormatter(value, row, index) {
    
    var results = '<a class="preview"  data-role="Admin" title="预览"> 预览</a>'
    return results;
}
window.questionOperate = {
    'click .preview': function (e, value, row, index) {
        $.SubAjax({
            type: 'post',
            data: {
                questMiddleId: row.Id,
            },
            url: '/DataImport/QuestionAnswer/GetQuestionAnswerPreview',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#QAtitle").html(row.UserName);
                    var tpl = $("#tpl").html();
                    var html = juicer(tpl, data);
                    $("#PreviewData").html(html);
                    $("#PreviewDetail").modal();
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }

            }
        });
    }
}
