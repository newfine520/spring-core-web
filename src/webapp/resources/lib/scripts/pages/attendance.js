
$(function () {
    //initMap();
    $(".select2").select2();
    //省市下拉框
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    LoadAllArea($("#Area"));
    changeArea($("#Area"), $("#SubArea"));
    //BindDptTree("menuContent", "treeDemo", "txtDepartment");
    //BindDptTree("treeContent", "tree", "Department");
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });
    $(".datepicker").val(getNowFormatDate());
    $('#dataTable').bootstrapTable({
        url: "/System/Attendance/GetList",
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
                field: 'UserId',
                formatter: 'actionFormatter',
                events: 'OperateEvent'
            },
             {
                 field: 'AreaName',
                 title: '大区'
             },
             {
                 field: 'SubAreaName',
                 title: '小区'
             },
             {
                 field: 'ProvinceName',
                 title: '省份'
             },
             {
                 field: 'CityName',
                 title: '城市'
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
                  field: 'StoreAddress',
                  title: '门店地址',
                  formatter: 'substr'
              },
              {
                  field: 'UserNo',
                  title: '工号'
              },
              {
                  field: 'UserName',
                  title: '店员'
              },

             //, {
             //    field: 'AttendanceTimeString',
             //    title: '考勤时间',
             //    sortable: "false"
             //}
             //, {
             //    field: 'AttendType',
             //    title: '考勤类型',
             //    sortable: "false"
             //},
             //{
             //    title: '操作',
             //    field: 'Id',
             //    formatter: 'actionFormatter',
             //    events: 'OperateEvent'
             //},
             {
                 field: 'Mobile',
                 title: '手机'
             },

             {
                 field: 'TimeDiff',
                 title: '工作时长'
             },
             {
                 field: 'OnDutyTimeString',
                 title: '上班时间'
             },
             {
                 title: '上班定位',
                 field: 'OndutyLocation',
                 formatter: 'onlocationFormatter',
                 events: 'OperateEvent'
             },
             {
                 title: '上班距离(米)',
                 field: 'OndutyDistance'
             },
             //{
             //    field: 'ondutyComment',
             //    title: '上班备注',
             //    formatter: 'substrOndutyComment'
             //},
             {
                 field: 'OffDutyTimeString',
                 title: '下班时间'
             },
             {
                 title: '下班定位',
                 field: 'OffdutyLocation',
                 formatter: 'offlocationFormatter',
                 events: 'OperateEvent'
             },
              {
                  title: '下班距离(米)',
                  field: 'OffdutyDistance'
              },

             //{
             //    field: 'offdutyComment',
             //    title: '下班备注',
             //    formatter: 'substrOffdutyComment'
             //}


        ]
    });
    $('#dataTable').bootstrapTable("checkAll");

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    });

    var uploaderOn;
    var intw = 0;
    var uploaderOff;
    $('#AttdencePhotoModal').on('shown.bs.modal', function (e) {

        var $ = jQuery,
        $list = $('#fileList'),

        ratio = window.devicePixelRatio || 1,

        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio;

        uploaderOn = WebUploader.create({
            auto: true,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/System/Attendance/AddPhoto',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePickerOn',
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            fileNumLimit: 1
        });

        uploaderOff = WebUploader.create({
            auto: true,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: '/System/Attendance/AddPhoto',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePickerOff',
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            fileNumLimit: 1
        });

        uploaderOn.on('fileQueued', function (file) {

        });

        uploaderOn.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                        .appendTo($li)
                        .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploaderOn.on('uploadSuccess', function (file, data) {
            $('#' + file.id).addClass('upload-state-done');
            $('#picOn').val(data.Msg);
            $('#imgOnPhoto').prop("src", data.Msg);
            uploaderOn.removeFile(file);
            var obj = new Object();
            obj.imgPath = $('#picOn').val();
        });
        uploaderOff.on('uploadSuccess', function (file, data) {
            $('#' + file.id).addClass('upload-state-done');
            $('#picOff').val(data.Msg);
            $('#imgOffPhoto').prop("src", data.Msg);
            uploaderOff.removeFile(file);
            var obj = new Object();
            obj.imgPath = $('#picOff').val();
        });

        // 文件上传失败，显示上传出错。
        uploaderOn.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploaderOn.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });

    }).on('hidden.bs.modal', function (e) {
        $('#fileList').empty();
        uploaderOn.destroy();
        uploaderOff.destroy();
    });

    $("#ctlBtn").on("click", function () {
        uploader.upload();
    })


    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                ProvinceCode: $("#ProvinceCode").val(),
                CityCode: $("#CityCode").val(),
                AreaId: $("#Area").val(),
                SubAreaId: $("#SubArea").val(),
                UserNo: $("#txtUserNo").val(),
                UserName: $("#txtUserName").val(),
                StoreName: $("#txtStoreName").val(),
                StoreNo: $("#txtStoreNo").val(),
                AttendanceTypeCode: $("#selAttendanceTypeCode").val(),
                // AttendanceTime: $("#AttendanceTime").val(),
                AttendanceTimeSta: $("#AttendanceTimeSta").val(),
                AttendanceTimeEnd: $("#AttendanceTimeEnd").val(),
               // DepartmentId: $("#txtDepartmentId").val(),
                Mobile: $("#txtMobile").val(),
            },
            url: '/System/Attendance/ExportAttendance',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=考勤信息";
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })

    $("#btnLeaveExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                ProvinceCode: $("#ProvinceCode").val(),
                CityCode: $("#CityCode").val(),
                AreaId: $("#Area").val(),
                SubAreaId: $("#SubArea").val(),
                UserNo: $("#txtUserNo").val(),
                UserName: $("#txtUserName").val(),
                StoreName: $("#txtStoreName").val(),
                StoreNo: $("#txtStoreNo").val(),
                AttendanceTypeCode: $("#selAttendanceTypeCode").val(),
                AttendanceTimeSta: $("#AttendanceTimeSta").val(),
                AttendanceTimeEnd: $("#AttendanceTimeEnd").val(),
                Mobile: $("#txtMobile").val(),
            },
            url: '/System/Attendance/ExportLeavePost',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=离岗信息";
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })
   
})


