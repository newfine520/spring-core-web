
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

    LoadDatatableSchedule();
    LoadDatatableNoSchedule();
    
    $("#btnSearch").on("click", function () {
        $('#dataTableSchedule').bootstrapTable("destroy");// 破坏原来的表
        LoadDatatableSchedule();
        $('#dataTableNoSchedule').bootstrapTable("destroy");// 破坏原来的表
        LoadDatatableNoSchedule();
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
                SchedulingExportTimeSta: $("#SchedulingExportTimeSta").val(),
                SchedulingExportTimeEnd: $("#SchedulingExportTimeEnd").val(),

            },
            url: '/DataImport/SchedulingExport/ExportDataList',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=排班信息";
                }
                else {
                    $.ShowMessage("error", data.Msg);
                }
            }
        })
    })

})

//排班
function LoadDatatableSchedule() {
    var columns = [
        {
            field: 'leave_date',
            title: '离职时间'
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
        {
            field: 'personel_status_code',
            title: '人员状态',
        },
        {
            field: 'area_name',
            title: '所在支社（大区）'
        },
        {
            field: 'sub_area_name',
            title: '所在办事处（小区）'
        },
        {
            field: 'in_job_status_code',
            title: '在职状态'
        },

    ];
    $.SubAjax({
        type: 'post',
        data: {
            SchedulingExportTimeSta: $("#SchedulingExportTimeSta").val(),
            SchedulingExportTimeEnd: $("#SchedulingExportTimeEnd").val(),
        },
        url: '/DataImport/SchedulingExport/QueryTitleName',
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
    //已有排班记录导购员
    $('#dataTableSchedule').bootstrapTable({
        url: "/DataImport/SchedulingExport/GetDataList",
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
            SchedulingExportTimeSta: $("#SchedulingExportTimeSta").val(),
            SchedulingExportTimeEnd: $("#SchedulingExportTimeEnd").val(),
            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset
        };

    }
}

//未排班
function LoadDatatableNoSchedule() {
    var columns = [
        {
            field: 'user_no',
            title: '导购员ID'
        },
        {
            field: 'user_name',
            title: '导购员姓名'
        },
        {
            field: 'area_name',
            title: '销售总部'
        },
        {
            field: 'sub_area_name',
            title: '办事处'
        },
        {
            field: 'store_no',
            title: '商场ID',
        },
        {
            field: 'store_name',
            title: '商场'
        },
        {
            field: 'city_name',
            title: '城市'
        },
        {
            field: 'AuthenticationNumber',
            title: '认证号码'
        },
        {
            field: 'entry_date',
            title: '入职日期'
        },
        {
            field: 'mobile',
            title: '移动电话'
        },

    ];
    
    //已有排班记录导购员
    $('#dataTableNoSchedule').bootstrapTable({
        url: "/DataImport/SchedulingExport/GetDataListNoSchedule",
        pagination: "true",
        queryParams: queryParamsNoSchedule,
        sidePagination: 'server',
        columns: columns
    });

    function queryParamsNoSchedule(params) {
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
            SchedulingExportTimeSta: $("#SchedulingExportTimeSta").val(),
            SchedulingExportTimeEnd: $("#SchedulingExportTimeEnd").val(),
            PageSize: params.limit,   //页面大小
            PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
            sortOrder: params.order,
            SkipCount: params.offset
        };

    }
}