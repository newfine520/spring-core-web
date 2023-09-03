$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    //$("#selCirclyDate").val(getNowTime());
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#ShelvesTimeSta").val(y + "-" + m + "-" + d);
    $("#ShelvesTimeEnd").val(y + "-" + m + "-" + d);
    $(".select2").select2();
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
    })


})



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
            field: 'ChannelName',
            title: '渠道'
        }, {
            field: 'ChainName',
            title: '系统'
        }, {
            field: 'DistributorNo',
            title: '经销商编号'
        }, {
            field: 'DistributorName',
            title: '经销商名称'
        }, {
            field: 'StoreNo',
            title: '门店编号',
        }, {
            field: 'StoreName',
            title: '门店名称'
        }, {
            field: 'CreateName',
            title: '提报人'
        }, {
            field: 'CreateTime',
            title: '提报时间'
        }
    ];

    var get = $.SubAjax({
        type: 'post',
        data: {
            isgift:false
        },
        url: '/Common/GetPCGiftSubBrand',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    columns.push({
                        title: value.SubBrandName + "(厘米)",
                        field: value.SubBrandId,
                    });
                })
                $('#dataTable').bootstrapTable({
                    url: "/DataImport/StoreShelves/GetShelvesList",
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
function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        CategoryType: categoryType.physiology,
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        Begin: $("#ShelvesTimeSta").val(),
        End: $("#ShelvesTimeEnd").val()
    };
}


$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Begin: $("#ShelvesTimeSta").val(),
            End: $("#ShelvesTimeEnd").val()
        },
        url: '/DataImport/StoreShelves/ExportShelvesReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=货架报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})