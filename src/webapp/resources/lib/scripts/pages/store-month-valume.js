$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }
    $("#selCirclyDate").val(defaultYearMonthDate);
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));

    LoadDatatable();
    $("#btnSearch").on("click", function () {
        if ($("#selCirclyDate").val() == null || $("#selCirclyDate").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择日期！");
            return false;
        }
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
    })
  
    $("#selCirclyDate").datepicker({ format: 'yyyy-mm', autoclose: true, minViewMode: 1, });
    $("#btnSearch").on("click", function () {
        if ($("#selCirclyDate").val() == null || $("#selCirclyDate").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择日期！");
            return false;
        }
        $('#dataTable').bootstrapTable("refresh");
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
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        CirclyDate: $("#selCirclyDate").val(),
        SalesCycle: 4001,
        SubBrandId: $("#selSubBrand").val(),
        SkuTypeMark: "800310"
    };
}


$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            CirclyDate: $("#selCirclyDate").val(),
            SalesCycle: 4001,
            SubBrandId: $("#selSubBrand").val(),
            SkuTypeMark: "800310"
        },
        url: '/DataImport/StoreMonthValume/ExportStoreSalesValume',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=销量提报月报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function getNowTime() {
    var sen = new Date();
    sen = sen.getFullYear() + "-" + (sen.getMonth() + 1) + "-" + sen.getDate();
    return sen;
}

function LoadDatatable() {
    var columns = [
        {
        //    title: '操作',
        //    field: 'StoreId',
        //    formatter: operateFormatter,
        //    events: 'operateEvents'
        //}, {
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
            field: 'StoreNo',
            title: '门店编号',
        }, {
            field: 'StoreName',
            title: '门店名称'
        }, {
            field: 'UserName',
            title: '店员'
        }, {
            field: 'CreateName',
            title: '提报人'
        }, {
            field: 'volumetotal',
            title: '总销量(元)'
        }
    ];

    var get = $.SubAjax({
        type: 'post',
        data: {
            SubBrandId: $("#selSubBrand").val(),
            SkuTypeMark: "800310"
        },
        url: '/Common/GetSubBrandSkuIds',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    columns.push({
                        title: value.SkuName + '(元)',
                        field: value.SkuId,
                    });
                })
                $('#dataTable').bootstrapTable({
                    url: "/DataImport/StoreMonthValume/GetDataList",
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