$(function () {
    $(".select2").select2();

    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));

    changeSubBrand($("#selSubBrand"), $("#SkuNo"));
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#HandInBeginTime").val(y + "-" + m + "-" + d);
    $("#HandInEndTime").val(y + "-" + m + "-" + d);
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreAdvent/GetDataList",
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
                field: 'StockCount',
                title: '到期数量'
            },
            {
                field: 'AdventTimeString',
                title: '到期时间'
            },
            {
                field: 'UserName',
                title: '提报人'
            },
            {
                field: 'HandInTimeString',
                title: '提报日期'
            }

        ]
    });

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    })


  
})



function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        SubBrandId:$("#selSubBrand").val(),
        SkuNo: $("#SkuNo").val(),
        AdventBeginTime: $("#AdventBeginTime").val(),
        AdventEndTime: $("#AdventEndTime").val(),
        HandInBeginTime: $("#HandInBeginTime").val(),
        HandInEndTime: $("#HandInEndTime").val(),
        UserNo: $("#UserNo").val()
    };
}


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
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            SubBrandId: $("selSubBrand").val(),
            SkuNo: $("#SkuNo").val(),
            AdventBeginTime: $("#AdventBeginTime").val(),
            AdventEndTime: $("#AdventEndTime").val(),
            HandInBeginTime: $("#HandInBeginTime").val(),
            HandInEndTime: $("#HandInEndTime").val(),
            UserNo: $("#UserNo").val()
        },
        url: '/DataImport/StoreAdvent/ExportStoreAdvent',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=临期品列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})
