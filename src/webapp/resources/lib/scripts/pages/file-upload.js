$(function () {
    $("#SchedualId").hide();
    $("#SalesId").hide();
    $("#AttendanceId").hide();
    if ($("#PositionType").val() == "管理员") {
        $("#SchedualId").show();
        $("#SalesId").show();
        $("#AttendanceId").show();
    }
    /* excel文件上传解析 */
    var excelUploader;
    var intw = 0;
    $('#ImportModal').on('shown.bs.modal', function (e) {
        excelUploader = WebUploader.create({
            auto: false,
            swf: '/Plugins/webuploader/Uploader.swf',
            server: '/DataImport/FileUpload/SchedualUpload',
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

    $('#btnUploadFile').on('click', function () {
        excelUploader.upload();
    });


    var excelUploader1;
    var intw1 = 0;
    $('#SalesImportModal').on('shown.bs.modal', function (e) {
        excelUploader1 = WebUploader.create({
            auto: false,
            swf: '/Plugins/webuploader/Uploader.swf',
            server: '/DataImport/FileUpload/SalesUpload',
            pick: '#btnFilePickerSales',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            fileNumLimit: 1
        });
        excelUploader1.on('filesQueued', function (files) {
            files.forEach(function (file) {
                $('#thelistSales').append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">请上传.....</p>' +
                    '</div>');
            });
        }).on('uploadComplete', function (file) {
            layer.close(intw1);
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
            intw1 = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        }).on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件上传成功");
                $("#SalesImportModal").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelistSales').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelistSales').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                excelUploader1.removeFile(file);
            }
        });
    }).on('hidden.bs.modal', function (e) {
        excelUploader1.destroy();
        $('#thelistSales').empty();
    });

    $('#btnUploadSales').on('click', function () {
        excelUploader1.upload();
    });

    //培训明细上传下载
    var excelUploader2;
    var intw2 = 0;
    $('#AttendanceImportModal').on('shown.bs.modal', function (e) {
        excelUploader2 = WebUploader.create({
            auto: false,
            swf: '/Plugins/webuploader/Uploader.swf',
            server: '/DataImport/FileUpload/AttendenceUpload',
            pick: '#btnFilePickerAttendance',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            fileNumLimit: 1
        });
        excelUploader2.on('filesQueued', function (files) {
            files.forEach(function (file) {
                $('#thelistAttendance').append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">请上传.....</p>' +
                    '</div>');
            });
        }).on('uploadComplete', function (file) {
            layer.close(intw2);
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
            intw2 = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        }).on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件上传成功");
                $("#AttendanceImportModal").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelistAttendance').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelistAttendance').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                excelUploader2.removeFile(file);
            }
        });
    }).on('hidden.bs.modal', function (e) {
        excelUploader2.destroy();
        $('#thelistAttendance').empty();
    });

    $('#btnUploadAttendance').on('click', function () {
        excelUploader2.upload();
    });

})