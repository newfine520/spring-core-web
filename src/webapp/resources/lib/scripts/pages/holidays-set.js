$(function () {
    $("#HolidayTime").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: 'linked',
    });


    $("#HolidayYear").datepicker({
        minViewMode: 2,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    });

    $('#dataTable').bootstrapTable({
        url: "/DataImport/HolidaysSet/GetHolidays",
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
                field: 'Id',
                formatter: 'operateFormatter',
                events: 'operateEvents',
                width: "100px"
            },
            {
                field: 'HolidayName',
                title: '节假日名称'
            },
            {
                field: 'HolidayTimeStr',
                title: '日期'
            }

        ]
    });

})

function queryParams(params) {
    return {
        HolidayName: $("#txtHolidayName").val(),
        HolidayYear: $("#HolidayYear").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
    };
}

function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin" title="编辑">编辑</a>',
        '<a class="delete"  data-role="Admin" title="删除" style="margin-left:10px">删除</a>',
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        $("#HolidaySetModal").modal({ backdrop: 'static', keyboard: false });
        $("#HolidayId").val(row.Id);
        $("#HolidayName").val(row.HolidayName);
        $("#HolidayTime").val(row.HolidayTimeStr);
    },

    'click .delete': function (e, value, row, index) {
        parent.layer.confirm('确认删除？', {
            btn: ['确定', '取消'], //按钮
            shade: false //不显示遮罩
        }, function () {
            $.SubAjax({
                type: 'post',
                data: {
                    HolidayId: row.Id
                },
                url: '/DataImport/HolidaysSet/DeleteHoliday',
                success: function (data) {
                    if (data.IsSuccess) {
                        $.ShowMessage("success", "删除成功");
                        $('#dataTable').bootstrapTable("refresh");
                    }
                    else {
                        $.ShowMessage("error", data.Msg);
                    }
                }
            })
            layer.closeAll('dialog');
        })
    }

}
$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
})

$("#btnUpdate").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            Id: $("#HolidayId").val(),
            HolidayName: $("#HolidayName").val(),
            HolidayTime: $("#HolidayTime").val()
        },
        url: '/DataImport/HolidaysSet/UpdateHoliday',
        success: function (data) {
            if (data.IsSuccess) {
                $("#HolidaySetModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");

            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    });
})

$("#btnAddShow").on("click", function () {
    $(".select2").select2();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#HolidayName").val("");
    $("#HolidayTime").val("");
    $("#HolidaySetModal").modal({ backdrop: 'static', keyboard: false });

})

$("#btnAdd").on("click", function () {

    $.SubAjax({
        type: 'post',
        data: {
            HolidayName: $("#HolidayName").val(),
            HolidayTime: $("#HolidayTime").val()
        },
        url: '/DataImport/HolidaysSet/AddHoliday',
        success: function (data) {
            if (data.IsSuccess) {
                $("#HolidaySetModal").modal('hide');
                $.ShowMessage("success", "保存成功");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})


