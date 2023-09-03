$(function () {
    $(".select2").select2();
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StoreSalesTarget/GetDataList",
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
                 formatter: function actionFormatter(value, row, index) {
                     return [
                         '<a class="edit" data-role="ADMIN"  field="编辑">',
                         '编辑  ',
                         '</a>'
                     ].join('');
                 },
                 events: 'editStoreSalesTarget'
             },
             {
                 title: '大区',
                 field: 'AreaName',
             },
             {
                 title: '小区',
                 field: 'SubAreaName',
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
                 title: '门店名称',
                 field: 'StoreName',
             }, 
             {
                 title: '1月',
                 field: 'M1'
             }
            , {
                title: '2月',
                field: 'M2'
            }
             , {
                 title: '3月',
                 field: 'M3'
             }
              , {
                  title: '4月',
                  field: 'M4'
              }
              , {
                  title: '5月',
                  field: 'M5'
              }
                , {
                    title: '6月',
                    field: 'M6'
                }, {
                    title: '7月',
                    field: 'M7'
                }, {
                    title: '8月',
                    field: 'M8'
                }, {
                    title: '9月',
                    field: 'M9'
                }, {
                    title: '10月',
                    field: 'M10'
                }, {
                    title: '11月',
                    field: 'M11'
                }, {
                    title: '12月',
                    field: 'M12'
                }

        ],
    });
    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    })
    $("#btnExportTemplete").on("click", function () {
        ExportSalesTemplete();
    })
    $("#btnExport").on("click", function () {
        ExportSales();
    })
    var uploader;
    var intw = 0;
    $("#Modalimport").on('shown.bs.modal', function (e) {
        var categoryType = $(".nav-tabs  .active").data('value');
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/DataImport/StoreSalesTarget/ImportSales',
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
            $li.find('p.state').text('上传中');
            $percent.css('width', percentage * 100 + '%');
            intw = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        });
        uploader.on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#Modalimport").modal("hide");
                if ($(".nav-tabs  .active").data('value') == "physiology") {
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $('#dataTable1').bootstrapTable("refresh");
                }
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
    
    
})
function queryParams(params) {
    return {
        Year: $("#selYear").val(),
        StoreNo:$("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        AreaId: $("#Area").val(),
        SubAreaId:$("#SubArea").val(),
        ProvinceId: $("#ProvinceCode").val(),
        CityId: $("#CityCode").val(),
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order//排位命令（desc，asc）
    };
}
var editForm = $("#StoreSalesTargetForm");
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
$("#btnUpdate").on("click", function () {
    if (editForm.valid()) {
        $.SubAjax({
            type: 'post',
            data: editForm.serializeToJson(),
            url: '/DataImport/StoreSalesTarget/UpdateStoreSalesTarget',
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", "修改成功！");
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");

                }
                else {
                    $.ShowMessage("success", data.Msg);
                }
            }
        })
    }
})
window.editStoreSalesTarget = {
    'click .edit': function (e, value, row, index) {
        $("#myModal").modal({ backdrop: 'static', keyboard: false });
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
        $("#StoreSalesTargetForm").find("label.error").remove();
        $("#StoreSalesTargetForm").find("input.error").removeClass("error");
        $("#Year").val($("#selYear").val());
        $("#StoreId").val(row.StoreId);
        $("#tltleStore").html(row.StoreName + "-" + $("#selYear").val() + "年月销售额指标");
    }
}
function ExportSales() {

    var year = 0;

    $.SubAjax({
        type: 'post',
        data: {
            StoreName: $("#txtStoreName").val(),
            ProvinceId: $("#ProvinceCode").val(),
            CityId: $("#CityCode").val(),
            Year: $("#selYear").val(),
        },
        url: '/DataImport/StoreSalesTarget/ExportSalesTarget',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店月销售指标";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
}

function ExportSalesTemplete() {
    if ($("#yearMonth").val() == "") {
        $.ShowMessage("warning", "请选择日期");
        return;
    }
    $.SubAjax({
        type: 'post',
        data: {
            //FromType: "Olap",
            //CategoryType: $(".nav-tabs  .active").data('value'),
            YearMonth: $("#yearMonth").val()
        },
        url: '/DataImport/StoreSalesTarget/ExportStoreTemplete',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店月销量指标模板";
            }
            else {

                $.ShowMessage("error", data.Msg);
            }
        }
    })
}






