$(function () {
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }
    $(".select2").select2();
    $(".datepicker").datepicker({
        format: "yyyy-mm",
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    $("#yearMonth").val(defaultYearMonthDate);

    $('#dataTable').bootstrapTable({
        url: "/DataImport/VisitedManage/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns:  [
            {
                title: '操作',
                field: 'Id',
                formatter: 'actionFormatter',
                //events: 'OperateEvents'

            },
            {
                field: 'StoreNo',
                title: '门店编号'
            },
            {
                field: 'StoreName',
                title: '门店名称'
            },
            {
                field: 'MonthByStr',
                title: '月份'
            },
            {
                field: 'VisitedNum',
                title: '本月应拜访数'
                //,formatter: 'positionName'

            },
            {
                field: 'CreateTimeStr',
                title: '创建时间'
            },
        ],
    });
    var uploader;
    var intw = 0;
    $('#SetImportModal').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/VisitedManage/ImportSetVisited',
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
                $("#SetImportModal").modal("hide");
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
});


//$("#TempleteDown").on("click", function () {
//    DownloadTemplete();
//});
$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            StoreNo: $("#txtStoreCode").val(),
            StoreName: $("#txtStoreName").val(),
            Monthby: $("#yearMonth").val()
        },
        url: "/DataImport/VisitedManage/ExportService",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=设置月拜访门店次数列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})


//function DownloadTemplete() {
//    $.SubAjax({
//        type: 'post',
//        data: {},
//        url: '/DataImport/VisitedManage/DownloadTemplete',
//        success: function (data) {
//            if (data.IsSuccess) {
//                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=设置月拜访门店次数导入模版";
//            }
//            else {
//                $.ShowMessage("error", "模板异常");
//            }
//        }
//    })
//}

var EditForm = $("#EditForm");
EditForm.validate({
    rules: {

        EditNum: {
            required: true,
            number: true
        },


    },
    messages: {
        EditNum: {
            required: "请输入拜访次数",
            number: "请输入数字"
        }
    }
})

var AddForm = $("#AddForm");
AddForm.validate({
    rules: {
        //StoreName: {
        //    required: true
        //},
        VisitedNum: {
            required: true,
            number: true
        },
        Monthby:
            {
                required: true
            },

    },
    messages: {
        //StoreName: {
        //    required: "请选择门店"
        //},
        VisitedNum: {
            required: "请输入拜访次数",
            number: "请输入数字"
        },
        Monthby:
            {
            required: "请选择月份"
            }


    }
})

$("#btnAddShow").on("click", function () {
    $("#AddForm").find(".select2").val('');
    $("#AddForm").find(".form-control").val('');
    $('#myModal').modal({ backdrop: 'static', keyboard: false });
    $("#AddForm").find("label.error").remove();
    $("#AddForm").find("input.error").removeClass("error");
    $("#AddForm").find(".select2").focus();
})

$('#myModal').on('shown.bs.modal', function (e) {
    $(".select2").select2();
})


$("#btnAdd").on("click", function () {
    if (AddForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/VisitedManage/AddService',
            data: AddForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                    $("#myModal").modal("hide");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})

$("#btnUpdate").on("click", function () {
    if (EditForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/VisitedManage/EditService',
            data: EditForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                    $("#EditModal").modal("hide");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})

    function queryParams(params) {
        return {

            StoreNo: $("#txtStoreCode").val(),
            StoreName: $("#txtStoreName").val(),
            Monthby: $("#yearMonth").val(),

            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset,
            //排位命令（desc，asc）
        };
    }

function actionFormatter(value, row, index) {
        var results = '<a class="edit"onclick=editCount("' + value + '") data-role="Admin" title="编辑">编辑</a>';
        results += '<a class="delete" onclick=deleteCount("' + value + '") data-role="Admin" title="删除"> 删除</a>';

        return results;
    }

function editCount(Id) {
        $("#Id").val(Id);
        $("#EditModal").modal({ backdrop: 'static', keyboard: false });
        $("#EditForm").find("label.error").remove();
        $("#EditForm").find("input.error").removeClass("error");
        $.SubAjax({
            type: 'post',
            data: {
                id: Id
            },
            url: '/DataImport/VisitedManage/GetDataDetail',
            success: function (data) {
                if (data.IsSuccess) {
                    $("#StoreNo").val(data.Data.StoreNo);
                    $("#StoreName").val(data.Data.StoreName);
                    $("#MonthBy").val(data.Data.MonthByStr);
                    $("#EditNum").val(data.Data.VisitedNum);
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        });
}

function deleteCount(Id) {
                parent.layer.confirm('确认删除？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function () {
                $.SubAjax({
                    type: 'post',
                    data: {
                        id: Id
                    },
                    url: '/DataImport/VisitedManage/dele',
                    success: function (data) {
                        if (data.IsSuccess) {
                            $.ShowMessage("success", data.Msg);
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

    