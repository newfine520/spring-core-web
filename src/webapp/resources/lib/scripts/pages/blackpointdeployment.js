$(function () {
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    //changeACity($("#CityCode"), $("#Area"))
    LoadAllArea($("#Area"));
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
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    });
    $("#btnDetailSearch").on("click", function () {
        $('#detailTable').bootstrapTable("refresh");
    });


});


$('#dataTable').bootstrapTable({
    url: "/DataImport/BlackPointDeploymentRecord/GetDeploymentRecordList",
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
            field: 'DeploymentId',
            formatter: 'actionFormatter',
            events: 'viewDeploymentDetail',
            width: "80px"
        }, {
            field: 'CreateTime',
            title: '调配日期'
        }, {
            field: 'FMStoreName',
            title: '转出门店名称'
        }, {
            field: 'FMHanStoreCode',
            title: '转出门店汉高代码'
        }, 
        {
            field: 'FMWastonStoreCode',
            title: '转出门店屈臣氏代码'
        },{
            field: 'FMLargeArea',
            title: '所在大区'
        }, {
            field: 'FMProvince',
            title: '所在省'
        }, {
            field: 'FMCity',
            title: '所在城市'
        }, {
            field: 'StoreChain',
            title: '系统'
        }, {
            field: 'StoreType',
            title: '门店类型'
        }, {
            field: 'StoreLevel',
            title: '门店等级'
        }, {
            field: 'StoreDefinition',
            title: '门店定义'
        }, {
            field: 'StoreChannel',
            title: '渠道'
        }, {
            field: 'StoreStatus',
            title: '门店状态'
        }, {
            field: 'Creater',
            title: '提交人'
        }, {
            field: 'TGStoreName',
            title: '收货门店'
        },
        {
            field: 'TGWastonStoreCode',
            title: '收货门店屈臣氏代码'
        }, {
            field: 'SumDeploymentCount',
            title: '总调配数量'
        }, {
            field: 'SumTotalAmount',
            title: '总零售额'
        }
    ]
});

//导出
$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            FMStoreName: $('#FMStoreName').val(),
            FMHanStoreCode: $('#FMHanStoreCode').val(),
            FMWastonStoreCode: $('#FMWastonStoreCode').val(),
            TGStoreName: $('#TGStoreName').val(),
            TGHanStoreCode: $('#TGHanStoreCode').val(),
            TGWastonStoreCode: $('#TGWastonStoreCode').val(),
            LargeArea: $('#Area').val(),
            CityCode: $('#CityCode').val(),
            ProvinceCode: $('#ProvinceCode').val(),
            //Brand: $('#Brand').val(),
            //ProductName: $('#ProductName').val(),
            //ItemNumber: $('#ItemNumber').val(),
            RecordTimeSta: $('#RecordTimeSta').val(),
            RecordTimeEnd: $('#RecordTimeEnd').val()
        },
        url: '/DataImport/BlackPointDeploymentRecord/ExportDeploymentRecordList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=黑点货品调配信息";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function actionFormatter(value, row, index) {
    var results = '';
    if (row.DeploymentId !== null && row.DeploymentId !== "") {
        results += '<a class="check ml10" title="明细"> 明细</a>';
    }

    if (row.DeploymentImgPath !== null && row.DeploymentImgPath !== "") {
        results += '<a class="photo" title="照片">  照片</a>';
    }
    return results;
}

window.viewDeploymentDetail = {

    'click .check': function (e, value, row, index) {
        $("#DeploymentRecordId").val(row.DeploymentId);
        $("#Brand").val("");
        $('#ProductName').val(""),
        $('#ItemNumber').val(""),
        $('#detailTable').bootstrapTable("refresh");
        $("#DetailModal").modal({ backdrop: 'static', keyboard: false });

    },
    'click .photo': function (e, value, row, index) {
        $("#PhotoModal").modal({ backdrop: 'static', keyboard: false });

        var data = { list: row.DeploymentImgPath };
        var tpl = $("#tpl").html();
        var html = juicer(tpl, data);
        $("#divShowImgs").html(html);
        $('.fancybox').fancybox({
            openEffect: 'none',
            closeEffect: 'none'
        });
            
        
    }
};
//调配记录查询参数
function queryParams(params) {
    return {
        FMStoreName: $('#FMStoreName').val(),
        FMHanStoreCode: $('#FMHanStoreCode').val(),
        FMWastonStoreCode: $('#FMWastonStoreCode').val(),
        TGStoreName: $('#TGStoreName').val(),
        TGHanStoreCode: $('#TGHanStoreCode').val(),
        TGWastonStoreCode: $('#TGWastonStoreCode').val(),
        LargeArea: $('#Area').val(),
        CityCode: $('#CityCode').val(),
        ProvinceCode: $('#ProvinceCode').val(),
        RecordTimeSta: $('#RecordTimeSta').val(),
        RecordTimeEnd: $('#RecordTimeEnd').val(),
        PageSize: params.limit, //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）        };
    };
}

//调配明细查询参数
function queryDetailParams(params) {
    return {
        DeploymentId: $('#DeploymentRecordId').val(),
        Brand: $('#Brand').val(),
        ProductName: $('#ProductName').val(),
        ItemNumber: $('#ItemNumber').val(),
        PageSize: params.limit, //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）       
    };
}


$('#DetailModal').on('shown.bs.modal', function (e) {

    $("#detailTable").bootstrapTable({
        url: "/DataImport/BlackPointDeploymentRecord/GetDeploymentRecordDetail",
        pagination: "true",
        queryParams: queryDetailParams,
        sidePagination: 'server',
        //onPostBody: function () {
        //    RenderRoleButton();
        //},
        clickToSelect: true,
        columns: [
            {
                field: 'ProductName',
                title: '品名'
            }, {
                field: 'ItemNumber',
                title: '货号'
            }, {
                field: 'DeploymentCount',
                title: '调配数量'
            }, {
                field: 'TotalAmount',
                title: '总零售额'
            }
        ]
    });
})

