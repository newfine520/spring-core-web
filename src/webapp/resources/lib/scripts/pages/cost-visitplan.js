$(function () {
    $(".select2").select2();
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    var columns = [
        {
            title: '操作',
            field: 'StoreId',
            formatter: operateFormatter,
            events: 'operateEvents'
        },
        {
            field: 'AreaName',
            title: '大区'
        },
        {
            field: 'SubAreaName',
            title: '小区'
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
            field: 'UserName',
            title: '巡店门店负责人',
        },
        {
            field: 'VisitTime',
            title: '巡店日期'
        },
    ];
    $.SubAjax({
        type: 'post',
        url: '/DataImport/VisitCost/GetVisitCostType',
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
        }
    })
    $('#dataTable').bootstrapTable({
        url: "/DataImport/VisitCost/GetDataList",
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
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        BeginTime: $("#BeginTime").val(),
        EndTime: $("#EndTime").val(),
        UserId: $("#selPositionStatusCode").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
});

$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            UserId: $("#selPositionStatusCode").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            BeginTime: $("#BeginTime").val(),
            EndTime: $("#EndTime").val(),
        },
        url: '/DataImport/VisitCost/ExportCostList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=巡店费用列表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin"  title="编辑">编辑</a>'
    ].join('');
}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#VisitCostPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#TaskPlanId").val(row.id);
        $.SubAjax({
            type: 'post',
            data: { TaskPlanId: row.id },
            url: '/DataImport/VisitCost/GetVisitCostDetil',
            success: function (data) {
                if (data.IsSuccess) {
                    data = data.Data;
                    $("#UrbanTrafficCost").val(data.UrbanTrafficCost);
                    $("#IntercityTrafficCost").val(data.IntercityTrafficCost);
                }
                //else {
                //    $.ShowMessage('error', '获取数据失败！')
                //}
            }
        })
    }
}

$("#btnUpdate").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            TaskPlanId: $("#TaskPlanId").val(),
            UrbanTrafficCost: $("#UrbanTrafficCost").val(),
            IntercityTrafficCost:$("#IntercityTrafficCost").val()
        },
        url: '/DataImport/VisitCost/UpdateVisitCost',
        success: function (data) {
            if (data.IsSuccess) {
                $("#VisitCostPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");

            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})