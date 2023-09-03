$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/System/ProvinceCity/GetDataList",
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
                field: 'SubAreaId',
                formatter: 'actionFormatter',
                events: 'areaOperate',
                width: "80px"
            },
            {
                field: 'ProvinceName',
                title: '省份'
            }, {
                field: 'CityName',
                title: '城市'
            }, {
                field: 'CityLevel',
                title: '城市级别'
            }

        ],
    });

    //$('#dataTable').bootstrapTable("checkAll");

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    });
    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/System/ProvinceCity/ImportProvinceCity',
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
window.areaOperate = {
    'click .edit': function (e, value, row, index) {
            $("#btnUpdate").show();
            $("#btnAdd").hide();
            $("#myModal").modal({ backdrop: 'static', keyboard: false });
            $("#ProvinceName").val(row.ProvinceName);
            $("#CityName").val(row.CityName);
            $("#CityLevel").val(row.CityLevel);
            $("#ProvinceId").val(row.ProvinceId);
            $("#CityId").val(row.CityId);
    }
}
function queryParams(params) {
    return {
        ProvinceName: $("#txtProvince").val(),
        CityName: $("#txtCity").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="edit" data-role="Admin" title="编辑">编辑</a>'
    return results;
}
var areaForm = $("#areaForm");
areaForm.validate({
    rules: {

        ProvinceName: {
            required: true
        },
        CityName: {
            required: true
        }

    },
    messages: {

        ProvinceName: {
            required: "请输入省份",
        },
        CityName: {
            required: "请输入城市",
        }

    }
})
$("#btnAddShow").on("click", function () {
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#areaForm").find(".form-control").val('');
})


$("#btnAdd").on("click", function () {
    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/ProvinceCity/AddProvinceCity',
            data: areaForm.serializeToJson(),
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


$("#btnUpdate").on("click", function () {

    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/ProvinceCity/UpdateProvinceCity',
            data: areaForm.serializeToJson(),
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


function checkAll($this) {
    var _this = $($this);
    if (_this.is(":checked")) {
        $('#dataTable').bootstrapTable("checkAll");

    }
    else {
        $('#dataTable').bootstrapTable("uncheckAll");
        $("#UserIds").val('')
    }
};

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            ProvinceName: $("#txtProvince").val(),
            CityName: $("#txtCity").val(),
        },
        url: '/System/ProvinceCity/ExprotCitys',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=省份城市列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})