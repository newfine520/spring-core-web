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
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() == 0) {
        defaultYearMonthDate = (new Date().getFullYear() - 1).toString() + "-" + 12
    }
    else {
        if (new Date().getMonth() < 10) {
            defaultYearMonthDate += "0" + (new Date().getMonth());
        }
        else {
            defaultYearMonthDate += (new Date().getMonth());
        }
    }
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
    LoadDatatable();
    $("#btnSearch").on("click", function () {
        if (($("#CycleMonth").val() == null || $("#CycleMonth").val().substring(0, 7) == "") &&
            ($("#CycleWeek").val() == null || $("#CycleWeek").val() == "")) {
            $.ShowMessage("warning", "请选择时间！");
            return false;
        }
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
            server: '/DataImport/PosReport/ImportPosData',
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
            field: '销量月份',
            title: '销量月份'
        },
        {
            field: '大区',
            title: '大区'
        }, {
            field: '省份',
            title: '省份'
        },
        {
            title: '城市',
            field: '城市',
        },
        {
            title: '城市（县级市及以上城市层级）',
            field: '城市（县级市及以上城市层级）',
        }, {
            field: '城市级别',
            title: '城市级别'
        }, {
            field: '门店编码',
            title: '门店编码'
        }, {
            field: '门店名称',
            title: '门店名称',
        }, {
            field: '门店类型',
            title: '门店类型'
        } , {
            field: '门店等级',
            title: '门店等级',
        }, {
            field: '门店定义',
            title: '门店定义'
        },
        //{
        //    field: 'UserName',
        //    title: '提报人'
        //},
        {
            field: '门店渠道',
            title: '门店渠道'
        }, {
            field: '供货方式',
            title: '供货方式'
        }, {
            field: '门店有效性',
            title: '门店有效性'
        }, {
            field: '上传BA',
            title: '上传BA'
        }, {
            field: 'BA类型',
            title: 'BA类型'
        }, {
            field: 'DBAS',
            title: 'DBAS'
        }, {
            field: 'BAS',
            title: 'BAS'
        }, {
            field: '品牌',
            title: '品牌'
        }, {
            field: '系列',
            title: '系列'
        },
        //{
        //    field: '品类',
        //    title: '品类'
        //},
        {
            field: '产品条码',
            title: '产品条码'
        }, {
            field: '产品编码',
            title: '产品编码'
        }, {
            field: '产品名称',
            title: '产品名称'
        }, {
            field: '产品简称',
            title: '产品简称'
        }, {
            field: '产品类型',
            title: '产品类型'
        }, {
            field: '销售数量',
            title: '销售数量'
        }, {
            field: 'POS金额（含税）',
            title: 'POS金额（含税）'
        }, {
            field: 'POS金额（未税）',
            title: 'POS金额（未税）'
        }, {
            field: '团购金额（含税）',
            title: '团购金额（含税）'
        }, {
            field: '团购金额（未税）',
            title: '团购金额（未税）'
        }, {
            field: '标准零售价（未税）',
            title: '标准零售价（未税）'
        }, {
            field: '店内折扣率',
            title: '店内折扣率'
        }, {
            field: '数据来源',
            title: '数据来源'
        }
    ];
    $('#dataTable').bootstrapTable({
        url: "/DataImport/PosReport/GetPosList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns,
    });



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
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        ChannelName: $("#ChannelName").val(),
        ChainName: $("#ChainName").val(),
        DistributorNo: $("#DistributorNo").val(),
        DistributorName: $("#DistributorName").val(),
        WeekDate: $("#CycleWeek").val(),
        CycleMonth: $("#CycleMonth").val(),
        selSubBrand: str
    };
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
            WeekDate: $("#CycleWeek").val(),
            CycleMonth: $("#CycleMonth").val(),
            selSubBrand: str
        },
        url: '/DataImport/PosReport/ExportPosReport',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=Pos报告";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})
