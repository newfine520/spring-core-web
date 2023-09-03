$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }
    $("#yearMonth").val(defaultYearMonthDate);
    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreRack/QueryStoreRack",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                title: '操作',
                field:'Id',
                formatter: 'operateFormatter',
                events: 'operateEvents',
            },
            {
                title: '省份',
                field:'ProvinceName',
            },
            {
                title: '城市',
                field:'CityName',
            },
            {
                title: '月份',
                field:'MonthYear',
            },
            {
                title: '门店编号',
                field:'StoreNo',
            },
            {
                title: '门店名称',
                field:'StoreName',
            },
            {
                title: '品类',
                field: 'CategoryName',
            },
            {
                title: '品牌',
                field:'BrandName',
            },
            {
                title: '货架节数',
                field:'RackCount',
            },
            //{
            //    title: '陈列面数',
            //    field:'DisplayCount',
            //}
        ],
    });

    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/StoreRack/ImportStoreRack',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
        });

        uploader.on('fileQueued', function (file) {
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
        })
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
            $li.find('p.state').text('上传中');
            $percent.css('width', percentage * 100 + '%');
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
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
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
});
function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        StoreName: $("#txtStoreName").val(),
        ProvinceCode: $("#ProvinceCode").val(),
        CityCode: $("#CityCode").val(),
        YearMonth: $("#yearMonth").val(),
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>'
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#myModal").modal({ backdrop: 'static', keyboard: false });
        $("#StoreRackId").val(row.Id);
        $("#myModalLabel").html(row.StoreName);
        $.SubAjax({
            type: 'post',
            data: { Id: row.Id },
            url: '/DataImport/StoreRack/GetStoreRackDetail',
            success: function (data) {
                if (data.IsSuccess) {
                    data = data.Data;
                    $("#RackCount").val(data.RackCount);
                    $("#DisplayCount").val(data.DisplayCount);

                }
                //else {
                //    $.ShowMessage('error', '获取数据失败！')
                //}
            }
        })
    }
}
var StoreRackForm = $("#StoreRackForm");
StoreRackForm.validate({
    rules: {
        RackCount: {
            required: true
        },
        DisplayCount: {
            required: true
        }
    },
    messages: {
        RackCount: {
            required: "请输入货架节数",
        },
        DisplayCount: {
            required: "请输入陈列面数",
        },
    }
})
$("#btnUpdate").on("click", function () {
    var srId = $("#StoreRackId").val();
    if (StoreRackForm.valid()) {
        
        $.SubAjax({
            type: 'post',
            url: '/DataImport/StoreRack/UpdateStoreRack?Id=' + srId,
            data: StoreRackForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})
$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            StoreName: $("#txtStoreName").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            YearMonth: $("#yearMonth").val(),
        },
        url: '/DataImport/StoreRack/ExportStoreRack',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=货架信息报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})