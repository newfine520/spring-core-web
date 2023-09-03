$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/System/AppMenu/GetDataList",
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
                field: 'MenuName',
                title: '菜单名称'
            },
            {
                field: 'InStoreType',
                title: '走店/驻店'
            }, {
                field: 'MenuPhotoName',
                title: '图标照片名称'
            }, {
                field: 'AppMenuTypeName',
                title: 'App菜单分类'
            },
            {
                field: 'MenuSort',
                title: '菜单顺序'
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
           // $("#btnAdd").hide();
            $("#myModal").modal({ backdrop: 'static', keyboard: false });
            $("#MenuId").val(row.MenuId);
            $("#MenuName").val(row.MenuName);
            $("#MenuSort").val(row.MenuSort);
            $("#AppMenuType").val(row.AppMenuTypeCode);
            $(".select2").select2();
            if (row.InStoreType == "走店")
                $("#AppMenuType").prop("disabled", true);
            else
                $("#AppMenuType").prop("disabled", false);
            if (row.MenuId == 2)
                $("#MenuName").prop("disabled", true);
            else
                $("#MenuName").prop("disabled", false);
    }
}
function queryParams(params) {
    return {
        // ModuleName: $("#txtModule").val(),AppMenuType
        MenuName: $("#txtMenu").val(),
        ApplicableRange: $("#applicableRange").val(),
        AppMenuType: $("#selAppMenuType").val(),
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
        AppMenuType: {
            required: true
        },
        MenuName: {
            required: true
        },
        MenuSort: {
            required: true
        }

    },
    messages: {
        AppMenuType: {
            required: "请输入菜单名称",
        },
        MenuName: {
            required: "请输入菜单名称",
        },
        MenuSort: {
            required: "请输入菜单顺序",
        }

    }
})


$("#btnUpdate").on("click", function () {

    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/AppMenu/UpdateAppMenu',
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