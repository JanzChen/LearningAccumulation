/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * 对 Jquery EasyUI 的扩展方法
 * 以后所有对 Jquery EasyUI 的方法全部放此文件中 方便版本升级
 * User: ljj
 * Date: 15-7-22
 * Time: 下午3:07
 */

/**
 * 版本信息获取
 * 
 * @type {{version: *, safari: Boolean, opera: Boolean, msie: (Boolean|boolean),
 *       mozilla: (Boolean|boolean)}}
 */
$.browser = {
    version : (navigator.userAgent.toLowerCase().match(
            /.+(?:rv|it|ra|ie)[V:]([\d.]+)/) || [])[1],
    safari : /webkit/.test(navigator.userAgent.toLowerCase()),
    opera : /opera/.test(navigator.userAgent.toLowerCase()),
    msie : /msie/.test(navigator.userAgent.toLowerCase())
            && !/opera /.test(navigator.userAgent.toLowerCase()),
    mozilla : /mozilla/.test(navigator.userAgent.toLowerCase())
            && !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase())
};

$.fn.selectReadOnly = function() {
    var tem = $(this).children('option').index($("option[selected]"));
    $(this).change(function() {
        $(this).children('option').eq(tem).attr("selected", true);
    });
};

// /////////////
// 操作接口
function refresh() {
    window.location.reload(true);
}

function todo(page, fun) {
    $.messager.alert('提示', page + '的（' + fun + '）功能未实现！', 'info');
}

/*
 * 显示加载等待提示框，来自datagrid，因此放到这里，add by lzh 2012-03-11 @param target
 * 提示框加到什么对象上，一般是div或者窗口 @param msg 提示框显示的信息
 */
function showLoadingBox(target, msg) {
    $("<div id='loadingBoxMask' class=\'datagrid-mask\'></div>").css({
        display : "block",
        width : "100%",
        height : $(window).height()
    }).appendTo(target);
    $("<div id='loadingBoxMaskMsg' class=\'datagrid-mask-msg\'></div>").html(
            msg).appendTo(target).css({
        display : "block",
        left : (target.outerWidth(true) - 200) / 2,
        top : ($(window).height() - 80) / 2
    });
}

// 删除加载等待提示框，来自datagrid，因此放到这里，add by lzh 2012-03-11
function removeLoadingBox() {
    $('#loadingBoxMask').remove();
    $('#loadingBoxMaskMsg').remove();
}

// datagrid列页面搜索
function pageSearch() {
    $("tr[datagrid-row-index]").show();
    var inputs = $("input[onkeyup]");

    for (var i = 0;; i++) {
        var dri = "datagrid-row-index=" + i;
        var driTrs = $("tr[" + dri + "]");
        var length = driTrs.length;

        if (length > 0) {
            var driTr = $(driTrs.get(length - 1));

            $.each(inputs, function(i, n) {
                var inputVal = $(n).val();

                if (inputVal != "") {
                    var inputTdField = $(n).parent().attr("field");
                    var divText = driTr
                            .find("td[field='" + inputTdField + "']").find(
                                    "div").text();

                    if (divText.indexOf(inputVal) == -1) {
                        driTrs.hide();
                    }
                }
            });
        } else {
            break;
        }
    }
}

/**
 * jquery 编写的圆角代码
 */
