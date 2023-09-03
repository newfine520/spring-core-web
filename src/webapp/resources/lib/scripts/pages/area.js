$(function () {
    $(function () { $('.tooltip-show').tooltip('show'); });
    loadAllProvince($("#ProvinceCode"), false);
    //xp
    loadAllProvince($("#Province"), false);
    changeProvince($("#Province"), $("#City"));


    changeDepartment($("#Department"), $("#SubDepartment"))
    changeCity($("#CityCode"), $("#DistrictCode"))
    
    $(".select2").select2();
    
    $("#PromoterId").select2(
        {
            maximumSelectionLength: 10
        }); 
    $('#myModal').on('shown.bs.modal', function (e) {
        $(".select2").select2();

    })


    $('#dataTable').bootstrapTable({
        url: "/System/Area/GetAreaList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            //{
            //    title: '<input data-index="0" type="checkbox" onClick="checkAll(this)" />',
            //    formatter: function (value, row, index) {
            //        return '<input data-index="0" name="btSelectItem" type="checkbox" value="' + row.Id + '" />'
            //    }
            //},
            {
                title: '操作',
                field: 'SubAreaId',
                formatter: 'actionFormatter',
                //events: 'storeOperate',
                events: 'areaOperate',
                width: "50px"
            },
            {
                field: 'AreaName',
                title: '大区'
            }, {
                field: 'SubAreaName',
                title: '小区',
            },
            //{
            //    field: 'DirectorName',
            //    title: '主管',
            //},
            //{
            //    field: 'ManagerName',
            //    title: '经理',
            //},
            //{
            //    field: 'AdmName',
            //    title: '区域管理员',
            //},
            //{
            //    field: 'ProvinceName',
            //    title: '所在省'
            //}, {
            //    field: 'CityName',
            //    title: '所在市'
            //},
            
        ],
    });

    $('#dataTable').bootstrapTable("checkAll");

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    });
    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/System/Area/ImportArea',
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
            $li.find('p.state').text('上传中...');
            $percent.css('width', percentage * 100 + '%');
            intw = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        })
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

                })
                uploader.removeFile(file);
            }
        });
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
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
window.areaOperate = {
    'click .check': function (e, value, row, index) {
        //editArea(row.Id
        editArea(value);
        $("#btnUpdate").hide();
        $("#btnAdd").hide();
       
    }
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        $("#menuContent").fadeOut("fast");
        $("#treeContent").fadeOut("fast");
        $("#chainContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }
}
function queryParams(params) {
    return {
        AreaCityCode: $("#City").val(),
        AreaProvinceCode: $("#Province").val(),
        AreaName: $("#txtAreaName").val(),
        SubAreaName: $("#txtSubAreaName").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=editArea("' + value + '") data-role="Admin" title="编辑">编辑</a>'
    //results += '<a class="check ml10" href="javascript:void(0)"title="查看"> 查看</a>';
    return results;
}

function substr(value, row, index) {
    var leng = row.StoreAddress;
    if (row.StoreAddress != null) {
        if (row.StoreAddress.length > 8) {
            leng = row.StoreAddress.substr(0, 8) + '...'
        }
    }
    return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.StoreAddress + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
}
var areaForm = $("#areaForm");
areaForm.validate({
    rules: {
        
        AreaName: {
            required: true
        },
        SubAreaName: {
            required: true
        },
        //ProvinceCode: {
        //    required: true
        //},
        //CityCode: {
        //    required: true
        //}

    },
    messages: {
      
        AreaName: {
            required: "请选择大区",
        },
        SubAreaName: {
            required: "请选择小区",
        },
        //ProvinceCode: {
        //    required: "请输入省份",
        //},
        //CityCode: {
        //    required: "请输入城市",
        //}

    }
})
$("#btnAddShow").on("click", function () {
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#areaForm").find(".form-control").val('');
    loadAllProvince($("#ProvinceCode"), false);
    //$("#areaForm").find("#PromoterId").val('0');
    //$("#areaForm").find("#PromoterId").select2();
    changeProvince($("#ProvinceCode"), $("#CityCode"));
})


$("#btnAdd").on("click", function () {
    //var promoterId = $("#PromoterId").val();
    var subAreaId = $("#SubAreaId").val();
    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/Area/AddArea?subAreaId=' + subAreaId,
            data: areaForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})


$("#btnUpdate").on("click", function () {
    var subAreaId = $("#SubAreaId").val();
    if (areaForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/Area/UpdateArea?subAreaId=' + subAreaId,
            data: areaForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})

function editArea(Id) {
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#areaForm").find("label.error").remove();
    $("#areaForm").find("input.error").removeClass("error"); 
    $("#EntryDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    //var roleName = '@(((SFA.Service.UserService.Output.UserDescriptOutput)ViewData["CurrentUser"]).RoleNameEns)';
    if ($("#PositionType").val() == "门店负责人") {
        $("#AreaName").prop("disabled", true);
        $("#SubAreaName").prop("disabled", true);
    }

    changeDepartment($("#DepartmentId"), $("#SubDepartmentId"));
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/System/Area/GetAreaDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#SubAreaId").val(Id);
                $("#AreaName").val(data.Area);
                $("#SubAreaName").val(data.SubArea);
                $("#DirectorId").val(data.DirectorId);
                $("#ManagerId").val(data.ManagerId);
                $("#AdmId").val(data.AdmId);
                //$("#ProvinceCode").val(data.Province);
                //$("#ProvinceCode").select2();
                
                //getCityByProvince($("#ProvinceCode"), $("#CityCode"))
                //$("#CityCode").val(data.City);
                //$("#CityCode").select2();
                
                //getDistrictByCity($("#CityCode"), $("#DistrictCode"))
                //$("#DistrictCode").val(data.DistrictCode);
                //$("#DistrictCode").select2();
                
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }

        }
    });
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {},
        url: '/System/Store/ExportStore',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=门店列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})
