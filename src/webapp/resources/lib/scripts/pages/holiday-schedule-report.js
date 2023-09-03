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
    $(".datepicker").datepicker({
        minViewMode: 2,
        format: "yyyy",
        autoclose: true,
        todayBtn: 'linked',
    });

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
                Year: $("#HolidayYear").val(),
                HolidayName: $("#HolidayName").val()
            },
            url: '/DataImport/HolidayScheduleReport/ExportHolidayScheduleList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=节假日加班报表";
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })

})

//节假日加班
function LoadDatatable() {
    var columns = [
        {
            field: 'area_name',
            title: '大区'
        },
        {
            field: 'Supversion_name',
            title: '所属大区督导'
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
            field: 'store_no',
            title: 'PDG所在门店编码'
        }, {
            field: 'positionname',
            title: 'PDG类型'
        }, {
            field: 'store_names',
            title: 'PDG所在门店名称'
        }, {
            field: 'user_no',
            title: 'PDG工号'
        }, {
            field: 'username',
            title: 'PDG姓名'
        }, {
            field: 'min_salary',
            title: '当地最低工资（元/月）'
        }, {
            field: 'basic_salary',
            title: 'PDG基本工资（元/月）'
        }, {
            field: 'Over_PayAmount',
            title: '预计加班费金额'
        }, {
            field: 'remark',
            title: '备注'
        }, {
            field: 'ParentName',
            title: '督导'
        }
    ];
    var HolidayName = $("#HolidayName").val();
    var str = "";
    if (HolidayName != null) {
        str = HolidayName.join(",");
    }
    $.SubAjax(

        {
            type: 'post',
            data: {
                Year: $("#HolidayYear").val(),
                HolidayName: str
            },
            url: '/DataImport/HolidayScheduleReport/QueryTitleName',
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
        url: "/DataImport/HolidayScheduleReport/QueryHolidayScheduleList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });

    function queryParams(params) {
        // var HolidayName = ($("#HolidayName option:checked" ).text());
        var HolidayName = $("#HolidayName").val();
        var str = "";
        if (HolidayName != null) {
            str = HolidayName.join(",");
        }
        return {
            AreaId: $("#Area").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            Year: $("#HolidayYear").val(),
            HolidayName: str,
            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset,


        };
    }
}
