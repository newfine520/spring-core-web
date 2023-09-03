$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    //$("#selCirclyDate").val(getNowTime());
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    //$(".datepicker").datepicker({
    //    format: "yyyy-mm-dd",
    //    autoclose: true,
    //    todayBtn: 'linked',
    //});
    //var dd = new Date();
    //var y = dd.getFullYear();
    //var m = dd.getMonth() + 1;
    //var d = dd.getDate();
    //$("#ShelvesTimeSta").val(y + "-" + m + "-" + d);
    //$("#ShelvesTimeEnd").val(y + "-" + m + "-" + d);
    $(".select2").select2();

$('#dataTable').bootstrapTable({
    url: "/DataImport/BlackPointInformation/GetDataList",
    pagination: "true",
    queryParams: queryParams,
    sidePagination: 'server',
    onPostBody: function () {
        RenderRoleButton();
    },
    clickToSelect: true,
    columns: [
        {
           
            field: 'area_name',
            title: '大区'
        }, {
            field: 'sub_area_name',
            title: '小区'
        }, {
            title: '省份',
            field: 'ProvinceName',
        }, {
            title: '城市',
            field: 'CityName',
        }, {
            field: 'HenkelStoreCode',
            title: '汉高店铺代码'
        }, {
            field: 'Watsonslnventory',
            title: '屈臣氏店铺代码'
        }, {
            field: 'StoreName',
            title: '店铺名称'
        }, {
            field: 'SellStore',
            title: '销售覆盖门店'
        }, {
            field: 'Brand',
            title: '品牌',
        }, {
            field: 'ItemNumber',
            title: '货号'
        }, {
            field: 'ProductName',
            title: '品名'
        }, {
            field: 'StoreStock',
            title: '门店库存'
        }, {
            field: 'OnWayStock',
            title: '在途库存'
        }, {
            field: 'TTLStock',
            title: 'TTL库存'
        }, {
            field: 'TTLStockAmount',
            title: 'TTL库存金额'
        }, {
            field: 'WeekSellCount',
            title: '周均销售量',
        }, {
            field: 'WeekSellAmount',
            title: '周均销售额'
        }, {
            field: 'LastWeekTurnOver',
            title: '上周周转'
        }, {
            field: 'Status',
            title: '状态'
        }, {
            field: 'DeploymentCount',
            title: '建议调配支数'
        }
    ],
});

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })
})


function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        CategoryType: categoryType.physiology,
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        Brand: $("#Brand").val(),
        ProductName: $("#ProductName").val(),
        ItemNumber: $("#ItemNumber").val(),
        Status: $("#Status").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        Watsonslnventory: $("#Watsonslnventory").val(),
        //Begin: $("#ShelvesTimeSta").val(),
        //End: $("#ShelvesTimeEnd").val()
    };
}


$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            Brand: $("#Brand").val(),
            ProductName: $("#ProductName").val(),
            ItemNumber: $("#ItemNumber").val(),
            Status: $("#Status").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Watsonslnventory: $("#Watsonslnventory").val(),
            //Begin: $("#ShelvesTimeSta").val(),
            //End: $("#ShelvesTimeEnd").val()
        },
        url: '/DataImport/BlackPointInformation/ExportData',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=黑点信息";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})