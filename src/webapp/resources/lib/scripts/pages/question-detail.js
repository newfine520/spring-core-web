$(function ()
{

    //alert($("#Qid").val());
    $(".select2").select2();
    $("#questionParam").select2();
    LoadQuestionNo($("#ParentNo"));
    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
    LoadQuestionCompareNo($("#CompareNo"));
    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
    $("#selType").on("change", function () {
        var typeCode = $("#selType").val();
        if(typeCode!=null&&typeCode!="")
        {
            if (typeCode == "800001" ) {
                $("#ChooseOption").show();
                $("#divMaxNum").hide();
                $("#divKeyboardType").hide();
                $("#selKeyboardType").val("");
                $("#MaxNum").val("");
                $("#divParentNo").show();
                $("#divParentSelect").show();
                $("#ParentNo").val("");
                $("#ParentSelect").val("");
                $("#divCompareType").hide();
                $("#divCompareNo").hide();
                $("#CompareNo").val("");
                $("#CompareType").val("");
                $("#selKeyboardTypeDiv").show();
                $("#selKeyboardTypeDiv2").hide();
            } else if (typeCode == "800002") {
                $("#ChooseOption").show();
                $("#divMaxNum").hide();
                $("#divKeyboardType").hide();
                $("#selKeyboardType").val("");
                $("#MaxNum").val("");
                $("#divParentNo").show();
                $("#divParentSelect").show();
                $("#ParentNo").val("");
                $("#ParentSelect").val("");
                $("#divCompareType").hide();
                $("#divCompareNo").hide();
                $("#CompareNo").val("");
                $("#CompareType").val("");
                $("#selKeyboardTypeDiv").show();
                $("#selKeyboardTypeDiv2").hide();
            }
            else if (typeCode == "800005")
            {
                $("#divMaxNum").show();
                $("#divKeyboardType").show();
                $("#divParentNo").show();
                $("#divParentSelect").show();
                $("#ParentNo").val("");
                $("#ParentSelect").val("");
                $("#divCompareType").hide();
                $("#divCompareNo").hide();
                $("#CompareNo").val("");
                $("#CompareType").val("");
                $("#MaxNum").val("");
                $("#ChooseOption").hide();
                $("#ParamaterA").val("");
                $("#ParamaterB").val("");
                $("#ParamaterC").val("");
                $("#ParamaterD").val("");
                $("#ParamaterE").val("");
                $("#ParamaterF").val("");
                if ($("#selKeyboardType").val() == "100021") {

                    $("#divCompareType").show();
                    $("#divCompareNo").show();
                }
                $("#selKeyboardTypeDiv").show();
                $("#selKeyboardTypeDiv2").hide();
            } else if (typeCode == "800007") {
                $("#divKeyboardType").show();
                $("#divParentNo").show();
                $("#divParentSelect").show();
                $("#ParentNo").val("");
                $("#ParentSelect").val("");
                $("#divCompareType").hide();
                $("#divCompareNo").hide();
                $("#CompareNo").val("");
                $("#CompareType").val("");
                $("#MaxNum").val("");
                $("#ChooseOption").hide();
                $("#ParamaterA").val("");
                $("#ParamaterB").val("");
                $("#ParamaterC").val("");
                $("#ParamaterD").val("");
                $("#ParamaterE").val("");
                $("#ParamaterF").val("");
                $("#selKeyboardTypeDiv").hide();
                $("#selKeyboardTypeDiv2").show();
            } else
            {
                $("#ChooseOption").hide();
                $("#divMaxNum").hide();
                $("#divKeyboardType").hide();
                $("#selKeyboardType").val("");
                $("#MaxNum").val("");
                $("#ChooseOption").hide();
                $("#ParentNo").val("");
                $("#ParentSelect").val("");
                $("#divCompareType").hide();
                $("#divCompareNo").hide();
                $("#CompareNo").val("");
                $("#CompareType").val("");
                $("#ParamaterA").val("");
                $("#ParamaterB").val("");
                $("#ParamaterC").val("");
                $("#ParamaterD").val("");
                $("#ParamaterE").val("");
                $("#ParamaterF").val("");
                $("#selKeyboardTypeDiv").show();
                $("#selKeyboardTypeDiv2").hide();          
            }
        }
    });

    $("#selKeyboardType").on("change", function () {
        var KeyboardType = $("#selKeyboardType").val();
        if (KeyboardType == "100021") {
            $("#divCompareType").show();
            $("#divCompareNo").show();
        }
        else {
            $("#divCompareType").hide();
            $("#divCompareNo").hide();
            $("#CompareNo").val("");
            $("#CompareType").val("");
        }
    });
    $('#myModal').on('shown.bs.modal', function (e) {
        $(".select2").select2();
    })
    $('#dataTable').bootstrapTable({
        url: "/DataImport/Question/GetQuestionDetailList",
        pagination: "true",
        queryParams: queryParams,
        sidePagination: 'server',
        onPostBody: function () {
            RenderRoleButton();
        },
        columns: [
            
            {
                title: '操作',
                //field: 'SubAreaId',
                formatter: 'actionFormatter',
                events: 'questionOperate',
            }, {
                field: 'Type',
                title: '类型'
            },  {
                field: 'Content',
                title: '问题项内容',
            }, {
                field: 'IsNecessary',
                title: '是否必填项',
                formatter: function (value, row, index)
                {
                    if (row.IsNecessary == true) {
                        return "是"
                    } else {
                        return "否"
                    }
                }
            }, {
                field: 'SortId',
                title: '序号',
            }, {
                field: 'QuestionParamName',
                title: '题目归类',  
            }

            
        ],

    });
   
    var uploader;
    var intw = 0;
    $('#modalImport').on('shown.bs.modal', function (e) {
        uploader = WebUploader.create({
            auto: false,
            // swf文件路径
            swf: '/Plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            //server: '/DataImport/Question/ImportQuestion?Id=' + $("#Qid").val(),
            server: '/DataImport/Question/ImportQuestion',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
        });

        uploader.on('fileQueued', function (file) {
            $("#thelist").append('<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">请上传.....</p>' +
            '</div>');
        });
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('p.state').text('上传中...');
            $percent.css('width', percentage * 100 + '%');
            intw = layer.load(0, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
        })
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('p.state').text('上传中');
            $percent.css('width', percentage * 100 + '%');
        });
        uploader.on('uploadSuccess', function (file, response) {
            if (response.IsSuccess) {
                $.ShowMessage("success", "文件导入成功");
                $("#modalImport").modal("hide");
                $('#dataTable').bootstrapTable("refresh");
            }
            else {
                $('#thelist').empty();
                $.each(response.Data, function (index, value) {
                    $('#thelist').append("<div style='color:red'>" + value.ErrorMsg + "</div><br/>")

                })
                uploader.removeFile(file);
            }
        });
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
            layer.close(intw)
        });
    }).on('hidden.bs.modal', function (e) {
        uploader.destroy();
        $('#thelist').empty();
    });

    $("#ctlBtn").on("click", function () {
        uploader.upload();
    })
});
function actionFormatter(value, row, index) {
    var results = '<a class="like"onclick=questionDetail("' + row.Id + '") data-role="Admin" title="编辑">编辑</a>'
    //results += '<a class="like"onclick=deleteDetail("' + row.Id + '") data-role="Admin" title="删除"> 删除</a>'
    return results;
}

