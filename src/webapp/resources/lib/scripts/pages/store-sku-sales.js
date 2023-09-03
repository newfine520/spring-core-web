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
    $("#Begin").val(y + "-" + m + "-" + d);
    $("#End").val(y + "-" + m + "-" + d);


    LoadDatatable();
    //$("#btnSearch").on("click", function () {
    //    if ($("#selCirclyDate").val() == null || $("#selCirclyDate").val().substring(0, 7) == "") {
    //        $.ShowMessage("warning", "请选择日期！");
    //        return false;
    //    }
    //    $('#dataTable').bootstrapTable("destroy");
    //    LoadDatatable();
    //})

    //$("#selCirclyDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#btnSearch").on("click", function () {
        if ($("#Begin").val() == null || $("#Begin").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择开始日期！");
            return false;
        }
        if ($("#End").val() == null || $("#End").val().substring(0, 7) == "") {
            $.ShowMessage("warning", "请选择结束日期！");
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
        //CirclyDate: $("#selCirclyDate").val(),
        Begin: $("#Begin").val(),
        End: $("#End").val(),
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
    //if ($("#Begin").val() != $("#End").val()) {
    //    $.ShowMessage("warning", "只能按日导出！");
    //    return false;
    //}
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
            //CirclyDate: $("#selCirclyDate").val(),
            Begin: $("#Begin").val(),
            End: $("#End").val(),
            SalesCycle: 4001,
            //SubBrandId: $("#selSubBrand").val(),
            selSubBrand: str,
            SkuTypeMark: "800310"
        },
        url: '/DataImport/StoreSkuSales/ExportBudget',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=销量报表";
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


function LoadDatatable() {
    var columns = [
        {
            field: 'strSalesDate',
            title: '销量日期'
        }, {
            field: 'areaName',
            title: '大区'
        }, {
            field: 'subAreaName',
            title: '省份'
        }, {
            title: '城市',
            field: 'provinceName',
        }, {
            title: '城市',
            field: 'cityName',
        }, {
            title: '城市级别',
            field: 'cityLevel',
        }, {
            field: 'StoreNo',
            title: '门店编号',
        }, {
            field: 'StoreName',
            title: '门店名称'
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
            field: 'channelName',
            title: '门店渠道'
        }, {
            field: 'ProvideType',
            title: '经销商-供货形式'
        }, {
            field: 'StoreStatus',
            title: '门店有效性'
        }, {
            field: 'reportName',
            title: '上传BA'
        }, {
            field: 'ReportPosition',
            title: 'BA类型'
        }, {
            field: 'DbasUser',
            title: 'DBAS'
        }, {
            field: 'BasUser',
            title: 'BAS'
        }, {
            field: 'SubBrandName',
            title: '二级品牌'
        },
        {
            field: 'SkuName',
            title: '品牌',
        }, {
            field: 'PosTotal',
            title: '销售金额（含税）',
        }, {
            field: 'PosUntax',
            title: '销售金额（未税）',
        }
    ];

    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreSkuSales/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns,
    });




}