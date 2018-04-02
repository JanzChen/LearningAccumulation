/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * 调整datagrid大小 <br>
 * 已知使用场景：<br>
 * 1、存在查询条件时，设置的查询条件的行数会改变 <br>
 * 2、它左右两边的布局hide或窗体大小改变，导致datagrid发生onResize事件时
 * 
 * @author lzh
 */
function resizeMainGrid() {
    var center = $('.eventLayout').layout('panel', 'center');
    var south = $('.eventLayout').layout('panel', 'south');

    var _h = (center.height() || 0) - (south.height() || 0)
            - ($('#searchFieldSet').outerHeight(true) || 0);
    var _w = center.width();
    // 我们约定用于做datagrid的table的id值是datagridTb
    var datagridTb = $('#datagridTb');

    if (datagridTb.length == 0) {
        $.messager
                .alert('错误', '我们约定用于做datagrid的table的id值是datagridTb！', 'error');
        return;
    }
    datagridTb.datagrid('resize', {
        width : _w,
        height : _h
    });

    // 如果存在相对于datagridTb的子datagrid，调整其大小。如果存在这种用法，代码需要调整才能支持的更好
    if (south.length > 0) {
        var subDatagridTb = $('#subDatagridTb');

        if (subDatagridTb.length == 0) {
            $.messager.alert('错误',
                    '我们约定相对于datagridTb的子datagrid的table的id值是subDatagridTb！',
                    'error');
            return;
        }
        subDatagridTb.datagrid('resize', {
            height : south.height() - 50
        });
    }
}

/**
 * 动态加载js，css文件 <br>
 * 调用方式：includeJsOrCssFile(path + "/lib/custom/images/", ['page.css']); <br>
 * 或 includeJsOrCssFile('', [path + '/lib/custom/images/page.css']);
 * 
 * @param path
 *            js或css文件路径，如果需要引入的文件路径不一样，传递此参数为空，file参数可以是路径加文件名
 * @param file
 *            js或css文件名
 * @returns
 */
function includeJsOrCssFile(path, file) {
    var files = typeof file == "string" ? [ file ] : file;

    for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, "");
        var att = name.split('.');
        var ext = att[att.length - 1].toLowerCase();
        var isCSS = ext == "css";
        var tag = isCSS ? "link" : "script";
        var attr = isCSS ? " type='text/css' rel='stylesheet' "
                : " language='javascript' type='text/javascript' ";
        var link = (isCSS ? "href" : "src") + "='" + path + name + "'";

        if ($(tag + "[" + link + "]").length == 0) {
            $('head').append("<" + tag + attr + link + "></" + tag + ">");
        }
    }
}

/**
 * 为布局中的面板添加收起事件，添加收起后的显示的信息
 * 
 * @param region
 *            面板的区域，比如region="west"
 * @param text
 *            面板收起后显示的信息
 * @returns
 */
function panelOnCollapse(region, text) {
    $(function() {
        if (text == undefined) {
            text = $('body').layout('panel', region).panel('options').title;
        }
        $('body').layout('panel', region)
                .panel(
                        {
                            onCollapse : function() {
                                if ($('.layout-expand').find(
                                        '.layout-button-right')[0]) {
                                    $(
                                            $('.layout-expand').find(
                                                    '.layout-button-right')[0])
                                            .parent().parent().parent().find(
                                                    '.panel-body').html(
                                                    '<div style="font-weight: bold;font-size: 15px;margin: auto;padding: 4px;">'
                                                            + text + '</div>');
                                }
                                if ($('.layout-expand').find(
                                        '.layout-button-left')[0]) {
                                    $(
                                            $('.layout-expand').find(
                                                    '.layout-button-left')[0])
                                            .parent().parent().parent().find(
                                                    '.panel-body').html(
                                                    '<div style="font-weight: bold;font-size: 15px;margin: auto;padding: 4px;">'
                                                            + text + '</div>');
                                }
                            }
                        });
    });
}

/**
 * 时间对象的格式化
 */
function formatDate(date, format) {
    /*
     * format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" : date.getMonth() + 1,
        "d+" : date.getDate(),
        "h+" : date.getHours(),
        "m+" : date.getMinutes(),
        "s+" : date.getSeconds(),
        "q+" : Math.floor((date.getMonth() + 3) / 3),
        "S" : date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }

    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/**
 * Map对象
 * 
 * @returns
 */

function Map_() {

    var struct = function(key, value) {
        this.key = key;
        this.value = value;
    };

    var put = function(key, value) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                this.arr[i].value = value;
                return;
            }
        }
        this.arr[this.arr.length] = new struct(key, value);
    };

    var get = function(key) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                return this.arr[i].value;
            }
        }
        return null;
    };

    var remove = function(key) {
        var v;

        for (var i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();

            if (v.key === key) {
                continue;
            }
            this.arr.unshift(v);
        }
    };

    var keySet = function() {
        var keyset = [];

        for (var i = 0; i < this.arr.length; i++) {
            keyset[i] = this.arr[i].key;
        }
        return keyset;
    };

    var valueSet = function() {
        var valueSet = [];

        for (var i = 0; i < this.arr.length; i++) {
            valueSet[i] = this.arr[i].value;
        }
        return valueSet;
    };

    var size = function() {
        return this.arr.length;
    };

    var isEmpty = function() {
        return this.arr.length <= 0;
    };

    var toString = function() {
        var str = "";

        for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
            str = str + keys[i] + ";\n";
        }
        return str;
    };

    this.arr = [];
    this.get = get;
    this.put = put;
    this.remove = remove;
    this.size = size;
    this.keySet = keySet;
    this.valueSet = valueSet;
    this.isEmpty = isEmpty;
    this.toString = toString;
}

/**
 * 文件大小转换，输入byte，转KB或MB
 */
function formatSize(sizeOfByte) {

    if (sizeOfByte < 1024) {

        return sizeOfByte + "B";

    } else if (sizeOfByte >= 1024 && sizeOfByte < 1024 * 1024) {

        return (sizeOfByte / 1024).toFixed(2) + "KB";

    } else if (sizeOfByte >= 1024 * 1024 && sizeOfByte < 1024 * 1024 * 1024) {

        return (sizeOfByte / (1024 * 1024)).toFixed(2) + "MB";

    } else if (sizeOfByte >= 1024 * 1024 * 1024
            && sizeOfByte < 1024 * 1024 * 1024 * 1024) {

        return (sizeOfByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
}

/**
 * 销毁iframe
 */
function destoryIframe(iframeDom) {
    if (iframeDom) {
        iframeDom.src = "";

        setTimeout(function() {
            cycleClear(iframeDom);
        }, 100);
    }
}

function cycleClear(iframeDom) {
    try {
        iframeDom.contentWindow.document.write('');
        iframeDom.contentWindow.document.clear();

        // 针对IE调用内置垃圾回收方法
        if ($.browser.msie) {
            CollectGarbage();
        }
    } catch (e) {
        setTimeout(function() {
            cycleClear(iframeDom);
        }, 100);
    }
}

/**
 * 移除数组中指定对象
 */
Array.prototype.remove = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};