function checkAll($this) {
    var _this = $($this);
    if (_this.is(":checked")) {
        $('#dataTable').bootstrapTable("checkAll");

    }
    else {
        $('#dataTable').bootstrapTable("uncheckAll");
        $("#UserIds").val('')
    }
};
function changeDepartment(Department, SubDepartment, district) {
    Department.on("change", function () {
        SubDepartment.empty();
        $.SubAjax({
            type: 'post',
            data: { ParentId: Department.val() },
            url: '/System/Store/GetSubDepartment',
            success: function (data) {
                var jsonData = eval(data.Data);
                var thisData = "[";
                $.each(jsonData, function (index, item) {
                    thisData += "{\"id\":\"" + item.DepartmentId + "\",\"text\":\"" + item.DepartmentName + "\"},";
                });
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                SubDepartment.select2({
                    placeholder: "请选择",
                    allowClear: true,
                    data: cData
                });
            },
            error: function (data) {
                //  alert("数据加载失败！");
            }
        });
    })
}

//function changeDepartment(Department, SubDepartment, district) {
//    $("#Department").on("change", function () {
//        var value = $(this).val();
//        if (value == "") {
//            city.empty();
//            city.select2({
//                placeholder: "请选择",
//                data: []
//            });
//        }
//        else {
//            var jsonData = CityJson;
//            var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
//            //有单选和多选
//            if (value.indexOf(',' > -1)) {
//                value = value + ",";
//                $.each(jsonData, function (index, item) {
//                    if (value.indexOf(item.ProvinceId + ",") > -1) {
//                        thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
//                    }
//                });
//            }
//            else {
//                $.each(jsonData, function (index, item) {
//                    if (value == item.ProvinceId) {
//                        thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
//                    }
//                });
//            }
//            thisData = thisData.substring(0, thisData.length - 1);
//            thisData += "]";
//            var cData = $.parseJSON(thisData);
//            city.empty();
//            city.select2({
//                placeholder: "请选择",
//                allowClear: true,
//                data: cData
//            });
//            if (district) {
//                changeCity(city, district)
//            }
//        }
//    });
//}

//function loadSubDepartment(provinceId) {
//    $.ajax({
//        type: "post",
//        url: "/Common/GetUserProvince",
//        dataType: "json",
//        cache: false,
//        success: function (data) {
//            var jsonData = eval(data);
//            var thisData = "[";
//            $.each(jsonData, function (index, item) {
//                thisData += "{\"id\":\"" + item.ProvinceId + "\",\"text\":\"" + item.ProvinceName + "\"},";
//            });
//            thisData = thisData.substring(0, thisData.length - 1);
//            thisData += "]";
//            var cData = $.parseJSON(thisData);
//            provinceId.select2({
//                placeholder: "请选择",
//                allowClear: true,
//                data: cData
//            });
//        },
//        error: function (data) {
//            //  alert("数据加载失败！");
//        }
//    });
//};