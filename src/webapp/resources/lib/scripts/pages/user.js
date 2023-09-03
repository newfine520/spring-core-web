
$(function () {
    loadAllProvince($("#ProvinceCode"), true);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    LoadAllAreas($("#Area"), true);
    changeAreas($("#Area"), $("#SubArea"))
    $(".select2").select2();
    $('#dataTable').bootstrapTable({
        url: "/sysUserList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            //RenderRoleButton();
        },
        columns: [
            //{
            //    title: '<input data-index="0"  type="checkbox" onClick="checkAll(this)" />',
            //    formatter: function (value, row, index) {
            //        return '<input data-index="0" name="btSelectItem"  type="checkbox" value="' + row.UserId + '"/>'
            //    }
            //},
            {
              field: 'checked',
              checkbox:true,
              align: 'center',
              valign:'middle'
            },
            {
                title: '操作',
                field: 'id',
                formatter: 'actionFormatter',
                events: 'userLeaveOperate'
            }, {
                field: 'userName',
                title: '姓名',
                sortable: "true"
            }, {
                field: 'userNo',
                title: '工号',
                sortable: "true"
            },
            {
                field: 'sexCode',
                title: '性别'
            },
            {
                field: 'roleCode',
                title: '角色名'
            },
            {
                field: 'positionId',
                title: '职位名'
            },
            {
                field: 'mobile',
                title: '手机号'
            }, {
                field: 'parentName',
                title: '上级'
            },
            {
                field: 'serviceStatusCode',
                title: '在职状态'
            }, {
                field: 'registerAddress',
                title: '户籍地址'
             },
            // {
            //     field: 'WorkAge',
            //     title: '奥维思工龄'
            // },
            {
                field: 'owsEntryDate',
                title: '奥维思入职日期'
            },
            {
                field: 'entryDate',
                title: '入职日期'
            }
            
        ]
    });
    $('#dataTable').bootstrapTable("checkAll");

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    })
    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/upload',
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

    var uploader1;
    var intw1 = 0;
    $('#modalImportUserStore').on('shown.bs.modal', function (e) {
        uploader1 = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/System/User/ImportUserStore',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker1',
            accept: {
                title: 'excel',
                extensions: 'xlsx,xls',
                mimeTypes: 'application/*'
            },
            fileNumLimit: 1
        });
        uploader1.on('fileQueued', function (file) {
            $("#thelist1").empty();
            $("#thelist1").append('<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">请上传.....</p>' +
                '</div>');

        });
        uploader1.on('uploadProgress', function (file, percentage) {
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
        });
        uploader1.on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#modalImportUserStore").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelist1').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelist1').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")
                })
                uploader1.removeFile(file);
            }
        });

        uploader1.on('uploadError', function (file, reason) {
            $('#' + file.id).find('p.state').text('上传出错:原因' + reason);
        });

        uploader1.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw1)
        });
    }).on('hidden.bs.modal', function (e) {
        uploader1.destroy();
        $('#thelist1').empty();
    });

    $("#ctlBtn1").on("click", function () {
        uploader1.upload();
    })

    //弹出替换上级
    $("#btnUpdataParent").on("click", function () {
        var userIds = "";
        var userNames = "";
        $("[name='btSelectItem']").each(function () {
            if ($(this).is(":checked")) {
                userIds += $(this).val() + ",";
                userNames += $(this).parent().parent().find("td").eq(1).html() + ",";
            }
        })
        if (userIds == "") {
            $.ShowMessage("warning", "请选择人员！");
            return;
        }
        $("#AllUser").html(userNames);
        $("#UserIds").val(userIds)
        $("#modalChief").modal({ backdrop: 'static', keyboard: false });
    })

    //替换上级操作
    $("#btnUpdateChief").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: { UserIds: $("#UserIds").val(), CheifUserId: $("#selUserChief").val() },
            url: '/System/User/UpdateChief',
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", "更新成功！");
                    $("#modalChief").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })


})

