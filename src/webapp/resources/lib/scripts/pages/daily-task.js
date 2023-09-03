$(function () {
    $(".select2").select2();
    LoadAllArea($("#Area"))
    changeArea($("#Area"), $("#SubArea"))
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $(".datepicker").val(getNowFormatDate());
    LoadDatatable();
})

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("destroy");
    LoadDatatable();
})

function queryParams(params) {
    return {
        AreaId: $("#Area").val(),
        SubAreaId: $("#SubArea").val(),
        //UserNo: $("#txtUserNo").val(),
        //UserName: $("#txtUserName").val(),
        StoreNo: $("#txtStoreNo").val(),
        StoreName: $("#txtStoreName").val(),
        QuestionName: $("#QuestionName").val(),
        BeginTime: $("#BeginTime").val(),
        EndTime: $("#EndTime").val(),
        UserId: $("#selPositionStatusCode").val(),
        QuestionWorkType: $("#QuestionWorkType").val(),
        ActivityNo: $("#txtActivityNo").val(),
        ActivityName: $("#txtActivityName").val(),
        IsGift: $("#selIsGift").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}
$("#btnSearch").on("click", function () {
    //$('#dataTable').bootstrapTable("refresh", { query: { SkipCount: 0 } });
    $('#dataTable').bootstrapTable("destroy");// 破坏原来的表
    LoadDatatable();
});

$(".export").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            AreaId: $("#Area").val(),
            SubAreaId: $("#SubArea").val(),
            UserId: $("#selPositionStatusCode").val(),
            //UserNo: $("#txtUserNo").val(),
            //UserName: $("#txtUserName").val(),
            StoreNo: $("#txtStoreNo").val(),
            StoreName: $("#txtStoreName").val(),
            QuestionName: $("#QuestionName").val(),
            BeginTime: $("#BeginTime").val(),
            EndTime: $("#EndTime").val(),
            QuestionWorkType: $("#QuestionWorkType").val(),
            ActivityNo: $("#txtActivityNo").val(),
            ActivityName: $("#txtActivityName").val(),
            IsGift: $("#selIsGift").val()
        },
        url: '/DataImport/DailyTask/ExportDataList',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=日常任务报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})

function LoadDatatable() {
    var columns = [
        //{
        //    title: '操作',
        //    //field: 'StoreId',
        //    formatter: operateFormatter,
        //    events: 'operateEvents'
        //},
        {
            field: '活动编号',
            title: '活动编号'
        },
        {
            field: '活动名称',
            title: '活动名称'
        },
        {
            field: '大区',
            title: '大区'
        }, {
            field: '小区',
            title: '小区'
        }, {
            field: '省份',
            title: '省份'
        }, {
            field: '城市',
            title: '城市'
        }, {
            field: '系统',
            title: '系统'
        }, {
            field: '渠道',
            title: '渠道'
        }, {
            field: '商店编码',
            title: '商店编码'
        }, {
            field: '商店标准名称',
            title: '商店标准名称'
        }, {
            field: '店员姓名',
            title: '店员姓名',
        }, {
            field: '店员电话',
            title: '店员电话',
        },  {
            field: '提交表格时间',
            title: '提交表格时间'
        },
    ];
    $.SubAjax({
        type: 'post',
        data: { QuestionWorkType: $("#QuestionWorkType").val(),
            QuestionName: $("#QuestionName").val(),
        },
        url: '/DataImport/DailyTask/QueryQuestionName',
        success: function (data) {
            if (data.IsSuccess) {
                $.each(data.Data, function (index, value) {
                    if (value.Type == '拍照') {
                        columns.push({
                            title: value.Question,
                            field: value.Question,
                            formatter: function (value, row, index) {
                                //alert(value);
                                if (value != null && value != "") {
                                    var results = '<a class="detail" style="margin-left: 38%;" title="照片"> 照片</a>';
                                    return results;
                                }
                            },
                            events: 'OperateEvent'
                        });
                    }
                    else {
                        columns.push({
                            title: value.Question,
                            field: value.Question,
                        });
                    }
                })
            }
        }
    })
    $('#dataTable').bootstrapTable({
        url: "/DataImport/DailyTask/GetDataList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        columns: columns
    });
}



window.OperateEvent = {
    'click .detail': function (e, value, row, index) {
        $("#modalDetail").modal({ backdrop: 'static', keyboard: false });
        var photos = value.split(';');
        if (photos.length > 0) {
            $("#carousel2").show();
            var imasges = "";
            var li = "";
            $.each(photos, function (index, value) {
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
    },
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