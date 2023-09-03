$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
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
    $("#ReportTimeSta").val(y + "-" + m + "-" + d);
    $("#ReportTimeEnd").val(y + "-" + m + "-" + d);
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        if ($("#ReportTimeSta").val() == null || $("#ReportTimeSta").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择日期！");
            return false;
        }
        if ($("#ReportTimeEnd").val() == null || $("#ReportTimeEnd").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择日期！");
            return false;
        }
        $('#dataTable').bootstrapTable("destroy");
        LoadDatatable();
    })

    $("#btnUpdate").on("click", function () {
        var salesVolumes = [];
        $.each($(".sub-brand-volume"), function (index, value) {
            salesVolumes.push({
                SubBrandId: $(this).find($("input[name='BrandVolume']")).data("brand"),
                SalvesVolume: $(this).find($("input[name='BrandVolume']")).val()
            });
        })
        $.SubAjax({
            type: 'post',
            data: JSON.stringify({
                StoreId: $("#StoreId").val(),
                StoreSalesVolumeId: $("#StoreSalesVolumeId").val(),
                PromoterId: $("#PromoterId").val(),
                SalesVolumes: salesVolumes,
                //SampleCount: $("#SampleCount").val(),
                //SampleSalesVolume: $("#SampleSalesVolume").val(),
                Total: $("#Total").val(),
                CirclyDate: $("#selCirclyDate").val()
            }),
            contentType: "application/json; charset=utf-8",
            url: '/DataImport/StoreSalesValume/UpdateStoreSalvesVolume',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#StoreSalesVolumeModal").modal('hide')
                    $.ShowMessage("success", "保存成功");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })

    /* excel文件上传解析 */
    var excelUploader;
    var intw = 0;
    $('#ImportModal').on('shown.bs.modal', function (e) {
        excelUploader = WebUploader.create({
            auto: false,
            swf: '/Plugins/webuploader/Uploader.swf',
            server: '/DataImport/StoreSalesValume/Import',
            pick: '#btnFilePicker',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            fileNumLimit: 1
        });
        excelUploader.on('filesQueued', function (files) {
            files.forEach(function (file) {
                $('#thelist').append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">请上传.....</p>' +
                    '</div>');
            });
        }).on('uploadComplete', function (file) {
            layer.close(intw);
        }).on('uploadProgress', function (file, percentage) {
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
        }).on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#ImportModal").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelist').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelist').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                excelUploader.removeFile(file);
            }
        });
    }).on('hidden.bs.modal', function (e) {
        excelUploader.destroy();
        $('#thelist').empty();
    });

    $('#btnUploadFile').on('click', function () {
        excelUploader.upload();
    });
})
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
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        Begin: $("#ReportTimeSta").val(),
        End: $("#ReportTimeEnd").val(),
        SalesCycle: 4001,
        //SubBrandId: $("#selSubBrand").val(),
        selSubBrand: str,
        SkuTypeMark: "800310"
    };
}
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>'
    ].join('');
}

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
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            ChannelName: $("#ChannelName").val(),
            ChainName: $("#ChainName").val(),
            DistributorNo: $("#DistributorNo").val(),
            DistributorName: $("#DistributorName").val(),
            Begin: $("#ReportTimeSta").val(),
            End: $("#ReportTimeEnd").val(),
            SalesCycle: 4001,
            //SubBrandId: $("#selSubBrand").val(),
            selSubBrand: str,
            SkuTypeMark: "800310"
        },
        url: '/DataImport/StoreSalesValume/ExportStoreSalesValume',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=销量提报列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

function getNowTime() {
    var sen = new Date();
    sen = sen.getFullYear() + "-" + (sen.getMonth() + 1) + "-" + sen.getDate();
    return sen;
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {

        $.SubAjax({
            type: 'post',
            data: {
                UserId: row.UserId,
                StoreId: row.storeid,
                CirclyDate: $("#selCirclyDate").val()
            },
            url: '/DataImport/StoreSalesValume/QueryStoreSalesVolume',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#StoreSalesVolumeModal").modal({ backdrop: 'static', keyboard: false });
                    $("#StoreId").val(row.storeid);
                    $("h2").html(row.StoreName);
                    var tpl = $("#tpl").html();
                    var html = juicer(tpl, data.Data);
                    $("#divStoreSalesVolume").html(html);
                } else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });

    }
}

function LoadDatatable() {
    var columns = [
        //{
        //    title: '操作',
        //    field: 'StoreId',
        //    formatter: operateFormatter,
        //    events: 'operateEvents'
            //}, 
            {
                field: 'SalesTime',
                title: '日期'
            }, {
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
                title: '渠道',
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
                field: 'UpdateName',
                title: '最后修改人'
            }, {
                field: 'volumetotal',
                title: '总销量(元)'
            }
    ];

    var a = $("#selSubBrand").val();
    var str = "";
    if (a != null) {
        str = a.join(";");
        var get = $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: str,
                SkuTypeMark: "800310"
            },
            url: '/Common/GetSubBrandsSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName + '(元)',
                            field: value.SkuId,
                        });
                    })
                    $('#dataTable').bootstrapTable({
                        url: "/DataImport/StoreSalesValume/GetDataList",
                        pagination: "true",
                        queryParams: queryParams,
                        sidePagination: 'server',
                        onPostBody: function () {
                            RenderRoleButton();
                        },
                        columns: columns,
                    });
                }
                //columns.push({
                //    title: "派样数量(包)",
                //    field: "sample_count",
                //});
                //columns.push({
                //    title: "派样产品售出量",
                //    field: "sample_sales_volume",
                //});
                //columns.push({
                //    title: '操作',
                //    field: 'StoreId',
                //    formatter: operateFormatter,
                //    events: 'operateEvents'
                //});

            }
        })
    }
    else
    {
        var get = $.SubAjax({
            type: 'post',
            data: {
                SubBrandId: a,
                SkuTypeMark: "800310"
            },
            url: '/Common/GetSubBrandSkuIds',
            success: function (data) {
                if (data.IsSuccess) {
                    $.each(data.Data, function (index, value) {
                        columns.push({
                            title: value.SkuName + '(元)',
                            field: value.SkuId,
                        });
                    })
                    $('#dataTable').bootstrapTable({
                        url: "/DataImport/StoreSalesValume/GetDataList",
                        pagination: "true",
                        queryParams: queryParams,
                        sidePagination: 'server',
                        onPostBody: function () {
                            RenderRoleButton();
                        },
                        columns: columns,
                    });
                }
                //columns.push({
                //    title: "派样数量(包)",
                //    field: "sample_count",
                //});
                //columns.push({
                //    title: "派样产品售出量",
                //    field: "sample_sales_volume",
                //});
                //columns.push({
                //    title: '操作',
                //    field: 'StoreId',
                //    formatter: operateFormatter,
                //    events: 'operateEvents'
                //});

            }
        })
    }

    

}