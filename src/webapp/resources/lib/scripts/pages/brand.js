$(function () {
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Brand/GetBrand",
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
                title: '品牌名称'
            },
            {
                field: 'strCreateTime',
                title: '创建时间'
            }

        ]
    });
})

function queryParams(params) {
    return {
        brandName: $("#brandName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>',
        '<a class="delete"  data-role="Admin" title="删除" style="margin-left:10px">删除</a>',
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        $("#BrandInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#brandNameEdit").val(row.name);
        $("#brandId").val(row.id);
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    brandId: row.id
                },
                url: '/DataImport/Brand/DeleteBrand',
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

    $.SubAjax({
        type: 'post',
        data: {
            brandId: $("#brandId").val(),
            brandName: $("#brandNameEdit").val()
        },
        url: '/DataImport/Brand/UpdateBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $("#BrandInfoPartialModal").modal('hide');
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
    $("#brandNameEdit").val("");
    $("#BrandInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            brandName: $("#brandNameEdit").val()
        },
        url: '/DataImport/Brand/AddBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $("#BrandInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
