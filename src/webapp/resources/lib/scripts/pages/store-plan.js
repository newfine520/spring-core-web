$(function () {
    $(".select2").select2();
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))

    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StorePlan/GetDataList",
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
                 field: 'StoreId',
                 formatter: function actionFormatter(value, row, index) {
                     return [
                         '<a class="edit" data-role="SuperVisionAdmin"  field="编辑">',
                         '编辑  ',
                         '</a>'
                     ].join('');
                 },
                 events: 'editStoreSales'
             },
              {
                  title: '省份',
                  field: 'ProvinceName',
              },
                 {
                     title: '城市',
                     field: 'CityName',
                 },
                 {
                     title: '门店编号',
                     field: 'StoreNo',
                 },
             {
                 title: '门店',
                 field: 'StoreName',
             }, {
                 title: '1月(元)',
                 field: 'M1'
             }
            , {
                title: '2月(元)',
                field: 'M2'
            }
             , {
                 title: '3月(元)',
                 field: 'M3'
             }
              , {
                  title: '4月(元)',
                  field: 'M4'
              }
              , {
                  title: '5月(元)',
                  field: 'M5'
              }
                , {
                    title: '6月(元)',
                    field: 'M6'
                }, {
                    title: '7月(元)',
                    field: 'M7'
                }, {
                    title: '8月(元)',
                    field: 'M8'
                }, {
                    title: '9月(元)',
                    field: 'M9'
                }, {
                    title: '10月(元)',
                    field: 'M10'
                }, {
                    title: '11月(元)',
                    field: 'M11'
                }, {
                    title: '12月(元)',
                    field: 'M12'
                }
        ],
    });
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })
    $("#btnExportTemplete").on("click", function () {
        if ($("#yearMonth").val() == "") {
            $.ShowMessage("warning", "请选择日期");
            return;
        }
        $.SubAjax({
            type: 'post',
            data: { YearMonth: $("#yearMonth").val() },
            url: '/DataImport/StorePlan/ExportTemplete',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=月销售计划模板";
                    $("#modalImport").modal("hide");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }

            }
        })
    })

    var uploader;
    var intw = 0;
    $("#modalImport").on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/StorePlan/ImportStoreSalesPlanData',
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
            $li.find('p.state').text('上传中');
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

        uploader.on('uploadError', function (file) {
            $.ShowMessage("error", "文件上传出错");
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw)
        });

        $("#ctlBtn").on("click", function () {
            uploader.upload();
        })
    }).on('hidden.bs.modal', function (e) {
        uploader.destroy();
        $('#thelist').empty();
    });
    var editForm = $("#StoreSalesForm");
    editForm.validate({
        rules: {
            M1: {
                required: true,
                number: true
            },
            M2: {
                required: true,
                number: true
            }, M3: {
                required: true,
                number: true
            }, M4: {
                required: true,
                number: true
            }, M5: {
                required: true,
                number: true
            }, M6: {
                required: true,
                number: true
            }, M7: {
                required: true,
                number: true
            }, M8: {
                required: true,
                number: true
            }, M9: {
                required: true,
                number: true
            }, M10: {
                required: true,
                number: true
            }, M11: {
                required: true,
                number: true
            }, M12: {
                required: true,
                number: true
            }
        }, messages: {
            M1: {
                required: "不能为空",
                number: "请输入数字"
            },
            M2: {
                required: "不能为空",
                number: "请输入数字"
            }, M3: {
                required: "不能为空",
                number: "请输入数字"
            }, M4: {
                required: "不能为空",
                number: "请输入数字"
            }, M5: {
                required: "不能为空",
                number: "请输入数字"
            }, M6: {
                required: "不能为空",
                number: "请输入数字"
            }, M7: {
                required: "不能为空",
                number: "请输入数字"
            }, M8: {
                required: "不能为空",
                number: "请输入数字"
            }, M9: {
                required: "不能为空",
                number: "请输入数字"
            }, M10: {
                required: "不能为空",
                number: "请输入数字"
            }, M11: {
                required: "不能为空",
                number: "请输入数字"
            }, M12: {
                required: "不能为空",
                number: "请输入数字"
            }
        }
    });
    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                Year: $("#selYear").val(),
                StoreName: $("#txtStoreName").val(),
                ProvinceId: $("#ProvinceCode").val(),
                CityId: $("#CityCode").val()
            },
            url: '/DataImport/StorePlan/ExportSales',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=销售计划";
                }
            }
        })
    })
    $("#btnUpdate").on("click", function () {
        if (editForm.valid()) {
            $.SubAjax({
                type: 'post',
                data: editForm.serializeToJson(),
                url: '/DataImport/StorePlan/UpdateStoreSales',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "修改成功！");
                        $("#myModal").modal("hide")
                        $('#dataTable').bootstrapTable("refresh");
                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
        }
    })
    window.editStoreSales = {
        'click .edit': function (e, value, row, index) {
            $("#myModal").modal({ backdrop: 'static', keyboard: false });
            $("#tltleStore").html(row.StoreName + "-" + $("#selYear").val() + "年月销售计划");
            $("#M1").val(row.M1);
            $("#M2").val(row.M2);
            $("#M3").val(row.M3);
            $("#M4").val(row.M4);
            $("#M5").val(row.M5);
            $("#M6").val(row.M6);
            $("#M7").val(row.M7);
            $("#M8").val(row.M8);
            $("#M9").val(row.M9);
            $("#M10").val(row.M10);
            $("#M11").val(row.M11);
            $("#M12").val(row.M12);
            $("#Year").val($("#selYear").val());
            $("#StoreId").val(row.StoreId);
            $("#FromType").val("olap")
        }
    }
})
function queryParams(params) {
    return {
        Year: $("#selYear").val(),
        StoreName: $("#txtStoreName").val(),
        StoreNo: $("#txtStoreNo").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}
