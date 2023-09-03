$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/System/VacationType/GetDataList",
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
                field: 'id',
                formatter: 'actionFormatter',
                events: 'operateEvents',
                width: "100px"
            }, {
                field: 'typeName',
                title: '类型名称'
            }, {
                field: 'vacName',
                title: '参数名称'
            }, {
                formatter: 'isFormatter',
                field: 'isFrozen',
                title: '是否被固化'
            },
            {
                formatter: 'isFormatter',
                field: 'isDeleted',
                title: '是否不可用'
            },
            {
                field: 'StrCreateTime',
                title: '创建时间'
            }
        ]
    });
    $('#dataTable').bootstrapTable("checkAll");


    $('#SubListModal').on('shown.bs.modal', function (e) {

        $('#dataTableSub').bootstrapTable({
            url: "/System/VacationType/GetSubList",
            pagination: "true",
            queryParams: queryParamsSub,
            sidePagination: 'server',
            clickToSelect: true,
            columns: [
                {
                    title: '操作',
                    field: 'id',
                    formatter: 'actionFormatterSub',
                    events: 'operateEvents',
                    width: "100px"
                }, {
                    field: 'vacName',
                    title: '二级类型名称'
                }, {
                    formatter: 'isFormatter',
                    field: 'isFrozen',
                    title: '是否被固化'
                },
                {
                    formatter: 'isFormatter',
                    field: 'isDeleted',
                    title: '是否不可用'
                },
                {
                    field: 'StrCreateTime',
                    title: '创建时间'
                }
            ]
        });
    }).on('hidden.bs.modal', function (e) {
        $("#subTypeCode").val("");
        $('#dataTableSub').bootstrapTable('destroy');

    });

})

function actionFormatter(value, row, index) {
    var res =""
    if (row.isDeleted != true) {
        if (row.isFrozen != true) {
            res += '<a class="edit" data-role="Admin" title="编辑">编辑</a>';
            res += '<a class="delete"  data-role="Admin" title="设为不可用" style="margin-left:10px">设为不可用</a>';
            if (row.typeCode == "30082") {
                res += '<a class="up" data-role="Admin" title="上移" style="margin-left:10px">上移</a>';
                res += '<a class="down" data-role="Admin" title="下移" style="margin-left:10px">下移</a>';
            }
        } else {
            res = "固化";
        }
    } else {
        res = "不可用";
    }
    res += '<a class="subList" data-role="Admin" title="二级列表" style="margin-left:10px">二级列表</a>'

    return res;
}

function actionFormatterSub(value, row, index) {
    var res = ""
    if (row.isDeleted != true) {
        if (row.isFrozen != true) {
            res += '<a class="editSub" data-role="Admin" title="编辑">编辑</a>';
            res += '<a class="delete"  data-role="Admin" title="设为不可用" style="margin-left:10px">设为不可用</a>';
        }
    } else {
        res = "不可用";
    }
    return res;
}

function isFormatter(value, row, index) {   
    return value == true ? "是": "否";
}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#vacName").val(row.vacName);
        $("#vacId").val(row.id);
        $("#vacTypeCode").val(row.typeCode);
        $("#vacTypeCode").prop("disabled", true);
        $(".select2").select2();
        $("#VacTypePartialModal").modal({ backdrop: 'static', keyboard: false });

    },

    'click .editSub': function (e, value, row, index) {
        $("#subVacName").val(row.vacName);
        $("#subId").val(row.id);
        $("#SubTypePartialModal").modal({ backdrop: 'static', keyboard: false });        
    },

    'click .subList': function (e, value, row, index) {
        $("#subTypeCode").val(row.typeCode);
        $("#subTypeName").val(row.typeName);
        $("#subParamterCode").val(row.vacCode);
        $("#SubListModal").modal({ backdrop: 'static', keyboard: false });
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认设为不可用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    vacId: row.id
                },
                url: '/System/VacationType/DeleteParam',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "设置成功");
                        $('#dataTable').bootstrapTable("refresh");
                        $('#dataTableSub').bootstrapTable("refresh");
                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    },
    'click .up': function (e, value, row, index) {
        $.SubAjax({
            type: 'post',
            data: {
                id: value
            },
            url: '/System/VacationType/upParam',
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", "设置成功");
                    $('#dataTable').bootstrapTable("refresh");
                    $('#dataTableSub').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
        layer.closeAll('dialog');
    },
    'click .down': function (e, value, row, index) {
        $.SubAjax({
            type: 'post',
            data: {
                id: value
            },
            url: '/System/VacationType/downParam',
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", "设置成功");
                    $('#dataTable').bootstrapTable("refresh");
                    $('#dataTableSub').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
        layer.closeAll('dialog');
    }


}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

function queryParamsSub(params) {
    return {
        typeCode: $("#subTypeCode").val(),
        paramterCode: $("#subParamterCode").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


function queryParams(params) {
    return {
        typeCode: $("#typeCode").val(),
        parameterName: $("#txtVaName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

$("#btnAdd").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            typeCode: $("#vacTypeCode").val(),
            vacId: $("#vacId").val(),
            parameterName: $("#vacName").val()
        },
        url: '/System/VacationType/UpdateParam',
        success: function (data) {
            if (data.IsSuccess) {
                $("#VacTypePartialModal").modal('hide');
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
    $("#vacName").val("");
    $("#vacId").val("");
    $("#vacTypeCode").val("");
    $("#vacTypeCode").prop("disabled", false)
    $(".select2").select2();
    $("#VacTypePartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnSubNew").on("click", function () {
    //$("#subEditTypeCode").val($("#subTypeCode").val());
    $("#subId").val("");
    $("#subVacName").val("");
    //$("#subEditParamCode").val($("#subParamterCode").val(""));
    $("#SubTypePartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnSubAdd").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            typeCode: $("#subTypeCode").val(),
            typeName: $("#subTypeName").val(),
            vacId: $("#subId").val(),
            parameterName: $("#subVacName").val(),
            parameterCode: $("#subParamterCode").val()
        },
        url: '/System/VacationType/UpdateSub',
        success: function (data) {
            if (data.IsSuccess) {
                $("#SubTypePartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTableSub').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

$("#typeCode").change(function () {
    $('#dataTable').bootstrapTable("refresh");
});