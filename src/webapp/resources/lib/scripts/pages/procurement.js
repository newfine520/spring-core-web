$(function () {
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    defaultYearMonthDate += (new Date().getMonth() + 1) + "-" + (new Date().getDate());
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#FullDateSta").val(y + "-" + m + "-" + d);
    $("#FullDateEnd").val(y + "-" + m + "-" + d);
    $(".select2").select2();
    //$(".datepicker").val(defaultYearMonthDate)
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Procurement/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [

            {
                field: 'AreaName',
                title: '大区'
            }, {
                field: 'SubAreaName',
                title: '小区',
            }, {
                field: 'ProvinceName',
                title: '所在省'
            }, {
                field: 'CityName',
                title: '所在市'
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
                title: '门店编号'
            }, {
                field: 'StoreName',
                title: '门店名称'
            }, {
                title: '地址',
                field: 'StoreAddress',
                formatter: 'substrAddress',
            }, {
                title: '品牌',
                field: 'BrandName',
            }, {
                title: 'SKU编号',
                field: 'SkuNo',
            }, {
                title: 'SKU名称',
                field: 'ProductName',
            }, {
                title: '进货个数',
                field: 'Account',
            }, {
                title: '填报人',
                field: 'FullInName',
            }, {
                title: '填报日期',
                field: 'CreatDateString'
            },
        ],
    });
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })

    $('#btnExport').on("click", function () {
        exportData()
    })

    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/Procurement/ImportProcurement',
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
    })
})
function substrAddress(value, row, index) {
    if (row.StoreAddress != null) {
        var leng = row.StoreAddress;
        if (row.StoreAddress.length > 10) {
            leng = row.StoreAddress.substr(0, 10) + '...'
        }
        return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.StoreAddress + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
    }
}

function queryParams(params) {
    return {
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        SkuNo: $("#SkuNo").val(),
        StoreName: $("#txtStoreName").val(),
        FullDateSta: $("#FullDateSta").val(),
        FullDateEnd: $("#FullDateEnd").val(),
        FullInName: $("#txtFullInName").val(),
        StoreNo: $("#txtStoreNo").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}

function exportData(type) {
    $.SubAjax({
        type: 'post',
        data: {
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            SkuNo: $("#SkuNo").val(),
            StoreName: $("#txtStoreName").val(),
            FullDateSta: $("#FullDateSta").val(),
            FullDateEnd: $("#FullDateEnd").val(),
            FullInName: $("#txtFullInName").val(),
            StoreNo: $("#txtStoreNo").val(),
        },
        url: '/DataImport/Procurement/ExportData',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=进货提报";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
}