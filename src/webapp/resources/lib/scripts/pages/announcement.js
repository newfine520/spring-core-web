var editor;

$(function () {

    KindEditor.ready(function (K) {
        editor = K.create('textarea[name="content"]', {
            uploadJson: '/DataImport/Announcement/AddPhoto',
            newlineTag : 'br',
            allowFileManager: true,
            afterBlur: function () { this.sync(); }
        });
    });
    loadAllProvince($("#ProvinceCode"),true);
    changeProvinceByAnn($("#ProvinceCode"), $("#CityCode"))
    LoadAllAreas($("#Area"), true);
    changeAreasByAnn($("#Area"), $("#SubArea"));
    //loadAllChannel($("#ChanelId"));
    $(".select2").select2();

    $(".datetimepicker").datetimepicker({
    language: 'zh-CN',
    todayBtn: 1,
    pickerPosition: "bottom-left",
    minuteStep: 10,
    format: 'yyyy-mm-dd hh:ii',
    autoclose: true,
    });
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Announcement/GetAnnouncementList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        clickToSelect: true,
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            {
                title: '操作',
                field: 'Id',
                formatter: 'actionFormatter',
                //events: 'Operate',
            },
            {
                field: 'Title',
                title: '公告标题',
                formatter: 'annFormatter'
            }, {
                field: 'Content',
                title: '公告内容',
                visible: false
            }, {
                field: 'AnnType',
                title: '公告类型'
            },{
                field: 'Range',
                title: '公告范围(角色)'
            },
            {
                field: 'AreaCode',
                title: '大区'
            }, {
                field: 'SubAreaCode',
                title: '小区'
            }, {
                field: 'ProvinceCode',
                title: '省份'
            }, {
                field: 'CityCode',
                title: '城市'
            },
            {
                field: 'ChannelId',
                title: '渠道'
            }, {
                field: 'Chain',
                title: '系统'
            },
            {
                field: 'Distributor',
                title: '经销商'
            },
            {
                field: 'StrBeginTime',
                title: '开始时间',
            },{
                field: 'StrEndTime',
                title: '结束时间',
            }
        ],
    });
})
function substr(value, row, index) {
    if (row.Content != null) {
        var leng = row.Content;
        if (row.Content.length > 15) {
            leng = row.Content;
            leng = leng.replace(/\"/g, "");
            leng = leng.replace(/[;=<>&\|\\\*^%$#@\-]/g, "");
            leng = leng.replace(/[a-zA-Z]/g, "");
            leng = leng.substr(0, 15) + '...'
        }
        var temp = row.Content;
        temp = temp.replace(/\"/g, "'");
        return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + temp + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
    }
}
function queryParams(params) {
    return {
        Title: $("#txtTitle").val(),
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
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=editAnnouncement("' + value + '") data-role="Admin" title="编辑">编辑</a>';
    results += '<a class="delete" onclick=deleteAnnounce("' + value + '") data-role="Admin" title="删除"> 删除</a>';
    //results += '<a class="check ml10" href="javascript:void(0)"title="查看"> 查看</a>';
    return results;
}

function annFormatter(value, row, index) {
    var results = '';
    if (row.Type == "1002") {
        results += '<a onclick=openpage("' + row.Content + '") data-role="Admin" title="公告链接"><u>' + value + '</u></a>';
        //results = '<a href=\"' + row.Content + '\" data-role="Admin" title="公告链接" target="_blank"><u>' + value + '</u></a>';
    }
    else {
        results = value;
    }
    
    return results;
}

function openpage(src) {
    $("#LinkModal").modal({ backdrop: 'static', keyboard: false });
    //$('iframe').attr('src', src);
    document.getElementById("aaa").innerHTML = '<object type="text/html" data="' + src + '" width="100%" height="100%"></object>';
}

function editAnnouncement(Id) {
    //loadAllChannel($("#ChanelId"));
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#announcementForm").find("label.error").remove();
    $("#announcementForm").find("input.error").removeClass("error");
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/Announcement/GetAnnouncementDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#AnnouncementId").val(Id);
                $("#Title").val(data.Title);
                $("#Range").val(data.Ranges);
                $("#ProvinceCode").val(data.ProvinceCodes);
                $("#Area").val(data.AreaCodes);
                $("#Channel").val(data.ChannelIds);
                if (data.ProvinceCode != "" && data.ProvinceCode != null) {
                    getCityByProvinceByAnn($("#ProvinceCode"), $("#CityCode"))
                }
                $("#CityCode").val(data.CityCodes);
                if (data.AreaCodes != "" && data.AreaCodes != null) {
                    getSubAreaByAreasByAnn($("#Area"), $("#SubArea"))
                }
                $("#SubArea").val(data.SubAreaCodes);
                $("#Chain").val(data.Chains);
                $("#Distributor").val(data.Distributors);
                editor.html(data.Content);
                $("#BeginTime").val(data.StrBeginTime);
                $("#EndTime").val(data.StrEndTime);
                $("input[name='Type'][value='" + data.Type + "']").prop("checked", true);
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
}
var announcementForm = $("#announcementForm");
announcementForm.validate({
    rules: {

        Title: {
            required: true
        },
        Content: {
            required: true
        },
        BeginTime: {
            required: true
        },
        EndTime: {
            required: true
        },
    },
    messages: {

        Title: {
            required: "请输入公告标题",
        },
        Content: {
            required: "请输入公告内容",
        },
        BeginTime: {
            required: "请输入开始时间",
        },
        EndTime: {
            required: "请输入结束时间",
        },
    }
})
$("#btnUpdate").on("click", function () {
    var start = $("#BeginTime").val();
    var end = $("#EndTime").val();
    $("#Ranges").val($("#Range").val());
    $("input[name='ProvinceCodes']").val($("#ProvinceCode").val())
    if ((',' + $("#CityCode").val()).indexOf(',0') != -1) {
        $("input[name='CityCodes']").val('0');
    }
    else {
        $("input[name='CityCodes']").val($("#CityCode").val())
    }
    $("input[name='Areas']").val($("#Area").val())
    if ((',' + $("#SubArea").val()).indexOf(',0') != -1) {
        $("input[name='SubAreas']").val('0');
    }
    else {
        $("input[name='SubAreas']").val($("#SubArea").val())
    }
    $("input[name='Channels']").val($("#Channel").val())
    $("input[name='Chains']").val($("#Chain").val())
    $("input[name='Distributors']").val($("#Distributor").val())
    var type = $('input:radio:checked').val();
    if (start >= end) {
        $.ShowMessage("warning", "结束时间必须大于开始时间");
        return false;
    }
    var Id = $("#AnnouncementId").val();
 

    if (announcementForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Announcement/UpdateAnnouncement?Id=' + Id,
            data: {
                Range: $("#Range").val(),
                Ranges: $("#Ranges").val(),
                ProvinceCode: $("input[name='ProvinceCodes']").val(),
                CityCode: $("input[name='CityCodes']").val(),
                AreaCode: $("input[name='Areas']").val(),
                SubAreaCode: $("input[name='SubAreas']").val(),
                ChannelId: $("input[name='Channels']").val(),
                Chain: $("#Chains").val(),
                Distributor: $("#Distributors").val(),
                BeginTime: $("#BeginTime").val(),
                EndTime: $("#EndTime").val(),
                EndTime: $("#EndTime").val(),
                Title: $("#Title").val(),
                Type: type,
                Content: editor.html(),
                AnnouncementId: $("#AnnouncementId").val(),
            },
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
});

$("#btnAddShow").on("click", function () {
    $("input[name='ProvinceCode']").val("")
    $("input[name='CityCode']").val("")
    $("input[name='AreaCode']").val("")
    $("input[name='SubAreaCode']").val("")
    $("input[name='Channel']").val("")
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#announcementForm").find(".form-control").val('');
    //重置select
    $("#announcementForm").find(".select2").val('');
    $("#announcementForm").find(".select2").select2();

});

$("#btnAdd").on("click", function () {
    var start = $("#BeginTime").val();
    var end = $("#EndTime").val();
    $("#Ranges").val($("#Range").val());
    $("input[name='ProvinceCodes']").val($("#ProvinceCode").val())
    if ((',' + $("#CityCode").val()).indexOf(',0') != -1) {
        $("input[name='CityCodes']").val('0');
    }
    else {
        $("input[name='CityCodes']").val($("#CityCode").val())
    }
    $("input[name='Areas']").val($("#Area").val())
    if ((',' + $("#SubArea").val()).indexOf(',0') != -1) {
        $("input[name='SubAreas']").val('0');
    }
    else {
        $("input[name='SubAreas']").val($("#SubArea").val())
    }
    $("input[name='Channels']").val($("#Channel").val())
    $("input[name='Chains']").val($("#Chain").val())
    $("input[name='Distributors']").val($("#Distributor").val())
    var type = $('input:radio:checked').val();
    if (start >= end) {
        $.ShowMessage("warning", "结束时间必须大于开始时间");
        return false;
    }
    if (announcementForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Announcement/Addannouncement',
            data: {
                Range: $("#Range").val(),
                ProvinceCode: $("input[name='ProvinceCodes']").val(),
                CityCode: $("input[name='CityCodes']").val(),
                AreaCode: $("input[name='Areas']").val(),
                SubAreaCode: $("input[name='SubAreas']").val(),
                ChannelId: $("input[name='Channels']").val(),
                Ranges: $("#Ranges").val(),
                Chain: $("#Chains").val(),
                Distributor: $("#Distributors").val(),
                BeginTime: $("#BeginTime").val(),
                EndTime: $("#EndTime").val(),
                Title: $("#Title").val(),
                Type: type,
                Content: editor.html(),
            },
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
});


function deleteAnnounce(Id) {
    parent.layer.confirm('确定删除该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Announcement/DeleteAnnouncement',
            data: { Id: Id },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
                layer.closeAll('dialog');
            }
        });
    }, function () {
    })
}

function loadAllChannel(channelId) {
    $.ajax({
        type: "post",
        url: "/Common/GetChannelList",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            var jsonData = eval(data.Data);
            var thisData = "[";
            $.each(jsonData, function (index, item) {
                thisData += "{\"id\":\"" + item.ChanelId + "\",\"text\":\"" + item.ChanelName + "\"},";
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            channelId.select2({
                placeholder: "请选择",
                allowClear: true,
                data: cData
            });
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
}

function changeAreasByAnn(area, subarea) {
    area.on("change", function () {
        var value = $(this).val();
        if (value == "" || value == null) {
            subarea.empty();
            subarea.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.ajax({
                type: "post",
                url: "/Common/GetSubAreasList",
                dataType: "json",
                cache: false,
                async: false,
                success: function (data) {
                    var jsonData = eval(data.Data);
                    var V = "," + value + ",";
                    if (V.indexOf(",0,") > -1) {
                        var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                    }
                    else {
                        var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                        //有单选和多选
                        if ((value.length > 1)) {
                            value = value + ",";
                            $.each(jsonData, function (index, item) {
                                if (value.indexOf(item.AreaId + ",") > -1) {
                                    thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                                }
                            });
                        }
                        else {
                            $.each(jsonData, function (index, item) {
                                if (value == item.AreaId) {
                                    thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                                }
                            });
                        }
                    }
                    thisData = thisData.substring(0, thisData.length - 1);
                    thisData += "]";
                    var cData = $.parseJSON(thisData);
                    subarea.empty();
                    subarea.select2({
                        placeholder: "请选择",
                        allowClear: true,
                        data: cData
                    });
                },
                error: function (data) {
                    //  alert("数据加载失败！");
                }
            });
        }
    });
}

function getSubAreaByAreasByAnn(area, subarea) {
    var value = area.val();
    if (value != "" && value != null) {
        $.ajax({
            type: "post",
            url: "/Common/GetSubAreasList",
            dataType: "json",
            cache: false,
            async: false,
            success: function (data) {
                var jsonData = eval(data.Data);
                var V = "," + value + ",";
                if (V.indexOf(",0,") > -1) {
                    var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                }
                else {
                    var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                    if (value.length > 1) {
                        value = value + ",";
                        $.each(jsonData, function (index, item) {
                            if (value.indexOf(item.AreaId + ",") > -1) {
                                thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                            }
                        });
                    }
                    else {
                        $.each(jsonData, function (index, item) {
                            if (value == item.AreaId) {
                                thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                            }
                        });
                    }
                }
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                subarea.empty();
                subarea.select2({
                    placeholder: "请选择",
                    allowClear: true,
                    data: cData
                });

            },
            error: function (data) {
                //  alert("数据加载失败！");
            }
        });
    }
}

function changeProvinceByAnn(province, city) {
    province.on("change", function () {
        var value = $(this).val();
        if (value == "" || value == null) {
            city.empty();
            city.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.ajax({
                type: "post",
                url: "/Common/GetCityList",
                dataType: "json",
                cache: false,
                async: false,
                success: function (data) {
                    var jsonData = eval(data.Data);
                    var V = "," + value + ",";
                    if (V.indexOf(",0,") > -1) {
                        var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                    }
                    else {
                        var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";

                        //有单选和多选
                        if ((value.length > 1)) {
                            value = value + ",";
                            $.each(jsonData, function (index, item) {
                                if (value.indexOf(item.ProvinceId + ",") > -1) {
                                    thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
                                }
                            });
                        }
                        else {
                            $.each(jsonData, function (index, item) {
                                if (value == item.ProvinceId) {
                                    thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
                                }
                            });
                        }
                    }
                    thisData = thisData.substring(0, thisData.length - 1);
                    thisData += "]";
                    var cData = $.parseJSON(thisData);
                    city.empty();
                    city.select2({
                        placeholder: "请选择",
                        allowClear: true,
                        data: cData
                    });
                },
                error: function (data) {
                    //  alert("数据加载失败！");
                }
            });
        }
    });
}

function getCityByProvinceByAnn(province, city) {
    var value = province.val();
    if (value != "" && value != null) {
        $.ajax({
            type: "post",
            url: "/Common/GetCityList",
            dataType: "json",
            cache: false,
            async: false,
            success: function (data) {
                var jsonData = eval(data.Data);
                var V = "," + value + ",";
                if (V.indexOf(",0,") > -1) {
                    var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                }
                else {
                    var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                    if ((value.length > 1)) {
                        value = value + ",";
                        $.each(jsonData, function (index, item) {
                            if (value.indexOf(item.ProvinceId + ",") > -1) {
                                thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
                            }
                        });
                    }
                    else {
                        $.each(jsonData, function (index, item) {
                            if (value == item.ProvinceId) {
                                thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
                            }
                        });
                    }
                }
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                city.empty();
                city.select2({
                    placeholder: "请选择",
                    allowClear: true,
                    data: cData
                });
                //if (district) {
                //    changeCity(city, district)
                //}

            },
            error: function (data) {
                //  alert("数据加载失败！");
            }
        });
        
    }
}
