$(function () {
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    defaultYearMonthDate += (new Date().getMonth() + 1) + "-" + (new Date().getDate());
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $(".select2").select2();
    //$(".datepicker").val(defaultYearMonthDate)
    //loadAllProvince($("#ProvinceCode"), false);
    //changeProvince($("#ProvinceCode"), $("#CityCode"))
    //LoadAllArea($("#Area"))
    //changeArea($("#Area"), $("#SubArea"))
    $('#dataTable').bootstrapTable({
        url: "/DataImport/SingleSalesVolume/GetDataList",
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
                 title: '小区',
             },
            {
                field: 'ProvinceName',
                title: '所在省'
            }, {
                field: 'CityName',
                title: '所在市'
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
                    title: '提报人',
                    field: 'FullInName',
                },
             {
                 title: '产品名称',
                 field: 'ProductName',
             },
             {
                 title: '唯一码',
                 field: 'ProductCode',
             },
             {
                 title: '价格',
                 field: 'SalePrice',
             },
             {
                 title: '备注',
                 field: 'Remark',
             },
              {
                  title: '提报日期',
                  field: 'FullDateString'
              },
        ],
    });
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })

})

function queryParams(params) {
    return {
        //ProvinceId: $("#ProvinceCode").val(),
        //CityId: $("#CityCode").val(),
        //AreaId: $("#Area").val(),
        //SubAreaId: $("#SubArea").val(),
        StoreName: $("#txtStoreName").val(),
        FullDate: $("#FullDate").val(),
        FullInName: $("#txtFullInName").val(),
        StoreNo: $("#txtStoreNo").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}
