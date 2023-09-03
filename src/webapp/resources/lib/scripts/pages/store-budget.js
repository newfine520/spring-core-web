$(function () {
    $(".select2").select2();
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    var dd = new Date();
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1).toString().length == 1 ? "0" + (dd.getMonth() + 1).toString() : (dd.getMonth() + 1).toString();
    var d = dd.getDate();
    $("#QueryTime").val(y + "-" + m);
    $(".datepicker").datepicker({
        format: 'yyyy-mm',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        minViewMode: 1,
        language: 'zh-CN'
    });


    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreBudget/GetDataList",
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
                 field: 'yearMonth',
                 title: '年月'
             },
             {
                 field: 'areaName',
                 title: '大区'
             },
             {
                 field: 'subAreaName',
                 title: '小区'
             },
             {
                 field: 'provinceName',
                 title: '省份'
             },
             {
                 field: 'cityName',
                 title: '城市'
             },
             {
                 field: 'distributorNo',
                 title: '经销商编码'
             },
             {
                 field: 'distributorName',
                 title: '经销商名称'
             },
             {
                 field: 'channelName',
                 title: '渠道类型'
             },
             {
                 field: 'chainName',
                 title: '门店所属系统名称'
             },
            {
                field: 'storeNo',
                title: '门店编号'
            },
            {
                field: 'storeName',
                title: '门店名称'
            },
            {
                field: 'budgetTypeName',
                title: '费用类型'
            },
            {
                field: 'budget',
                title: '申请金额'
            },
            {
                field: 'actual',
                title: '结算金额'
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
            server: '/DataImport/StoreBudget/ImportBudget',
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
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceCodeId: $("#ProvinceCode").val(),
            CityCodeId: $("#CityCode").val(),
            StoreNo: $("#txtStoreCode").val(),
            StoreName: $("#txtStoreName").val(),
            QueryTime: $("#QueryTime").val(),
        },
        url: "/DataImport/StoreBudget/ExportBudget",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店费用列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})


function queryParams(params) {
    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceCodeId: $("#ProvinceCode").val(),
        CityCodeId: $("#CityCode").val(),
        StoreNo: $("#txtStoreCode").val(),
        StoreName: $("#txtStoreName").val(),
        QueryTime: $("#QueryTime").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}


//function operateFormatter(value, row, index) {
//    return [
//        '<a class="delete"  data-role="AdminHR" title="删除" style="margin-left:10px">删除</a>',
//    ].join('');
//}

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

