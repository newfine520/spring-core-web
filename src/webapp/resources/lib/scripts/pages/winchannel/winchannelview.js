var winchannelNS = winchannelNS || {};

winchannelNS.bindDMSDataTable = function () {

    $('#dataTable').bootstrapTable({
        url: "/DataImport/WinChannel/getAllDMSDataByPage",
        pagination: "true",
        queryParams: winchannelNS.Table.queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: 'Sale_ID',
                title: '销售ID'
            },
            {
                field: 'DIST_CODE',
                title: '经销商编码'
            },
            {
                field: 'DIST_NAME',
                title: '经销商名称'
            },
            {
                field: 'BILL_CODE',
                title: '单据编码'
            },
            {
                field: 'Bill_DateString',
                title: '单据日期'
            },
            {
                field: 'BILL_TYPE',
                title: '单据类型'
            },
            {
                field: 'DIST_STORE_CODE',
                title: '经销商处客户编码'
            },
            {
                field: 'DIST_STORE_NAME',
                title: '经销商处客户名称'
            },
            {
                field: 'DIST_PROD_CODE',
                title: '经销商产品编码'
            },
            {
                field: 'DIST_PROD_NAME',
                title: '经销商产品名称'
            },
            {
                field: 'DIST_PROD_BARCODE',
                title: '经销商产品条码'
            },
            {
                field: 'DIST_PROD_SPEC',
                title: '经销商产品规格'
            },
            {
                field: 'DIST_PROD_UNIT',
                title: '经销商产品单位'
            },
            {
                field: 'DIST_PROD_PRICE',
                title: '经销商产品价格'
            },
            {
                field: 'STORE_CODE',
                title: '门店标准编码'
            }
            ,
            {
                field: 'STORE_NAME',
                title: '门店标准名称'
            }
            ,
            {
                field: 'PROD_CODE',
                title: '产品标准编码'
            }
            ,
            {
                field: 'PROD_NAME',
                title: '产品标准名称'
            }
            ,
            {
                field: 'PROD_BARCODE',
                title: '产品标准条码'
            }
            ,
            {
                field: 'BASE_QTY',
                title: '基本单位数量'
            }
            ,
            {
                field: 'PROD_AMT',
                title: '经销商产品金额'
            },
            {
                field: 'BASE_UNIT',
                title: '基本单位'
            }
            ,
            {
                field: 'GROUP_PRICE',
                title: '基价价格'
            }

        ]
    });

}


winchannelNS.bindPOSDataTable = function () {

    $('#dataTable').bootstrapTable({
        url: "/DataImport/WinChannel/getAllPOSDataByPage",
        pagination: "true",
        queryParams: winchannelNS.Table.queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        clickToSelect: true,
        columns: [
            {
                field: 'Sale_ID',
                title: '销售ID'
            },
            {
                field: 'DIST_CODE',
                title: '经销商编码'
            },
            {
                field: 'DIST_NAME',
                title: '经销商名称'
            },
            {
                field: 'BILL_CODE',
                title: '单据编码'
            },
            {
                field: 'Bill_DateString',
                title: '单据日期'
            },
            {
                field: 'BILL_TYPE',
                title: '单据类型'
            },
            {
                field: 'DIST_STORE_CODE',
                title: '经销商处客户编码'
            },
            {
                field: 'DIST_STORE_NAME',
                title: '经销商处客户名称'
            },
            {
                field: 'DIST_PROD_CODE',
                title: '经销商产品编码'
            },
            {
                field: 'DIST_PROD_NAME',
                title: '经销商产品名称'
            },
            {
                field: 'DIST_PROD_BARCODE',
                title: '经销商产品条码'
            },
            {
                field: 'DIST_PROD_SPEC',
                title: '经销商产品规格'
            },
            {
                field: 'DIST_PROD_UNIT',
                title: '经销商产品单位'
            },
            {
                field: 'DIST_PROD_PRICE',
                title: '经销商产品价格'
            },
            {
                field: 'STORE_CODE',
                title: '门店标准编码'
            }
            ,
            {
                field: 'STORE_NAME',
                title: '门店标准名称'
            }
            ,
            {
                field: 'STORE_CODE',
                title: '门店标准编码'
            }
            ,
            {
                field: 'PROD_CODE',
                title: '产品标准编码'
            }
            ,
            {
                field: 'PROD_NAME',
                title: '产品标准名称'
            }
            ,
            {
                field: 'PROD_BARCODE',
                title: '产品标准条码'
            }
            ,
            {
                field: 'BASE_QTY',
                title: '基本单位数量'
            }
            ,
            {
                field: 'PROD_AMT',
                title: '经销商产品金额'
            }

            ,
            {
                field: 'GROUP_PRICE',
                title: '基价价格'
            }

        ]
    });

}


winchannelNS.Table = {

    queryParams: function (params) {
        return {
            PageSize: params.limit,   //页面大小
            PageIndex: params.offset / params.limit + 1,//  sort: params.sort,  //排序列名
            sortOrder: params.order,//排位命令（desc，asc）
            Month: $("#yearMonth").val(),
        };
    }

}