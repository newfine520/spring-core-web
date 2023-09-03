$(function () {
    $('#dataTable').bootstrapTable({
        url: "/System/PCPower/GetRole",
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
})

function queryParams(params) {
    return {
        positionName: $("#positionName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    var res = ""
        res += '<a class="edit" data-role="Admin,AREAADMIN,SUPERVISION" title="编辑">权限设置</a>';
    return res;
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
        $("#positionNameEdit").val(row.name);
        editAssem(row);
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    roleId: row.id
                },
                url: '/System/PCPower/DeleteBrand',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "删除成功");
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

function editAssem(row) {

    var setting = {
        check: {
            enable: true,

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

    $.SubAjax({
        type: 'post',
        data: { positionId: row.id },
        url: '/System/PCPower/GetAssem',
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
        arr.push(-1)
    }

    $.SubAjax({
        type: 'post',
        data: {

            list: arr,
            positionId: $("#positionId").val(),
        },
        url: '/System/PCPower/UpdateRoleMenu',
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

