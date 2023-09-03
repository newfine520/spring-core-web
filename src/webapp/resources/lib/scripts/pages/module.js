$(function ()
{

    $("#SetModuleItemModal").on("hidden.bs.model", function (e) { $(this).removeData(); });

    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/System/Module/GetModuleList",
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
                //field: 'SubAreaId',
                formatter: 'actionFormatter',
                events: 'moduleOperate',
                width: "80px"
            },
            {
                field: 'ModuleCode',
                title: '模块编号'
            }, {
                field: 'ModuleName',
                title: '模块名',
            }, {
                field: 'IsShow',
                title: '是否显示',
                formatter: function (value, row, index) {
                    if (row.IsShow == false) {
                        return "否";
                    } else {
                        return "是";
                    }
                }
            }]
    });
});
function actionFormatter(value, row, index) {

    var results = '<a class="like" onclick=editModule("' + row.Id + '") data-role="Admin" title="编辑"> 编辑</a>'
    results = results + '<a class="like" onclick=setModuleItem("' + row.Id + '") data-role="Admin" title="设置"> 设置</a>'

    results = results + '<a class="like" href = "/System/Module/ModuleItem?id=' + row.Id + '"  title="详情"> 详情</a>'

    
    if (row.IsShow == false) {
        results += '<a  class="showModule" data-role="Admin" title="显示"> 显示</a>';
    } else {
        results += '<a  class="hideModule" data-role="Admin" title="隐藏"> 隐藏</a>';
    }
    return results;
}
window.moduleOperate = {
    'click .check': function (e, value, row, index) {
        //editArea(row.Id
        editArea(value);
        $("#btnUpdate").hide();
        $("#btnAdd").hide();
       
    },
    'click .hideModule': function (e, value, row, index) {
        hideModule(row.Id)
    },
    'click .showModule': function (e, value, row, index) {
        showModule(row.Id)
}
}
function queryParams(params) {
    return {
        ModuleCode: $("#txtModuleCode").val(),
        ModuleName: $("#txtModuleName").val(),
        IsShow: $("#isShow").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
var moduleForm = $("#moduleForm");
moduleForm.validate({
    rules: {

        ModuleCode: {
            required: true
        },
        ModuleName: {
            required: true
        },
    },
    messages: {

        ModuleCode: {
            required: "请输入模块编号",
        },
        ModuleName: {
            required: "请输入模块名",
        },
    }
})

var moduleItemForm = $("#moduleItemForm");
moduleItemForm.validate({
    rules: {

        MIcode: {
            required: true
        },
        MIname: {
            required: true
        },
    },
    messages: {

        MIcode: {
            required: "请输入编号",
        },
        MIname: {
            required: "请输入名称",
        },
    }
})
function hideModule(Id) {
    parent.layer.confirm('确定隐藏该模块吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/System/Module/HideModule',
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

function showModule(Id) {
    parent.layer.confirm('确定显示该模块吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/System/Module/ShowModule',
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

function editModule(Id) {
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#moduleForm").find("label.error").remove();
    $("#moduleForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/System/Module/GetModuleDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#ModuleId").val(Id);
                $("#ModuleCode").val(data.ModuleCode);
                $("#ModuleName").val(data.ModuleName);
                //$("#selShow").val("true");
                if (data.IsShow == false) {
                    $("#selShow").val("false");
                } else {
                    $("#selShow").val("true");
                }
                
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}
function queryItemParams(params) {
    return {
        Id: $("#hidModuleId").val()
    };
}

function setModuleItem(Id) {
    
    $('#moduleDiv').hide();
    $("#MIcode").val("");
    $("#MIname").val("");
    $("#unit").val("");
    $("#sortId").val("");
    $("#hidModuleId").val(Id);
    $("#SetModuleItemModal").modal({ backdrop: 'static', keyboard: false });
    $('#seriesdatatable').bootstrapTable("refresh");
    $('#seriesdatatable').bootstrapTable({
        url: "/System/Module/GetModuleItems",
        pagination: "true",
        queryParams: queryItemParams,
        //{
        //    Id: $("#hidModuleId").val()
        //},
        sidePagination: 'server',
        //onPostBody: function () {
        //    RenderRoleButton();
        //},
        //clickToSelect: true,
        onEditableSave: function (field, row, oldValue, $el) {
            $.ajax({
                type: "post",
                url: "/System/Module/Edit",
                data: { strJson: JSON.stringify(row) },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", data.Msg);
                    }
                },
                error: function () {
                    $.ShowMessage("error", data.Msg)
                },
                complete: function () {
                }
            });
        },
        columns: [

            //{
            //    title: '操作',
            //    //field: 'SubAreaId',
            //    formatter: 'Formatter',

            //},
              {
                  title: '编号',
                  field: 'ItemCode',
                  editable: true
              }, {
                  title: '名称',
                  field: 'ItemName',
                  editable: true
              },
              {
                  title: '单位',
                  field: 'Unit',
                  editable: true
              }, {
                  title: '排序',
                  field: 'SortId',
                  editable: true
              }]
    });
    
}
//$('#SetModuleItemModal').on('hidden.bs.modal', function (e) {
//    alert("!");
//    $(this).removeData(bs.modal);

//})

function Formatter(value, row, index) {
    var results = '<a class="like"onclick=deleteModuleItem("' + row.Id + '") data-role="Admin" title="删除"> 删除</a>'
    return results;
}
function deleteModuleItem(Id) {
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/System/Module/DeleteModuleItem',
        success: function (data) {
            if (data.IsSuccess) {
                $.ShowMessage("success", data.Msg);
                $('#seriesdatatable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}
$("#btnUpdate").on("click", function () {
    var ModuleId = $("#ModuleId").val();
    if (moduleForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/Module/UpdateModule?Id=' + ModuleId,
            data: moduleForm.serializeToJson(),
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
    $("#moduleForm").find(".form-control").val('');
    $("#moduleForm").find(".select2").val('');
    $("#moduleForm").find(".select2").select2();
    
});

$("#btnAdd").on("click", function () {
    if (moduleForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/Module/AddModule',
            data: moduleForm.serializeToJson(),
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
$('#myModal').on('shown.bs.modal', function (e) {
    $(".select2").select2();
})
$("#btnAddMI").on("click", function () {
    var MMid = $("#hidModuleId").val();
    if (moduleItemForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/Module/AddModuleItem?Id=' + MMid,
            data: moduleItemForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#SetModuleItemModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
});

function newModule() {
    $('#moduleDiv').show();
}