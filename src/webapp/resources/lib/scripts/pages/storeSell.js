$(function () {
    $("#txtMonth").datepicker({
        changeMonth: true,
        changeYear: true,
        format: 'yyyy-mm',
        startView: 2,
        maxViewMode: 1,
        minViewMode: 1,
        autoclose: true,
        language: 'zh-CN',
    });
   
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreSell/GetStoreSellUserList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                field: 'StoreNo',
                title: '门店编号'
            },{
                field: 'StoreName',
                title: '门店名称'
            }, {
                field: 'month',
                title: '卖进月份',
            }, {
                field: 'shouldSellCount',
                title: '计划卖进人数'
            }, {
                field: 'actuallySellCount',
                title: '实际卖进人数',
            }
        ],
    });

    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/StoreSell/ImportStoreSell',
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
})


function queryParams(params) {
    return {
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        time: $("#txtMonth").val(),
        IsPage: true,
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});



window.OperateEvent = {
    'click .photo': function (e, value, row, index) {
        $("#PhotoModal").modal({ backdrop: 'static', keyboard: false });
        if (row.PhotoUrl.length > 0) {
            var data = { list: row.PhotoUrl };
            var tpl = $("#tpl").html();
            var html = juicer(tpl, data);
            $("#divShowImgs").html(html);
            $('.fancybox').fancybox({
                openEffect: 'none',
                closeEffect: 'none'
            });
        }
    }
};