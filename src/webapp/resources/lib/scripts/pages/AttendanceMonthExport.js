
$(function () {
    //initMap();
    $(".select2").select2();
    //大区小区下拉框
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    LoadAllArea($("#Area"));
    changeArea($("#Area"), $("#SubArea"));
    //BindDptTree("menuContent", "treeDemo", "txtDepartment");
    //BindDptTree("treeContent", "tree", "Department");
    //$(".datepicker").datepicker({
    //    format: "yyyy-mm-dd",
    //    autoclose: true,
    //    todayBtn: 'linked',
    //});
    var defaultYearMonthDate = new Date().getFullYear().toString() + "-";
    if (new Date().getMonth() + 1 < 10) {
        defaultYearMonthDate += "0" + (new Date().getMonth() + 1);
    }
    else {
        defaultYearMonthDate += (new Date().getMonth() + 1);
    }

    $(".datepicker").datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });

    $("#yearMonth").val(defaultYearMonthDate);
    LoadDatatable()


    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");// 破坏原来的表
        LoadDatatable();

    });

    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                AreaId: $("#Area").val(),
                // SubAreaId: $("#SubArea").val(),
                ProvinceCode: $("#ProvinceCode").val(),
                CityCode: $("#CityCode").val(),
                UserNo: $("#txtUserNo").val(),
                UserName: $("#txtUserName").val(),
                //StoreName: $("#txtStoreName").val(),
                //StoreNo: $("#txtStoreNo").val(),
                //Mobile: $("#txtMobile").val(),
                YearMonth: $("#yearMonth").val(),
                //AttendanceExportTimeEnd: $("#AttendanceExportTimeEnd").val(),

            },
            url: '/DataImport/AttendanceMonthExport/ExportDataList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=考勤月报表";
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })

})

//排班
function LoadDatatable() {
    var columns = [
        {
            field: 'Supversion_name',
            title: '督导主任'
        },
        {
            field: 'area_name',
            title: '大区'
        },
        {
            field: 'province_name',
            title: '省/直辖市'
        },
        {
            field: 'city_name',
            title: '城市'
        },
        {
            field: 'city_level',
            title: '城市级别'
        },
        {
            field: 'user_no',
            title: 'TPM工号'
        },
        {
            field: 'user_name',
            title: '姓名'
        },
        {
            field: 'mobile',
            title: '手机'
        },
        {
            field: 'positionname',
            title: '促销员类型'
        },
        {
            field: 'store_no',
            title: 'PDM所属门店编码'
        },
        {
            field: 'store_names',
            title: 'PDM所属门店名称'
        },

        {
            field: 'basic_salary',
            title: '固定工资'
        },
        {
            field: 'TotalDayCount',
            title: '总上班天数'
        },
        {
            field: 'lunch_duration',
            title: '总排班工时'
        },
        {
            field: 'total_lunch_duration',
            title: '总吃饭小时'
        },
        {
            field: 'total_attentime',
            title: '总打卡工时'
        },
        {
            field: 'NoLeavingDay',
            title: '未离店天数'
        },
        {
            field: 'distinceCounts',
            title: '偏移异常天数'
        },
        {
            field: 'BelowSixCount',
            title: '在岗时间低于7小时'
        },
        {
            field: 'NoScheduleAttendance',
            title: '休息来上班天数'
        },
        {
            field: 'NoAttendanceSchedule',
            title: '旷工'
        },
        {
            field: 'total_overtime',
            title: '实际加班时长'
        },
        {
            field: 'total_overtime_holiday',
            title: '国定节假日加班时长'
        },
        {
            field: 'total_overtime_other',
            title: '非国定节假日加班时长'
        }
    ];
    $.SubAjax({
        type: 'post',
        data: {
            AttendanceExportTimeSta: $("#yearMonth").val(),
            //AttendanceExportTimeEnd: $("#AttendanceExportTimeEnd").val(),
        },
        url: '/DataImport/AttendanceMonthExport/QueryTitleName',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    columns.push({
                        title: value,
                        field: value,
                    });
                })
            }
        }
    })

    $('#dataTable').bootstrapTable({
        url: "/DataImport/AttendanceMonthExport/GetAttendanceMonthList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });

    function queryParams(params) {
        return {
            AreaId: $("#Area").val(),
            //SubAreaId: $("#SubArea").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            //StoreName: $("#txtStoreName").val(),
            //StoreNo: $("#txtStoreNo").val(),
            // Mobile: $("#txtMobile").val(),
            UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            YearMonth: $("#yearMonth").val(),
            //AttendanceExportTimeSta: $("#yearMonth").val(),
            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset
        };

    }
}
