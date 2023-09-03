$(function () {
    $(".select2").select2();
    $("#editStartTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: 'linked',
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#editStartTime").datepicker("setEndDate", $("#editEndTime").val());
    });
    $("#editEndTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: 'linked',
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#editEndTime").datepicker("setStartDate", $("#editStartTime").val());
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Question/GetQuestionList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            //{
            //    title: '<input data-index="0" type="checkbox" onClick="checkAll(this)" />',
            //    formatter: function (value, row, index) {
            //        return '<input data-index="0" name="btSelectItem" type="checkbox" value="' + row.Id + '" />'
            //    }
            //},
            {
                title: '操作',
                formatter: 'actionFormatter',
                events: 'questionOperate',
            }, {
                field: 'QuestionWorkType',
                title: '问卷类型'
            }, {
                field: 'QuestionName',
                title: '问卷名称'
            }, {
                field: 'StatusCode',
                title: '问卷状态',
            },
            {
                field: 'PostFrequency',
                title: '提交频次',
            },
            {
                field: 'IsShow',
                formatter: 'showFormatter',
                title: '是否显示题号',
            }
        ],

    });
    $('#myModal').on('shown.bs.modal', function (e) {
        $(".select2").select2();
    })

});
function actionFormatter(value, row, index) {
    var results = '<a class="like" onclick=editQuestion("' + row.Id + '") data-role="Admin" title="编辑">编辑</a>'
    results += '<a class="like"href = "/DataImport/Question/QuestionDetail?Id=' + row.Id + '" data-role="Admin"  title="详情"> 详情</a>'
    results += '<a class="preview"  title="预览"> 预览</a>'
    return results;
}
function showFormatter(value,row,index) {
    return value != 0 ? '是' : '否';
}
window.questionOperate = {
    'click .check': function (e, value, row, index) {
        $("#btnUpdate").hide();
        $("#btnAdd").hide();

    },
    'click .preview': function (e, value, row, index) {
        $.SubAjax({
            type: 'post',
            data: { QuestionId: row.Id, IsShow: row.IsShow == null ? 1 : row.IsShow },
            url: '/DataImport/Question/GetQuestionPreview',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#QuestionPreviewTitle").html(row.QuestionName);  
                    var tpl = $("#tpl").html();
                    var html = juicer(tpl, data);
                    $("#PreviewData").html(html);
                    $("#PreviewDetail").modal();
                    //icheck
                    $('.i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    });
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }

            }
        });
    }


}
function queryParams(params) {
    return {
        Status: $("#StatusCode").val(),
        QuestionName: $("#txtQuesName").val(),
        QuestionWorkType: $("#QuestionWorkType").val(),
        //IsShow: $("#isShow").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
var questionListForm = $("#questionListForm");
questionListForm.validate({
    rules: {
        WorkType: {
            required: true
        },
        QuestionListName: {
            required: true
        },
        Status: {
            required: true
        },
        PostFrequency: {
            required: true
        }
    },
    messages: {
        WorkType: {
            required: "请输入问卷类型",
        },
        QuestionListName: {
            required: "请输入问卷名称",
        },
        Status: {
            required: "请选择问卷状态",
        },
        PostFrequency: {
            required: "请选择提报频次",
        },
    }
})



function editQuestion(Id) {
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#questionListForm").find("label.error").remove();
    $("#questionListForm").find("input.error").removeClass("error");

    //var roleName = '@(((SFA.Service.UserService.Output.UserDescriptOutput)ViewData["CurrentUser"]).RoleNameEns)';
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/Question/GetQuestionListDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#QListId").val(Id);
                $("#QuestionListName").val(data.QuestionName);
                $("#Status").val(data.Status);
                $("#WorkType").val(data.WorkType);
                $("#PostFrequency").val(data.PostFrequency);
                $("#editStartTime").val(data.StrStartTime);
                $("#editEndTime").val(data.StrEndTime);
                $("#isShow").val(data.isshow);
             //   $(".select2").select2();
                $("#Chain").val(data.StoreChainId);
                $("#Channel").val(data.StoreChannelId);
                $("#Distributor").val(data.StoreDistributorId);
                $("#Position").val(data.UserPositionId);
                
            }
            else {
                $.ShowMessage("error", data.Msg)
            }

        }
    });
}


$("#btnUpdate").on("click", function () {
    var QListId = $("#QListId").val();
    $("input[name='WorkType']").val($("#WorkType").val())
    $("input[name='StoreChainId']").val($("#Chain").val())
    $("input[name='StoreChannelId']").val($("#Channel").val())
    $("input[name='StoreDistributorId']").val($("#Distributor").val())
    $("input[name='UserPositionId']").val($("#Position").val())
    if (questionListForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Question/UpdateQuestionList?Id=' + QListId,
            data: questionListForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
});

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$("#btnAddShow").on("click", function () {
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#questionListForm").find(".form-control").val('');
    $("#Status").val("");
    $(".select2").val('');
    $(".select2").select2();


    //$("#Status").empty();
    //$("#Status").find("option[text='请选择']").prop("selected", true);
});

$("#btnAdd").on("click", function () {
    $("input[name='StoreChainId']").val($("#Chain").val())
    $("input[name='StoreChannelId']").val($("#Channel").val())
    $("input[name='StoreDistributorId']").val($("#Distributor").val())
    $("input[name='UserPositionId']").val($("#Position").val())
    if (questionListForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Question/AddQuestionList',
            data: questionListForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
});