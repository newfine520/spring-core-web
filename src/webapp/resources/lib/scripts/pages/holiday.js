$(function () {
    $(".select2").select2();
    $("#txtYear").datepicker({
        format: "yyyy",
        autoclose: true,
        minView: 'decade',
        startView: 'decade',
        viewSelect: 'decade',
        minViewMode: 2,
        pickerPosition: "bottom-left"
    })
    $('#dataTable').bootstrapTable({
        url: "/System/Holiday/GetHolidayList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        columns: [
            //{
            //    title: '操作',
            //    field: 'Id',
            //    formatter: 'actionFormatter',
            //    //events: 'storeOperate',
            //    events: 'Operate',
            //    width: "80px"
            //},
            {
                field: 'UserNo',
                title: '工号'
            },
            {
                field: 'UserName',
                title: '姓名'
            },
            {
                field: 'Year',
                title: '年份'
            },
            {
                field: 'Days',
                title: '年假总小时数'
            },
            {
                field: 'DaysLeft',
                title: '年假剩余小时数'
            },
            {
                field: 'OverTime',
                title: '加班总小时数'
            },
            {
                field: 'OverTimeLeft',
                title: '加班剩余小时数'
            }

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
            server: '/System/Holiday/ImportHoliday',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/*'
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

});
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})
function queryParams(params) {
    return {
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        Year: $("#txtYear").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#txtUserNo").val(),
            UserName: $("#txtUserName").val(),
            Year: $("txtYear").val(),
        },
        url: '/System/Holiday/ExportHoliday',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=年假列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})