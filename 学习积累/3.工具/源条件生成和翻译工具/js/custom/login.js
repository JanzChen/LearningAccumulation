/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
$(function() {
    /**
     * 加载初始化操作
     */
    load();
    /**
     * 读取cookie 判断是否为空 通过验证,显示cookie记录内容 并打钩
     */
    readCookie();
    /**
     * 提交登录 判断是否记住用户名 记住,则设置cookie 一般记住一个星期
     */
    setSubmitCookie();
});

/**
 * 读取cookie
 */
function readCookie() {
    var loginId = $.cookie("cookie_login_name");
    if (!isObjectNull(loginId)) {
        $("#loginId").val(loginId);
        $("#rememberme").attr("checked", 'true');
    }
}

/**
 * 提交时设置cookie
 */
function setSubmitCookie() {
    $("#wp-submit").click(function() {
        // 用户名不能为空
        if (isObjectNull($("#loginId").val())) {
            message.innerHTML = "<br>用户名不能为空";
            return false;
        }
        // 输入密码不能为空
        if (isObjectNull($("#password").val())) {
            message.innerHTML = "<br>密码不能为空";
            return false;
        }
        // 如果选中了保存用户名选项
        if ($("#rememberme").is(":checked")) {
            $.cookie("cookie_login_name", $("#loginId").val(), {
                expires : 30,// 设置保存期限,一个月
                path : "/"// 设置保存的路径
            });
        } else {
            $.cookie("cookie_login_name", null, {
                path : "/"
            });
        }

        var url = path + "/synframe/security/loginManage.do?method=login";
        $('#loginform').attr("action", url);
    });
}

// 判断数据是否为空
function isObjectNull(obj) {
    if (obj == undefined || obj == "undefined") {
        return true;
    }

    if (obj == "" || obj == '') {
        return true;
    }

    if (obj == null || obj == "null") {
        return true;
    }
}

/**
 * 加载初始化
 */
function load() {
    var currPageurl = document.URL;

    // 如果不是外部页面弹出系统的登录页面，则进行处理
    if (currPageurl.indexOf("extPageOpen=true") == -1) {

        if (top.location != self.location) { // 跳出iframe
            top.location = self.location;
        }

        if (window.opener) { // 若是弹出的打开窗口，则刷新父窗口并关闭该窗口
            window.opener.location.reload();
            window.close();
        }
    }

    try {
        $('#loginId').focus();
    } catch (e) {
    }
}

/**
 * 重置操作
 */
function reset() {
    $('#loginId').val("");
    $('#password').val("");
    $('#rememberme').attr("checked", false);
    $('#loginerror').hide();
}

/**
 * cookie插件
 */
jQuery.cookie = function(key, value, options) {

    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
                encodeURIComponent(key),
                '=',
                options.raw ? String(value) : encodeURIComponent(String(value)),
                options.expires ? '; expires=' + options.expires.toUTCString()
                        : '', options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : '' ].join(''));
    }
    options = value || {};
    var result, decode = options.raw ? function(s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key)
            + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
