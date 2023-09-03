$(function () {
    $('#dataTable').bootstrapTable({
        url: "/System/Channel/GetChannel",
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
                field: 'name',
                title: '渠道'
            },
            {
                field: 'strCreateTime',
                title: '创建时间'
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
            server: '/System/Channel/ImportChannel',
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

function queryParams(params) {
    return {
        channelName: $("#channelName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>',
        '<a class="delete"  data-role="Admin" title="删除" style="margin-left:10px">删除</a>',
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        $("#ChannelInfoPartialModal").modal({ backdrop: 'static', keyboard: false });
        $("#channelNameEdit").val(row.name);
        $("#channelId").val(row.id);
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    channelId: row.id
                },
                url: '/System/Channel/DeleteChannel',
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
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnUpdate").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            channelId: $("#channelId").val(),
            channelName: $("#channelNameEdit").val()
        },
        url: '/System/Channel/UpdateChannel',
        success: function (data) {
            if (data.IsSuccess) {
                $("#ChannelInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");

            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    });
})

$("#btnNew").on("click", function () {
    $(".select2").select2();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#channelNameEdit").val("");
    $("#ChannelInfoPartialModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            channelName: $("#channelNameEdit").val()
        },
        url: '/System/Channel/AddChannel',
        success: function (data) {
            if (data.IsSuccess) {
                $("#ChannelInfoPartialModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})


