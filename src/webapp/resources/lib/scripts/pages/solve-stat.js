$(function () {
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    defaultYearMonthDate += (new Date().getMonth() + 1) + "-" + (new Date().getDate());
    $("#FullDateSta").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        //daysOfWeekDisabled:[2,3,4,5,6,0],
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $("#FullDateEnd").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        //daysOfWeekDisabled: [1,2, 3, 4, 5, 6],
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/OutofStock/GetSolveStatList",
        pagination: false,
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [

            {
                field: 'Week',
                title: '周期',
                formatter(value) {
                    return '第'+value+"周"
                }
            }, {
                field: 'StartDateStr',
                title: '开始时间',
            }, {
                field: 'EndDateStr',
                title: '结束时间'
            }, {
                field: 'Null_Store',
                title: '状态',
                formatter(value) {
                    return value>0?"未解决":"已解决"
                }
            }, {
                field: '',
                title: '统计',
                formatter(value,row) {
                    return '<span style="color:red">未解决：' + row.Null_Store + '</span>家门店 <span style="color:red">' + row.Null_Sku + '</span>个SKU缺货 <br><span>已解决：' + row.Store + '</span>家门店 <span>' + row.Sku + '</span>个SKU缺货'
                }
            }, {
                field: 'Solve_TimeStr',
                title: '反馈更新时间'
            }, {
                field: 'id',
                title: '操作',
                formatter(value,row) {
                    return '<a href="/DataImport/OutofStockReport/Index?FullDate=' + row.StartDateStr + '">查看</a>'
                }
            }
        ],
    });
    $("#btnSearch").on("click", function () {
        var startDate = $("#FullDateSta").val();
        var endDate = $("#FullDateEnd").val();

        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })
})

function queryParams(params) {
    return {
        FullDateSta: $("#FullDateSta").val(),
        FullDateEnd: $("#FullDateEnd").val(),
        date:'2020-10-01'
    };
}