window.questionOperate = {
    'click .check': function (e, value, row, index) {
        //editArea(row.Id
        editArea(value);
        $("#btnUpdate").hide();
        $("#btnAdd").hide();
       
    }
   
}
function queryParams(params) {
    return {
        Content: $("#txtContent").val(),
        Type: $("#CategoryCode").val(),
        Qid: $("#Qid").val(),
        QuestionParam: $("#_questionParam").val(),
        PageSize: params.limit,   //页面大小
        PageIndex: params.pageNumber,//  sort: params.sort,  //排序列名
        sortOrder: params.order,
        SkipCount: params.offset,
        //排位命令（desc，asc）
    };
}
var questionForm = $("#questionForm");
questionForm.validate({
    rules: {
        SortId: {
            required: true
        },
        selType: {
            required: true
        },
        Content: {
            required: true
        },
    },
    messages: {
        SortId: {
            required: "请输入排序",
        },
        selType: {
            required: "请选择问题类型",
        },
        Content: {
            required: "请输入问题内容",
        },
    }
})

function deleteDetail(Id) {
    parent.layer.confirm('确定删除该条数据吗？', {
        btn: ['确定', '取消'], //按钮
        shade: false //不显示遮罩
    }, function () {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Question/DeleteQuestion?Id=' + Id,
            data: { Id: Id },
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
                layer.closeAll('dialog');
            }
        });
    }, function () {
    })
}

