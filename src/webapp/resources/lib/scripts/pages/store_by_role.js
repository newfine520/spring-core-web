$(function () {
    $(function () { $('.tooltip-show').tooltip('show'); });
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    //changeACity($("#CityCode"), $("#Area"))
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    $(".select2").select2();
    $("#PromoterId").select2(
        {
            maximumSelectionLength: 10
        });
    $('#myModal').on('shown.bs.modal', function (e) {
        $(".select2").select2();

    })


    $('#dataTable').bootstrapTable({
        url: "/System/StoreByRole/GetStoreList",
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
                field: 'Id',
                formatter: 'actionFormatter',
                events: 'storeOperate',
                width: "80px"
            }, {
                field: 'AreaName',
                title: '大区'
            }, {
                field: 'SubAreaName',
                title: '小区',
                //formatter: 'substr'
            }, {
                field: 'Pronvice',
                title: '所在省'
            }, {
                field: 'City',
                title: '所在市'
            }, {
                field: 'CityLevel',
                title: '城市级别'
            }, {
                field: 'StoreCode',
                title: '门店编号'
            }, {
                field: 'StoreName',
                title: '门店名称'
            }, {
                field: 'StoreType',
                title: '门店类型',
                //width: "120px"
            }, {
                field: 'StoreDefinition',
                title: '门店定义'
            }, {
                field: 'StoreLevel',
                title: '门店等级',
                //width: "120px"
            }, {
                field: 'StoreAddress',
                title: '门店地址',
                formatter: 'substr'
            }, {
                field: 'StoreLocation',
                title: '门店定位',
                formatter: 'locationFormatter',
                events: 'storeOperate'
            }, {
                field: 'Flow',
                title: '渠道'
            }, {
                field: 'Chain',
                title: '系统'
            }, {
                field: 'Distributor',
                title: '经销商'
            }, {
                field: 'Promoter',
                title: '店员',
                //width: "120px"
            }, {
                field: 'Supversion',
                title: '门店负责人',
                //width: "120px"
            }, {
                field: 'StoreStatus',
                title: '门店状态'
            }, {
                field: 'ProvideType',
                title: '供货形式'
            }, {
                field: 'SalesName',
                title: '销售姓名'
            },

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
            server: '/System/StoreByRole/ImportStore',
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
window.storeOperate = {
    'click .check': function (e, value, row, index) {
        editStore(row.Id);
        $("#StoreForm").find("input").prop("disabled", true);
        $("#StoreForm").find("select").prop("disabled", true);
        $("#StoreForm").find("textarea").prop("disabled", true);
        $("#btnUpdate").hide();
        $("#btnAdd").hide();
    },
    'click .location': function (e, value, row, index) {
        $("#modalStoreLocation").modal({ backdrop: 'static', keyboard: false });
        $("#input").val(row.StoreAddress);
        var location = row.StoreLocation.split(',');
        $("#storeid").val(row.Id);
        $("#longitude").val(location[0]);
        $("#latitude").val(location[1]);
        $("#lon").val(location[0]);
        $("#lat").val(location[1]);
        //$("#input").val("");
        $("#myModalLocation").html(row.StoreName);
    }
}

$('#modalStoreLocation').on('shown.bs.modal', function (e, value, row, index) {

    //map.clearOverlays();
    //$("#allmap").clear();
    var map = new BMap.Map("allmap");
    var new_point = new BMap.Point($("#longitude").val(), $("#latitude").val())
    map.centerAndZoom(new_point, 17);
    map.setDefaultCursor("url('bird.cur')");
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.NavigationControl());
    var marker = new BMap.Marker(new_point);  // 创建标注
    map.addOverlay(marker);
    var local = new BMap.LocalSearch(map, {
        renderOptions: { map: map }
    });
    $("#searchLocation").on("click", function () {

        local.search($("#suggestId").val());

    })

    map.addEventListener("click", function (e) {
        map.clearOverlays();    //清除地图上所有覆盖物
        new_point = new BMap.Point(e.point.lng, e.point.lat);
        marker = new BMap.Marker(new_point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.panTo(new_point);
        //lngX = e.point.lng;
        //latY = e.point.lat;
        $("#longitude").val(e.point.lng);
        $("#latitude").val(e.point.lat);
        $("#lon").val(e.point.lng);
        $("#lat").val(e.point.lat);
        var gc = new BMap.Geocoder();
        gc.getLocation(new_point, function (rs) {
            var addComp = rs.addressComponents;
            var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            $("#input").val(address);
        });
    });

    //输入智能提示
    function G(id) {
        return document.getElementById(id);
    }

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {
        "input": "suggestId",
        "location": map
    });
    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
        $("#input").val(value);
    });

    //var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace(myValue);


    });

    function setPlace(myValue) {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 17);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
            //给经纬度赋值
            $("#longitude").val(pp.lng);
            $("#latitude").val(pp.lat);
            $("#lon").val(pp.lng);
            $("#lat").val(pp.lat);
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    //var label = new BMap.Label("我是文字标注哦", { offset: new BMap.Size(20, -10) });
    //marker.setLabel(label);

    //map.panTo(new_point);
})






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
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        StoreProvinceCode: $("#ProvinceCode").val(),
        StoreCityCode: $("#CityCode").val(),
        StoreCode: $("#txtStoreCode").val(),
        StoreName: $("#txtStoreName").val(),
        StoreUserId: $("#selPositionStatusCode").val(),
        StoreStatus: $("#selStoreStatus").val(),
        DistributorId: $("#selDistributor").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=editStore("' + value + '") title="编辑">编辑</a>'
    results += '<a class="check ml10" href="javascript:void(0)"title="查看"> 查看</a>';
    return results;
}
function locationFormatter(value, row, index) {
    if (row.StoreLocation != null && row.StoreLocation != "")
    { var results = '<a class="location"  title="门店定位"><image src="/images/location.jpg" class="loc"/></a>'; }
    return results;
}

