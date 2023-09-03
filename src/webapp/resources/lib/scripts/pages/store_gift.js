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
    $("#GiftTimeSta").val(y + "-" + m + "-" + d);
    $("#GiftTimeEnd").val(y + "-" + m + "-" + d);
    $(".select2").select2();
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
    })

    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/StoreGift/ImportData',
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
            field: 'UpdateName',
            title: '提报人'
        }, {
            field: 'last_update_time',
            title: '提报日期'
        }
        
    ];

    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
        var get = $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: str
            },
            url: '/Common/GetGiftSubBrandsSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName + "(" + value.UnitCode + ")",
                            field: value.SkuId,
                        });
                    })
                    $('#dataTable').bootstrapTable({
                        url: "/DataImport/StoreGift/GetGiftList",
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
    else {
        var get = $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: a
            },
            url: '/Common/GetGiftSubBrandsSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName + "(" + value.UnitCode + ")",
                            field: value.SkuId,
                        });
                    })
                    $('#dataTable').bootstrapTable({
                        url: "/DataImport/StoreGift/GetGiftList",
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

    

}
function queryParams(params) {
    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
    }

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
        Begin: $("#GiftTimeSta").val(),
        End: $("#GiftTimeEnd").val(),
        //SubBrandId: $("#selSubBrand").val()
        selSubBrand: str
    };
}


$("#btnExportG").on("click", function () {
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
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Begin: $("#GiftTimeSta").val(),
            End: $("#GiftTimeEnd").val(),
            selSubBrand: str
            //SubBrandId: $("#selSubBrand").val()
        },
        url: '/DataImport/StoreGift/ExportGiftReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=赠品提报列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

$("#btnExportVertical").on("click", function () {
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
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Begin: $("#GiftTimeSta").val(),
            End: $("#GiftTimeEnd").val(),
            selSubBrand: str
            //SubBrandId: $("#selSubBrand").val()
        },
        url: '/DataImport/StoreGift/ExportGiftVerticalReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=赠品提报列表(竖版)";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

$("#btnExportReceiveAndSend").on("click", function () {
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
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Begin: $("#GiftTimeSta").val(),
            End: $("#GiftTimeEnd").val(),
            selSubBrand: str
            //SubBrandId: $("#selSubBrand").val()
        },
        url: '/DataImport/StoreGift/ExportReceiveAndSendReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=赠品收发存报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})