function questionDetail(Id) {
    
    $("#btnUpdate").show();
    $("#btnAdd").hide();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#questionForm").find("label.error").remove();
    $("#questionForm").find(".error").removeClass("error");
    
    //var roleName = '@(((SFA.Service.UserService.Output.UserDescriptOutput)ViewData["CurrentUser"]).RoleNameEns)';
    $.SubAjax({
        type: 'post',
        data: { Id: Id },
        url: '/DataImport/Question/GetQuestionDetail',
        success: function (data) {
            if (data.IsSuccess) {
                data = data.Data;
                $("#QuestionId").val(Id)
                $("#SortId").val(data.SortId);
                $("#Content").val(data.Content);
                $("#selType").val(data.Type); 
                console.log(data.QuestionParam);
                if (data.QuestionParam != null) {
                    var op = data.QuestionParam;
                   // $("#questionParam").find("option[text=op]").attr("selected", true);
                    $("#questionParam").val(data.QuestionParam);
                }
                if (data.IsNecessary) {
                    $("#IsNecessary1").prop("checked", true);
                    $("#IsNecessary2").prop("checked", false);
                } else {
                    $("#IsNecessary2").prop("checked", true);
                    $("#IsNecessary1").prop("checked", false);

                }
                if (data.SortId == 1) {
                    $("#divParentNo").show();
                    $("#divParentSelect").show();
                    $("#ParentNo").val("");
                    $("#ParentSelect").val("");
                }
                else {
                    $("#divParentNo").show();
                    $("#divParentSelect").show();
                    $("#ParentNo").val(data.ParentIdint);
                    LoadQuestionValue($("#ParentNo"), $("#ParentSelect"));
                    $("#ParentSelect").val(data.ParentValue);
                }
                if (data.Type == "800001" || data.Type == "800002") {
                    $("#ChooseOption").show();
                    $("#divMaxNum").hide();
                    $("#divKeyboardType").hide();
                    $("#MaxNum").val("");
                    $("#divCompareType").hide();
                    $("#divCompareNo").hide();
                    $("#CompareNo").val("");
                    $("#CompareType").val("");
                    $("#selKeyboardType").val("");
                    $("#ParamaterA").val(data.ParamaterA);
                    $("#ParamaterB").val(data.ParamaterB);
                    $("#ParamaterC").val(data.ParamaterC);
                    $("#ParamaterD").val(data.ParamaterD);
                    $("#ParamaterE").val(data.ParamaterE);
                    $("#ParamaterF").val(data.ParamaterF);
                } else if (data.Type == "800005")
                {
                    $("#divMaxNum").show();
                    $("#divKeyboardType").show();

                    $("#MaxNum").val(data.MaxNum);
                    $("#selKeyboardType").val(data.KeyboardType);
                    $("#ChooseOption").hide();
                    $("#ParamaterA").val("");
                    $("#ParamaterB").val("");
                    $("#ParamaterC").val("");
                    $("#ParamaterD").val("");
                    $("#ParamaterE").val("");
                    $("#ParamaterF").val("");
                    $("#divCompareType").hide();
                    $("#divCompareNo").hide();
                    $("#CompareNo").val("");
                    $("#CompareType").val("");
                    if (data.KeyboardType == "100021" && data.SortId != 1) {
                        $("#divCompareType").show();
                        $("#divCompareNo").show();
                        $("#CompareNo").val(data.CompareNoint);
                        $("#CompareType").val(data.CompareType);
                    }
                    $("#selKeyboardTypeDiv").show();
                    $("#selKeyboardTypeDiv2").hide();
                } else if (data.Type == "800007") {
                    $("#divMaxNum").hide();
                    $("#divKeyboardType").show();

                    $("#MaxNum").val(data.MaxNum);
                    $("#selKeyboardType2").val(data.KeyboardType);

                    $("#ChooseOption").hide();
                    $("#ParamaterA").val("");
                    $("#ParamaterB").val("");
                    $("#ParamaterC").val("");
                    $("#ParamaterD").val("");
                    $("#ParamaterE").val("");
                    $("#ParamaterF").val("");
                    $("#divCompareType").hide();
                    $("#divCompareNo").hide();
                    $("#CompareNo").val("");
                    $("#CompareType").val("");
                    $("#selKeyboardTypeDiv").hide();
                    $("#selKeyboardTypeDiv2").show();
                }
                else {
                    $("#divMaxNum").hide();
                    $("#divKeyboardType").hide();
                    $("#MaxNum").val("");
                    $("#divCompareType").hide();
                    $("#divCompareNo").hide();
                    $("#CompareNo").val("");
                    $("#CompareType").val("")
                    $("#selKeyboardType").val("");
                    $("#ChooseOption").hide();
                    $("#ParamaterA").val("");
                    $("#ParamaterB").val("");
                    $("#ParamaterC").val("");
                    $("#ParamaterD").val("");
                    $("#ParamaterE").val("");
                    $("#ParamaterF").val("");
                }
                $(".select2").select2();
            }
            else {
                $.ShowMessage("error", data.Msg)
            }

        }
    });
}

