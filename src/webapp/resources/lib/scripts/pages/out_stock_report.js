$(function () {
    //获取上周周末
    var lstWeek = getTime(1);

    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    defaultYearMonthDate += (new Date().getMonth() + 1) + "-" + (new Date().getDate());
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
        endDate: lstWeek
    });
    if ($(".datepicker").val() == "") {
        $(".datepicker").val(defaultYearMonthDate);
    }
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))

    //loadAllProvince($("#ProvinceCodeBlack"), false);
    //changeProvince($("#ProvinceCodeBlack"), $("#CityCodeBlack"))
    //LoadAllArea($("#AreaBlack"))
    //changeArea($("#AreaBlack"), $("#SubAreaBlack"))

    $(".select2").select2();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    })
    $("#btnSearchBlack").on("click", function () {
        $('#dataTableBlack').bootstrapTable("refresh");
    })
    $('#dataTable').bootstrapTable({
        url: "/DataImport/OutofStockReport/GetDetailList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                field: 'AreaName',
                title: '大区'
            }, {
                field: 'SubAreaName',
                title: '省份'
            },
            {
                field: 'ProvinceName',
                title: '城市'
            },
            {
                field: 'CityName',
                title: '城市(县级)'
            }
            ,
            {
                field: 'CityLevel',
                title: '城市级别'
            }
            ,
            {
                field: 'ChannelName',
                title: '渠道'
            }
            ,
            {
                field: 'StoreNo',
                title: '门店编号'
            },
            {
                field: 'StoreName',
                title: '门店名称'
            },
            {
                field: 'StoreType',
                title: '门店类型'
            }
            ,
            {
                field: 'StoreDefinition',
                title: '门店定义'
            }
            ,
            {
                field: 'StoreAddress',
                title: '门店地址'
            },
            {
                field: 'SaleUserName',
                title: '销售主管姓名'
            },
            {
                field: 'SaleUserNo',
                title: '销售主管编码'
            },
            {
                field: 'PostUserName',
                title: '上报人'
            },
            {
                field: 'PostUserNo',
                title: '上报人编号'
            },
            {
                field: 'PostPositionName',
                title: '上报人职位'
            },
            {
                field: 'PostTimeStr',
                title: '缺货日期'
            },
            {
                field: 'SubBrandName',
                title: '品牌'
            },
            {
                field: 'SkuUpccode',
                title: '缺货SKU条码'
            },
            {
                field: 'SkuName',
                title: '缺货SKU名称'
            },
            {
                field: 'IsOutName',
                title: '缺货状态'
            },
            {
                field: 'XNum',
                title: '饱和排面数'
            },
            {
                field: 'YNum',
                title: '饱和纵深个数'
            },
            {
                field: 'XYNum',
                title: '饱和数量'
            },
            {
                field: 'SkuPrice',
                title: 'SKU参考价格'
            },
            {
                field: 'SafeNum',
                title: '安全库存'
            },
            {
                field: 'Acount',
                title: '库存'
            },
            {
                field: 'OutOfPrice',
                title: '缺货金额'
            }, {
                field: 'OutWeek',
                title: '缺货周数'
            },
            {
                field: 'SolveStatusName',
                title: '反馈结果'
            },
            {
                field: 'SolveUserName',
                title: '反馈人姓名'
            },
            {
                field: 'SolvePositionName',
                title: '反馈人职位'
            },
            {
                field: 'SolveUserNo',
                title: '反馈人编码'
            },
            {
                field: 'SolveTimeStr',
                title: '反馈时间'
            }
        ]
    });

    //$('#dataTableBlack').bootstrapTable({
    //    url: "/DataImport/OutofStockReport/GetBlackList",
    //    pagination: "true",
    //    queryParams: queryParamsRecord,
    //    sidePagination: 'server',
    //    onPostBody: function () {
    //        RenderRoleButton();
    //    },
    //    columns: [

    //        {
    //            field: 'area_name',
    //            title: '大区'
    //        }, {
    //            field: 'sub_area_name',
    //            title: '小区'
    //        },
    //        {
    //            field: 'ProvinceName',
    //            title: '省份'
    //        },
    //        {
    //            field: 'CityName',
    //            title: '城市'
    //        }
    //        ,
    //        {
    //            field: 'CityLevel',
    //            title: '城市级别'
    //        }
    //        ,
    //        {
    //            field: 'ChannelName',
    //            title: '渠道'
    //        }
    //        ,
    //        {
    //            field: 'StoreNo',
    //            title: '门店编号'
    //        },
    //        {
    //            field: 'StoreName',
    //            title: '门店名称'
    //        },
    //        {
    //            field: 'StoreType',
    //            title: '门店类型'
    //        }
    //        ,
    //        {
    //            field: 'StoreDefinition',
    //            title: '门店定义'
    //        }
    //        ,
    //        {
    //            field: 'address',
    //            title: '门店地址'
    //        },
    //        {
    //            field: 'UserName',
    //            title: '填报人'
    //        },
    //        {
    //            field: 'SubBrandName',
    //            title: '品牌'
    //        },
    //        {
    //            field: 'upccode',
    //            title: '缺货SKU条码'
    //        },
    //        {
    //            field: 'SkuName',
    //            title: '缺货SKU名称'
    //        },
    //        {
    //            field: 'sumWeek',
    //            title: '连续4周缺货周数'
    //        }
    //    ]
    //});

    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                ProvinceId: $("#ProvinceCode").val(),
                CityId: $("#CityCode").val(),
                AreaId: $("#Area").val(),
                SubAreaId: $("#SubArea").val(),
                ChannelId: $("#ChannelId").val(),
                ChainId: $("#ChainId").val(),
                SkuNo: $("#SkuNo").val(),
                StoreName: $("#txtStoreName").val(),
                FullDate: $("#FullDate").val(),
                FullDateEnd: $("#FullDate_End").val(),
                FullInName: $("#txtFullInName").val(),
                StoreNo: $("#txtStoreNo").val(),
                SolveStatus: $("#SolveStatus").val(),
                Week: $("#Week").val()
            },
            url: '/DataImport/OutofStockReport/ExportDetail',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=缺货明细";
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })

    $("#btnBlackExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                ProvinceId: $("#ProvinceCode").val(),
                CityId: $("#CityCode").val(),
                AreaId: $("#Area").val(),
                SubAreaId: $("#SubArea").val(),
                ChannelId: $("#ChannelId").val(),
                ChainId: $("#ChainId").val(),
                SkuNo: $("#SkuNo").val(),
                StoreName: $("#txtStoreName").val(),
                FullDate: $("#FullDate").val(),
                FullDateEnd: $("#FullDate_End").val(),
                FullInName: $("#txtFullInName").val(),
                StoreNo: $("#txtStoreNo").val(),
                SolveStatus: $("#SolveStatus").val(),
                Week: $("#Week").val(),
            },
            url: '/DataImport/OutofStockReport/ExportBlackList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=缺货黑名单";
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })

    $("#btnExportBlack").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                ProvinceId: $("#ProvinceCodeBlack").val(),
                CityId: $("#CityCodeBlack").val(),
                AreaId: $("#AreaBlack").val(),
                SubAreaId: $("#SubAreaBlack").val(),
                ChannelName: $("#ChannelNameBlack").val(),
                ChainName: $("#ChainNameBlack").val(),
                DistributorNo: $("#DistributorNoBlack").val(),
                DistributorName: $("#DistributorNameBlack").val(),
                SkuNo: $("#SkuNoBlack").val(),
                StoreName: $("#txtStoreNameBlack").val(),
                FullDate: $("#FullDateBlack").val(),
                FullInName: $("#txtFullInNameBlack").val(),
                StoreNo: $("#txtStoreNoBlack").val(),
            },
            url: '/DataImport/OutofStockReport/ExportBlackList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=缺货黑名单";
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })
})
function getTime(n) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDay(); //返回星期几的某一天;
    n = day == 0 ? n + 6 : n + (day - 1)
    now.setDate(now.getDate() - n);
    //date = now.getDate();
    //var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
    return now;
}
function queryParams(params) {
    return {
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ChannelId: $("#ChannelId").val(),
        ChainId: $("#ChainId").val(),
        SkuNo: $("#SkuNo").val(),
        StoreName: $("#txtStoreName").val(),
        FullDate: $("#FullDate").val(),
        FullDateEnd: $("#FullDate_End").val(),
        FullInName: $("#txtFullInName").val(),
        StoreNo: $("#txtStoreNo").val(),
        SolveStatus: $("#SolveStatus").val(),
        Week: $("#Week").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}

function queryParamsRecord(params) {
    return {
        ProvinceId: $("#ProvinceCodeBlack").val(),
        CityId: $("#CityCodeBlack").val(),
        AreaId: $("#AreaBlack").val(),
        SubAreaId: $("#SubAreaBlack").val(),
        ChannelName: $("#ChannelNameBlack").val(),
        ChainName: $("#ChainNameBlack").val(),
        DistributorNo: $("#DistributorNoBlack").val(),
        DistributorName: $("#DistributorNameBlack").val(),
        SkuNo: $("#SkuNoBlack").val(),
        StoreName: $("#txtStoreNameBlack").val(),
        FullDate: $("#FullDateBlack").val(),
        FullInName: $("#txtFullInNameBlack").val(),
        StoreNo: $("#txtStoreNoBlack").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}
