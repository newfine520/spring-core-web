$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/SubBrand/GetSubBrand",
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
            }, {
                field: 'name',
                title: '二级品牌名称'
            }, {
                field: 'brandName',
                title: '品牌名称'
            }, {
                field: 'isGiftString',
                title: '是否是赠品'
            }

        ]
    });
})

function queryParams(params) {
    return {
        subBrandName: $("#subBrandName").val(),
        StringIsGift:$("#selIsGift").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    var res = ""
    res += '<a class="edit" data-role="Admin" title="编辑">编辑</a>';
    if (row.isGiftString == "否")
        res += '<a class="delete"  data-role="Admin" title="删除" style="margin-left:10px">删除</a>'

    return res;
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();    
        $("#SubBrandInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#subBrandNameEdit").val(row.name);
        $("#brandIdEdit").val(row.brandId);
        $("#subBrandId").val(row.id);
        if (row.isGiftString == "是")
        {
            $("#isGift1").prop("checked", true);
            $("#isGift2").prop("checked", false);
        }
        else
        {
            $("#isGift1").prop("checked", false);
            $("#isGift2").prop("checked", true);
        }
        $(".select2").select2();
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    subBrandId: row.id
                },
                url: '/DataImport/SubBrand/DeleteSubBrand',
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

$("#btnUpdate").on("click", function () {
    var isValue = $("input[name='isGift']:checked").val();
    $.SubAjax({
        type: 'post',
        data: {
            subBrandId: $("#subBrandId").val(),
            subBrandName: $("#subBrandNameEdit").val(),
            brandId: $("#brandIdEdit").val(),
            StringIsGift: isValue
        },
        url: '/DataImport/SubBrand/UpdateSubBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $("#SubBrandInfoPartialModal").modal('hide');
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
    $("#subBrandNameEdit").val("");
    $("#isGift1").prop("checked", false);
    $("#isGift2").prop("checked", false);
    $("#SubBrandInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {
    var isValue = $("input[name='isGift']:checked").val();
    $.SubAjax({
        type: 'post',
        data: {
            subBrandName: $("#subBrandNameEdit").val(),
            brandId: $("#brandIdEdit").val(),
            StringIsGift: isValue
        },
        url: '/DataImport/SubBrand/AddSubBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $("#SubBrandInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
