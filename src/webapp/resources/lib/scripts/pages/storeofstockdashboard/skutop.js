//  加载sku

function loadSKUData() {



    $.get("/DataImport/StoreOutOfStatistics/getStoreOutOfSkuSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        groupType: 0,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {
        data = data;

        var item = [];
        if (data) {
            if (data.DetailList && data.DetailList.length > 0)
                if (data.DetailList.length > 0) {
                    data.DetailList.forEach(function (it, index) {
                        if (index < 3) {
                            item.push(`<div class="sku-top-row"><p class="header-product" style="display:flex"><span class="badge badge-red">${index + 1}</span><span>${it.SkuName}</span></p><p class="header-store">${it.OutOfSkuCount}</p><p class="header-price">${parseFloat(Math.round(it.OutOfMoney)).toLocaleString()}</p></div>`);
                        }
                        else {
                            item.push(`<div class="sku-top-row"><p class="header-product" style="display:flex"><span class="badge badge-gray">${index + 1}</span><span>${it.SkuName}</span></p><p class="header-store">${it.OutOfSkuCount}</p><p class="header-price">${parseFloat(Math.round(it.OutOfMoney)).toLocaleString()}</p></div>`);
                        }

                    });

                    $("#p_sku").html(data.TotalSkuNum || 0);
                    $("#p_store").html(data.TotalStoreNum || 0);
                    console.log(parseFloat(data.TotalMoney).toLocaleString())
                    $("#p_money").html(parseFloat(Math.round(data.TotalMoney)).toLocaleString()|| 0);


                }


        }
        $("#SkuTop").html(item.join(''));

    }, "json");
}


// 加载品类
function loadPinLeiData() {


    $.get("/DataImport/StoreOutOfStatistics/getStoreOutOfSkuSummery", {
        StartDate: OutOfStockStatisticsPageNS.dateConfig.startTime,
        EndDate: OutOfStockStatisticsPageNS.dateConfig.endTime,
        groupType: 1,
        Status: OutOfStockStatisticsPageNS.dateConfig.status
    }, function (data) {
        data = data;

        var item = [];
        if (data) {
            if (data.DetailList && data.DetailList.length > 0)
                if (data.DetailList.length > 0) {
                    data.DetailList.forEach(function (it, index) {
                        if (index < 3) {
                            item.push(`<div class="sku-top-row"><p class="header-pinlei" style="display:flex"><span class="badge badge-red">${index + 1}</span><span>${it.CategoryName}</span></p><p class="header-store">${it.OutOfSkuCount}</p></p><p class="header-store">${it.OutOfStore}</p><p class="header-price">${parseFloat(Math.round(it.OutOfMoney)).toLocaleString()}</p></div>`);
                        }
                        else {
                            item.push(`<div class="sku-top-row"><p class="header-pinlei" style="display:flex"><span class="badge badge-gray">${index + 1}</span><span>${it.CategoryName}</span></p><p class="header-store">${it.OutOfSkuCount}</p></p><p class="header-store">${it.OutOfStore}</p><p class="header-price">${parseFloat(Math.round(it.OutOfMoney)).toLocaleString()}</p></div>`);
                        }
                    });
                }
            $("#p_c_sku").html(data.TotalSkuNum || 0);
            $("#p_c_store").html(data.TotalStoreNum || 0);
            $("#p_c_money").html(parseFloat(Math.round(data.TotalMoney)).toLocaleString() || 0);
        }
        $("#pinLeiTop").html(item.join(''));

    }, "json");
}