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
        url: "/DataImport/Overtime/GetOvertimeList",
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
            },
            {
                field: 'Type',
                title: '加班类型'
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
                field: 'WorkTime',
                title: '加班时长(小时)',
            }, {
                field: 'Reason',
                title: '加班原因'
            },
        ],
    });
    $("#OverTimeStartTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#OverTimeEndTime").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
})

function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        StatusCode: $("#txtStatus").val(),
        IsPage: true,
        OverTimeStartTime: $("#OverTimeStartTime").val(),
        OverTimeEndTime: $("#OverTimeEndTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    //var results = '<a class="like"onclick=editOverTime("' + value + '") data-role="Admin" title="编辑">编辑</a>';
    //results += '<a class="delete" onclick=deleteOverTime("' + value + '")  title="删除"> 删除</a>';
    var results = '';
    if (row.Status != '已同意' && row.Status != '已拒绝') {
        //if (row.EnterpriseUser == 'tyson') {
            if (row.IsAuditUser) {
                results += '<a class="like"onclick=editOverTime("' + value + '",1) title="审批">审批</a>'
            }
        //    else {
        //        results += '<a class="like"onclick=editOverTime("' + value + '",1) data-role="ADMIN" title="审批">审批</a>'
        //    }
        //} else {
        //    results += '<a class="like"onclick=editOverTime("' + value + '",1) title="审批">审批</a>'
        //}
        
        //results += '<a class="check" onclick=checkOverTime("' + value + '",210)  title="同意"> 同意</a>';
        //results += '<a class="check" onclick=checkOverTime("' + value + '",220)  title="拒绝"> 拒绝</a>';
    } else {
        results += '<a class="like"onclick=editOverTime("' + value + '",2)  title="已审批">已审批</a>';

    }
    if (row.PhotoName != null && row.PhotoName != "")
    { results += '<a class="photo" title="照片">  照片</a>'; }
    results += '<a class="check ml10" title="审批记录"> 审批记录</a>';
    //results += '<a class="check ml10" href="javascript:void(0)"title="查看"> 查看</a>';
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
function editOverTime(Id, flag) {
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#divAdd").hide();
    $("#OverTimeForm").find("label.error").remove();
    $("#OverTimeForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/OverTime/GetOverTimeDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#myModal").find('h3').html("姓名：" + data.UserName);
                $("#OverTimeId").val(Id);
                $("#Type").val(data.TypeCode);
                $("#WorkTime").val(data.WorkTime);
                $("#BeginTime").val(data.StrBeginTime);
                $("#EndTime").val(data.StrEndTime);
                $("#Status").val(data.Status);
                $("#Reason").val(data.Reason);
                $("#AuditReason").val(data.AuditReason);
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
    $("#OverTimeForm").find("input").prop("disabled", true);
    $("#OverTimeForm").find("select").prop("disabled", true);
    $("#OverTimeForm").find("textarea").prop("disabled", true);

    if (flag == 1) {
        $("#btnAgree").show();
        $("#btnRefuse").show();
        $("#AuditReason").prop("disabled", false);
    } else if (flag == 2) {
        $("#btnAgree").hide();
        $("#btnRefuse").hide();
    }
}
var OverTimeForm = $("#OverTimeForm");
OverTimeForm.validate({
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
    if (OverTimeForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/OverTime/UpdateOverTime',
            data: OverTimeForm.serializeToJson(),
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

function deleteOverTime(Id) {
    parent.layer.confirm('确定删除该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/OverTime/DeleteOverTime?Id=' + Id,
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
function checkOverTime(Id, status) {
    parent.layer.confirm('确定核审该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/Common/ChangeAudit',
            data: {
                Id: Id,
                Type: 2001,
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
    $("#OverTimeForm").find(".form-control").val('');
    //重置select
    $("#OverTimeForm").find(".select2").val('');
    $("#OverTimeForm").find(".select2").select2();

});
$("#btnAdd").on("click", function () {
    if ($("#UserId").val() == null || $("#UserId").val() == "") {
        $.ShowMessage("warning", "请选择报销人员");
        return false;
    }
    if (OverTimeForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/OverTime/AddOverTime',
            data: OverTimeForm.serializeToJson(),
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
            StatusCode: $("#txtStatus").val(),
            OverTimeStartTime: $("#OverTimeStartTime").val(),
            OverTimeEndTime: $("#OverTimeEndTime").val()
        },
        url: '/DataImport/Overtime/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=加班信息表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
$("#btnAgree").on("click", function () {
    var id = $("#OverTimeId").val();
    checkOverTime(id, 210);

})
$("#btnRefuse").on("click", function () {
    var id = $("#OverTimeId").val();
    checkOverTime(id, 220);

})