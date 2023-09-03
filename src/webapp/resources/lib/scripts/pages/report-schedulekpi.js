$(function () {

    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    var columns = [
      {
          field: 'area',
          title: '区域'
      },
      {
          field: 'province',
          title: '省份'
      },
      {
          field: 'city',
          title: '城市'
      },
      {
          field: 'project',
          title: '所属项目'
      },
      {
          field: 'Strmonth',
          title: '活动月份'
      },
      {
          field: 'total_recruitmentnum',
          title: '应招聘总人数'
      },
      {
          field: 'total_opennum',
          title: '已经开档的总人数'
      },
      {
          field: 'total_arrivednum',
          title: '已经到岗的总人数'
      },
      {
          field: 'total_nightnum',
          title: '晚班人数'
      },
      {
          field: 'night_rate',
          title: '晚班占比'
      }
    ];

    $('#dataTable').bootstrapTable({
        url: "/DataImport/ReportKpi/QueryKpiScheduleList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });

    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/ReportKpi/ImportKpiSchedule',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker'
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

                });
                uploader.removeFile(file);
            }
        });
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw);
        });
    }).on('hidden.bs.modal', function (e) {
        uploader.destroy();
        $('#thelist').empty();
    });

    $("#ctlBtn").on("click", function () {
        uploader.upload();
    });

});
function queryParams(params) {
    return {
        Month: $("#yearMonth").val(),
        Project: $("#project").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
    };
}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
});

$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            Month: $("#yearMonth").val(),
            Project: $("#project").val()
        },
        url: '/DataImport/ReportKpi/ExportKpiSchedule',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=Kpi排班管理汇总表";
            } else {
                $.ShowMessage("error", data.Msg);
            }
        }
    });
});