!function(e){function t(t){for(var o,i,n=t[0],s=t[1],c=t[2],m=0,d=[];m<n.length;m++)i=n[m],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&d.push(r[i][0]),r[i]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);for(u&&u(t);d.length;)d.shift()();return l.push.apply(l,c||[]),a()}function a(){for(var e,t=0;t<l.length;t++){for(var a=l[t],o=!0,n=1;n<a.length;n++){var s=a[n];0!==r[s]&&(o=!1)}o&&(l.splice(t--,1),e=i(i.s=a[0]))}return e}var o={},r={3:0},l=[];function i(t){if(o[t])return o[t].exports;var a=o[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=o,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(a,o,function(t){return e[t]}.bind(null,o));return a},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var n=window.webpackJsonp=window.webpackJsonp||[],s=n.push.bind(n);n.push=t,n=n.slice();for(var c=0;c<n.length;c++)t(n[c]);var u=s;l.push([71,1,0]),a()}({11:function(e,t,a){var o=a(64);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,a(7).default)("f0d9d088",o,!1,{})},5:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"c",(function(){return l})),a.d(t,"b",(function(){return i}));var o=a(0),r=function(){return o.a.request({url:"Common/GetPosArea",method:"get"})},l=function(e){return o.a.request({url:"Common/QueryPosSubArea",method:"post",data:e})},i=function(e){return o.a.request({url:"Common/QueryPosProvinceCity",method:"post",data:e})}},63:function(e,t,a){"use strict";var o=a(11);a.n(o).a},64:function(e,t,a){(t=a(6)(!1)).push([e.i,".gift[data-v-6364bf6c]{background:#fff;padding-top:30px}.main[data-v-6364bf6c]{width:100%;margin-top:30px;padding-top:30px;border-top:1px solid #e7eaec}.main>.table[data-v-6364bf6c]{margin-top:30px}[data-v-6364bf6c] .el-form-item__content{width:190px}",""]),e.exports=t},71:function(e,t,a){"use strict";a.r(t);var o=a(8),r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"gift"},[a("el-row",{staticStyle:{padding:"0 20px"}},[a("div",{staticClass:"searchForm"},[a("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.searchForm,"label-position":"right","label-width":"100px"}},[a("el-form-item",{attrs:{label:"活动编号"}},[a("el-input",{attrs:{placeholder:"请选择活动编号"},model:{value:e.searchForm.ActivityNo,callback:function(t){e.$set(e.searchForm,"ActivityNo",t)},expression:"searchForm.ActivityNo"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"活动名称"}},[a("el-input",{attrs:{placeholder:"请选择活动名称"},model:{value:e.searchForm.ActivityName,callback:function(t){e.$set(e.searchForm,"ActivityName",t)},expression:"searchForm.ActivityName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"门店编号"}},[a("el-input",{attrs:{placeholder:"门店编号"},model:{value:e.searchForm.StoreNo,callback:function(t){e.$set(e.searchForm,"StoreNo",t)},expression:"searchForm.StoreNo"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"门店名称"}},[a("el-input",{attrs:{placeholder:"门店名称"},model:{value:e.searchForm.StoreName,callback:function(t){e.$set(e.searchForm,"StoreName",t)},expression:"searchForm.StoreName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"大区"}},[a("el-select",{attrs:{clearable:"",filterable:"","collapse-tags":"",placeholder:"请选择大区"},on:{change:e.AreaNameChange},model:{value:e.searchForm.AreaName,callback:function(t){e.$set(e.searchForm,"AreaName",t)},expression:"searchForm.AreaName"}},e._l(e.AreaSelect,(function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.value}})})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"省份"}},[a("el-select",{attrs:{clearable:"",filterable:"","collapse-tags":"",placeholder:"请选择省份"},on:{change:e.ProvinceChange},model:{value:e.searchForm.Province,callback:function(t){e.$set(e.searchForm,"Province",t)},expression:"searchForm.Province"}},e._l(e.ProvinceSelect,(function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.value}})})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"城市"}},[a("el-select",{attrs:{clearable:"",filterable:"","collapse-tags":"",placeholder:"请选择城市"},model:{value:e.searchForm.City,callback:function(t){e.$set(e.searchForm,"City",t)},expression:"searchForm.City"}},e._l(e.CitySelect,(function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.value}})})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"赠品编码"}},[a("el-input",{attrs:{placeholder:"赠品编码"},model:{value:e.searchForm.GiftSkuNo,callback:function(t){e.$set(e.searchForm,"GiftSkuNo",t)},expression:"searchForm.GiftSkuNo"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"赠品名称"}},[a("el-input",{attrs:{placeholder:"赠品名称"},model:{value:e.searchForm.GiftSkuName,callback:function(t){e.$set(e.searchForm,"GiftSkuName",t)},expression:"searchForm.GiftSkuName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"提报状态"}},[a("el-select",{attrs:{clearable:"",placeholder:"提报状态"},model:{value:e.searchForm.ReportStatus,callback:function(t){e.$set(e.searchForm,"ReportStatus",t)},expression:"searchForm.ReportStatus"}},[a("el-option",{key:0,attrs:{label:"未提报",value:"未提报"}}),e._v(" "),a("el-option",{key:1,attrs:{label:"已提报",value:"已提报"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"时间"}},[a("el-date-picker",{attrs:{type:"daterange","value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:e.handleTimeClear},model:{value:e.timeData,callback:function(t){e.timeData=t},expression:"timeData"}})],1)],1),e._v(" "),a("el-row",[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.onSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.onReset}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-plus",size:"small"},on:{click:function(t){e.dialogVisible=!0}}},[e._v("发货")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"small",loading:e.downloadLoading},on:{click:e.download}},[e._v("下载")])],1)],1)]),e._v(" "),a("el-row",{staticClass:"main",staticStyle:{padding:"0 20px"}},[a("div",{staticClass:"table"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoading,expression:"tableLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,border:!0,fit:!0}},[a("el-table-column",{attrs:{prop:"ActivityNo",label:"活动编号","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ActivityName",label:"活动名称","min-width":"180"}}),e._v(" "),a("el-table-column",{attrs:{prop:"AreaName",label:"大区","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Province",label:"省份","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"City",label:"城市","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreNo",label:"门店编号","min-width":"160"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName",label:"门店名称","min-width":"190"}}),e._v(" "),a("el-table-column",{attrs:{prop:"GiftSkuNo",label:"赠品编号","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"GiftSkuName",label:"赠品名称","min-width":"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Status",label:"提报状态","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"YFAmount",label:"应发数量"}}),e._v(" "),a("el-table-column",{attrs:{prop:"SSAmount",label:"实收数量"}}),e._v(" "),a("el-table-column",{attrs:{prop:"YAmount",label:"已发数量"}}),e._v(" "),a("el-table-column",{attrs:{prop:"KCAmount",label:"库存量"}}),e._v(" "),a("el-table-column",{attrs:{prop:"CTime",label:"创建时间","min-width":"180"}})],1),e._v(" "),a("el-row",[a("el-col",{staticStyle:{"margin-top":"30px",display:"flex","align-items":"center","justify-content":"flex-end"}},[a("el-pagination",{attrs:{"current-page":e.searchForm.PageNumber,"page-size":e.searchForm.PageSize,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",background:"",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1)]),e._v(" "),a("el-dialog",{attrs:{title:"上传发货数据",visible:e.dialogVisible,width:"40%","append-to-body":""},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("p",[e._v("请根据具体活动上传赠品发货数据！")]),e._v(" "),a("p",[e._v(e._s(1===e.fileList.length?e.fileList[0].name:""))]),e._v(" "),a("el-row",{staticStyle:{"margin-top":"20px"}},[a("el-col",{attrs:{span:4}},[a("div",{staticClass:"btns"},[a("a",{staticClass:"btn btn-primary",attrs:{id:"btnExportTemplete",href:"/Templete/GiftDelivery/赠品发货模板.xlsx"}},[e._v("模板下载")])])]),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-upload",{staticClass:"upload-demo",attrs:{action:"https://jsonplaceholder.typicode.com/posts/",limit:1,"auto-upload":!1,"show-file-list":!1,accept:".xls,.xlsx","on-change":e.fileOnchange,"file-list":e.fileList}},[a("a",{staticClass:"btn btn-primary",staticStyle:{"border-color":"#337ab7","background-color":"#337ab7"}},[e._v("选择文件")])])],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.handleCancel}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary",loading:e.buttonLoading},on:{click:e.handleUpload}},[e._v("上 传")])],1)],1)],1)};r._withStripped=!0;var l=a(9),i=a(5),n={data:function(){return{centerDialogVisible:!1,searchForm:{ActivityNo:"",ActivityName:"",AreaName:[],City:"",Province:[],StoreNo:"",StoreName:"",GiftSkuNo:"",GiftSkuName:"",ReportStatus:"",StartTime:"",EndTime:"",PageNumber:1,PageSize:10},timeData:[],loading:!1,tableData:[],fileList:[],PageSize:10,total:0,dialogVisible:!1,buttonLoading:!1,tableLoading:!1,downloadLoading:!1,AreaSelect:[],ProvinceSelect:[],CitySelect:[],ActivityNameSelect:[],ActivityNoSelect:[]}},methods:{handleColumnClick:function(e,t,a){this.centerDialogVisible=!0,this.FormType=a},onSearch:function(){var e=this;this.tableLoading=!0,Object(l.b)(this.searchForm).then((function(t){t.data.rows&&(e.tableData=t.data.rows,e.total=t.data.total),e.tableLoading=!1})).catch((function(t){e.tableLoading=!1}))},onReset:function(){this.searchForm={ActivityNo:"",ActivityName:"",AreaName:"",City:"",Province:"",StoreNo:"",StoreName:"",GiftSkuNo:"",GiftSkuName:"",ReportStatus:"",StartTime:"",EndTime:"",PageNumber:1,PageSize:10},this.timeData=[],this.onSearch()},onAdd:function(){this.centerDialogVisible=!0,this.FormType="add"},fileOnchange:function(e){this.fileList=[e]},download:function(){var e=this;this.downloadLoading=!0,Object(l.a)(this.searchForm).then((function(t){200===t.status&&t.data.IsSuccess&&(window.location.href="/File/DownFile?filePath="+t.data.Data+"&fileName=发货数据"),e.downloadLoading=!1})).catch((function(t){e.downloadLoading=!1}))},handleSizeChange:function(e){this.searchForm.PageSize=e,this.onSearch()},handleCurrentChange:function(e){this.searchForm.PageNumber=e,this.onSearch()},handleUpload:function(){var e=this;if(this.buttonLoading=!0,0==this.fileList.length)return this.$tool("请选择要上传的文件"),void(this.buttonLoading=!1);var t=new FormData;t.append("file",this.fileList[0].raw),Object(l.c)(t).then((function(t){if(t.data.IsSuccess)e.$tool(t.data.Msg),e.onSearch();else{var a="";t.data.Data.forEach((function(e){a=a+e.ErrorMsg+";"})),e.$tool(a)}e.dialogVisible=!1,e.buttonLoading=!1,e.fileList=[]})).catch((function(t){e.buttonLoading=!1}))},handleCancel:function(){this.dialogVisible=!1,this.fileList=[]},handleTimeClear:function(e){null!==e?(this.searchForm.StartTime=e[0],this.searchForm.EndTime=e[1]):(this.searchForm.StartTime="",this.searchForm.EndTime="")},AreaNameChange:function(){var e=this;this.searchForm.Province=[],Object(i.c)({AreaId:this.searchForm.AreaName}).then((function(t){t.data.IsSuccess&&(e.ProvinceSelect=t.data.Data)}))},ProvinceChange:function(){}},created:function(){var e=this;this.onSearch(),Object(i.a)().then((function(t){t.data.IsSuccess&&(e.AreaSelect=t.data.Data)})),Object(i.b)().then((function(t){t.data.rows&&(e.CitySelect=t.data.rows)}))},mounted:function(){}},s=(a(63),a(4)),c=Object(s.a)(n,r,[],!1,null,"6364bf6c",null);c.options.__file="src/views/gift.vue";var u=c.exports;new o.a({el:"#app",render:function(e){return e(u)}})},9:function(e,t,a){"use strict";a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return l})),a.d(t,"a",(function(){return i}));var o=a(0),r=function(e){return o.a.request({url:"/GiftDelivery/QueryGiftDeliveryList",method:"post",data:e})},l=function(e){return o.a.request({url:"/GiftDelivery/ImportGiftDelivery",method:"post",data:e})},i=function(e){return o.a.request({url:"/GiftDelivery/ExportGiftDelivery",method:"post",data:e})}}});