function substr(value, row, index) {
    var leng = row.StoreAddress;
    if (row.StoreAddress != null) {
        if (row.StoreAddress.length > 9) {
            leng = row.StoreAddress.substr(0, 9) + '...'
        }
    }
    return ' <span data-toggle="tooltip" data-placement="bottom"   title="' + row.StoreAddress + '" class="tooltip-show" style="cursor:default">' + leng + '</span>';
}
var StoreForm = $("#StoreForm");
StoreForm.validate({
    rules: {
        StoreNo: {
            required: true
        },
        StoreName: {
            required: true
        },
        AreaId: {
            required: true
        },
        SubAreaId: {
            required: true
        },
        //chain: {
        //    required: true
        //},
        StoreStatusCode: {
            required: true
        },
        ProvinceCodeId: {
            required: true
        },
        CityCodeId: {
            required: true
        }
        //,
        //Address: {
        //    required: true
        //}
        //ContactName: {
        //    required: true
        //},

    },
    messages: {
        StoreNo: {
            required: "请输入门店编号",
        },
        StoreName: {
            required: "请输入门店名称",
        },
        AreaId: {
            required: "请选择大区",
        },
        SubAreaId: {
            required: "请选择小区",
        },
        //chain: {
        //    required: "请输入所属企业",
        //},
        StoreStatusCode: {
            required: "请输入门店状态",
        },
        ProvinceCodeId: {
            required: "请选择省份",
        },
        CityCodeId: {
            required: "请选择城市",
        }
        //,
        //Address: {
        //    required: "请输入地址",
        //}
        //ContactName: {
        //    required: "请输入业务联系人",
        //},

    }
})
$("#btnAddShow").on("click", function () {
    $("#StoreForm").find("input").prop("disabled", false);
    $("#StoreForm").find("select").prop("disabled", false);
    $("#StoreForm").find("textarea").prop("disabled", false);
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#StoreForm").find(".form-control").val('');
    $("#StoreForm").find("#PromoterId").val('0');
    $("#StoreForm").find("#PromoterId").select2();
    $("#StoreForm").find("#SupervisorId").val('0');
    $("#StoreForm").find("#SupervisorId").select2();
    loadAllProvince($("#ProvinceCodeId"), false);
    changeProvince($("#ProvinceCodeId"), $("#CityCodeId"));
    $("#CityCodeId").empty();
    $("#CityCodeId").val('');
    $(".select2").select2();
    //changeACity($("#CityCodeId"), $("#AreaId"));
    LoadAllArea($("#AreaId"))
    changeArea($("#AreaId"), $("#SubAreaId"));
})


