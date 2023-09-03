$(function () {
    
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Position/GetPosition",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                title: '操作',
                field: 'PositionId',
                formatter: 'operateFormatter',
                events: 'operateEvents',
                width: "100px"
            },
            {
                field: 'name',
                title: '职位名称'
            },
            {
                field: 'RoleName',
                title: '挂靠角色'
            },
            {
                field: 'IsDisableString',
                title: '是否启用'
            }

        ]
    });
})

function queryParams(params) {
    return {
        PositionName: $("#selPositionName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


//var positionForm = $("#PositionForm");
//positionForm.validate({
//    rules: {
//        PositionName: {
//            required: true
//        },
//        RoleType: {
//            required: true
//        }
//    },
//    messages: {
//        PositionName: {
//            required: "请输入职位名称",
//        },
//        RoleType: {
//            required: "请选择角色",
//        }
//    }
//})

function operateFormatter(value, row, index) {
    var res = ""
        res += '<a class="edit" data-role="Admin" title="编辑">编辑</a>';
        if (row.IsDisableString == "是")
            res += '<a class="Disable" data-role="Admin" title="禁用"> 禁用</a>';
        else
            res += '<a class="Enabled" data-role="Admin" title="启用"> 启用</a>';
    return res;
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        $("#PositionInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#PositionName").val(row.name);
        $("#PositionId").val(row.PositionId);
        $("#RoleType").val(row.RoleCode);
        $(".select2").select2();

    },
    'click .Disable': function (e, value, row, index) {
        parent.layer.confirm('确认禁用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    PositionId: row.PositionId,
                    IsDisable: true
                },
                url: '/DataImport/Position/EnabledOrDisablePosition',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "保存成功");
                        $('#dataTable').bootstrapTable("refresh");

                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    },
    'click .Enabled': function (e, value, row, index) {
        parent.layer.confirm('确认启用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    PositionId: row.PositionId,
                    IsDisable: false
                },
                url: '/DataImport/Position/EnabledOrDisablePosition',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "保存成功");
                        $('#dataTable').bootstrapTable("refresh");

                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    }

}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnUpdate").on("click", function () {
    //if (positionForm.valid()) {
        $.SubAjax({
            type: 'post',
            data: {
                PositionId: $("#PositionId").val(),
                PositionName: $("#PositionName").val(),
                RoleCode: $("#RoleType").val()
            },
            url: '/DataImport/Position/UpdatePosition',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#PositionInfoPartialModal").modal('hide');
                    $.ShowMessage("success", "保存成功");
                    $('#dataTable').bootstrapTable("refresh");

                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    //}
})

$("#btnNew").on("click", function () {
    $(".select2").select2();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#PositionName").val("");
    $("#RoleType").val("");
    $(".select2").select2();
    $("#PositionInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {
    //if (positionForm.valid()) {
        $.SubAjax({
            type: 'post',
            data: {
                PositionName: $("#PositionName").val(),
                RoleCode: $("#RoleType").val()
            },
            url: '/DataImport/Position/AddPosition',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#PositionInfoPartialModal").modal('hide');
                    $.ShowMessage("success", "保存成功");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    //}
})
