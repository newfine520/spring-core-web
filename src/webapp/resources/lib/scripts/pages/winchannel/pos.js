$(function () {


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
    winchannelNS.bindPOSDataTable();

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("destroy");
        winchannelNS.bindPOSDataTable();

    })

    $("#btnExport").on("click", function () {
        $.SubAjax({
            type: 'post',
            data: {
                Month: $("#yearMonth").val()
            },
            url: '/DataImport/WinChannel/ExportPOSDetail',
            success: function (data) {
                if (data.IsSuccess) {
                    window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=pos数据";
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    })




});