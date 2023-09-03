var setting = {
    check: {
        enable: true,
        chkboxType: { "N": "ps", "N": "s" }

    },
    view: {
        showIcon: false,
        showLine: false,

    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Power/GetRole",
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
                title: '职位名称'
            }
        ]
    });

    $(":radio").click(function () {
        //var setting = {
        //    check: {
        //        enable: true,

        //    },
        //    view: {
        //        showIcon: false,
        //        showLine: false,

        //    },
        //    data: {
        //        simpleData: {
        //            enable: true
        //        }
        //    }
        //};
        $.SubAjax({
            type: 'post',
            data: {
                positionId: $("#positionId").val(),
                typeString: $(this).val()
            },
            url: '/DataImport/Power/GetAssem',
            success: function (data) {
                if (data.IsSuccess) {
                    var ss = data.Data;
                    var cData = JSON.parse(ss);
                    zNodes = cData;
                    $.fn.zTree.init($("#tree"), setting, zNodes);
                    $("#MenuInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
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
    return [
        '<a class="edit" data-role="Admin,AREAADMIN,SUPERVISION" title="编辑">权限设置</a>',
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        if (($("#queryRoleType").val() == "管理员")) {
            $("#btnUpdate").show();
            $("#btnAdd").hide();
        }
        else {
            $("#btnUpdate").hide();
            $("#btnAdd").hide();
        }
        $("#MenuInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#positionId").val(row.id);
        $("#positionEdit").val(row.name);
        $("#roleNameEdit").val(row.RoleName);
        if (row.RoleCode != '5000490') {
            $("#divTypePow").hide();
            editAssemAdm(row);
        }
        else {
            $("#divTypePow").show();
            editAssem(row);
        }
    },

    //'click .delete': function (e, value, row, index) {
    //    parent.layer.confirm('确认删除？', {
    //        btn: ['确定', '取消'], //按钮
    //        shade: false //不显示遮罩
    //    }, function () {
    //        $.SubAjax({
    //            type: 'post',
    //            data: {
    //                roleId: row.id
    //            },
    //            url: '/DataImport/Power/DeleteBrand',
    //            success: function (data) {
    //                if (data.IsSuccess) {
    //                    $.ShowMessage("success", "删除成功");
    //                    $('#dataTable').bootstrapTable("refresh");
    //                }
    //                else {
    //                    $.ShowMessage("error", data.Msg);
    //                }
    //            }
    //        })
    //        layer.closeAll('dialog');
    //    })
    //}

}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

function editAssemAdm(row) {
    $.SubAjax({
        type: 'post',
        data: { positionId: $("#positionId").val() },
        url: '/DataImport/Power/GetAssemAdm',
        success: function (data) {
            if (data.IsSuccess) {
                $(".select2").select2();
                var ss = data.Data;
                var cData = JSON.parse(ss);
                zNodes = cData;
                $.fn.zTree.init($("#tree"), setting, zNodes);
                $("#MenuInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}


function editAssem(row) {

    //var setting = {
    //    check: {
    //        enable: true,
    //        chkboxType: { "N": "ps", "N": "s" }
    //        //setting.check.chkboxType = { "Y" : "ps", "N" : "s" }

    //    },
    //    view: {
    //        showIcon: false,
    //        showLine: false,

    //    },
    //    data: {
    //        simpleData: {
    //            enable: true
    //        }
    //    }
    //};

    $.SubAjax({
        type: 'post',
        data: { positionId: $("#positionId").val() },
        url: '/DataImport/Power/GetAssem',
        success: function (data) {
            if (data.IsSuccess) {
                if (data.Msg == '走店') {
                    $("#TypePow1").prop("checked", false);
                    $("#TypePow2").prop("checked", true);
                }
                else
                {
                    $("#TypePow1").prop("checked", true);
                    $("#TypePow2").prop("checked", false);
                }
                //$("#TypePow").val(data.Msg);
                $(".select2").select2();
                var ss = data.Data;
                var cData = JSON.parse(ss);
                zNodes = cData;
                $.fn.zTree.init($("#tree"), setting, zNodes);
                $("#MenuInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}

$("#btnUpdate").on("click", function () {

    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getCheckedNodes(true);
    var str = JSON.stringify(nodes);
    var arr = new Array();
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].pId != null) {
            arr.push(nodes[i].id);
        }
    }

    if (arr.length == 0) {
        arr.push(0)
    }

    $.SubAjax({
        type: 'post',
        data: {

            list: arr,
            positionId: $("#positionId").val(),
        },
        url: '/DataImport/Power/UpdateRoleMenu',
        success: function (data) {
            if (data.IsSuccess) {
                $("#MenuInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");

            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})