window.userLeaveOperate = {
  
    'click .resetPassword': function (e, value, row, index) {
        ResetPassword(row.UserId)
    }, 'click .check': function (e, value, row, index) {
        editUser(row.UserId);
        $("#btnUpdate").hide();
        $("#UserForm").find("input").prop("disabled", true);
        $("#UserForm").find("select").prop("disabled", true);
        $("#UserForm").find("textarea").prop("disabled", true);
        $("#btnAdd").hide();
    }

}

var userForm = $("#UserForm");
userForm.validate({
    rules: {
        UserName: {
            required: true
        },
        UserNo: {
            required: true
        },
        PositionType:
        {
            required: true
        },
        Mobile:
        {
            required: true
        },
        PositionStatus:
        {
            required: true
        }       
    },
    messages: {
        UserName: {
            required: "请输入姓名",
        },
        UserNo: {
            required: "请输入工号",
        },
        PositionType:
        {
            required: "请选择职位",
        },
        Mobile:
        {
            required: "请输入手机号",
        },
        PositionStatus:
        {
            required: "请输入在职状态",
        }
    }
})

function queryParams(params) {
    return {
        userName: $("#txtUserName").val(),
        userNo: $("#txtUserNo").val(),
        positionId: $("#selPosition").val(),
        //SelRoleType: $("#selRoleType").val(),
        serviceStatusCode: $("#selPositionStatusCode").val(),
        roleId:$("#selRoleType").val(),
        //Dispatch: $("#selDispatch").val(),
        //DepartmentId: $("#txtDepartmentId").val(),
        //ParentId: $("#selSuperior").val(),
        limit: params.limit,   //页面大小
        page: params.offset/params.limit+1//  sort: params.sort,  //排序列名
        //sortOrder: params.order,
        //SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=editUser("' + value + '") data-role="Admin" title="编辑">编辑</a>';
    results += '<a class="check ml10" href="javascript:void(0)"title="查看"> 查看</a>';
    //if (row.PositionStatus != "离职") {
    //    results += '<a class="leave ml10" href="javascript:void(0)"data-role="Admin" title="离职"> 离职</a>'
    //}
    //if (row.PositionStatus == "待入职") {
    //    results += '<a class="entry ml10" href="javascript:void(0)"data-role="Admin" title="确认入职"> 确认入职</a>'
    //}
    return results;
}
$("#btnAddShow").on("click", function () {
    $("input[name='ProvinceCode']").val("")
    $("input[name='CityCode']").val("")
    $("input[name='AreaCode']").val("")
    $("input[name='SubAreaCode']").val("")
    $("#btnAdd").show();
    $("#btnUpdate").hide();
    $('#myModal').modal({ backdrop: 'static', keyboard: false });
    $("#UserForm").find(".form-control").val('');
    $("#UserForm").find(".select2").val('');
    $("#UserForm").find(".select2").select2();
    $("#EntryDateA2").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#OWSEntryDateA2").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#LeaveDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#BirthDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#UserForm").find("input").prop("disabled", false);
    $("#UserForm").find("select").prop("disabled", false);
    $("#UserForm").find("textarea").prop("disabled", false);
    $("#UserForm").find("label.error").remove();
    $("#UserForm").find("input.error").removeClass("error");

})
$('#myModal').on('shown.bs.modal', function (e) {
    $(".select2").select2();
})


$("#btnAdd").on("click", function () {
    $("input[name='ProvinceCode']").val($("#ProvinceCode").val())
    $("input[name='CityCode']").val($("#CityCode").val())
    $("input[name='AreaCode']").val($("#Area").val())
    $("input[name='SubAreaCode']").val($("#SubArea").val())
    if (userForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/User/AddUser',
            data: userForm.serializeToJson(),
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
    $("input[name='ProvinceCode']").val($("#ProvinceCode").val())
    $("input[name='CityCode']").val($("#CityCode").val())
    $("input[name='AreaCode']").val($("#Area").val())
    $("input[name='SubAreaCode']").val($("#SubArea").val())
    if (userForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/User/UpdateUser',
            data: userForm.serializeToJson(),
            dataType: "json",
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

$("#btnExport").on("click", function () {
    var body={
        userName: $("#txtUserName").val(),
          userNo: $("#txtUserNo").val(),
        positionId: $("#selPosition").val()
    };
    //20211122用axios请求库接收流文件，实现浏览器下载Excel功能
    axios.post('/exportUserList',body, {
        responseType: 'blob'
    }).then( function (res){
        var filename = decodeURI(res.headers['content-disposition'].match(/(filename=(.*))/)[2])
        var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });

        var objectUrl = URL.createObjectURL(blob);
        var $a = $("<a>")
        $a.attr("href", objectUrl)
        $a.attr("download", filename)
        $("body").append($a)
        $a[0].click(0);
        $a.remove()

    }).catch(function (res) {
        console.log(res)
    })
})
//$("#PositionType").change(function () {
//    if ($(this).val() == '5000410') {
//        $("#ParentId").val("");
//        $("#ParentId").select2();
//        $("#ParentId").prop("disabled", true);
//    }
//    else {
//        $("#ParentId").prop("disabled", false);
//    }
//})
function editUser(userId) {
    $("#UserForm").find("input").prop("disabled", false);
    $("#UserForm").find("select").prop("disabled", false);
    $("#UserForm").find("textarea").prop("disabled", false);
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#PositionStatus").val("")
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#EntryDateA2").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#OWSEntryDateA2").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#LeaveDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#BirthDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    $("#UserForm").find("label.error").remove();
    $("#UserForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { userId: userId },
        url: '/System/User/GetUserDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#UserId").val(userId);
                $("#UserName").val(data.UserName);
                $("#Department").val(data.DepartmentName);
                $("#DepartmentId").val(data.DepartmentId);
                $("#UserNo").val(data.UserNo);
                $("#PositionId").val(data.PositionId);
                $("#PositionType").val(data.PositionType);
                $("#RoleType").val(data.RoleType);
                $("#PositionStatus").val(data.PositionStatusCode);
                $("#WorkArea").val(data.WorkArea);
                $("#IdCard").val(data.IdCard);
                //$("#ParentId").prop("disabled", true);
                
                //if (data.PositionType == '5000410') {
                //    $("#ParentId").prop("disabled", true);
                //    $("#ParentId").val("")
                //}
                //else {
                //    $("#ParentId").prop("disabled", false);
                //}
                $("#SexCode").val(data.SexCode);
                $("#ProvinceCode").val(data.ProvinceCodes);
                $("#Area").val(data.AreaCodes);
                $("#EntryDateA2").val(data.EntryDateA2);
                $("#OWSEntryDateA2").val(data.OWSEntryDateA2);
                $("#LeaveDate").val(data.StrLeaveDate);
                $("#EntryDateUC").val(data.EntryDateUC);
                $("#Rank").val(data.Rank);
                $("#DispatchCode").val(data.DispatchCode);
                $("#Address").val(data.Address);
                $("#RegisterAddress").val(data.RegisterAddress);
                $("#Remark").val(data.Remark);
                $("#Mobile").val(data.Mobile)
                $("#ParentId").val(data.ParentId);
                $("#Email").val(data.Email);
                $("#SysItems").val(data.SysItems);
                if (data.ProvinceCode != "" && data.ProvinceCode != null) {
                    getCityByProvince($("#ProvinceCode"), $("#CityCode"))
                }
                $("#CityCode").val(data.CityCodes);
                if (data.AreaCodes != "" && data.AreaCodes != null) {
                    getSubAreaByAreas($("#Area"), $("#SubArea"))
                }
                $("#SubArea").val(data.SubAreaCodes);
                $(".select2").select2();

            }
            else {
                $.ShowMessage("error", data.Msg)
            }

        }
    });
}

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

