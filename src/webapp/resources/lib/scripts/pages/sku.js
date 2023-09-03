$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Sku/GetDataList",
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
                field: 'Id',
                formatter: 'operateFormatter',
                events: 'operateEvents',
                width: "100px"
            },
            {
                field: 'Sort',
                title: '序号'
            },
            {
                field: 'SkuNo',
                title: 'SKU唯一编号'
            },
            {
                field: 'SkuName',
                title: 'SKU名称'
            },
            {
                field: 'Abbreviation',
                title: 'SKU简称'
            },
            {
                field: 'UpcCode',
                title: '产品条码'
            },
            {
                field: 'CapacityUnit',
                title: '容量单位'
            },
            {
                field: 'Price',
                title: 'SKU单价'
            },
            {
                field: 'Unit',
                title: 'SKU单位'
            },
            {
                field: 'ProductRule',
                title: '规格'
            },
            {
                field: 'ProductType',
                title: '产品类型'
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
                field: 'IsMainString',
                title: '是否重点'
            },
            {
                field: 'IsGMOString',
                title: '是否转基因'
            },
            {
                field: 'Width',
                title: '宽度(厘米)'
            },
            {
                field: 'TransportMode',
                title: '运输方式'
            },
            {
                field: 'CategoryName',
                title: '品类'
            },
            {
                field: 'FirstBrandName',
                title: '一级品牌'
            },
            {
                field: 'SubBrandName',
                title: '二级品牌'
            },
            {
                field: 'SkuTypeMark',
                title: 'SKU类型'
            },
            {
                field: 'Remark',
                title: '备注'
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
            server: '/DataImport/Sku/ImportSku',
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


    //导入门店sku关系
    var uploaderStoreSku;
    var intw2 = 0;
    $('#storeSkuModalImport').on('shown.bs.modal', function (e) {
        uploaderStoreSku = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/Sku/ImportStoreSku',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#pickerStoreSku',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            fileNumLimit: 1
        });
        uploaderStoreSku.on('fileQueued', function (file) {
            $("#thelist2").empty();
            $("#thelist2").append('<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">请上传.....</p>' +
            '</div>');

        });
        uploaderStoreSku.on('uploadProgress', function (file, percentage) {
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
            intw2 = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        });
        uploaderStoreSku.on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#storeSkuModalImport").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelist2').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelist2').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                uploaderStoreSku.removeFile(file);
            }
        });

        uploaderStoreSku.on('uploadError', function (file, reason) {
            $('#' + file.id).find('p.state').text('上传出错:原因' + reason);
        });

        uploaderStoreSku.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw2)
        });
    }).on('hidden.bs.modal', function (e) {
        uploaderStoreSku.destroy();
        $('#thelist2').empty();
    });

    $("#ctlBtnStoreSku").on("click", function () {
        uploaderStoreSku.upload();
    })



})

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            SkuNo: $("#SkuNo").val(),
            SkuName: $("#SkuName").val(),
            SubBrandId: $("#SubBrand").val(),
            SkuTypeMark: $("#SkuTypeMark").val()
        },
        url: "/DataImport/Sku/ExportSku",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=SKU列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

$("#btnExportStoreSku").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {},
        url: "/DataImport/Sku/ExportStoreSku",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店SKU关系列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function queryParams(params) {
    return {
        SkuNo: $("#SkuNo").val(),
        SkuName: $("#SkuName").val(),
        SubBrandId: $("#SubBrand").val(),
        SkuTypeMark: $("#SkuTypeMark").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}
$("#btnExportStoreSkuTemplete").on("click", function () {
    DownloadTemplete();
})

function operateFormatter(value, row, index) {
    return [
        '<a class="delete"  data-role="AdminHR" title="删除" style="margin-left:10px">删除</a>',
    ].join('');
}

window.operateEvents = {
    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    SkuNo: row.SkuNo
                },
                url: '/DataImport/Sku/DeleteSku',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "删除成功");
                        $('#dataTable').bootstrapTable("refresh");
                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    }
}



function DownloadTemplete() {
    $.SubAjax({
        type: 'post',
        data: {},
        url: '/DataImport/Sku/DownloadTemplete',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店SKU关系导入模版";
            }
            else {
                $.ShowMessage("error", "模板异常");
            }
        }
    })
}