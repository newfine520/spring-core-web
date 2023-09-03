'use strict';

if (!jQuery) throw new Error("jQuery未被正确加载，请检查！");

(function ($, global, window) {
    //modal里的select2 BUG
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    $.fn.serializeToJson = function () {
        var dom = $(this),
            childList = dom.find("[name]"),
            result = {};
        if (childList.length > 0) {
            for (var i = 0; i < childList.length; i++) {
                var child = $(childList[i]),
                    name = child.attr("name"),
                    value = child.val();
                if (child.is(":checkbox")) {
                    value = child.prop("checked");
                } else if (child.is("radio")) {
                    value = child.prop("checked");
                }

                if (result[name]) {
                    result[name] += "," + value;
                    if (result[name].indexOf(",") == 0) {
                        result[name] = result[name].substr(1);
                    }
                } else {
                    result[name] = value;
                }
            }
        }
        return result;
    };

    global.ShowMessage = function (type, msg) {
        //type:info信息，success:成功,warning:警告，error:错误
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-top-center",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        Command: toastr[type](msg)
    };
    global.SubAjax = function (obj) {
        var intw = 0;
        $.ajax({
            type: obj.type,
            data: obj.data,
            url: obj.url,
            async: false,
            dataType: 'JSON',
            contentType: obj.contentType,
            beforeSend: function () {
                intw = layer.load(0, {
                    shade: [0.2, '#000'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
                obj.success(data)
                if (!data.IsSuccess && data.IsNotLogin) {
                    $("#modal-login").modal({ backdrop: 'static', keyboard: false });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            statusCode: {
                302: function () {
                    layer.close(intw);
                    $(".modal ").modal("hide");
                    $("#modal-login").modal();
                },
                403: function () {
                    layer.close(intw);
                    $.ShowMessage("error", "您没有操作权限！");
                }
            },
            complete: function () {
                layer.close(intw)
            }
        })
    }
    //获取Html转义字符
    $.htmlEncode = function (html) {
        return document.createElement('a').appendChild(
               document.createTextNode(html)).parentNode.innerHTML;
    };
    //获取Html 
    $.htmlDecode = function (html) {
        var a = document.createElement('a'); a.innerHTML = html;
        return a.textContent;
    };
})(jQuery, jQuery, window);
/**
 * $.fn扩展  end
 */