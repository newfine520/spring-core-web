$(function () {
    $('#dataTable').bootstrapTable({
        url: "/DataImport/SalesDataStatistics/GetList",
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
        YearMonthSta: "2018-01-22",
        YearMonthEnd: "2018-02-23",
        Area: "-1",
        SubArea: "-1",
        Province: "-1",
        City: "-1",
        Distributor: "-1",
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

