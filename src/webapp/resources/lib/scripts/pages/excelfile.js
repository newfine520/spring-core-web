$(function () {
    $('#dataTable').bootstrapTable({
        url: "/DataImport/ExcelFileUpload/GetFileList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: 'FileName',
                title: '文件名称'
            },
            {
                field: 'UploadUserName',
                title: '上传人'
            },

            {
                field: 'UpdateUser',
                title: '修改人'
            },
            {
                title: '操作',
                field: 'Id',
                formatter: 'operateFormatter',
                events: 'operateEvents',
                width: "100px"
            }
        ]
    });

    //上传初始化
    var excelUploader;
    var intw = 0;
    $('#ImportModal').on('shown.bs.modal', function (e) {
        excelUploader = WebUploader.create({
            auto: false,
            swf: '/Plugins/webuploader/Uploader.swf',
            server: '/DataImport/ExcelFileUpload/AddFileUpload',
            pick: '#btnFilePicker',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls,doc',
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
                $.ShowMessage("success", "文件上传成功");
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

    //上传
    $('#btnUploadFile').on('click', function () {
        var obj = new Object();
        obj.filedataid = $("#fileid").val();
        excelUploader.options.formData = obj;
        excelUploader.upload();

    });
})

function operateFormatter(value, row, index) {
    var results = '<a class="like" onclick=DownLoadFile("' + value + '")  title="下载">下载</a>'
    results += '|<a class="like" onclick=UpdateFile("' + value + '")  data-toggle="modal" data-target="#ImportModal"  title="更新">更新</a>';
    return results;
}

//定义操作按钮
function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
        //排位命令（desc，asc）
    };
}

//下载
function DownLoadFile(id) {
    $.SubAjax({
        type: 'post',
        data: {
            fileid: id
        },
        url: '/DataImport/ExcelFileUpload/DownLoadFile',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/NewDownFile?filePath=" + data.Data + "&fileName=" + data.Msg + "";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}

//更新
function UpdateFile(id) {
    $("#fileid").val(id);
}