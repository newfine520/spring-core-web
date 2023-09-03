$(function () {
    $(".select2").select2();
    $("#BeginTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#BeginTime").datepicker("setEndDate", $("#EndTime").val());
    });
    $("#EndTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left"
    }).on("click", function (ev) {
        $("#EndTime").datepicker("setStartDate", $("#BeginTime").val());
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Reimbursement/GetReimburseList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                title: '操作',
                field: 'Id',
                formatter: 'actionFormatter',
                //events: 'storeOperate',
                events: 'OperateEvent',
                width: "80px"
            },
            {
                field: 'storeNo',
                title: '门店编号'
            }, {
                field: 'storeName',
                title: '门店名称'
            }, {
                field: 'UserNo',
                title: '工号'
            }, {
                field: 'UserName',
                title: '姓名'
            }, {
            //    field: 'Type',
            //    title: '类型'
            //}, {
                field: 'Status',
                title: '状态'
            }, {
            //    field: 'Destination',
            //    title: '目的地'
            //}, {
                field: 'Total',
                title: '金额'
            }, {
            //    field: 'Reason',
            //    title: '原因'
            //}, {
                field: 'StrCreateTime',
                title: '提报时间'
            }, {
                field: 'StrBeginTime',
                title: '开始时间',
            }, {
                field: 'StrEndTime',
                title: '结束时间',
            }
        ],
    });

    $("#btnUpdateStatus").on("click", function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Reimbursement/ChangeStatus',
            data: {
                Id: $("#statusId").val(),
                Status: $("#EditStatus").val()
            },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myStatusModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
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
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        Type: $("#txtType").val(),
        StatusCode: $("#txtStatus").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '';
    if (row.Status == '未审批' || row.Status == '审批中') {       
        if (row.IsAuditUser == true) {
            results += '<a class="like"onclick=editReimburse("' + value + '",1)  title="审批">审批</a>';
        }
    } else {
        results += '<a class="like"onclick=editReimburse("' + value + '",2) title="已审批">已审批</a>';

    }
    //if (row.Status != '未审批' && row.Status != '已拒绝' && row.Status != '审批中') {
    //    results += '<a class="like"onclick=editStatusReimburse("' + value + '") data-role="Admin" title="跟踪状态"> 跟踪状态</a>';
    //}
    if (row.PhotoName != null && row.PhotoName != "") {
        results += '<a class="photo" title="照片">  照片</a>';
    }
    return results;
}
window.OperateEvent = {
    'click .photo': function (e, value, row, index) {
        $("#PhotoModal").modal({ backdrop: 'static', keyboard: false });
        if (row.PhotoUrl.length > 0) {
            var data = { list: row.PhotoUrl };
            var tpl = $("#tpl").html();
            var html = juicer(tpl, data);
            $("#divShowImgs").html(html);
            $('.fancybox').fancybox({
                openEffect: 'none',
                closeEffect: 'none'
            });
        }
    }
};
function editStatusReimburse(id) {
    $("#statusId").val(id)
    $("#myStatusModal").modal();
}

function editReimburse(Id, flag) {
    //$("#btnUpdate").show();
    //禁用


    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#divAdd").hide();
    $("#ReimburseForm").find("label.error").remove();
    $("#ReimburseForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/Reimbursement/GetReimburseDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#myModal").find('h3').html("报销人：" + data.UserName);
                $("#ReimburseId").val(Id);
                $("#BeginTime").val(data.StrBeginTime);
                $("#EndTime").val(data.StrEndTime);
                $("#Status").val(data.Status);
                $("#Reason").val(data.Reason);
                //$("#Destination").val(data.Destination);
                $("#AuditReason").val(data.AuditReason);
                var tpl1 = $("#tpl1").html();
                var html = juicer(tpl1, data);
                $("#PreviewData").html(html);
                $.each($(".reiDetailSon"), function (index) {
                    $(this).find("#Type").val(data.ReimburseSonList[index].TypeCode)
                })
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
    $("#ReimburseForm").find("input").prop("disabled", true);
    $("#ReimburseForm").find("select").prop("disabled", true);
    $("#ReimburseForm").find("textarea").prop("disabled", true);
    if (flag == 1) {
        $("#btnAgree").show();
        $("#btnRefuse").show();
        $("#AuditReason").prop("disabled", false);
    } else if (flag == 2) {
        $("#btnAgree").hide();
        $("#btnRefuse").hide();
    }
}

var ReimburseForm = $("#ReimburseForm");
ReimburseForm.validate({
    rules: {

        Money: {
            required: true
        },

    },
    messages: {

        Money: {
            required: "请输入金额",
        },

    }
});
$("#btnUpdate").on("click", function () {
    //var Id = $("#AnnouncementId").val();
    var son = [];
    $.each($(".reiDetailSon"), function () {

        var TypeCode = $(this).find("#Type").val();
        var Detail = $(this).find("#Detail").val();
        var Cost = $(this).find("#Cost").val();
        var Remark = $(this).find("#Remark").val();
        var Attach = $(this).find("#Attach").val();
        var SonId = $(this).find("#SonId").val();
        son.push({
            SonId: SonId,
            TypeCode: TypeCode,
            Detail: Detail,
            Cost: Cost,
            Remark: Remark,
            Attach: Attach,
        });

    })
    if (ReimburseForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Reimbursement/UpdateReimburse',
            //data: $.param({ sonReimburseSonList: son }) + '&' + ReimburseForm.serializeToJson(),
            data: {
                ReimburseSonList: son,
                ReimburseId: $("#ReimburseId").val(),
                BeginTime: $("#BeginTime").val(),
                EndTime: $("#EndTime").val(),
                Status: $("#Status").val(),
                //Destination: $("#Destination").val(),
                Reason: $("#Reason").val(),
            },
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

function deleteReimburse(Id) {
    parent.layer.confirm('确定删除该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Reimbursement/DeleteReimburse?Id=' + Id,
            data: { Id: Id },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);

                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
                layer.closeAll('dialog');
            }
        });
    }, function () {
    })
}
function checkReimburse(Id, status) {
    parent.layer.confirm('确定核审该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/Common/ChangeAudit',
            data: {
                Id: Id,
                Type: 2002,
                Status: status,
                AuditReason: $("#AuditReason").val()
            },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
                layer.closeAll('dialog');
            }
        });
    }, function () {
    })
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$("#btnAddShow").on("click", function () {

    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#myModal").find('h3').html("报销信息");
    $("#divAdd").show();
    $("#ReimburseForm").find(".form-control").val('');
    //重置select
    $("#ReimburseForm").find(".select2").val('');
    $("#ReimburseForm").find(".select2").select2();

});
$("#btnAdd").on("click", function () {
    if ($("#UserId").val() == null || $("#UserId").val() == "") {
        $.ShowMessage("warning", "请选择报销人员");
        return false;
    }
    if (ReimburseForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Reimbursement/AddReimburse',
            data: ReimburseForm.serializeToJson(),
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

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#txtUserNo").val(),
            UserName: $("#txtUserName").val(),
            Type: $("#txtType").val(),
            StatusCode: $("#txtStatus").val(),
        },
        url: '/DataImport/Reimbursement/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=报销信息表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
$("#btnAgree").on("click", function () {
    var id = $("#ReimburseId").val();
    checkReimburse(id, 210);

})
$("#btnRefuse").on("click", function () {
    var id = $("#ReimburseId").val();
    checkReimburse(id, 220);

})