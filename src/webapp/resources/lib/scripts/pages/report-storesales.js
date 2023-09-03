$(function () {
    $(".select2").select2();
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN',
    });
    $("#BeginTime").val(getfirstDate);
    $("#EndTime").val(getlastDate);
    
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
            field: '系统',
            title: '系统'
        },
        {
            field: '门店代码',
            title: '门店代码'
        },
        {
            field: '门店名称',
            title: '门店名称'
        },
        {
            field: '当月薪资人数',
            title: '当月薪资人数'
        },
        {
            field: '门店负责人姓名',
            title: '门店负责人姓名',
        },
        {
            field: '店员姓名',
            title: '店员姓名',
        },
        {
            field: '店员联系方式',
            title: '店员联系方式',
        },
        {
            field: '入职日期',
            title: '入职日期',
        },
        {
            field: '离职日期',
            title: '离职日期',
        },
        {
            field: '指标',
            title: '指标(元)'
        },
        {
            field: '达成',
            title: '达成(元)'
        },
        {
            field: '达成率',
            title: '达成率'
        },
        {
            field: '编制备注',
            title: '编制备注'
        },

    ];

    $('#dataTable').bootstrapTable({
        url: "/DataImport/ReportStoreSales/GetDataList",
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
    if ($("#BeginTime").val() == null || $("#EndTime").val().substring(0, 7) == null||
        $("#BeginTime").val() == "" || $("#EndTime").val().substring(0, 7)=="")
    {
        $.ShowMessage("warning", "请选择开始时间和结束时间！");
        return false;
    }
    if ($("#BeginTime").val().substring(0, 7) != $("#EndTime").val().substring(0, 7))
    {
        $.ShowMessage("warning", "结束时间和开始时间需要保持在同一个月内！");
        return false;
    }
    $('#dataTable').bootstrapTable("refresh");
});

$(".export").on("click", function () {
    if ($("#BeginTime").val() ==null || $("#EndTime").val().substring(0, 7)==null||
        $("#BeginTime").val() == "" || $("#EndTime").val().substring(0, 7)=="")
    {
        $.ShowMessage("warning", "请选择开始时间和结束时间！");
        return false;
    }
    if ($("#BeginTime").val().substring(0, 7) != $("#EndTime").val().substring(0, 7)) {
        $.ShowMessage("warning", "结束时间和开始时间需要保持在同一个月内！");
        return false;
    }
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
        url: '/DataImport/ReportStoreSales/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=销量报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
function getfirstDate() {
    var date = new Date();
    if (date.getMonth() + 1 < 10)
    {
        date = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-01";
    } else
    {
        date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-01";
    }
    
    return date;
}
function getlastDate() {
    var date = new Date();
    var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    if (date.getMonth() + 1 < 10) {
        date = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + endDate;
    } else {
        date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + endDate;
    }
    return date;

}