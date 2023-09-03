$(function () {
    $("#selDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#selDate").val(getNowTime());
    var columns = [
        {
        field: 'store_no',
        title: '门店编号'
        },
        {
            field: 'store_name',
            title: '门店名称'
        },
        {
            field: 'c_name',
            title: '提报人'
        },
        {
            field: 'user_name',
            title: '店员'
        }];
    $.SubAjax({
        type: 'post',
        url: '/System/Module/QueryModuleItemName',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    //var subBrandName = value.Name;
                    columns.push({
                        title: value,
                        field: value,
                    });
                })
            }
        }})
    $('#dataTable').bootstrapTable({
        url: "/System/Module/GetModuleItemList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns:columns

    });
})
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
});
function queryParams(params) {
    return {
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        Date:$("#selDate").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function getNowTime() {
    var sen = new Date();
    sen = sen.getFullYear() + "-" + (sen.getMonth() + 1) + "-" + sen.getDate();
    return sen;
}

