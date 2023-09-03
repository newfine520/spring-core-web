(function (win) {
    var app = new Vue({
        el: "#app",
        data: {
            baseUrl: '',
            dateString: new Date().getTime(),
            number: 0,
            isComplete: false,
            dialogSelect: false,
            isLoading: false,
            tableData: [],
            toleranceList: window.toleranceList,
            toleranceSelectList: [],
            siftList: JSON.parse(JSON.stringify(window.siftList)),
            defaultSiftAllList: JSON.parse(JSON.stringify(window.siftAllList)),
            siftAllList: [],
            checkList: [],
            areaList: [],         // 区域列表
            classList: [],        // 品类列表
            distributorList: [],  // 经销商列表
            productGroupList: [], // 产品组列表
            productLineList: [],  // 产品线列表
            brnadList: [],        // 品拍列表
            shopTypeList: [],     // 门店类型列表
            shopClassList: [],    // 门店类型细分
            proviceList: [],      // 供货形式
            shopDefineList: [],   // 供货形式
            categoryList: [],     // 品类
            subCategoryList: [],  // 子品类
            distributorNoList: [],  // 经销商编码列表
            cityList: [],        // 城市列表
            dialogSearch: {
                keyword: '',
            },
            searchForm: {
              // AreaName: [],
              // ProvinceName: [],
              // CityName: [],
              // CountyLevelCity: [],
              // StoreTypeCode: [],
              // SubStoreTypeCode: [],
              // StoreDefineCode: [],
              // SupplyFormCode: [],
              // SubCategory: [],
              // StoreCode: '',
              // StoreName: '',
              // Category: [],
              // SubCategory: [],
              // Brand: [],
              // ProductLine: [],
              // ProductGroup: [],
              // ProductSpecification: '',
              // DistributorName: [],
              // DistributorNo: [],
              // DistCustomerCode: '',
              // DistCustomerName: '',
              // DistCode: '',
              // DistName: '',
              // DistProdName: '',
              // DistProdCode: '',
              // DistProdBarCode: '',
              // ProductName: '',
              // ProductCode: '',
              // ProductBarCode: '',
            },
            total: 0,
            defaultForm: {
                dateTime: [new Date(), new Date()],
                PageIndex: 1,
                PageSize: 20,
                IsPage: true
            },
            options: [
                { label: '东区', value: 1 }
            ]
        },
        components: {},
        mounted() {
            document.querySelector('#app').style.display = "block"
            // window.Utils.getPosAreaList();
            this.loadInitData()
            this.toleranceList.forEach((item, index) => {
                this.handleTolerance(item, index)
            })
        },
        methods: {
            // initLoading
            initLoading() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                return loading
            },
            // 初始化searchForm
            initSearchForm() {
                this.searchForm = {}
                this.searchForm['dateTime'] = ''
                if (this.siftList.length) {
                    this.siftList.forEach((item) => {
                        this.searchForm[item.code] = ''
                    });
                }
                console.log('searchForm', this.searchForm)
            },
            // 每页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 当前页
            handleCurrentChange(val) {
                this.loadTableDataList()
            },
            // 下拉列表点击事件
            handleSelectChange(val, index, event) {
                console.log('event:', event)
                let isAll = false
                if (event.length > 0) {
                  if (event[event.length - 1] === '-1') {
                    isAll = true
                  } else if(event.length === val.list.length - 1){
                    isAll = true
                  } else {
                    isAll = false
                  }
                }
                
                if (isAll) {
                  // 选择全部
                  this.searchForm[val.code] = ["-1"]
                } else {
                  // 选择非全部
                  this.searchForm[val.code] = this.searchForm[val.code].filter((item) => {
                    return item !== '-1'
                  })
                }

                if (val.code === 'CityName') {
                  this.searchForm['CountyLevelCity'] = []
                    // 选中了城市
                    this.siftList.forEach((item) => {
                        if (item.code === 'CountyLevelCity') {
                            this.loadCoutry(val, index, this.searchForm[val.code])
                        }
                    })
                } else if (val.code === 'Category') {
                    // 选中了品类
                    // 清除子品类和品牌选中的数据
                    this.searchForm.SubCategory = []
                    this.searchForm.Brand = []
                    this.siftList.forEach((item) => {
                        if (item.code === 'SubCategory') {
                            this.loadClass(val, index, this.searchForm[val.code])
                        }
                    })
                } else if (val.code === 'AreaName') {
                  // 选中了大区
                  // 清空省份数据
                  this.searchForm.ProvinceName = []
                  this.siftList.forEach((item) => {
                    if (item.code === 'ProvinceName') {
                        this.loadProvince(val, index, this.searchForm[val.code])
                    }
                  })
                }
            },
            // 度量值点击事件
            handleTolerance(item, index) {
                this.$set(item, "isSelect", !item['isSelect']);
                // console.log(item, index)
                let arr = []
                if (item.isSelect) {
                    // 添加
                    arr = [...this.siftList, ...[{ 'name': item.name, 'code': item.code }]]
                } else {
                    // 删除
                    arr = this.siftList.filter((siftItem) => {
                        return siftItem.code !== item.code
                    })
                }
                this.toleranceSelectList = arr
                this.siftList = arr
            },
            // 备选
            handleSelect() {
                // 降选中的数据，填充到备选项
                let arr = this.siftList.map((item) => {
                    return item.name
                })
                this.checkList = arr
                this.siftAllList = JSON.parse(JSON.stringify(this.defaultSiftAllList))
                this.dialogSearch.keyword = ""
                this.dialogSelect = true
            },
            // 查询
            searchData() {
                this.loadTableDataList()
            },
            // 导出excel
            exportExcel() {
                this.$confirm('是否导出Excel?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    // 确定

                    this.handleExportExcel();

                }).catch(() => {
                    // 取消
                });
            },
            // 导出csv
            exportCSV() {
                this.$confirm('是否导出CSV?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 确定
                    this.handleExportCSV();
                }).catch(() => {
                    // 取消
                });
            },
            // 弹窗 - 关闭
            handleCloseDialog() {
                this.checkList = []
            },
            // 弹窗 - 搜索
            handleSearch() {
                console.log(this.dialogSearch.keyword)

                let list = this.defaultSiftAllList.filter((item) => {
                    return item.name.indexOf(this.dialogSearch.keyword) != -1
                })
                this.siftAllList = list
            },
            // 弹窗 - 确定
            handleSure() {
                console.log('checkList', this.checkList)
                // this.dialogSelect = false
                // 筛选出选中的数据
                let list = this.siftAllList.filter((item) => {
                    return this.checkList.includes(item.name)
                })

                // 备选去除选项，表单对应清除
                let codes = []
                list.forEach((item) => {
                    codes.push(item.code)
                })
                for (const key in this.searchForm) {
                    if (!codes.includes(key)) {
                        delete this.searchForm[key]
                    }
                }

                // 筛选出度量值
                let codeList = this.toleranceList.map(item => item.code);
                let tArr = this.toleranceSelectList.filter((toleranceItem, index) => {
                    return codeList.includes(toleranceItem.code)
                })
                this.siftList = [...list, ...tArr]
                console.log(list)
                // 清空选中值，关闭弹窗
                this.checkList = []
                this.dialogSelect = false
                this.handleData()
            },
            // 弹窗 - 全选
            handleSelectAll() {
                this.checkList = []
                this.siftAllList.forEach((item) => {
                    this.checkList.push(item.name)
                })
            },
            // 弹窗 - 清空
            handleClear() {
                this.checkList = []
            },
            // checkbox 点击事件
            handleChangeCheckbox(val) {
                // let arr = ['大区', '省份']
                // this.checkList = [...this.checkList, ...arr]
                // 关联选中
                console.log(val)
                if (val.includes('县级市')) {
                    this.checkList = [...['城市'], ...val]
                }
                if (val.includes('省份')) {
                  this.checkList = [...['大区'], ...val]
              }
                if (val.includes('子品类')) {
                    this.checkList = [...['品类'], ...val]
                }
                this.checkList = [...new Set(this.checkList)]
                console.log(this.checkList)
            },
            // 处理数据 - 下拉列表填充数据
            handleData() {
                this.siftList.forEach((item) => {
                    if (item.code === 'AreaName') {
                        this.$set(item, 'list', this.areaList)
                    } else if (item.code === 'Category') {
                        this.$set(item, 'list', this.classList)
                    } else if (item.code === 'DistributorName') {
                        this.$set(item, 'list', this.distributorList)
                    } else if (item.code === 'ProductGroup') {
                        this.$set(item, 'list', this.productGroupList)
                    } else if (item.code === 'ProductLine') {
                        this.$set(item, 'list', this.productLineList)
                    } else if (item.code === 'Brand') {
                        this.$set(item, 'list', this.brnadList)
                    } else if (item.code === 'StoreTypeCode') {
                        this.$set(item, 'list', this.shopTypeList)
                    } else if (item.code === 'SubStoreTypeCode') {
                        this.$set(item, 'list', this.shopClassList)
                    } else if (item.code === 'StoreDefineCode') {
                        this.$set(item, 'list', this.shopDefineList)
                    } else if (item.code === 'SupplyFormCode') {
                        this.$set(item, 'list', this.proviceList)
                    } else if (item.code === 'ProvinceName') {
                        this.$set(item, 'list', this.provinceList)
                    } else if (item.code === 'DistributorNo') {
                        this.$set(item, 'list', this.distributorNoList)
                    } else if (item.code === 'CityName') {
                      this.$set(item, 'list', this.cityList)
                  } 
                })
                console.log('result:', this.siftList)
            },
            // 填充数据，二级列表
            fillDataForSelect(index, list) {
                let item = this.siftList[index]
                this.$set(item, 'list', list)
                this.siftList.splice(index, 1, item)
            },
            // date类型转字符串
            getTimeStringWithDate(date) {
                let y = date.getFullYear()
                let m = date.getMonth() + 1
                let d = date.getDate()
                if (m < 10) {
                    m = "0" + m;
                }
                if (d < 10) {
                    d = "0" + d;
                }
                return y + '-' + m + '-' + d
            },
            // 数据处理
            handleFormData(item, key) {
                return this.$set(item, key, item[key].length > 0 ? item[key].join(',') : '')
            },
            // 处理提交的表单
            handleForm() {

              // 处理searchForm，空数组活空对象，添加-1，为了查询全部
              let obj = JSON.parse(JSON.stringify(this.searchForm))
              let arr = this.siftList.filter((item) => {
                return item.hasOwnProperty('type')
              })
              
              if (arr.length > 0) {
                arr.forEach((item) => {
                  if (obj.hasOwnProperty(item['code'])) {
                    if (item['type'] === 'input') {
                      // 输入框
                      obj[item['code']] = obj[item['code']] ? obj[item['code']] : '-1'
                    } else {
                      // 下拉框
                      obj[item['code']] = obj[item['code']].length > 0 ? obj[item['code']] : ['-1']
                    }
                  } else {
                    obj[item['code']] = '-1'
                  }
                })
              }
              let params = {}
              Object.assign(params, obj, this.defaultForm)
              console.log('searchForm', params)
              if (!params.dateTime) {
                  // 
                  throw new Error("请选择开始日期和结束日期");
              }
              // 数据处理
              this.$set(params, 'StartTime', params.dateTime.length > 0 ? this.getTimeStringWithDate(params.dateTime[0]) : '')
              this.$set(params, 'EndTime', params.dateTime.length > 0 ? this.getTimeStringWithDate(params.dateTime[1]) : '')

              return params
            },
            // 加载列表数据
            loadTableDataList() {
                let params = null;
                try {
                    params = this.handleForm()
                } catch (e) {
                    this.$alert(e.message, '提示框', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                this.isLoading = true
                // window.service.post(`${this.baseUrl}/Common/QueryPosSalesStatistics`, params).then((result) => {
                window.service.post(`${this.baseUrl}/Common/QueryPosSalesStatistics`, params).then((result) => {
                    if (result.data) {
                        this.tableData = result.data.rows
                    }
                    this.total = result.data.total
                    this.isLoading = false
                }).catch((error) => {
                    this.isLoading = false
                })
            },
            // 加载初始数据 - 下拉列表
            loadInitData() {
                this.isLoading = true
                let self = this
                // 获取大区列表
                let areaOption = new Promise((resolve, reject) => {
                    window.service.get(`${this.baseUrl}/Common/GetPosArea`).then((result) => {
                        if (result.data.Data) {
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })

                // 获取品类列表
                let classOption = new Promise((resolve, reject) => {
                    window.service.get(`${this.baseUrl}/Common/GetPosCategory`).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
                // 获取经销商列表
                let DistributorOption = new Promise((resolve, reject) => {
                    window.service.get(`${this.baseUrl}/Common/GetPosDistributor`).then((result) => {
                        if (result.data.rows) {
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
                            resolve(list)
                            // resolve(result.data.rows)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })

                // 获取产品组列表
                let productGroupOption = new Promise((resolve, reject) => {
                    window.service.get(`${this.baseUrl}/Common/GetPosProductGroup`).then((result) => {
                        if (result.data.Data) {
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                            // resolve(result.data.Data)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })

                // 获取产品线列表哦
                let productLineOption = new Promise((resolve, reject) => {
                    window.service.get(`${this.baseUrl}/Common/GetPosProductLine`).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })

                // 获取品牌列表
                let brandOption = new Promise((resolve, reject) => {
                    window.service.post(`${this.baseUrl}/Common/QueryPosBrand`).then((result) => {
                        if (result.data.rows) {
                            // resolve(result.data.rows)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
                // 门店类型
                let shopTypeOption = new Promise((resolve, reject) => {
                    let params = { "PropertyType": "门店类型" };
                    window.service.get(`${this.baseUrl}/StoreType/GetStorePropertyList`, { params }).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
                // 门店类型细分
                let shopClassOption = new Promise((resolve, reject) => {
                    let params = { "PropertyType": "门店类型细分" };
                    window.service.get(`${this.baseUrl}/StoreType/GetStorePropertyList`, { params }).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
                // 供货形式
                let proviceOption = new Promise((resolve, reject) => {
                    let params = { "PropertyType": "供货形式" };
                    window.service.get(`${this.baseUrl}/StoreType/GetStorePropertyList`, { params }).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
                // 门店定义
                let shopDefineOption = new Promise((resolve, reject) => {
                    let params = { "PropertyType": "门店定义" };
                    window.service.get(`${this.baseUrl}/StoreType/GetStorePropertyList`, { params }).then((result) => {
                        if (result.data.Data) {
                            // resolve(result.data.Data)
                            let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                            resolve(list)
                        } else {
                          resolve([])
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })

                // 获取省份列表
                let provinceOption = new Promise((resolve, reject) => {
                    // window.service.get(`${this.baseUrl}/Common/GetPosSubArea`).then((result) => {
                    //     if (result.data.Data) {
                    //         let list = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                    //         resolve(list)
                    //     } else {
                    //       resolve([])
                    //     }
                    // }).catch((error) => {
                    //     reject(error)
                    // })
                    resolve([])
                })
                // 获取经销商编码
                let distributorNoList = new Promise((resolve, reject) => {
                  window.service.get(`${this.baseUrl}/Common/GetPosDistributorCode`).then((result) => {
                      if (result.data.rows) {
                        let list = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
                        resolve(list)
                      } else {
                        resolve([])
                      }
                  }).catch((error) => {
                      reject(error)
                  })
                })

                // 获取城市列表
                let cityOption = new Promise((resolve, reject) => {
                  window.service.post(`${this.baseUrl}/Common/QueryPosProvinceCity`).then((result) => {
                      if (result.data.rows) {
                        let list = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
                        resolve(list)
                      } else {
                        resolve([])
                      }
                  }).catch((error) => {
                      reject(error)
                  })
                })

                Promise.all([areaOption, classOption, DistributorOption, productGroupOption, productLineOption,
                    brandOption, shopTypeOption, shopClassOption,
                    proviceOption, shopDefineOption, provinceOption, distributorNoList, cityOption]
                ).then((result) => {
                    console.log(result)
                    self.areaList = result[0]
                    self.classList = result[1]
                    self.distributorList = result[2]
                    self.productGroupList = result[3]
                    self.productLineList = result[4]
                    self.brnadList = result[5]
                    self.shopTypeList = result[6]
                    self.shopClassList = result[7]
                    self.proviceList = result[8]
                    self.shopDefineList = result[9]
                    // self.provinceList = result[10]
                    self.distributorNoList = result[11]
                    self.cityList = result[12]
                    self.handleData()
                    self.isLoading = false
                    this.loadTableDataList()
                }).catch((error) => {
                    self.isLoading = false
                    this.loadTableDataList()
                    this.$message({
                        message: '数据请求失败',
                        type: 'error',
                        duration: 2000
                    });
                })
            },
            // 加载城市
            // loadCity(val, index, selectIds) {
            //     console.log('选中的id:', selectIds)

            //     let params = { 'ProvinceId': selectIds }
            //     this.isLoading = true
            //     window.service.post(`${this.baseUrl}/Common/QueryPosProvinceCity`, params).then((result) => {
            //         if (result.data) {
            //             let cityList = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
            //             this.fillDataForSelect(index + 1, cityList)
            //         } else {
            //             this.$message({
            //                 message: result.data.Msg,
            //                 type: 'warning',
            //                 duration: 2000
            //             });
            //         }
            //         this.isLoading = false
            //     }).catch((error) => {
            //         this.isLoading = false
            //     })
            // },
            // 加载省份
            loadProvince(val, index, selectIds) {
              console.log('选中的id:', selectIds)
              let params = { 'AreaId': selectIds }
              this.isLoading = true
              window.service.post(`${this.baseUrl}/Common/QueryPosSubArea`, params).then((result) => {
                  if (result.data) {
                    let subAreaList = []
                    if (result.data.Data) {
                      subAreaList = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                    }
                    this.fillDataForSelect(index + 1, subAreaList)
                  } else {
                    this.$message({
                      message: result.data.Msg,
                      type: 'warning',
                      duration: 2000
                    });
                  }
                  this.isLoading = false
              }).catch((error) => {
                  this.isLoading = false
              })
            },
            // 加载县级市
            loadCoutry(val, index, selectIds) {
              console.log('选中的id:', selectIds)

              let params = { 'AreaId': selectIds }

              this.isLoading = true
              window.service.post(`${this.baseUrl}/Common/QueryPosCountyLevelCityList`, params).then((result) => {
                  if (result.data) {
                    let coutryList = []
                    if (result.data.Data) {
                      coutryList = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                    }
                    this.fillDataForSelect(index + 1, coutryList)
                  } else {
                    this.$message({
                        message: result.data.Msg,
                        type: 'warning',
                        duration: 2000
                    });
                  }
                  this.isLoading = false
              }).catch((error) => {
                  this.isLoading = false
              })
            },
            // 加载子品类
            loadClass(val, index, selectIds) {
                console.log('选中的id:', selectIds)
                let params = { 'categoryid': selectIds }
                this.isLoading = true
                window.service.post(`${this.baseUrl}/Common/QueryPosSubCategory`, params).then((result) => {
                    if (result.data) {
                      let subCategoryList = []
                      if (result.data.Data) {
                        subCategoryList = [...[{ name: '全部', value: '-1' }], ...result.data.Data]
                      }
                      this.fillDataForSelect(index + 1, subCategoryList)
                    } else {
                      this.$message({
                        message: result.data.Msg,
                        type: 'warning',
                        duration: 2000
                      });
                    }
                    this.isLoading = false
                }).catch((error) => {
                    this.isLoading = false
                })

                window.service.post(`${this.baseUrl}/Common/QueryPosBrand`, params).then((result) => {
                    if (result.data.rows) {
                      let brandList = []
                      if (result.data.rows) {
                        brandList = [...[{ name: '全部', value: '-1' }], ...result.data.rows]
                      } 
                      this.fillDataForSelect(index + 2, brandList)
                    } else {
                        this.$message({
                            message: result.data.Msg,
                            type: 'warning',
                            duration: 2000
                        });
                    }
                    this.isLoading = false
                }).catch((error) => {
                    this.isLoading = false
                })
            },
            handleExportExcel() {

                let params = null;
                try {
                    params = this.handleForm();
                    //不分页
                    params.IsPage = false;
                    //显示列名
                    params.siftList = this.siftList;
                    // 
                    //params.siftList.push({
                    //    name: "开始时间",
                    //    code: "StartTime"
                    //})
                    //params.siftList.push({
                    //    name: "结束时间",
                    //    code: "EndTime"
                    //})
                } catch (e) {
                    this.$alert(e.message, '提示框', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                this.isLoading = true
                window.service.post(`${this.baseUrl}/Common/ExportWPOSExcel`, params).then((result) => {

                    if (result.data.IsSuccess) {
                        window.location.href = "/File/DownFile?filePath=" + result.data.Data + "&fileName=POS销售数据统计";
                    }
                    else {
                        $.ShowMessage("error", data.Msg)
                    }
                    this.isLoading = false
                }).catch((error) => {
                    this.isLoading = false
                })

            },
            handleExportCSV() {

                let params = null;
                try {
                    params = this.handleForm();
                    //不分页
                    params.IsPage = false;
                    //显示列名
                    params.siftList = this.siftList;

                    //params.siftList.push({
                    //    name: "开始时间",
                    //    code: "StartTime"
                    //})
                    //params.siftList.push({
                    //    name: "结束时间",
                    //    code: "EndTime"
                    //})
                } catch (e) {
                    this.$alert(e.message, '提示框', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                this.isLoading = true
                window.service.post(`${this.baseUrl}/Common/ExportWPOSCSV`, params).then((result) => {

                    if (result.data.IsSuccess) {
                        window.location.href = "/File/DownFile?filePath=" + result.data.Data + "&fileName=POS销售数据统计";
                    }
                    else {
                        $.ShowMessage("error", data.Msg)
                    }
                    this.isLoading = false
                }).catch((error) => {
                    this.isLoading = false
                })

            }
        },
    });
})(window)