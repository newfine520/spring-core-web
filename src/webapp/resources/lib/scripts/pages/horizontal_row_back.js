$(function () {
    $(".select2").select2();

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
    dd.setDate(dd.getDate() - 1)
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#BeginFullDate").val(y + "-" + m + "-" + d);
    $("#EndFullDate").val(y + "-" + m + "-" + d);
    LoadDatatable();


})

$("#btnSearch").on("click", function () {
    if ($("#BeginFullDate").val() == null || $("#BeginFullDate").val().substring(0, 7) == "") {
        $.ShowMessage("warning", "请选择日期！");
        return false;
    }
    if ($("#EndFullDate").val() == null || $("#EndFullDate").val().substring(0, 7) == "") {
        $.ShowMessage("warning", "请选择日期！");
        return false;
    }
    $('#dataTable').bootstrapTable("destroy");
    LoadDatatable();
})

$("#btnExport").on("click", function () {
    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
    }
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            StoreNo: $("#StoreNo").val(),
            StoreName: $("#StoreName").val(),
            Begin: $("#BeginFullDate").val(),
            End: $("#EndFullDate").val(),
            selSubBrand: str
        },
        url: "/DataImport/StoreRow/ExportHorizontalRow",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=历史排面列表横版";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function queryParams(params) {
    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
    }

    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        StoreNo: $("#StoreNo").val(),
        StoreName: $("#StoreName").val(),
        Begin: $("#BeginFullDate").val(),
        End: $("#EndFullDate").val(),
        selSubBrand: str,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


function LoadDatatable() {
    var columns = [
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
                field: '经销商编号',
                title: '经销商编号'
            },
            {
                field: '经销商名称',
                title: '经销商名称'
            },
            {
                field: '门店编号',
                title: '门店编号'
            },
            {
                field: '门店名称',
                title: '门店名称'
            },
            {
                field: '提报人工号',
                title: '提报人工号'
            },
            {
                field: '提报人',
                title: '提报人'
            },
            {
                field: '日期',
                title: '日期'
            }
    ];

    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
        $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: str,
                SkuTypeMark: "800370"
            },
            url: '/Common/GetSubBrandsSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName,
                            field: value.SkuName
                        });
                    })
                }

            }
        })
    }
    else {
        $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: a,
                SkuTypeMark: "800370"
            },
            url: '/Common/GetSubBrandSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName,
                            field: value.SkuName
                        });
                    })
                }

            }
        })
    }

    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreRow/AllRowReport",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns,
    });

}

