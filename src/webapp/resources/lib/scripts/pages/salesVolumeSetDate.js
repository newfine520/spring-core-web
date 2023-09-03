$(function () {
    $(".select2").select2();
    $.SubAjax({
        type: 'get',
        data: {},
        url: '/DataImport/SalesVolumeSetDate/GetSalesVolumePostTime',
        success: function (data) {
            if (data.IsSuccess) {
                $("#weekDates").val(data.Data);
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
});

$("#btnUpdateConfig").on("click", function () {
    $("input[name='weekSelect']").val($("#weekDates").val())

    $.SubAjax({
        type: 'post',
        data: $("#ConfigForm").serializeToJson(),
        url: '/DataImport/SalesVolumeSetDate/ConfigSalesVolumePostTime',
        success: function (data) {
            if (data.IsSuccess) {
                $.ShowMessage("success", '修改成功');
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
});