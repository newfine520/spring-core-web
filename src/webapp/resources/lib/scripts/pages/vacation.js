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
        url: "/DataImport/Vacation/GetVacationList",
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
                events: 'OperateEvent',
                width: "80px"
            },
            {
                field: 'AreaName',
                title: '大区'
            },
            {
                field: 'SubAreaName',
                title: '省份'
            },
            {
                field: 'StoreNo',
                title: '门店编号'
            },
            {
                field: 'StoreName',
                title: '门店名称'
            },
            {
                field: 'UserNo',
                title: '工号'
            },

            {
                field: 'UserName',
                title: '姓名'
            }, {
                field: 'Type',
                title: '请假类型'
            }, {
                field: 'Status',
                title: '状态'
            }, {
                field: 'StrCreateTime',
                title: '提报时间'
            }, {
                field: 'StrBeginTime',
                title: '开始时间',
            }, {
                field: 'StrEndTime',
                title: '结束时间',
            }, {
                field: 'TimeAll',
                title: '请假时长(小时)',
            }, {
                field: 'Remark',
                title: '备注'
            }
        ],
    });


    $("#VacationStartTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#VacationEndTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
})

function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        Type: $("#txtType").val(),
        StatusCode: $("#txtStatus").val(),
        VacationStartTime: $("#VacationStartTime").val(),
        VacationEndTime: $("#VacationEndTime").val(),
        IsPage: true,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '';
    if (row.Status != '已同意' && row.Status != '已拒绝') {
        if (row.IsAuditUser) {
            results += '<a class="like"onclick=editVacation("' + value + '",1) title="审批">审批</a>'
        }
    } else {
        results += '<a class="like"onclick=editVacation("' + value + '",2) title="已审批">已审批</a>';
    }
    if (row.PhotoName != null && row.PhotoName != "")
    { results += '<a class="photo" title="照片">  照片</a>'; }
    results += '<a class="check ml10" title="审批记录"> 审批记录</a>';
    return results;
}

window.OperateEvent = {
    'click .check': function (e, value, row, index) {
        $.SubAjax({
            type: 'post',
            data: { id: value },
            url: '/Common/ShowAuditProcess',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#AuditModal").modal({ backdrop: 'static', keyboard: false });
                    //data = data.Data;
                    var tpl = $("#tpl1").html();
                    var html = juicer(tpl, data);
                    $("#divShowAudit").html(html);
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        })

    },
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

function editVacation(Id, flag) {
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#divAdd").hide();
    $("#VacationForm").find("label.error").remove();
    $("#VacationForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/Vacation/GetVacationDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#myModal").find('h3').html("请假人：" + data.UserName);
                $("#VacationId").val(Id);
                $("#UserId").val(data.UserId);
                $("#Type").val(data.Type);
                $("#TimeAll").val(data.TimeAll);
                $("#BeginTime").val(data.StrBeginTime);
                $("#EndTime").val(data.StrEndTime);
                $("#Status").val(data.Status);
                $("#Remark").val(data.Remark);
                $("#AuditReason").val(data.AuditReason);
                $(".select2").select2();

            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
    $("#VacationForm").find("input").prop("disabled", true);
    $("#VacationForm").find("select").prop("disabled", true);
    $("#VacationForm").find("textarea").prop("disabled", true);
    if (flag == 1) {
        $("#btnAgree").show();
        $("#btnRefuse").show();
        $("#AuditReason").prop("disabled", false);
    } else if (flag == 2) {
        $("#btnAgree").hide();
        $("#btnRefuse").hide();
    }
}
var VacationForm = $("#VacationForm");
VacationForm.validate({
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
    if (VacationForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Vacation/UpdateVacation',
            data: VacationForm.serializeToJson(),
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

function deleteVacation(Id) {
    parent.layer.confirm('确定删除该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Vacation/DeleteVacation?Id=' + Id,
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
function checkVacation(Id, status) {
    parent.layer.confirm('确定核审该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/Common/ChangeAudit',
            data: {
                Id: Id,
                type: 2000,
                status: status,
                UserId: $("#UserId").val(),
                Days: $("#TimeAll").val(),
                HolidayType: $("#Type").val(),
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
    $("#VacationForm").find(".form-control").val('');
    //重置select
    $("#VacationForm").find(".select2").val('');
    $("#VacationForm").find(".select2").select2();

});
$("#btnAdd").on("click", function () {
    if ($("#UserId").val() == null || $("#UserId").val() == "") {
        $.ShowMessage("warning", "请选择报销人员");
        return false;
    }
    if (VacationForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Vacation/AddVacation',
            data: VacationForm.serializeToJson(),
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
            VacationStartTime: $("#VacationStartTime").val(),
            VacationEndTime: $("#VacationEndTime").val(),
        },
        url: '/DataImport/Vacation/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=请假信息表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

$("#btnAgree").on("click", function () {
    var id = $("#VacationId").val();
    //var userid = $("#UserId").val();
    checkVacation(id, 210);

})
$("#btnRefuse").on("click", function () {
    var id = $("#VacationId").val();
    //var userid = $("#UserId").val();
    checkVacation(id, 220);

})