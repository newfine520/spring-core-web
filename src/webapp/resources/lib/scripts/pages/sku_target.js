$(function () {
    //var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    //if (new Date().getMonth() == 0) {
    //    defaultYearMonthDate = (new Date().getFullYear() - 1).toString() + "-" + 12
    //}
    //else {
    //    if (new Date().getMonth() < 10) {
    //        defaultYearMonthDate += "0" + (new Date().getMonth());
    //    }
    //    else {
    //        defaultYearMonthDate += (new Date().getMonth());
    //    }
    //}
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
        if (new Date().getMonth()+1 < 10) {
            defaultYearMonthDate += "0" + (new Date().getMonth()+1);
        }
        else {
            defaultYearMonthDate += (new Date().getMonth()+1);
        }
    
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    $(".select2").select2();
    $(".datepicker").datepicker({
        format: "yyyy-mm",
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    $("#CycleMonth").val(defaultYearMonthDate);


    $('#dataTable').bootstrapTable({
        url: "/DataImport/SkuTarget/QuerySkuTarget",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            //{
            //    title: '操作',
            //    field: 'Id',
            //    formatter: 'operateFormatter',
            //    events: 'operateEvents',
            //    width: "100px"
            //},
            {
                field: 'YearMonth',
                title: '年月'
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
                field: 'ProvinceName',
                title: '省份'
            },
            {
                field: 'CityName',
                title: '城市'
            },
            {
                field: 'ChannelName',
                title: '渠道'
            },
            {
                field: 'ChainName',
                title: '系统'
            },
            {
                field: 'DistributorNo',
                title: '经销商编号'
            },
            {
                field: 'DistributorName',
                title: '经销商名称'
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
                field: 'SubBrand',
                title: '二级品牌'
            },
            {
                field: 'Category',
                title: '品类'
            },
            {
                field: 'IsGMOString',
                title: '是否转基因'
            },
            {
                field: 'IsMainString',
                title: '是否重点产品'
            },
            {
                field: 'SkuNo',
                title: '产品编码'
            },
            {
                field: 'SkuName',
                title: '产品名称'
            },
            {
                field: 'Price',
                title: '单价'
            },
            {
                field: 'ProductRule',
                title: '规格'
            },
            {
                field: 'PackageRule',
                title: '箱规'
            },
            {
                field: 'ConversionOfBox',
                title: '箱吨折算'
            },
            {
                field: 'CountTarget',
                title: '目标数量'
            },
            {
                field: 'BoxCountTarget',
                title: '目标箱数'
            },
            {
                field: 'TonnageTarget',
                title: '目标吨数'
            },
            {
                field: 'SalesTarget',
                title: '目标金额(元)'
            },
            {
                field: 'ActualCount',
                title: '实际数量'
            },
            {
                field: 'SalesReachRate',
                title: '销量达成率'
            },
            {
                field: 'ActualSales',
                title: '实际金额(元)'
            },
            {
                field: 'SalesRate',
                title: '销售额达成率'
            }

        ]
    });

    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/SkuTarget/ImportTarget',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            fileNumLimit: 1
        });
        uploader.on('fileQueued', function (file) {
            $("#thelist").empty();
            $("#thelist").append('<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">请上传.....</p>' +
            '</div>');

        });
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('p.state').text('上传中...');
            $percent.css('width', percentage * 100 + '%');
            intw = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        });
        uploader.on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#modalImport").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelist').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelist').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                uploader.removeFile(file);
            }
        });

        uploader.on('uploadError', function (file, reason) {
            $('#' + file.id).find('p.state').text('上传出错:原因' + reason);
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw)
        });
    }).on('hidden.bs.modal', function (e) {
        uploader.destroy();
        $('#thelist').empty();
    });

    $("#ctlBtn").on("click", function () {
        uploader.upload();
    });




})

$("#btnSearch").on("click", function () {
    if ($("#CycleMonth").val() == null || $("#CycleMonth").val().substring(0, 7) == "") {
        $.ShowMessage("warning", "请选择日期！");
        return false;
    }
    $('#dataTable').bootstrapTable("refresh");
})

function queryParams(params) {
    return {
        YearMonth: $("#CycleMonth").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        DistributorId: $("#DistributorId").val(),
        CategoryId: $("#CategoryId").val(),
        SkuNo: $("#SkuNo").val(),
        SkuName: $("#SkuName").val(),
        IsHaveDataString: $("#IsHaveDataString").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            YearMonth: $("#CycleMonth").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            DistributorId: $("#DistributorId").val(),
            CategoryId: $("#CategoryId").val(),
            SkuNo: $("#SkuNo").val(),
            SkuName: $("#SkuName").val(),
            IsHaveDataString: $("#IsHaveDataString").val()
        },
        url: "/DataImport/SkuTarget/ExportData",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=SKU指标";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})