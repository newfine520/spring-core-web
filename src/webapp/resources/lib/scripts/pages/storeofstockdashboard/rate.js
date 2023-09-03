

function laadRateGet() {

    $.get("/DataImport/StoreOutOfStatistics/getStoreOutOfAreaSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {

        loadRate(data);
        loadProvinceRate(data);


           
            let count =  0;
            if (data.BigAreaGroup) {
              
                if (data.BigAreaGroup.length >= 3) {
                    count = 3
                } else {
                    count = data.BigAreaGroup.length;
                }
            }
           
            if (count == 0) {
                count = 1;
            }
            if (count == 1) {
                $(".roll_row .roll__list li").width(($("#areaProviceRate").width() + 14));
            }
            if (count == 2) {
                $(".roll_row .roll__list li").width(($("#areaProviceRate").width() + 6)/2);
            }

            if (count == 3) {
                $(".roll_row .roll__list li").width(($("#areaProviceRate").width() + 2)/3);
            }
           

        $('#areaProviceRate').rollSlide({
            orientation: 'right',
            num: 1,
            v: 1500,
            space: 3000,
            isRoll: false
        });


        //loadRate(data);
        //loadProvinceRate(data);

        //var currentProvinceLocation = 0;
        //var childLength = $(".province-content-list").length;
        //var proviceWidth = $(".province-content-list").width();
        //if (childLength > 3) {
        //    proviceWidth = proviceWidth * (childLength - 3);
        //}           


        //$("#d_leftMove").off('click').on('click', function () {
        //    if (currentProvinceLocation < proviceWidth) {
        //        moveProvince(currentProvinceLocation += $(".dashboard-province-rate").outerWidth());
        //    }               

        //});
        //$("#d_rightMove").off('click').on('click', function () {
        //    if (currentProvinceLocation > 0)
        //        moveProvince(currentProvinceLocation -= $(".dashboard-province-rate").outerWidth());
        //});

    }, "json");

}

function moveProvince(movePx) {

    $("#areaProviceRate").scrollLeft(movePx);
}
function rightMoveProvince(movePx) {
    $("#areaProviceRate").scrollLeft(1000);
}