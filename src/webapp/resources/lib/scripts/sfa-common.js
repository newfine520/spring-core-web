function ConvertToJSDate(jsonDate) {

    var jsondate = jsonDate.replace("/Date(", "").replace(")/", "");

    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    } else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }
    var date = new Date(parseInt(jsondate, 10));

    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function InitHeight() {
    var titleHeight = $(".ibox-title").height();
    var formHeight = $(".form-height").height();
    if (formHeight > 0) {
        var tableHeight = $(window).height() - formHeight - titleHeight - 75;
        $(".table-hover.table-bordered").data("height", tableHeight);
    }
}

$(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(".select2").select2();
    })
})