/** *********************** start ***************************** */
(function($) {

    var style = document.createElement('div').style, moz = style['MozBorderRadius'] !== undefined, // <br>
    webkit = style['WebkitBorderRadius'] !== undefined, radius = style['borderRadius'] !== undefined
            || style['BorderRadius'] !== undefined, mode = document.documentMode || 0, noBottomFold = $.browser.msie
            && (($.browser.version < 8 && !mode) || mode < 8),

    expr = $.browser.msie && (function() {
        var div = document.createElement('div');
        try {
            div.style.setExpression('width', '0+0');
            div.style.removeExpression('width');
        } catch (e) {
            return false;
        }
        return true;
    })();

    $.support = $.support || {};
    $.support.borderRadius = moz || webkit || radius; // so you can do: if
    // (!$.support.borderRadius)
    // $('#myDiv').corner();

    function sz(el, p) {
        return parseInt($.css(el, p)) || 0;
    }

    function hex2(s) {
        s = parseInt(s).toString(16);
        return (s.length < 2) ? '0' + s : s;
    }

    function gpc(node) {
        while (node) {
            var v = $.css(node, 'backgroundColor'), rgb;
            if (v && v != 'transparent' && v != 'rgba(0, 0, 0, 0)') {
                if (v.indexOf('rgb') >= 0) {
                    rgb = v.match(/\d+/g);
                    return '#' + hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
                }
                return v;
            }
            if (node.nodeName.toLowerCase() == 'html') {
                break;
            }
            node = node.parentNode; // keep walking if transparent
        }
        return '#ffffff';
    }

    function getWidth(fx, i, width) {
        switch (fx) {
        case 'round':
            return Math.round(width * (1 - Math.cos(Math.asin(i / width))));
        case 'cool':
            return Math.round(width * (1 + Math.cos(Math.asin(i / width))));
        case 'sharp':
            return width - i;
        case 'bite':
            return Math.round(width
                    * (Math.cos(Math.asin((width - i - 1) / width))));
        case 'slide':
            return Math.round(width * (Math.atan2(i, width / i)));
        case 'jut':
            return Math.round(width * (Math.atan2(width, (width - i - 1))));
        case 'curl':
            return Math.round(width * (Math.atan(i)));
        case 'tear':
            return Math.round(width * (Math.cos(i)));
        case 'wicked':
            return Math.round(width * (Math.tan(i)));
        case 'long':
            return Math.round(width * (Math.sqrt(i)));
        case 'sculpt':
            return Math.round(width * (Math.log((width - i - 1), width)));
        case 'dogfold':
        case 'dog':
            return (i && 1) ? (i + 1) : width;
        case 'dog2':
            return (i && 2) ? (i + 1) : width;
        case 'dog3':
            return (i && 3) ? (i + 1) : width;
        case 'fray':
            return (i % 2) * width;
        case 'notch':
            return width;
        case 'bevelfold':
        case 'bevel':
            return i + 1;
        case 'steep':
            return i / 2 + 1;
        case 'invsteep':
            return (width - i) / 2 + 1;
        }
    }

    $.fn.corner = function(options) {

        // in 1.3+ we can fix mistakes with the ready state
        if (this.length == 0) {
            if (!$.isReady && this.selector) {
                var s = this.selector, c = this.context;
                $(function() {
                    $(s, c).corner(options);
                });
            }
            return this;
        }

        return this
                .each(function(index) {
                    var $this = $(this),
                    // meta values override options
                    o = [ $this.attr($.fn.corner.defaults.metaAttr) || '',
                            options || '' ].join(' ').toLowerCase(), keep = /keep/
                            .test(o), // keep
                    // borders?
                    cc = ((o.match(/cc:(#[0-9a-f]+)/) || [])[1]), // corner
                    // color
                    sc = ((o.match(/sc:(#[0-9a-f]+)/) || [])[1]), // strip
                    // color
                    width = parseInt((o.match(/(\d+)px/) || [])[1]) || 10, // corner
                    // width
                    re = /round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog|invsteep|steep/, // <br>
                    fx = ((o.match(re) || [ 'round' ])[0]), fold = /dogfold|bevelfold/
                            .test(o), edges = {
                        T : 0,
                        B : 1
                    }, opts = {
                        TL : /top|tl|left/.test(o),
                        TR : /top|tr|right/.test(o),
                        BL : /bottom|bl|left/.test(o),
                        BR : /bottom|br|right/.test(o)
                    },
                    // vars used in func later
                    strip, pad, cssHeight, j, bot, d, ds, bw, i, w, e, c, common, $horz;

                    if (!opts.TL && !opts.TR && !opts.BL && !opts.BR) {
                        opts = {
                            TL : 1,
                            TR : 1,
                            BL : 1,
                            BR : 1
                        };
                    }
                    // support native rounding
                    if ($.fn.corner.defaults.useNative && fx == 'round'
                            && (radius || moz || webkit) && !cc && !sc) {
                        if (opts.TL) {
                            $this.css(radius ? 'border-top-left-radius'
                                    : moz ? '-moz-border-radius-topleft'
                                            : '-webkit-border-top-left-radius',
                                    width + 'px');
                        }
                        if (opts.TR) {
                            $this
                                    .css(
                                            radius ? 'border-top-right-radius'
                                                    : moz ? '-moz-border-radius-topright'
                                                            : '-webkit-border-top-right-radius',
                                            width + 'px');
                        }
                        if (opts.BL) {
                            $this
                                    .css(
                                            radius ? 'border-bottom-left-radius'
                                                    : moz ? '-moz-border-radius-bottomleft'
                                                            : '-webkit-border-bottom-left-radius',
                                            width + 'px');
                        }
                        if (opts.BR) {
                            $this
                                    .css(
                                            radius ? 'border-bottom-right-radius'
                                                    : moz ? '-moz-border-radius-bottomright'
                                                            : '-webkit-border-bottom-right-radius',
                                            width + 'px');
                        }
                        return;

                    }

                    strip = document.createElement('div');
                    $(strip).css({
                        overflow : 'hidden',
                        height : '1px',
                        minHeight : '1px',
                        fontSize : '1px',
                        backgroundColor : sc || 'transparent',
                        borderStyle : 'solid'
                    });

                    pad = {
                        T : parseInt($.css(this, 'paddingTop')) || 0,
                        R : parseInt($.css(this, 'paddingRight')) || 0,
                        B : parseInt($.css(this, 'paddingBottom')) || 0,
                        L : parseInt($.css(this, 'paddingLeft')) || 0
                    };

                    if (typeof this.style.zoom != undefined) {
                        this.style.zoom = 1; // force 'hasLayout' in IE
                    }
                    if (!keep) {
                        this.style.border = 'none';
                        strip.style.borderColor = cc || gpc(this.parentNode);
                        cssHeight = $(this).outerHeight();
                    }
                    for (j in edges) {
                        bot = edges[j];
                        // only add stips if needed
                        if ((bot && (opts.BL || opts.BR))
                                || (!bot && (opts.TL || opts.TR))) {
                            strip.style.borderStyle = 'none '
                                    + (opts[j + 'R'] ? 'solid' : 'none')
                                    + ' none '
                                    + (opts[j + 'L'] ? 'solid' : 'none');
                            d = document.createElement('div');
                            $(d).addClass('jquery-corner');
                            ds = d.style;

                            // 以下注释为jshint特有
                            // 用来去除Expected an assignment or function call and
                            // instead saw an
                            // expression警告
                            /* jshint -W030 */
                            bot ? this.appendChild(d) : this.insertBefore(d,
                                    this.firstChild);

                            if (bot && cssHeight != 'auto') {
                                if ($.css(this, 'position') == 'static') {
                                    this.style.position = 'relative';
                                }
                                ds.position = 'absolute';
                                ds.bottom = ds.left = ds.padding = ds.margin = '0';
                                if (expr) {
                                    ds.setExpression('width',
                                            'this.parentNode.offsetWidth');
                                } else {
                                    ds.width = '100%';
                                }
                            } else if (!bot && $.browser.msie) {
                                if ($.css(this, 'position') == 'static') {
                                    this.style.position = 'relative';
                                }
                                ds.position = 'absolute';
                                ds.top = ds.left = ds.right = ds.padding = ds.margin = '0';

                                // fix ie6 problem when blocked element has a
                                // border
                                // width
                                if (expr) {
                                    bw = sz(this, 'borderLeftWidth')
                                            + sz(this, 'borderRightWidth');
                                    ds.setExpression('width',
                                            'this.parentNode.offsetWidth - '
                                                    + bw + '+ "px"');
                                } else {
                                    ds.width = '100%';
                                }
                            } else {
                                ds.position = 'relative';
                                ds.margin = !bot ? '-' + pad.T + 'px -' + pad.R
                                        + 'px ' + (pad.T - width) + 'px -'
                                        + pad.L + 'px' : (pad.B - width)
                                        + 'px -' + pad.R + 'px -' + pad.B
                                        + 'px -' + pad.L + 'px';
                            }

                            e = document.createElement("div");
                            bot ? d.appendChild(e) : d.insertBefore(e,
                                    d.firstChild);
                            $(e).addClass("fix-left-boder").height(
                                    $this.height() - 2).css("top", width);

                            e = document.createElement("div");

                            bot ? d.appendChild(e) : d.insertBefore(e,
                                    d.firstChild);
                            $(e).addClass("fix-right-boder").height(
                                    $this.height() - 2).css("top", width);

                            for (i = 0; i < width; i++) {
                                w = Math.max(0, getWidth(fx, i, width));
                                e = strip.cloneNode(false);
                                e.style.borderWidth = '0 '
                                        + (opts[j + 'R'] ? w : 0) + 'px 0 '
                                        + (opts[j + 'L'] ? w : 0) + 'px';
                                // e.style.borderColor = "red" ;
                                bot ? d.appendChild(e) : d.insertBefore(e,
                                        d.firstChild);
                                $(e).append(
                                        "<div class='corner-porxy  corner-proxy-line"
                                                + (i == width - 1 ? "last" : i)
                                                + "'></div>").addClass(
                                        "corner-proxy-c");
                            }

                            if (fold && $.support.boxModel) {
                                if (bot && noBottomFold) {
                                    continue;
                                }
                                for (c in opts) {
                                    if (!opts[c]) {
                                        continue;
                                    }
                                    if (bot && (c == 'TL' || c == 'TR')) {
                                        continue;
                                    }
                                    if (!bot && (c == 'BL' || c == 'BR')) {
                                        continue;
                                    }

                                    common = {
                                        position : 'absolute',
                                        border : 'none',
                                        margin : 0,
                                        padding : 0,
                                        overflow : 'hidden',
                                        backgroundColor : strip.style.borderColor
                                    };
                                    $horz = $('<div/>').css(common).css({
                                        width : width + 'px',
                                        height : '1px'
                                    });
                                    switch (c) {
                                    case 'TL':
                                        $horz.css({
                                            bottom : 0,
                                            left : 0
                                        });
                                        break;
                                    case 'TR':
                                        $horz.css({
                                            bottom : 0,
                                            right : 0
                                        });
                                        break;
                                    case 'BL':
                                        $horz.css({
                                            top : 0,
                                            left : 0
                                        });
                                        break;
                                    case 'BR':
                                        $horz.css({
                                            top : 0,
                                            right : 0
                                        });
                                        break;
                                    }
                                    d.appendChild($horz[0]);

                                    var $vert = $('<div/>').css(common).css({
                                        top : 0,
                                        bottom : 0,
                                        width : '1px',
                                        height : width + 'px'
                                    });
                                    switch (c) {
                                    case 'TL':
                                        $vert.css({
                                            left : width
                                        });
                                        break;
                                    case 'TR':
                                        $vert.css({
                                            right : width
                                        });
                                        break;
                                    case 'BL':
                                        $vert.css({
                                            left : width
                                        });
                                        break;
                                    case 'BR':
                                        $vert.css({
                                            right : width
                                        });
                                        break;
                                    }
                                    d.appendChild($vert[0]);
                                }
                            }
                        }
                    }
                });
    };

    $.fn.uncorner = function() {
        if (radius || moz || webkit) {
            this.css(radius ? 'border-radius' : moz ? '-moz-border-radius'
                    : '-webkit-border-radius', 0);
        }
        $('div.jquery-corner', this).remove();
        return this;
    };

    // expose options
    $.fn.corner.defaults = {
        useNative : false, // true if plugin should attempt to use native
        // browser support for border radius rounding
        metaAttr : 'data-corner' // name of meta attribute to use for options
    };

})(jQuery);
/** *********************** end ***************************** */

// button
/*
 * <a id="undefined" class="easyui-linkbutton l-btn" href="#"
 * iconCls="icon-save"> <span class="l-btn-left"> <span style="padding-left:
 * 20px;" class="l-btn-text icon-save"> 保存 </span> </span> </a>
 * 
 * <a href="javascript:void(0);" class="g_a vm"> <span class="g_b"> <span
 * class="g_c"> <span class="g_d"> </span> <span class="g_e">就是你了</span>
 * </span> </span> </a>
 */
jQuery(function() {
    $(".easyui-linkbutton").each(
            function() {
                var text = $(this).text();
                var icon = $(this).attr("iconCls");

                icon = icon ? ("btn-icon " + icon) : "";

                $(this).addClass("g_a vm");
                $(this).empty();
                $(this).append(
                        '<span class="g_b"> ' + '	<span class="g_c">  '
                                + '<div class="g_p_fix"></div>'
                                + '		<span class="g_d"> &nbsp;</span>   '
                                + '	    <span class="g_e"><span class="' + icon
                                + '">' + text + '</span></span>   '

                                + '</span>   ' + '</span>  ');

                $(this).click(function() {
                    $(".ga_active").removeClass("ga_active");
                    $(this).addClass("ga_active");
                }).mouseover(function() {
                    $(this).addClass("ga_hover");
                }).mouseout(function() {
                    $(this).removeClass("ga_hover");
                });
            });
});

$.fn.linkbutton1 = function() {
    var text = $(this).text();
    var icon = $(this).attr("iconCls");

    icon = icon ? ("btn-icon " + icon) : "";

    $(this).addClass("g_a vm");
    $(this).empty();
    $(this).append(
            '<span class="g_b"> ' + '	<span class="g_c">  '
                    + '		<span class="g_d"> &nbsp; </span>   '
                    + '	    <span class="g_e"><span class="' + icon + '">'
                    + text + '</span></span>   ' + '</span>   ' + '</span>  ');

    $(this).click(function() {
        $(".ga_active").removeClass("ga_active");
        $(this).addClass("ga_active");
    }).mouseover(function() {
        $(this).addClass("ga_hover");
    }).mouseout(function() {
        $(this).removeClass("ga_hover");
    });
};

(function($) {

    $.fn.hint = function(blurClass) {
        if (!blurClass) {
            blurClass = 'blur';
        }

        return this
                .each(function() {
                    // get jQuery version of 'this'
                    var $input = $(this),

                    // capture the rest of the variable to allow for reuse
                    title = $input.attr('title'), $form = $(this.form), $win = $(window);

                    function remove() {
                        if ($input.val() === title
                                && $input.hasClass(blurClass)) {
                            $input.val('').removeClass(blurClass);
                        }
                    }

                    // only apply logic if the element has the attribute
                    if (title) {
                        // on blur, set value to title attr if text is blank
                        $input.blur(function() {
                            if (this.value === '') {
                                $input.val(title).addClass(blurClass);
                            }
                        }).focus(remove).blur(); // now change all inputs to
                        // title

                        // clear the pre-defined text when form is submitted
                        $form.submit(remove);
                        $win.unload(remove); // handles Firefox's
                        // autocomplete
                    }
                });
    };

})(jQuery);
