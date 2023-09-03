$(function () {
    $(".select2").select2();
    $("#FullDateSta").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#FullDateSta").val(y + "-" + m + "-" + d)
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        $('#dataTableG').bootstrapTable("destroy");// 破坏原来的表
        LoadDatatable();
    })

})

function queryParams(params) {
    return {
        StoreNo: $("#StoreNo").val(),
        StoreName: $("#StoreName").val(),
        SubBrandId: $("#selSubBrand").val(),
        CirclyDate: $("#FullDateSta").val(),
        SalesType: "800005",
        SkuTypeMark: "800310",
        FormType: "olap",
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="SuperVisionAdmin" title="编辑">编辑</a>',
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#StoreSalesVolumeModal").modal({ backdrop: 'static', keyboard: false });

        $.SubAjax({
            type: 'post',
            data: {
                StoreId: row.storeid,
                SubBrandId: $("#selSubBrand").val(),
                CirclyDate: $("#FullDateSta").val(),
                SkuTypeMark: "800320"
            },
            url: '/DataImport/StoreSalesValume/GetDataItems',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#StoreId").val(row.storeid);
                    var tpl = $("#tpl").html();
                    var html = juicer(tpl, data);
                    $("#SalesVolumeDiv").html(html);

                }
                else {
                    $.ShowMessage("error", "没有配置检测项")
                }
            }
        });
    }
}

$("#btnUpdate").on("click", function () {
    var SalesVolume = [];
    $.each($(".SalesVolumeRow"), function () {
        var ProductId = $(this).find("#ProductId").val();
        var Prices = $(this).find("#PricesDiv").find(".col-sm-9").find("#Prices").val();
        var Counts = $(this).find("#CountsDiv").find(".col-sm-9").find("#Counts").val();
        SalesVolume.push({
            ProductId: ProductId,
            Price: Prices,
            Count: Counts,
        });
    })
    $.SubAjax({
        type: 'post',
        data: JSON.stringify({
            StoreId: $("#StoreId").val(),
            //SubBrandId: $("#selSubBrand").val(),
            CryleDate: $("#FullDateSta").val(),
            SalesType: "800005",
            SalesVolumeList: SalesVolume
        }),
        contentType: "application/json; charset=utf-8",
        url: '/DataImport/StoreSalesVolume/UpdateStoreSalesVolumePC',
        success: function (data) {
            if (data.IsSuccess) {
                $("#StoreSalesVolumeModal").modal('hide')
                $.ShowMessage("success", "保存成功");
                $('#dataTableG').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

$("#btnExport").on("click", function () {
    var Time = $("#FullDateSta").val().toString("yyyy-MM-dd");
    $.SubAjax({
        type: 'post',
        data: {
            StoreNo: $("#StoreNo").val(),
            StoreName: $("#StoreName").val(),
            SubBrandId: $("#selSubBrand").val(),
            CirclyDate: $("#FullDateSta").val(),
            SalesType: "800005",
            SkuTypeMark: "800310"
        },
        url: '/DataImport/StoreSalesValume/ExportStoreSalesVolumeReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=单品销量";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

function LoadDatatable() {

    var columns = [
         {
             title: '操作',
             field: 'StoreId',
             formatter: operateFormatter,
             events: 'operateEvents'
         }, {
             title: '省份',
             field: '省份',
         }, {
            title: '城市',
            field: '城市',
        }, {
            field: '门店编号',
            title: '门店编号',
        }, {
            field: '门店名称',
            title: '门店名称'
        }

    ];


    var get = $.SubAjax({
        type: 'post',
        data: {
            SubBrandId: $("#selSubBrand").val(),
            SkuTypeMark: "800310"
        },
        url: '/DataImport/StoreSalesValume/QuerySkuItems',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    columns.push({
                        title: value.SkuName + '(元)',
                        field: value.SkuId,
                    });
                })

                $('#dataTableG').bootstrapTable({
                    url: "/DataImport/StoreSalesValume/GetDataListDay",
                    pagination: "true",
                    queryParams: queryParams,
                    sidePagination: 'server',
                    onPostBody: function () {
                        RenderRoleButton();
                    },
                    columns: columns,
                });
            }

        }
    })
}