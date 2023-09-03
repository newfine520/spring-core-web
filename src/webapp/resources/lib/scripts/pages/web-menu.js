$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/System/WebMenu/GetDataList",
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
                field: 'SubAreaId',
                formatter: 'actionFormatter',
                events: 'areaOperate',
                width: "80px"
            },
            {
                field: 'ModuleName',
                title: '模块名称'
            }, {
                field: 'MenuName',
                title: '菜单名称'
            }, {
                field: 'MenuUrl',
                title: '菜单地址'
            },

        ],
    });

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    });
    
});
window.areaOperate = {
    'click .edit': function (e, value, row, index) {
            $("#btnUpdate").show();
            $("#btnAdd").hide();
            $("#myModal").modal({ backdrop: 'static', keyboard: false });
            $("#ModuleName").val(row.ModuleName);
            $("#MenuName").val(row.MenuName);
            $("#MenuUrl").val(row.MenuUrl);
            $("#ModuleId").val(row.ModuleId);
            $("#MenuId").val(row.MenuId);
    }
}
function queryParams(params) {
    return {
        ModuleName: $("#txtModule").val(),
        MenuName: $("#txtMenu").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="edit" data-role="Admin" title="编辑">编辑</a>'
    return results;
}
var areaForm = $("#areaForm");
areaForm.validate({
    rules: {

        txtModule: {
            required: true
        },
        txtMenu: {
            required: true
        }

    },
    messages: {

        txtModule: {
            required: "请输入模块名称",
        },
        txtMenu: {
            required: "请输入菜单名称",
        }

    }
})
$("#btnAddShow").on("click", function () {
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#areaForm").find(".form-control").val('');
})


$("#btnAdd").on("click", function () {
    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/WebMenu/AddWebMenu',
            data: areaForm.serializeToJson(),
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
})


$("#btnUpdate").on("click", function () {

    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/WebMenu/UpdateWebMenu',
            data: areaForm.serializeToJson(),
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
})

function checkAll($this) {
    var _this = $($this);
    if (_this.is(":checked")) {
        $('#dataTable').bootstrapTable("checkAll");

    }
    else {
        $('#dataTable').bootstrapTable("uncheckAll");
        $("#UserIds").val('')
    }
};