$("#btnUpdate").on("click", function () {
    var isValue = $("input[name='IsNecessarys']:checked").val();
    $("input[name='IsNecessary']").val(isValue)
    var Qid = $("#QuestionId").val();
    if ($("#ParentNo").val() != null && $("#ParentNo").val() != "") {
        if ($("#ParentSelect").val() == null || $("#ParentSelect").val() == "") {
            $.ShowMessage("warning", "请选择父级值！");
            return;
        }
    }
    if (questionForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Question/UpdateQuestion?Id=' + Qid,
            data: questionForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                     LoadQuestionNo($("#ParentNo"));
                    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
                    LoadQuestionCompareNo($("#CompareNo"));
                    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
});

$("#btnSearch").on("click", function () {
    $('#dataTable').bootstrapTable("refresh");
});

$("#btnAddShow").on("click", function () {
    $("#btnUpdate").hide();
    $("#btnAdd").show();
    $("#myModal").modal({ backdrop: 'static', keyboard: false });
    $("#questionForm").find(".form-control").val('');
    $("#questionForm").find(".select2").val('');
    $(".select2").select2();
    $("#IsNecessary2").prop("checked", false);
    $("#IsNecessary1").prop("checked", false);
    $("#ChooseOption").hide();
    $("#divMaxNum").hide();
    $("#divKeyboardType").hide();
});

$("#btnAdd").on("click", function () {
    $("#QlistId").val($("#Qid").val());
    QlistId = $("#Qid").val();
    var isValue = $("input[name='IsNecessarys']:checked").val();
    $("input[name='IsNecessary']").val(isValue)
    //$("#selType").html("请选择");
    if (questionForm.valid()) {
        $.SubAjax({
            type: 'post',
            url: '/DataImport/Question/AddQuestion?QlistId=' + QlistId,
            data: questionForm.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $.ShowMessage("success", data.Msg);
                     LoadQuestionNo($("#ParentNo"));
                    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
                    LoadQuestionCompareNo($("#CompareNo"));
                    changeQuestionNo($("#ParentNo"), $("#ParentSelect"));
                    $("#myModal").modal("hide");
                    $('#dataTable').bootstrapTable("refresh");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
});


function LoadQuestionNo(ParentNo) {
    $.ajax({
        type: "post",
        data: {
            questionType: "800001,800002",
            qListId: $("#Qid").val(),
            KeyboardType: "",
            questId: $("#QuestionId").val()
        },
        url: "/DataImport/Question/GetQuestionNo",
        //dataType: "json",
        //cache: false,
        success: function (data) {
            var jsonData = eval(data);
            var thisData = "[";
            $.each(jsonData.Data, function (index, item) {
                thisData += "{\"id\":\"" + item.QuestionId + "\",\"text\":\"" + item.QuestionNo + "\"},";
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            ParentNo.select2({
                placeholder: "请选择",
                allowClear: true,
                data: cData
            });
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
}





function changeQuestionNo(ParentNo, ParentSelect) {
    ParentNo.on("change", function () {
        var value = $(this).val();
        if (value == "") {
            ParentSelect.empty();
            ParentSelect.select2({
                placeholder: "请选择",
                data: []
            });
        }
        else {
            $.SubAjax({
                type: 'post',
                data: { Id: ParentNo.val() },
                url: '/DataImport/Question/GetQuestionAnswer',
                success: function (data) {
                    if (data.Data != "" && data.Data != null) {
                        var jsonData = eval(data.Data);
                        var thisData = "[{\"id\":\"\",\"text\":\"\"},";
                        $.each(jsonData, function (index, item) {
                            thisData += "{\"id\":\"" + item + "\",\"text\":\"" + item + "\"},";
                        });
                        thisData = thisData.substring(0, thisData.length - 1);
                        thisData += "]";
                        var cData = $.parseJSON(thisData);
                        ParentSelect.empty();
                        ParentSelect.select2({
                            placeholder: "请选择",
                            allowClear: true,
                            data: cData
                        });
                    }
                },
                error: function (data) {
                    //  alert("数据加载失败！");
                }
            });
        }
    })
}

function LoadQuestionValue(ParentNo, ParentSelect) {
    $.SubAjax({
        type: 'post',
        data: { Id: ParentNo.val() },
        url: '/DataImport/Question/GetQuestionAnswer',
        success: function (data) {
            if (data.Data != "" && data.Data != null) {
                var jsonData = eval(data.Data);
                var thisData = "[{\"id\":\"\",\"text\":\"\"},";
                $.each(jsonData, function (index, item) {
                    thisData += "{\"id\":\"" + item + "\",\"text\":\"" + item + "\"},";
                });
                thisData = thisData.substring(0, thisData.length - 1);
                thisData += "]";
                var cData = $.parseJSON(thisData);
                ParentSelect.empty();
                ParentSelect.select2({
                    placeholder: "请选择",
                    allowClear: true,
                    data: cData
                });
            }
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
}

function LoadQuestionCompareNo(ParentNo) {
    $.ajax({
        type: "post",
        data: {
            questionType: "800005",
            qListId: $("#Qid").val(),
            KeyboardType: "100021",
            questId: $("#QuestionId").val()
        },
        url: "/DataImport/Question/GetQuestionNo",
        //dataType: "json",
        //cache: false,
        success: function (data) {
            var jsonData = eval(data);
            var thisData = "[";
            $.each(jsonData.Data, function (index, item) {
                thisData += "{\"id\":\"" + item.QuestionId + "\",\"text\":\"" + item.QuestionNo + "\"},";
            });
            thisData = thisData.substring(0, thisData.length - 1);
            thisData += "]";
            var cData = $.parseJSON(thisData);
            ParentNo.select2({
                placeholder: "请选择",
                allowClear: true,
                data: cData
            });
        },
        error: function (data) {
            //  alert("数据加载失败！");
        }
    });
}

$("#btnExport").on("click", function () {
    $.SubAjax({
        type: 'post',
        data: {
            Content: $("#txtContent").val(),
            Type: $("#CategoryCode").val(),
            Qid: $("#Qid").val()
        },
        url: "/DataImport/Question/ExportQuestion",
        success: function (data) {
            if (data.IsSuccess) {
                window.location.href = "/File/DownFile?filePath=" + data.Data + "&fileName=问卷列表";
            }
            else {
                $.ShowMessage("error", data.Msg)
            }
        }
    });
})