$("#btnAdd").on("click", function () {
    var promoterId = $("#PromoterId").val();
    var supervisorId = $("#SupervisorId").val();
    if (StoreForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/StoreByRole/AddStore?PromoterId=' + promoterId + '&SupervisorId=' + supervisorId,
            data: StoreForm.serializeToJson(),
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
    var promoterId = $("#PromoterId").val();
    var supervisorId = $("#SupervisorId").val();
    if (StoreForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/System/StoreByRole/UpdateStore?PromoterId=' + promoterId + '&SupervisorId=' + supervisorId,
            data: StoreForm.serializeToJson(),
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

$("#btnUpdateAddress").on("click", function () {
    $.SubAjax({
        type: 'post',
        url: '/System/StoreByRole/UpdateStoreAddress',
        data: {
            Address: $("#input").val(),
            StoreId: $("#storeid").val(),
            Lon: $("#longitude").val(),
            Lat: $("#latitude").val()
        },
        success: function (data) {
            if (data.IsSuccess) {
                $.ShowMessage("success", data.Msg);
                $("#modalStoreLocation").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });

})
function editStore(Id) {
    $("#StoreForm").find("input").prop("disabled", false);
    $("#StoreForm").find("select").prop("disabled", false);
    $("#StoreForm").find("textarea").prop("disabled", false);
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#StoreForm").find("label.error").remove();
    $("#StoreForm").find("input.error").removeClass("error");
    $("#EntryDate").datepicker({ format: 'yyyy-mm-dd', autoclose: true });
    loadAllProvince($("#ProvinceCodeId"), false);
    changeProvince($("#ProvinceCodeId"), $("#CityCodeId"));
    // changeACity($("#CityCodeId"), $("#AreaId"));
    LoadAllArea($("#AreaId"))
    changeArea($("#AreaId"), $("#SubAreaId"));
    if ($("#PositionType").val() != "管理员") {
        $("#StoreNo").prop("disabled", true);
        $("#StoreName").prop("disabled", true);
        $("#ProvinceCodeId").prop("disabled", true);
        $("#CityCodeId").prop("disabled", true);
        $("#AreaId").prop("disabled", true);
        $("#SubAreaId").prop("disabled", true);
        //$("#PromoterId").prop("disabled", true);
        $("#SupervisorId").prop("disabled", true);
        $("#Remark").prop("disabled", true);
        $("#chainId").prop("disabled", true);
        $("#ChanelId").prop("disabled", true);
        $("#StoreStatusCode").prop("disabled", true);
        $("#Distributor").prop("disabled", true);
        $("#Address").prop("disabled", true);
        $("#StoreType").prop("disabled", true);
        $("#StoreDefinition").prop("disabled", true);
        $("#StoreLevel").prop("disabled", true);
        $("#ProvideType").prop("disabled", true);
        $("#SalesName").prop("disabled", true);
    }

    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        async: false,
        url: '/System/StoreByRole/GetStoreDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#StoreId").val(Id);
                $("#StoreNo").val(data.StoreNo);
                $("#StoreName").val(data.StoreName);
                $("#ChanelId").val(data.ChanelId);
                $("#CityCodeId").empty();
                $("#ProvinceCodeId").val(data.ProvinceCode);
                $("#ProvinceCodeId").select2();
                $("#ChanelDetails").val(data.ChanelDetails);
                getCityByProvince($("#ProvinceCodeId"), $("#CityCodeId"));
                $("#CityCodeId").val(data.CityCode);
                $("#CityCodeId").select2();
                $("#AreaId").val(data.AreaId);
                $("#AreaId").select2();
                getSubAreaByArea($("#AreaId"), $("#SubAreaId"));
                $("#SubAreaId").val(data.SubAreaId);
                $("#SubAreaId").select2();
                $("#chainId").val(data.ChainId);
                $("#chain").val(data.ChainName);
                $("#StoreStatusCode").val(data.StoreStatusCode);
                $("#StoreGroupCode").val(data.StoreGroupCode);
                $("#DispatchCode").val(data.DispatchCode);
                $("#Mobile").val(data.Mobile)
                $("#Phone").val(data.Phone);
                $("#ContactName").val(data.ContactName)
                $("#AreaManager").val(data.AreaManager)
                $("#RegionalManager").val(data.RegionalManager)
                $("#Address").val(data.Address);
                $("#PromoterId").val(data.promoterids);
                $("#SupervisorId").val(data.supervisor);
                $("#DispartchCode").val(data.DispartchCode);
                $("#Remark").val(data.Remark);
                $("#SubAreaId").val(data.SubAreaId);
                $("#Distributor").val(data.DistributorId);
                $(".select2").select2();
                $("#StoreType").val(data.StoreType);
                $("#StoreDefinition").val(data.StoreDefinition);
                $("#StoreLevel").val(data.StoreLevel);
                $("#ProvideType").val(data.ProvideType);
                $("#SalesName").val(data.SalesName);
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
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            StoreProvinceCode: $("#ProvinceCode").val(),
            StoreCityCode: $("#CityCode").val(),
            StoreCode: $("#txtStoreCode").val(),
            StoreName: $("#txtStoreName").val(),
            StoreUserId: $("#selPositionStatusCode").val(),
            StoreStatus: $("#selStoreStatus").val(),
            DistributorId: $("#selDistributor").val()
        },
        url: '/System/StoreByRole/ExportStore',
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

function changeACity(City, Area) {
    City.on("change", function () {
        var value = $(this).val();
        if (value == "") {
            Area.empty();
            Area.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.SubAjax({
                type: 'post',
                data: {},
                url: '/System/StoreByRole/GetArea',
                success: function (data) {
                    if (data.Data != "" && data.Data != null) {
                        var jsonData = eval(data.Data);
                        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
                        $.each(jsonData, function (index, item) {
                            thisData += "{\"id\":\"" + item.AreaId + "\",\"text\":\"" + item.AreaName + "\"},";
                        });
                        thisData = thisData.substring(0, thisData.length - 1);
                        thisData += "]";
                        var cData = $.parseJSON(thisData);
                        Area.empty();
                        Area.select2({
                            placeholder: "请选择",
                            allowClear: true,
                            data: cData
                        });
                    }
                },
                error: function (data) {
                    //  alert("数据加载失败！");
                }
            });
        }
    })
}

//function LoadAllArea(Area) {

//    $.SubAjax({
//        type: 'post',
//        data: {},
//        url: '/System/StoreByRole/GetArea',
//        success: function (data) {
//            if (data.Data != "" && data.Data != null) {
//                var jsonData = eval(data.Data);
//                var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
//                $.each(jsonData, function (index, item) {
//                    thisData += "{\"id\":\"" + item.AreaId + "\",\"text\":\"" + item.AreaName + "\"},";
//                });
//                thisData = thisData.substring(0, thisData.length - 1);
//                thisData += "]";
//                var cData = $.parseJSON(thisData);
//                Area.empty();
//                Area.select2({
//                    placeholder: "请选择",
//                    allowClear: true,
//                    data: cData
//                });
//            }
//        },
//        error: function (data) {
//            //  alert("数据加载失败！");
//        }
//    });
//}
//function changeArea(Area, SubArea) {
//    Area.on("change", function () {
//        var value = $(this).val();
//        if (value == "") {
//            SubArea.empty();
//            SubArea.select2({
//                placeholder: "请选择",
//                data: []
//            });
//        }
//        else {
//            $.SubAjax({
//                type: 'post',
//                data: { AreaId: Area.val() },
//                url: '/System/StoreByRole/GetSubArea',
//                success: function (data) {
//                    if (data.Data != "" && data.Data != null) {
//                        var jsonData = eval(data.Data);
//                        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
//                        $.each(jsonData, function (index, item) {
//                            thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
//                        });
//                        thisData = thisData.substring(0, thisData.length - 1);
//                        thisData += "]";
//                        var cData = $.parseJSON(thisData);
//                        SubArea.empty();
//                        SubArea.select2({
//                            placeholder: "请选择",
//                            allowClear: true,
//                            data: cData
//                        });
//                    }
//                },
//                error: function (data) {
//                    //  alert("数据加载失败！");
//                }
//            });
//        }
//    })
//}

function getAreaByCity(CityCode, AreaId) {
    AreaId.empty();
    $.SubAjax({
        type: 'post',
        data: { CityId: CityCode.val() },
        url: '/System/StoreByRole/GetArea',
        success: function (data) {
            if (data.Data != "" && data.Data != null) {
                var jsonData = eval(data.Data);
                var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
                $.each(jsonData, function (index, item) {
                    thisData += "{\"id\":\"" + item.AreaId + "\",\"text\":\"" + item.AreaName + "\"},";
                });
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                AreaId.empty();
                AreaId.select2({
                    placeholder: "请选择",
                    allowClear: true,
                    data: cData
                });
            }
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
}



