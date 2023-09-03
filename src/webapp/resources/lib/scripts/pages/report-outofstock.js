$(function () {
    $(".select2").select2();
    
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    //$(".datepicker").val(defaultYearMonthDate)
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    var columns = [
        //{
        //    title: '操作',
        //    //field: 'StoreId',
        //    formatter: operateFormatter,
        //    events: 'operateEvents'
        //},
        {
            field: '大区',
            title: '大区'
        },
        {
            field: '小区',
            title: '小区'
        },
        {
            field: '省份',
            title: '省份'
        },
        {
            field: '城市',
            title: '城市'
        },
        {
            field: '渠道',
            title: '渠道'
        },
        {
            field: '系统名称',
            title: '系统名称'
        },
        {
            field: '商店代码',
            title: '商店代码'
        },
        {
            field: '商店名称',
            title: '商店名称'
        },
        {
            field: '负责门店负责人',
            title: '负责门店负责人',
        },
        {
            field: '报告日期',
            title: '报告日期'
        },
        {
            field: '门店缺货sku序号',
            title: '门店缺货sku序号'
        },
        {
            field: '品牌',
            title: '品牌'
        },
        {
            field: '产品品类',
            title: '产品品类'
        },
        {
            field: '产品代码',
            title: '产品代码'
        },
        {
            field: '产品描述',
            title: '产品描述'
        },
        {
            field: '缺货天数',
            title: '缺货天数'
        },
        {
            field: '本周能否解决',
            title: '本周能否解决'
        },
        {
            field: '缺货原因',
            title: '缺货原因'
        },
        {
            field: '是否是海报SKU',
            title: '是否是海报SKU'
        },
    ];

    $('#dataTable').bootstrapTable({
        url: "/DataImport/ReportOutofStock/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });

})
function queryParams(params) {
    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        BeginTime: $("#BeginTime").val(),
        EndTime:$("#EndTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            BeginTime: $("#BeginTime").val(),
            EndTime: $("#EndTime").val(),
        },
        url: '/DataImport/ReportOutofStock/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=缺货报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})