$(function () {
    $(".select2").select2();
    //省市下拉框
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"));
    LoadAllArea($("#Area"));
    changeArea($("#Area"), $("#SubArea"));

    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    $("#TimeSta").val(y + "-" + m + "-" + d);
    $("#TimeEnd").val(y + "-" + m + "-" + d);

    $('#dataTable').bootstrapTable({
        url: "/DataImport/ExerciseRecord/GetExerciseRecordList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            
            {
                field: '大区',
                title: '大区'
            },
            {
                field: '小区',
                title: '小区'
            },
            {
                field: '省份',
                title: '省份'
            },
            {
                field: '城市',
                title: '城市'
            },
            {
                field: '门店编号',
                title: '门店编号'
            },
            {
                field: '门店名称',
                title: '门店名称'
            },
            {
                field: '人员工号',
                title: '人员工号'
            },
            {
                field: '人员名称',
                title: '人员名称'
            },
            {
                field: '提交日期',
                title: '提交日期'
            },
            {
                field: '题目',
                title: '题目'
            },
            {
                field: '答题结果',
                title: '答题结果'
            },
            {
                field: '答题对错',
                title: '答题对错'
            }

        ]
    });




})

$("#btnSearch").on("click", function () {
    if ($("#TimeSta").val() == null || $("#TimeSta").val().substring(0, 7) == "") {
        $.ShowMessage("warning", "请选择日期！");
        return false;
    }
    if ($("#TimeEnd").val() == null || $("#TimeEnd").val().substring(0, 7) == "") {
        $.ShowMessage("warning", "请选择日期！");
        return false;
    }

    $('#dataTable').bootstrapTable("refresh");
})

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            QuestionName: $("#txtQusetionName").val(),
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            //UserName: $("#txtUserName").val(),
            UserNo: $("#txtUserNo").val(),
            //StoreName: $("#txtStoreName").val(),
            StoreNo: $("#txtStoreNo").val(),
            TimeSta: $("#TimeSta").val(),
            TimeEnd: $("#TimeEnd").val(),
        },
        url: "/DataImport/ExerciseRecord/ExportExerciseRecord",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=答题记录报表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})


function queryParams(params) {
    return {
        QuestionName: $("#txtQusetionName").val(),
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        ProvinceCode: $("#ProvinceCode").val(),
        CityCode: $("#CityCode").val(),
        //UserName: $("#txtUserName").val(),
        UserNo: $("#txtUserNo").val(),
        //StoreName: $("#txtStoreName").val(),
        StoreNo: $("#txtStoreNo").val(),
        TimeSta: $("#TimeSta").val(),
        TimeEnd: $("#TimeEnd").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset
    };
}




