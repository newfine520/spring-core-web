$(function () {
    $(".select2").select2();
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN'
    });
    $("#CityCode").select2({
        placeholder: "请选择",
        allowClear: true,
        data: ""
    });
    loadAllProvince($("#ProvinceCode"), false);
    changeProvince($("#ProvinceCode"), $("#CityCode"))
    var columns = [
         {
             title: '操作',
             field: 'StoreId',
             formatter: operateFormatter,
             events: 'operateEvents'
         },
             {
                 field: 'ProvinceName',
                 title: '省份',
             },
                 {
                     field: 'CityName',
                     title: '城市',
                 },
             {
                 field: 'StoreNo',
                 title: '门店编号',
             },
             {
                 field: 'StoreName',
                 title: '门店名称'
             },
             {
                 field: 'Brand',
                 title: '品牌'
             },{
                 field: 'Sku',
                 title: 'Sku'
             }, {
                 field: 'AdvicePrice',
                 title: '建议零售价'
             }, {
                 field: 'Price',
                 title: '实际零售价'
             },{
                 field:'IsAnomaly',
                 title: '是否异常',
                 formatter: function(value,row,index){
                     if (row.IsAnomaly) {
                         return "是";
                     } else {
                         return "否";
                     }
                 }
             },
             {
                 field: 'Reason',
                 title: '异常原因'
             }, {
                 field: 'CreateBy',
                 title: '填报人'
             }, {
                 field: 'StrCreateTime',
                 title: '填报时间'
             },

    ];
    $('#dataTable').bootstrapTable({
        url: "/DataImport/StorePriceAnomaly/QueryStorePriceAnomaly",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: columns
    });
    //$.SubAjax({
    //    type: 'post',
    //    //data: { CategoryNo: categoryType.physiology },
    //    url: '/DataImport/Brand/QuerySubBrand',
    //    success: function (data) {
    //        if (data.IsSuccess) {
    //            $.each(data.Data, function (index, value) {
    //                var subBrandName = value.Name;
    //                columns.push({
    //                    title: subBrandName,
    //                    field: subBrandName,
    //                    formatter: function (value1, row, index1) {
    //                        if (value1 < 0) {
    //                            return '否'
    //                        }
    //                        else {
    //                            return value1;
    //                        }
    //                    }
    //                });
    //            })
    //        }
    //        $('#dataTable').bootstrapTable({
    //            url: "/DataImport/StorePriceAnomaly/GetDataList",
    //            pagination: "true",
    //            queryParams: queryParams,
    //            sidePagination: 'server',
    //            onPostBody: function () {
    //                RenderRoleButton();
    //            },
    //            columns: columns
    //        });
    //    }
    //})

    $("#btnSearch").on("click", function () {
        $('#dataTable').bootstrapTable("refresh");
    })

    
})
var PriceAnomalyForm = $("#PriceAnomalyForm");
PriceAnomalyForm.validate({
    rules: {
        Price: {
            required: true
        }
    },
    messages: {
        Price: {
            required: "请输入实际零售价",
        }
    }
})

function queryParams(params) {
    return {
        PageSize: params.limit,   //页面大小
        SkipCount: params.offset,//  sort: params.sort,  //排序列名
        sortOrder: params.order,//排位命令（desc，asc）
        StoreName: $("#txtStoreName").val(),
        ProvinceCode: $("#ProvinceCode").val(),
        IsAnomaly:$("#isAnomaly").val(),
        CityCode: $("#CityCode").val(),
        DateSta: $("#FullDateSta").val(),
        DateEnd: $("#FullDateEnd").val()
    };
}
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" data-role="Admin"  title="编辑">编辑</a>'
    ].join('');
}
window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        $("#myModal").modal({ backdrop: 'static', keyboard: false });
        $("#PriceAnomalyId").val(row.Id);
        $("#myModalLabel").html(row.Sku);
        $.SubAjax({
            type: 'post',
            data: {Id: row.Id},
            url: '/DataImport/StorePriceAnomaly/GetStorePriceAnomalyDetail',
            success: function (data) {
                if (data.IsSuccess) {
                    data = data.Data;
                    $("#AdvicePrice").val(data.AdvicePrice);
                    $("#Price").val(data.Price);
                    $("#Reason").val(data.Reason);
                    if (data.IsAnomaly) {
                        $("#IsAnomaly1").prop("checked", true);
                        $("#IsAnomaly2").prop("checked", false);
                        
                        //$("#divReason").show();
                    }
                    else {
                        $("#IsAnomaly2").prop("checked", true);
                        $("#IsAnomaly1").prop("checked", false);

                        //$("#divReason").hide();
                    }
                    RadioClick();
                  
                }
                //else {
                //    $.ShowMessage('error', '获取数据失败！')
                //}
            }
        })
    }
}

function RadioClick() {
    $(".is-anomaly").on("click", function () {
        if ($(this).val() === "true") {
            //$("#divReason").show();
            $("#Reason").val('')
        }
        else {
            //$("#divReason").hide();
            $("#Reason").val('')
        }
    })
}
$("#btnUpdate").on("click", function () {
    var paId = $("#PriceAnomalyId").val();
    var isValue = $("input[name='IsAnomalys']:checked").val();
    $("input[name='IsAnomaly']").val(isValue)
    if (PriceAnomalyForm.valid()) {
        if (isValue) { }
        $.SubAjax({
            type: 'post',
            url: '/DataImport/StorePriceAnomaly/UpdatePriceAnomaly?Id=' + paId,
            data: PriceAnomalyForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})
$('input[name=Price]').change(function () {
    var price = $("#Price").val();
    var advicePrice = $("#AdvicePrice").val();
    if (price >= advicePrice * 0.7 && price <= advicePrice * 1.3) {
        $("#IsAnomaly2").prop("checked", true);
        $("#IsAnomaly1").prop("checked", false);

        //$("#divReason").hide();

    } else {
        $("#IsAnomaly1").prop("checked", true);
        $("#IsAnomaly2").prop("checked", false);

        //$("#divReason").show();



    }
});
$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            StoreName: $("#txtStoreName").val(),
            ProvinceCode: $("#ProvinceCode").val(),
            CityCode: $("#CityCode").val(),
            IsAnomaly: $("#isAnomaly").val(),
        },
        url: '/DataImport/StorePriceAnomaly/ExportPirceAnomaly',
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=异常价格报表";
            }
            else {
                $.ShowMessage("error", data.Msg);
            }
        }
    })
})
