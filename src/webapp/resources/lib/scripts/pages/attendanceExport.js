
$(function () {
    //initMap();
    $(".select2").select2();
    //大区小区下拉框
    
    LoadAllArea($("#Area"));
    changeArea($("#Area"), $("#SubArea"));
    //BindDptTree("menuContent", "treeDemo", "txtDepartment");
    //BindDptTree("treeContent", "tree", "Department");
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
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
                SubAreaId: $("#SubArea").val(),
                ProvinceCode: $("#ProvinceCode").val(),
                CityCode: $("#CityCode").val(),
                UserNo: $("#txtUserNo").val(),
                UserName: $("#txtUserName").val(),
                StoreName: $("#txtStoreName").val(),
                StoreNo: $("#txtStoreNo").val(),
                Mobile: $("#txtMobile").val(),
                AttendanceExportTimeSta: $("#AttendanceExportTimeSta").val(),
                AttendanceExportTimeEnd: $("#AttendanceExportTimeEnd").val(),

            },
            url: '/DataImport/AttendanceExport/ExportDataList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=考勤汇总信息";
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
            field: 'area_name',
            title: '大区'
        },
        {
            field: 'sub_area_name',
            title: '小区'
        },
        {
            field: 'user_no',
            title: '导购员ID'
        },
        {
            field: 'user_name',
            title: '导购员姓名'
        },
        {
            field: 'mobile',
            title: '导购员手机号'
        },
    ];
    $.SubAjax({
        type: 'post',
        data: {
            AttendanceExportTimeSta: $("#AttendanceExportTimeSta").val(),
            AttendanceExportTimeEnd: $("#AttendanceExportTimeEnd").val(),
        },
        url: '/DataImport/AttendanceExport/QueryTitleName',
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
        url: "/DataImport/AttendanceExport/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });
     
    function queryParams(params) {
        return {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            StoreName: $("#txtStoreName").val(),
            StoreNo: $("#txtStoreNo").val(),
            Mobile: $("#txtMobile").val(),
            UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            AttendanceExportTimeSta: $("#AttendanceExportTimeSta").val(),
            AttendanceExportTimeEnd: $("#AttendanceExportTimeEnd").val(),
            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset
        };

    }
}