//$("#btnOk").on("click", function () {
//    if ($("#txtLeaveDate").val() == "") {
//        $.ShowMessage("warning", "请选择离职日期");
//        return;
//    }
//    $.SubAjax({
//        type: 'post',
//        url: '/System/User/UserLeave',
//        data: { UserId: $("#leaveUseId").val(), LeaveTime: $("#txtLeaveDate").val(), LeaveTimePropose: $("#txtLeaveTimePropose").val() },
//        success: function (data) {
//            if (data.IsSuccess) {
//                $.ShowMessage("success", data.Msg);
//                //$("#modalLeave").modal("hide");
//                $('#dataTable').bootstrapTable("refresh");
//            }
//            else {
//                $.ShowMessage("error", data.Msg)
//            }
//        }
//    });
//})
//function UserEntry(userId) {
//    $("#btnOkEntry").on("click", function () {
//        if ($("#txtEntryDate").val() == "") {
//            $.ShowMessage("warning", "请选择入职日期");
//            return;
//        }
//        $.SubAjax({
//            type: 'post',
//            url: '/System/User/UserEntry',
//            data: { UserId: userId, EntryTime: $("#txtEntryDate").val() },
//            success: function (data) {
//                if (data.IsSuccess) {
//                    $.ShowMessage("success", data.Msg);
//                    //$("#modalLeave").modal("hide");
//                    $('#dataTable').bootstrapTable("refresh");
//                }
//                else {
//                    $.ShowMessage("error", data.Msg)
//                }
//            }
//        });
//    })
//}

