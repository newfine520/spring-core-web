$(function () {
    var formLogin = $("#formLogin");
    formLogin.validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            username: {
                required: "请输入账号",
            },
            password: {
                required: "请输入密码"
            }
        }
    });
    $("#btnLogin").click(function () {
        if (formLogin.valid()) {
            $.SubAjax({
                type: 'post',
                url: '/Account/DoLogin',
                data: formLogin.serializeToJson(),
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#modal-login").modal("hide");
                    }
                    else {
                        $.ShowMessage("error", data.Msg)
                    }
                }
            });
        }
    })
   
    //$(document).keyup(function (event) {
    //    if (event.keyCode == 13) {
    //        $("#btnLogin").trigger("click");
    //    }
    //});
})
var formEditPassword = $("#formEditPassword");
formEditPassword.validate({
    rules: {
        OldPassword: {
            required: true
        },
        NewPassword: {
            required: true,
            minlength: 6,
        },
        ComfirmPassword: {
            required: true,
            minlength: 6,
            equalTo: "#NewPassword"
        },

    },
    messages: {
        OldPassword: {
            required: "请输入原始密码",
        },
        NewPassword: {
            required: "请输入新密码",
            minlength: "密码不能小于6个字符",
        },
        ComfirmPassword: {
            required: "请确认新密码",
            minlength: "密码不能小于6个字符",
            equalTo: "两次密码必须相同"
        }
    }
});
$("#btnEditPassword").click(function () {
    if (formEditPassword.valid()) {
        $.ajax({
            type: 'post',
            url: '/User/EditPassword',
            data: formEditPassword.serializeToJson(),
            success: function (data) {
                if (data.IsSuccess) {
                    $("#modal-edit-passwrd").modal("hide");
                }
                else {
                    $.ShowMessage("error", data.Msg)
                }
            }
        });
    }
})