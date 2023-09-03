$(function () {
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Role/GetRole",
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
                field: 'Id',
                formatter: 'operateFormatter',
                events: 'operateEvents',
                width: "100px"
            },
            {
                field: 'name',
                title: '角色名称'
            },
            {
                field: 'enName',
                title: '英文名称'
            },
            {
                field: 'sysName',
                title: '系统名称'
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
        roleName: $("#roleName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    var res = ""
    if (row.IsFrozen != true) {
        res += '<a class="edit" data-role="Admin" title="编辑">编辑</a>';
        if (row.IsDisableString == "是")
            res += '<a class="Disable" data-role="Admin" title="禁用"> 禁用</a>';
        else
            res += '<a class="Enabled" data-role="Admin" title="启用"> 启用</a>';
    } else {
        res = "固化";
    }
    return res;
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        $("#RoleInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#roleNameEdit").val(row.name);
        $("#enNameEdit").val(row.enName);
        $("#sysNameEdit").val(row.sysName);
        $("#roleId").val(row.id);

    },
    'click .Disable': function (e, value, row, index) {
        parent.layer.confirm('确认禁用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    roleId: row.id,
                    IsDisable: true
                },
                url: '/DataImport/Role/EnabledOrDisableRole',
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
                    roleId: row.id,
                    IsDisable: false
                },
                url: '/DataImport/Role/EnabledOrDisableRole',
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

    $.SubAjax({
        type: 'post',
        data: {
            roleId: $("#roleId").val(),
            roleName: $("#roleNameEdit").val(),
            enName: $("#enNameEdit").val(),
            sysName: $("#sysNameEdit").val(),
        },
        url: '/DataImport/Role/UpdateRole',
        success: function (data) {
            if (data.IsSuccess) {
                $("#RoleInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");

            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

$("#btnNew").on("click", function () {
    $(".select2").select2();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#roleNameEdit").val("");
    $("#enNameEdit").val("");
    $("#sysNameEdit").val("");
    $("#RoleInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            roleName: $("#roleNameEdit").val(),
            enName: $("#enNameEdit").val(),
            sysName: $("#sysNameEdit").val()
        },
        url: '/DataImport/Role/AddRole',
        success: function (data) {
            if (data.IsSuccess) {
                $("#RoleInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
