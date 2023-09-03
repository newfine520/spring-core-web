$(function () {
    $(".select2").select2();

    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));

    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });
    var dd = new Date();
    dd.setDate(dd.getDate() - 1)
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#BeginFullDate").val(y + "-" + m + "-" + d);
    $("#EndFullDate").val(y + "-" + m + "-" + d);
    $('#dataTable').bootstrapTable({
        url: "/DataImport/PriceBack/QueryAllPrice",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: 'AreaName',
                title: '大区'
            },
            {
                field: 'SubAreaName',
                title: '小区'
            },
            {
                field: 'ProvinceName',
                title: '省份'
            },
            {
                field: 'CityName',
                title: '城市'
            },
            {
                field: 'ChannelName',
                title: '渠道'
            },
            {
                field: 'ChainName',
                title: '系统'
            },
            {
                field: 'DistributorNo',
                title: '经销商编号'
            },
            {
                field: 'DistributorName',
                title: '经销商名称'
            },
            {
                field: 'StoreNo',
                title: '门店编号'
            },
            {
                field: 'StoreName',
                title: '门店名称'
            },
            {
                field: 'subBrandName',
                title: '二级品牌'
            },
            {
                field: 'SkuNo',
                title: 'SKU编号'
            },
            {
                field: 'SkuName',
                title: 'SKU名称'
            },
            {
                field: 'Price',
                title: '单价'
            },
            {
                field: 'ReportUserName',
                title: '提报人'
            },
            {
                field: 'strTime',
                title: '日期'
            }

        ]
    });


})

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            SkuNo: $("#SkuNo").val(),
            SkuName: $("#SkuName").val(),
            StoreNo: $("#StoreNo").val(),
            StoreName: $("#StoreName").val(),
            BeginFullDate: $("#BeginFullDate").val(),
            EndFullDate: $("#EndFullDate").val()
        },
        url: "/DataImport/PriceBack/ExportAllPrice",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=历史单价报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function queryParams(params) {
    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        SkuNo: $("#SkuNo").val(),
        SkuName: $("#SkuName").val(),
        StoreNo: $("#StoreNo").val(),
        StoreName: $("#StoreName").val(),
        BeginFullDate: $("#BeginFullDate").val(),
        EndFullDate: $("#EndFullDate").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