$("#btnSync").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            PositionCode: $("#selPosition").val(),
            SelRoleType: $("#selRoleType").val(),
            PositionStatusCode: $("#selPositionStatusCode").val(),
            Dispatch: $("#selDispatch").val(),
            DepartmentId: $("#txtDepartmentId").val(),
            ParentId: $("#selSuperior").val(),
        },
        url: '/System/User/SyncUser',
        success: function (data) {
            if (data.IsSuccess) {
                $.ShowMessage("success", data.Msg);
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})

$("#btnUserStoresExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            PositionCode: $("#selPosition").val(),
            SelRoleType: $("#selRoleType").val(),
            PositionStatusCode: $("#selPositionStatusCode").val(),
            Dispatch: $("#selDispatch").val(),
            DepartmentId: $("#txtDepartmentId").val(),
            ParentId: $("#selSuperior").val(),
        },
        url: '/System/User/ExportUserStores',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=人店关系表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})
$("#btnSend").on("click", function () {
    $('#modalSend').modal({ backdrop: 'static', keyboard: false });
})
$("#btnContractSend").on("click", function () {
    var rows=$("#dataTable").bootstrapTable('getSelections');
    var ids="";
    $.each(rows,function (index,item)
    {
        if(index!=rows.length-1)
        {
            ids+=item.id+",";
        }
        else
        {
            ids+=item.id;
        }
    })
//20211128不知道为啥$("#contractTemplateId).text获取选中项的值是这样的：\n                                                \n                                                离职电子签约（店内/执行）\n                                            todo
    $.SubAjax({
        //20211128 todo
        type: 'post',
        data: {
            userIds:ids,
            contractTemplateId:$("#contractTemplateId").val(),
            contractTemplateName:$("select[name='contractTemplateId'] option:selected").text(),
            contractType:$("#ContractType").val(),
            contractTemplateEnum:512
        },
        url: '/sendContract',
        success: function (data) {
             if (data.code==0) {
                 $.ShowMessage("success", "发送成功！");

             }
                 $("#modalSend").modal("hide");
            //     $('#dataTable').bootstrapTable("refresh");
            // }
            // else {
            //     $.ShowMessage("error", data.Msg)
            // }
        }
    });
})
