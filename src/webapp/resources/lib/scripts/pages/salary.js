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
    
    LoadTable();
});
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("destroy");
    LoadTable();
});
function queryParams(params) {
    return {
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        UserNo: $("#txtUserNo").val(),
        UserName: $("#txtUserName").val(),
        UserPosition: $("#selPosition").val(),
        YearMonth: $("#yearMonth").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
$("#btnGetTempleteFile").on("click", function () {

    $.SubAjax({
        type: 'post',
        //data: { CategoryNo: categoryNo },
        url: '/System/Salary/ExportTemplate',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=工资信息";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>'
          
    ].join('');
}


/* excel文件上传解析 */
var excelUploader;
var intw = 0;
$('#SalaryImportModal').on('shown.bs.modal', function (e) {
    excelUploader = WebUploader.create({
        auto: false,
        swf: '/Plugins/webuploader/Uploader.swf',
        server: '/System/Salary/ImportSalary',
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
    }).on('uploadComplete', function (file) {
        layer.close(intw)
    }).on('uploadSuccess', function (file, response) {
        if (response.IsSuccess) {
            $.ShowMessage("success", "文件导入成功");
            $("#SalaryImportModal").modal("hide");
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



window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#SalaryModal").modal({ backdrop: 'static', keyboard: false });
        $("#UserNo").val(row.user_no);
        $("#editYearMonth").val(row.year_month);
        $("#SalaryModal").find('h2').html(row.user_name);
        
        $.SubAjax({
            type: 'post',
            data: {
                UserNo: row.user_no,
                YearMonth: row.year_month
            },
            url: '/System/Salary/GetSalary',
            success: function (productData) {
                if (productData.IsSuccess) {
                    var productList = $("#SalaryForm").html('')
                    $.each(productData.Data, function (index, values) {
                        var product = ' <div class="form-group col-md-12"><label class="col-sm-4 control-label text-right">' + values.SalaryTypeName + '</label><div class="col-sm-8"> <div class=" input-group"><input type="number" step="0.1" min="0"  aria-required="true"  required=""  class="form-control salary-type " id="' + values.SalaryTypeId + '" name="' + values.SalaryTypeId + '" value="' + values.SalaryValue + '"/><span class="input-group-addon">元</span></div></div></div>';

                        productList.append(product);
                    })

                }
            }
        })
    }, 
}
$("#btnUpdate").on("click", function () {
    var salaryDetail = $("#SalaryForm").find(".salary-type");
    var salaryDetailValue = "";
    for (var i = 0; i < salaryDetail.length; i++) {
        salaryDetailValue = salaryDetailValue + salaryDetail[i].id + "@" + salaryDetail[i].value + "#";
    }
    $.SubAjax({
        type: 'post',
        data: {
            UserNo: $("#UserNo").val(),
            YearMonth: $("#editYearMonth").val(),
            salaryDetailAmount: salaryDetailValue
        },
        url: '/System/Salary/Update',
        success: function (data) {
            if (data.IsSuccess) {
                $("#SalaryModal").modal('hide')
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            UserNo: $("#txtUserNo").val(),
            UserName: $("#txtUserName").val(),
            UserPosition: $("#selPosition").val(),
            YearMonth: $("#yearMonth").val(),
        },
        url: '/System/Salary/ExportSalary',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=工资信息表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
//function positionName(value, row, index)
//{
//    switch (value)
//    {
//        case '5000410': return '店员'
//            break;
//        case '5000420': return '门店负责人'
//            break;
//        case '5000440': return '总监'
//            break;
//        case '5000430': return '管理员'
//            break;
//        case '5000450': return '项目主管'
//            break;
//        case '5000460': return '人事社保专员'
//            break;
//        case '5000470': return '项目经理'
//            break;
//        case '5000480': return '区域管理员'
//            break;
//        case '5000490': return '店员'
//            break;
//        case '5000610': return '大区助理'
//            break;
//        case '5000620': return '客户'
//            break;
//        default: return '-'
//            break;
//    }
//}


function LoadTable() {
    var columns = [
       {
           title: '操作',
           //field: 'StoreId',
           formatter: operateFormatter,
           events: 'operateEvents'
       },
       {
           field: 'user_no',
           title: '人员工号'
       },
       {
           field: 'user_name',
           title: '人员姓名'
       },
       {
           field: 'positionname',
           title: '职位'
           //,formatter: 'positionName'

       },
       {
           field: 'year_month',
           title: '年月'
       },
    ];
    $.SubAjax({
        type: 'post',
        data: {
            YearMonth: $("#yearMonth").val()
        },
        url: '/System/Salary/QuerySalaryType',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    //var subBrandName = value.Name;
                    columns.push({
                        title: value,
                        field: value,
                    });
                })
            }
        }
    })
    $('#dataTable').bootstrapTable({
        url: "/System/Salary/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns
    });
}