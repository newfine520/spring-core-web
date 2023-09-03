function loadProvince(provinceId) {
    $.ajax({
        type: "post",
        url: "/Common/GetUserProvince",
        dataType: "json",
        async: false,
        cache: false,
        success: function (data) {
            var jsonData = eval(data);
            var thisData = "[";
            $.each(jsonData, function (index, item) {
                thisData += "{\"id\":\"" + item.ProvinceId + "\",\"text\":\"" + item.ProvinceName + "\"},";
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            provinceId.select2({
                placeholder: "请选择",
                allowClear: true,
                data: cData
            });
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
};
//function loadAllProvince(provinceId) {
//    var jsonData = ProvinceJson;
//    var thisData = "[";
//    $.each(jsonData, function (index, item) {
//        thisData += "{\"id\":\"" + item.ProvinceId + "\",\"text\":\"" + item.ProvinceName + "\"},";
//    });
//    thisData = thisData.substring(0, thisData.length - 1);
//    thisData += "]";
//    var cData = $.parseJSON(thisData);
//    provinceId.select2({
//        placeholder: "请选择",
//        allowClear: true,
//        data: cData
//    });
//}

function loadAllProvince(provinceId,isAll) {
    $.ajax({
        type: "post",
        url: "/Common/GetProvinceList",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            var jsonData = eval(data.Data);
            if (isAll == true) {
                var thisData = "[{\"id\":\"0\",\"text\":\"全国\"},";
            }
            else {
                var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
            }
            $.each(jsonData, function (index, item) {
                thisData += "{\"id\":\"" + item.ProvinceId + "\",\"text\":\"" + item.ProvinceName + "\"},";
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            provinceId.select2({
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

function loadAllCity(city) {
    var jsonData = CityJson;
    var thisData = "[";
    $.each(jsonData, function (index, item) {
        thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
    });
    thisData = thisData.substring(0, thisData.length - 1);
    thisData += "]";
    var cData = $.parseJSON(thisData);
    city.select2({
        placeholder: "请选择",
        allowClear: true,
        data: cData
    });
}
//function changeProvince(province, city, district) {
//    province.on("change", function () {
//        var value = $(this).val();
//        if (value == "" || value == null) {
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
//            if ((value.indexOf(',') > -1)) {
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

function changeProvince(province, city, district) {
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
                        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";

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
                    if (district) {
                        changeCity(city, district)
                    }
                },
                error: function (data) {
                    //  alert("数据加载失败！");
                }
            });
        }
    });
}


//function getCityByProvince(province, city) {
//    var value = province.val();
//    if (value != "" && value != null) {
//        var jsonData = CityJson;
//        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
//        if ((value.indexOf(',') > -1)) {
//            value = value + ",";
//            $.each(jsonData, function (index, item) {
//                if (value.indexOf(item.ProvinceId + ",") > -1) {
//                    thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
//                }
//            });
//        }
//        else {
//            $.each(jsonData, function (index, item) {
//                if (value == item.ProvinceId) {
//                    thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
//                }
//            });
//        }
//        thisData = thisData.substring(0, thisData.length - 1);
//        thisData += "]";
//        var cData = $.parseJSON(thisData);
//        city.empty();
//        city.select2({
//            placeholder: "请选择",
//            allowClear: true,
//            data: cData
//        });
//    }
//}

function getCityByProvince(province, city) {
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
                    var thisData = "[";
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

        //var jsonData = CityJson;
        //var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
        //if ((value.indexOf(',') > -1)) {
        //    value = value + ",";
        //    $.each(jsonData, function (index, item) {
        //        if (value.indexOf(item.ProvinceId + ",") > -1) {
        //            thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
        //        }
        //    });
        //}
        //else {
        //    $.each(jsonData, function (index, item) {
        //        if (value == item.ProvinceId) {
        //            thisData += "{\"id\":\"" + item.CityId + "\",\"text\":\"" + item.CityName + "\"},";
        //        }
        //    });
        //}
        //thisData = thisData.substring(0, thisData.length - 1);
        //thisData += "]";
        //var cData = $.parseJSON(thisData);
        //city.empty();
        //city.select2({
        //    placeholder: "请选择",
        //    allowClear: true,
        //    data: cData
        //});
    }
}
function changeCity(city, district) {
    city.on("change", function () {
        var value = $(this).val();
        if (value != "") {
            var jsonData = DistrictJson;
            var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
            $.each(jsonData, function (index, item) {
                if (value == item.CityId) {
                    thisData += "{\"id\":\"" + item.DistrictId + "\",\"text\":\"" + item.DistrictName + "\"},";
                }
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            district.empty();
            district.select2({
                placeholder: "请选择",
                allowClear: true,
                data: cData
            });
        }
    })
}
function getDistrictByCity(city, district) {
    var value = $(city).val();
    if (value == "") {
        district.val('');
        district.select2({
            placeholder: "请选择",
            data: []
        });
    }
    else {
        var jsonData = DistrictJson;
        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
        $.each(jsonData, function (index, item) {
            thisData += "{\"id\":\"" + item.DistrictId + "\",\"text\":\"" + item.DistrictName + "\"},";
        });
        thisData = thisData.substring(0, thisData.length - 1);
        thisData += "]";
        var cData = $.parseJSON(thisData);
        district.empty();
        district.select2({
            placeholder: "请选择",
            allowClear: true,
            data: cData
        });
    }
}
function LoadAllArea(Area) {

    $.SubAjax({
        type: 'post',
        data: {},
        async: false,
        url: '/Common/GetArea',
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
function changeArea(Area, SubArea) {
    Area.on("change", function () {
        var value = $(this).val();
        if (value == "") {
            SubArea.empty();
            SubArea.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.SubAjax({
                type: 'post',
                async: false,
                data: { AreaId: Area.val() },
                url: '/Common/GetSubArea',
                success: function (data) {
                    if (data.Data != "" && data.Data != null) {
                        var jsonData = eval(data.Data);
                        var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
                        $.each(jsonData, function (index, item) {
                            thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                        });
                        thisData = thisData.substring(0, thisData.length - 1);
                        thisData += "]";
                        var cData = $.parseJSON(thisData);
                        SubArea.empty();
                        SubArea.select2({
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
function getSubAreaByArea(AreaId, SubAreaId) {
    SubAreaId.empty();
    $.SubAjax({
        type: 'post',
        async: false,
        data: { AreaId: AreaId.val() },
        url: '/Common/GetSubArea',
        success: function (data) {
            if (data.Data != "" && data.Data != null) {
                var jsonData = eval(data.Data);
                var thisData = "[{\"id\":\"\",\"text\":\"请选择\"},";
                $.each(jsonData, function (index, item) {
                    thisData += "{\"id\":\"" + item.SubAreaId + "\",\"text\":\"" + item.SubAreaName + "\"},";
                });
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                SubAreaId.empty();
                SubAreaId.select2({
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


function LoadAllAreas(Area, isAll) {

    $.SubAjax({
        type: 'post',
        data: {},
        async: false,
        url: '/Common/GetAreaList',
        success: function (data) {
            if (data.Data != "" && data.Data != null) {
                var jsonData = eval(data.Data);
                if (isAll == true) {
                    var thisData = "[{\"id\":\"0\",\"text\":\"全部\"},";
                }
                else {
                    var thisData = "[";
                }
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


function changeAreas(area, subarea) {
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
                        var thisData = "[";
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

function getSubAreaByAreas(area, subarea) {
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
                    var thisData = "[";
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


///二级品牌与SKU二级联动

function changeSubBrand(SubBrand, Sku) {
    SubBrand.on("change", function () {
        var value = $(this).val();
        if (value == "") {
            Sku.empty();
            Sku.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.SubAjax({
                type: 'post',
                async: false,
                data: { SubBrandId: SubBrand.val() },
                url: '/Common/GetSubBrandSkuIds',
                success: function (data) {
                    if (data.Data != "" && data.Data != null) {
                        var jsonData = eval(data.Data);
                        var thisData = "[{\"id\":\"\",\"text\":\"\"},";
                        $.each(jsonData, function (index, item) {
                            thisData += "{\"id\":\"" + item.SkuNo + "\",\"text\":\"" + item.SkuName + "\"},";
                        });
                        thisData = thisData.substring(0, thisData.length - 1);
                        thisData += "]";
                        var cData = $.parseJSON(thisData);
                        Sku.empty();
                        Sku.select2({
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