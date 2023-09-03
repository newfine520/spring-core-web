$(function () {
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/DataImport/SalaryType/GetDataList",
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
                width: "50px"
            },
            {
                field: 'Sort',
                title: '序号'
            },
            {
                field: 'SalaryTypeName',
                title: '工资类型'
            },
            {
                field: 'StrCreateTime',
                title: '创建时间'
            },
            {
                field: 'StrIsDeleted',
                title: '已禁用'
            },
            {
                field: 'StrDeletedTime',
                title: '禁用时间'
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
            server: '/DataImport/SalaryType/ImportSalaryType',
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

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})


function queryParams(params) {
    return {
        SalaryType: $("#SalaryTypeName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    var results = '';
    if (row.StrIsDeleted=="是")
        results += '<a class="enable"  data-role="Admin" title="启用" style="margin-left:10px">启用</a>';
    else
        results += '<a class="disable"  data-role="Admin" title="禁用" style="margin-left:10px">禁用</a>';
    return results;


}

window.operateEvents = {
    'click .disable': function (e, value, row, index) {
        parent.layer.confirm('确认禁用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    id: row.TypeId,
                    IsDeleted:true
                },
                url: '/DataImport/SalaryType/DeleteSalaryType',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "禁用成功");
                        $('#dataTable').bootstrapTable("refresh");
                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    },
    'click .enable': function (e, value, row, index) {
        parent.layer.confirm('确认启用？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    id: row.TypeId,
                    IsDeleted: false
                },
                url: '/DataImport/SalaryType/DeleteSalaryType',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "启用成功");
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

$("#btnNew").on("click", function () {
    $(".select2").select2();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#typeId").val("");
    $("#typeNameEdit").val("");
    $("#typeSortEdit").val("");
    $("#SalaryTypePartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            SalaryType: $("#typeNameEdit").val(),
            Sort: $("#typeSortEdit").val()
        },
        url: '/DataImport/SalaryType/AddSalaryType',
        success: function (data) {
            if (data.IsSuccess) {
                $("#SalaryTypePartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})