$("#btnAddPhoto").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            OnDutyId: $("#UpRowId").val(),
            OffDutyId: $("#UpOffDutyId").val(),
            OnDutyPic: $("#picOn").val(),
            OffDutyPic: $("#picOff").val(),
            StoreId: $("#UpStoreId").val(),
            UserId: $("#UpUserId").val(),
        },
        url: '/System/Attendance/SetPhoto',
        success: function (data) {
            if (data.IsSuccess) {
                $("#AttdencePhotoModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

window.OperateEvent = {
    'click .detail': function (e, value, row, index) {
        $("#modalDetail").modal({ backdrop: 'static', keyboard: false });
        $.SubAjax({
            type: 'post',
            data: {
                StoreNo: row.StoreNo,
                PhotoTypeCode: PhotoType.Attendance,
                UploadType: "Attendance",
                UserId: row.UserId,
                ObjectIntId: row.RowId
            },
            url: '/Common/GetImages',
            success: function (data) {
                $("#isCorrect").html(data.Data.isCorrectArea);
                $("#checkTime").html(data.Data.CheckTime);
                if (data.TotalCount > 0) {
                    $("#carousel2").show();
                    var imasges = "";
                    var li = "";
                    $.each(data.Data, function (index, value) {

                        if (index == 0) {
                            li += '<li data-slide-to="0" data-target="#carousel2" class="active"></li>';
                            imasges += '<div class="item active"><img alt="image" class="img-responsive" src="' + value + '"></div>';
                        }
                        else {
                            li += '<li data-slide-to="' + index + '" data-target="#carousel2"></li>';
                            imasges += '<div class="item"><img alt="image" class="img-responsive" src="' + value + '"></div>';
                        }

                    })

                    $(".carousel-inner").html(imasges);
                    $(".carousel-indicators").html(li);
                }
                else {
                    $("#carousel2").hide();
                }
            }

        });
    },
    'click .uploadPhoto': function (e, value, row, index) {
        $("#AttdencePhotoModal").modal({ backdrop: 'static', keyboard: false });
        $("#UpRowId").val(row.RowId);
        $("#UpOffDutyId").val(row.OffDutyId);
        $("#UpStoreId").val(row.StoreId);
        $("#UpUserId").val(row.UserId);
        $("#imgOnPhoto").prop("src", "");
        $("#picOn").val("");
        $("#imgOffPhoto").prop("src", "");
        $("#picOff").val("");
    },
    'click .detail1': function (e, value, row, index) {
        $("#modalDetail").modal({ backdrop: 'static', keyboard: false });
        $.SubAjax({
            type: 'post',
            data: {
                StoreNo: row.StoreNo,
                PhotoTypeCode: PhotoType.Attendance,
                UploadType: "Attendance",
                UserId: row.UserId,
                ObjectIntId: row.OffDutyId
            },
            url: '/Common/GetImages',
            success: function (data) {
                $("#isCorrect").html(data.Data.isCorrectArea);
                $("#checkTime").html(data.Data.CheckTime);
                if (data.TotalCount > 0) {
                    $("#carousel2").show();
                    var imasges = "";
                    var li = "";
                    $.each(data.Data, function (index, value) {
                        if (index == 0) {
                            li += '<li data-slide-to="0" data-target="#carousel2" class="active"></li>';
                            imasges += '<div class="item active"><img alt="image" class="img-responsive" src="' + value + '"></div>';
                        }
                        else {
                            li += '<li data-slide-to="' + index + '" data-target="#carousel2"></li>';
                            imasges += '<div class="item"><img alt="image" class="img-responsive" src="' + value + '"></div>';
                        }
                    })

                    $(".carousel-inner").html(imasges);
                    $(".carousel-indicators").html(li);
                }
                else {
                    $("#carousel2").hide();
                }
            }

        });
    },
    'click .onlocation': function (e, value, row, index) {
        $("#modalAttendanceLocation").modal({ backdrop: 'static', keyboard: false });
        var location = row.OndutyLocation.split(',');
        $("#longitude").val(location[0]);
        $("#latitude").val(location[1]);
        if (row.StoreLocation != null) {
            location = row.StoreLocation.split(',');
            $("#storeLongitude").val(location[0]);
            $("#storeLatitude").val(location[1]);
        }
        
    },
    'click .offlocation': function (e, value, row, index) {
        $("#modalAttendanceLocation").modal({ backdrop: 'static', keyboard: false });
        var location = row.OffdutyLocation.split(',');
        $("#longitude").val(location[0]);
        $("#latitude").val(location[1]);
        if (row.StoreLocation != null) {
            location = row.StoreLocation.split(',');
            $("#storeLongitude").val(location[0]);
            $("#storeLatitude").val(location[1]);
        }

        
    },
    'click .leavePost': function (e, value, row, index) {
        //alert(row.OnDutyTime);
        $.SubAjax({
            type: 'post',
            data: {
                StoreId: row.StoreId,
                UserId: row.UserId,
                OnDutyTimes: row.OnDutyTimeString,
                OffDutyTimes: row.OffDutyTimeString,
                AttendanceDay: row.AttendanceDayString
            },
            url: '/System/Attendance/QueryLeavePostListPC',
            success: function (data) {
                if (data.IsSuccess) {
                    if (data.Data != null && data.Data != "") {
                        var tpl = $("#tpl").html();
                        var html = juicer(tpl, data);
                        $("#LeavePostDiv").html(html);
                    }
                    else {
                        $("#LeavePostDiv").html(' <label>没有离岗记录！</label>');
                    }
                    $("#LeavePostPartialModal").modal({
                        backdrop: 'static', keyboard: false
                    });
                }
                else {
                    $.ShowMessage("error", "没有配置检测项")
                }
            }
        });

    },
}
$('#modalAttendanceLocation').on('shown.bs.modal', function (e, value, row, index) {
    //map.clearOverlays();
    //$("#allmap").clear();
    var map = new BMap.Map("allmap");
    var new_point = new BMap.Point($("#longitude").val(), $("#latitude").val())
    var new_point_store = new BMap.Point($("#storeLongitude").val(), $("#storeLatitude").val())
    map.centerAndZoom(new_point_store, 17);
    map.centerAndZoom(new_point, 17);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.NavigationControl());
    var marker = new BMap.Marker(new_point);  // 创建标注
    map.addOverlay(marker);
    var label = new BMap.Label("打卡定位", { offset: new BMap.Size(20, -5) });
    //label.setStyle({
    //    color: "Red",
    //    fontSize: "15px",
    //    backgroundColor: "0.05",
    //    border: "5",
    //    fontWeight: "bold"
    //});
    marker.setLabel(label);
    
    var storeMarker = new BMap.Marker(new_point_store);
    map.addOverlay(storeMarker);
    var storeLabel = new BMap.Label("门店定位", { offset: new BMap.Size(20, -5) });
    //storeLabel.setStyle({
    //    color: "Red",
    //    fontSize: "15px",
    //    backgroundColor: "0.05",
    //    border: "5",
    //    fontWeight: "bold"
    //});
    storeMarker.setLabel(storeLabel);
    
    //map.panTo(new_point);
})

function substr(value, row, index) {
    if (row.StoreAddress != null) {
        var leng = row.StoreAddress;
        if (row.StoreAddress.length > 3) {
            leng = row.StoreAddress.substr(0, 3) + '...'
        }
        return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.StoreAddress + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
    }
}


function queryParams(params) {
    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceCode: $("#ProvinceCode").val(),
        CityCode: $("#CityCode").val(),
        UserName: $("#txtUserName").val(),
        UserNo: $("#txtUserNo").val(),
        StoreName: $("#txtStoreName").val(),    
        StoreNo: $("#txtStoreNo").val(),
        Mobile: $("#txtMobile").val(),
        AttendanceTypeCode: $("#selAttendanceTypeCode").val(),
        AttendanceTimeSta: $("#AttendanceTimeSta").val(),
        AttendanceTimeEnd: $("#AttendanceTimeEnd").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
    };
}

$("#btnGetTempleteFile").on("click", function () {

    $.SubAjax({
        type: 'post',
        //data: { CategoryNo: categoryNo },
        url: '/System/Attendance/ExportTemplate',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=考勤导入模板";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

/* excel文件上传解析 */
var excelUploader;
var intw = 0;
$('#ImportModal').on('shown.bs.modal', function (e) {
    excelUploader = WebUploader.create({
        auto: false,
        swf: '/Plugins/webuploader/Uploader.swf',
        server: '/System/Attendance/ImportAttendance',
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

function checkAll($this) {
    var _this = $($this);
    if (_this.is(":checked")) {
        $('#dataTable').bootstrapTable("checkAll");

    }
    else {
        $('#dataTable').bootstrapTable("uncheckAll");
        $("#UserIds").val('');
    }
}
function actionFormatter(value, row, index) {
    if (row.OnDutyTimeString != null && row.OnDutyTimeString != "") {
        var results = '<a class="leavePost"  title="离岗信息">离岗信息</a>';
        results += '<a class="detail"  title="照片">  上班</a>';
    }
        if (row.OffDutyTimeString != null && row.OffDutyTimeString != "")
        { results += '<a class="detail1"  title="照片">  下班</a>'; }

        results += '<a class="uploadPhoto" data-role="Admin" title="上传照片">  上传</a>'
    return results;
}
function onlocationFormatter(value, row, index) {
    if (row.OndutyLocation != null && row.OndutyLocation != "")
    { var results = '<a class="onlocation"  title="上班定位"><image src="/images/location.jpg" class="loc"/></a>'; }
    return results;
}
function offlocationFormatter(value, row, index) {
    if (row.OffdutyLocation != null && row.OffdutyLocation != "")
    { var results = '<a class="offlocation"  title="下班定位">  <image src="/images/location.jpg"  class="loc"/></a>'; }
    return results;
}

function substrOndutyComment(value, row, index) {
    if (row.OndutyComment != null) {
        var leng = row.OndutyComment;
        if (row.OndutyComment.length > 10) {
            leng = row.OndutyComment.substr(0, 10) + '...'
        }
        return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.OndutyComment + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
    }
}

function substrOffdutyComment(value, row, index) {
    if (row.OffdutyComment != null) {
        var leng = row.OffdutyComment;
        if (row.OffdutyComment.length > 10) {
            leng = row.OffdutyComment.substr(0, 10) + '...'
        }
        return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.OffdutyComment + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate;
}