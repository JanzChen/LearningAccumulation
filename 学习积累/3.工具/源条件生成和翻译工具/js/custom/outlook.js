/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * 初始化首页菜单及tab页
 * 
 * @author 省公司规范
 * @update lzh
 */
// 用户保存当前tab的iframe的src
var _currentTabFrameSrc = null;
// 用于保存当前菜单对象
var currentMenu = null;
var tabCache = {};
var menuCache = {};
// 用于标识东边的布局块是否收起
var isCollapse = false;
// 标签页当超过10个时给出提示让用户先关掉一些标签才能打开新的标签
var tabCount = 0;
$(function() {
    appendTabEven();
    tabContextMenuEven();

    $('#tabs').tabs({
        onClose : function(title) {
            tabCount = tabCount - 1;
        },
        onAdd : function(title) {
            tabCount = tabCount + 1;
        },
        onSelect : function(title) {
            var currTab = $('#tabs').tabs('getTab', title);
            var iframe = $(currTab.panel('options').content);
            _currentTabFrameSrc = iframe.attr('src');

            var item = tabCache[title];
            item = item || {
                label : "首页"
            };
            renderOpButton(item.action || []);

            // 显示最大化内容区按钮
            $('.tab-max-img').show();
        }
    });
    renderMenu();
});

/**
 * 呈现菜单的操作按钮
 * 
 * @param btns
 */
function renderOpButton(btns) {
    var tabTitle = $(".tabs-selected").text();

    // 往操作按钮前添加一个刷新按钮
    if (tabTitle != '首页' && (btns.length == 0 || btns[0].event != 'refresh')) {
        btns.unshift({
            label : "刷新",
            img : "/lib/custom/images/arrow-refresh.png",
            event : "refresh"
        });
    }
    $(".b").removeClass("actived").addClass("disabled");
    $(".custom-op").empty();

    $(btns)
            .each(
                    function() {
                        if (this.label) {
                            var html = [];
                            img = path + this.img;
                            html
                                    .push('<span style="text-align:center;float:left;" class="b b-'
                                            + this.event
                                            + ' actived" event="'
                                            + this.event
                                            + '" url="'
                                            + this.url
                                            + '">');
                            html.push('  <img src="' + img
                                    + '" style="width:16px;height:16px;');
                            // 如果是IE7、8浏览器并且是gif格式的图片，利用滤镜
                            if ($.browser.msie && img.indexOf(".gif") < 0
                                    && $.browser.version != '6.0') {
                                html
                                        .push('filter:progid:DXImageTransform.Microsoft.AlphaImageLoader();');
                            }
                            html.push('"><br>');
                            html.push(this.label);
                            html.push(' </span>');
                            $(".custom-op").append(html.join(""));
                        } else {
                            $('.' + this).removeClass("disabled").addClass(
                                    "actived");
                        }
                    });
    $(".b").hover(function() {
        var offset = $(this).children("img").offset();
        $(this).children("img").offset({
            top : offset.top + 1,
            left : offset.left + 1
        });
    }, function() {
        var position = $(this).children("img").offset();
        $(this).children("img").offset({
            top : position.top - 1,
            left : position.left - 1
        });
    });

}

/**
 * 呈现菜单
 */
function renderMenu() {
    $(function() {
        $('#tree').treeview({
            data : getTreeData(),
            defaultImg : "", // path + '/lib/menuTree/images/s.gif'
            onnodeclick : function(item, el) {
                var url = item.url;
                var icon = '';

                // 如果菜单不带有url，不能以null值表示，此菜单数据不要带有url属性
                if (!url) {
                    return;
                }

                // 可配置打开此菜单时是否要收起指定的布局，如果主信息区需求较宽的页面，这将有用
                if (!isCollapse) {
                    if (item.collapse) {
                        $('.easyui-layout').layout('collapse', item.collapse);
                        isCollapse = true;
                    }
                }
                var title = item.text;
                tabCache[title] = item;
                currentMenu = item;
                addTab(item, url, '');
            }
        });
    });
}

/**
 * 获取菜单
 * 
 * @returns {Array}
 */
function getTreeData() {
    var menus = [];
    var index = 1;
    for ( var o in titleMenuMap) {
        var childs = window[titleMenuMap[o]];
        childs = formatMenu(childs, 'id' + index);
        var title = o;
        var imgPath = null;

        if (o.indexOf("##") > 0) { // 菜单名称和菜单图标使用##并在一起
            title = o.split("##")[0];
            imgPath = path + o.split("##")[1];
        }

        var menu = {
            id : 'id' + index,
            text : title,
            img : imgPath,
            complete : true,
            ChildNodes : childs
        };

        if (childs && childs.length > 0) {
            menu.hasChildren = true;
        }
        menus.push(menu);
        menuCache[o] = menu;
        index++;
    }
    return menus;
}

/**
 * 格式化菜单
 * 
 * @param menus
 * @param pid
 *            父id
 */
function formatMenu(menus, pid) {
    if (!menus) {
        return null;
    }
    var index = 0;

    for (var i = 0; i < menus.length; i++) {
        var menu = menus[i];

        if (!menu) {
            continue;
        }

        menu.id = pid + "ll" + i;
        menu.pid = pid;
        menu.complete = true;
        menu.text = menu.title;
        menu.ChildNodes = formatMenu(menu.childs, menu.id);

        if (menu.title.indexOf("##") > 0) { // 菜单名称和菜单图标使用##并在一起
            menu.img = path + menu.title.split("##")[1];
            menu.text = menu.title.split("##")[0];
        }

        if (menu.ChildNodes && menu.ChildNodes.length > 0) {
            menu.hasChildren = true;
        }
        menuCache[menu.title] = menu;
    }
    return menus;
}

/**
 * 新增tab页
 * 
 * @param subtitle
 *            tab页名称
 * @param url
 *            tab页url
 * @param icon
 *            tab页图标
 */
function addTab(item, url, icon) {
    if (!$('#tabs').tabs('exists', item.text)) {
        // south布局呈现消息，如果要特制菜单消息，那么菜单需要添加这个属性，并赋值
        $(".footer-text").html(item.message || "数据加载中，请稍后......");
        setTimeout(function() {
            $(".footer-text").html(item.message || "加载完成");
        }, 500);

        if (tabCount < 10) {
            $('#tabs').tabs('add', {
                title : item.text,
                content : createFrame(url),
                closable : true,
                icon : icon
            });
        } else {
            $.messager.alert('提示', '最多只能打开10个标签页，请关掉不要的页面', 'info');
            return;
        }

        // 如果是ie浏览器
        if ($.browser.version == '6.0') {
            // 刷新iframe,解决ie6下iframe内容不显示的问题
            document.frames(url).location.reload();
        }
    } else {
        $('#tabs').tabs('select', item.text);
    }
    appendTabEven();
}

/**
 * 创建iframe
 * 
 * @param url
 * @returns {String}
 */
function createFrame(url) {
    var s = '<iframe scrolling="auto" name="' + url + '" src="' + url
            + '" frameborder="0" style="width:100%;height:100%;"></iframe>';
    return s;
}

/**
 * 为tab添附事件（双击及右键菜单选项事件）
 */
function appendTabEven() {
    // 双击关闭TAB选项卡
    $(".tabs-inner").dblclick(function() {
        var subtitle = $(this).children(".tabs-closable").text();
        // 销毁iframe
        destoryTabIframe(subtitle);
        $('#tabs').tabs('close', subtitle);
    });

    // 为选项卡绑定右键
    $(".tabs-inner").bind('contextmenu', function(e) {
        var subtitle = $(this).children(".tabs-closable").text();

        // 如果是首页tab页，不显示右键菜单
        if (subtitle == "") {
            return;
        }
        $('#mm').menu('show', {
            left : e.pageX,
            top : e.pageY
        });
        $('#mm').data("currtab", subtitle);
        // $('#tabs').tabs('select', subtitle);
        return false;
    });
}

/**
 * 绑定tab右键菜单选项事件
 */
function tabContextMenuEven() {
    // 关闭当前
    $('#mm-tabclose').click(function() {
        var currtabTitle = $('#mm').data("currtab");

        // 销毁iframe
        destoryTabIframe(currtabTitle);

        $('#tabs').tabs('close', currtabTitle);
    });

    // 刷新当前
    $('#mm-tabupdate').click(function() {
        var currtabTitle = $('#mm').data("currtab");
        var currTab = $('#tabs').tabs('getTab', currtabTitle);
        var iframe = $(currTab.panel('options').content);
        var src = iframe.attr('src');
        $('#tabs').tabs('update', {
            tab : currTab,
            options : {
                content : createFrame(src)
            }
        });
    });

    // 全部关闭
    $('#mm-tabcloseall').click(function() {
        $('.tabs-inner span').each(function(i, n) {
            var t = $(n).text();

            if (t != '首页') {
                if (t) {
                    // 销毁iframe
                    destoryTabIframe(t);
                }
                $('#tabs').tabs('close', t);
            }
        });
    });

    // 关闭除当前之外的tab
    $('#mm-tabcloseother').click(function() {
        var currtabTitle = $('#mm').data("currtab");
        $('.tabs-inner span').each(function(i, n) {
            var t = $(n).text();

            if (t != currtabTitle && t != '首页') {
                if (t) {
                    // 销毁iframe
                    destoryTabIframe(t);
                }
                $('#tabs').tabs('close', t);
            }
        });
        $('#tabs').tabs('select', currtabTitle);
    });

    // 关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function() {
        var currtabTitle = $('#mm').data("currtab");
        var pp = $('#tabs').tabs('getTab', currtabTitle);
        var tab = pp.panel('options').tab;
        var nextall = tab.nextAll();

        if (nextall.length == 0) {
            return false;
        }
        nextall.each(function(i, n) {
            var t = $('a:eq(0) span', $(n)).text();

            if (t != '首页') {
                if (t) {
                    // 销毁iframe
                    destoryTabIframe(t);
                }
                $('#tabs').tabs('close', t);
            }
        });
        return false;
    });

    // 关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function() {
        var currtabTitle = $('#mm').data("currtab");
        var pp = $('#tabs').tabs('getTab', currtabTitle);
        var tab = pp.panel('options').tab;
        var prevall = tab.prevAll();

        if (prevall.length == 0) {
            return false;
        }
        prevall.each(function(i, n) {
            var t = $('a:eq(0) span', $(n)).text();

            if (t != '首页') {
                if (t) {
                    // 销毁iframe
                    destoryTabIframe(t);
                }
                $('#tabs').tabs('close', t);
            }
        });
        $('#tabs').tabs('select', currtabTitle);
        return false;
    });

    // 退出
    $("#mm-exit").click(function() {
        $('#mm').menu('hide');
    });
}

$(function() {
    $("body")
            .on(
                    'click',
                    'span .b',
                    function() {
                        if ($(this).hasClass("disabled")) {
                            return;
                        }
                        var event = $(this).attr("event");
                        var tabTitle = $(".tabs-selected").text();

                        // 如果菜单页面的按钮绑定的事件执行的方法没有实现，则弹出提示框，todo方法是jquery.easyui.min.js中的方法
                        if (_currentTabFrameSrc) {
                            var win = $("iframe[src='" + _currentTabFrameSrc
                                    + "']")[0].contentWindow;

                            if (win[event]) {
                                win[event]($(this).attr("url"), tabTitle, $(
                                        this).text());
                            } else {
                                if (win['todo']) {
                                    win['todo'](tabTitle, $(this).text());
                                }
                                // $(this).show().bt(tabTitle,{positions:["bottom","right"]}).btOn();
                            }
                        }
                    });
    // 最大化内容区
    $('.tab-max-img').click(
            function() {
                var imgPath = path + '/lib/custom/images/min.gif';

                if ($('.tab-max-img').find("img").attr('src') == imgPath) {
                    $('.head_bg').show();
                    $('.footerbg').show();
                    $('.easyui-layout').layout('expand', 'west');
                    $('.tab-max-img').find("img").attr('src',
                            path + '/lib/custom/images/max.gif');
                    $('.tab-max-img').attr('title', '最大化内容区');
                } else {
                    $('.head_bg').hide();
                    $('.footerbg').hide();
                    $('body').layout().resize();
                    $('.easyui-layout').layout('collapse', 'west');
                    $('.tab-max-img').find("img").attr('src',
                            path + '/lib/custom/images/min.gif');
                    $('.tab-max-img').attr('title', '还原内容区大小');
                }
            });
    // 绑定west布局收起事件，即当收起时往panel中写入导航菜单和选中的菜单名称
    $('body').layout('panel', 'west').panel(
            {
                headerCls : 'panel-header',
                onCollapse : function() {
                    if ($('.layout-expand').find('.layout-button-right')[0]) {
                        var menu = currentMenu || {
                            'text' : '首页'
                        };
                        var text = menu.text;
                        $($('.layout-expand').find('.layout-button-right')[0])
                                .parent().parent().parent().find('.panel-body')
                                .html(
                                        '<div class="collapse-text">导<br/>航<br/>菜<br/>单<br/><br/>'
                                                + text + '</div>');
                    }
                    $("#mainPanle").resize();
                }
            });
    // 此页面有两个panel，变圆角
    setTimeout(function() {
        $(".easyui-panel").parent().corner("8px cc:#EBEBEB");
    }, 10000);

    var buttonHeight = $('.RoundedCorner').outerHeight(true);
    var center = $('body').layout('panel', 'center');

    // 设定tab页高度，需要减去操作按钮栏的高度
    $('#tabs').tabs({
        height : center.height() - buttonHeight,
        width : center.width()
    });

    // 如果center面板大小改变，调整tab页的高度和宽度
    center.panel({
        onResize : function(w, h) {
            $('#tabs').tabs('resize', {
                height : h - buttonHeight,
                width : w
            });
        }
    });
});

$(function() {
    // 个人中心菜单
    $('#centers_btn').bind('click', function() {
        var imgPosition = $('#centers_btn').position();
        $('#centers_menu').menu('show', {
            left : imgPosition.left + 2,
            top : imgPosition.top + 30
        });
    });
    // 注销
    $('#logout_btn')
            .bind(
                    'click',
                    function() {

                        $.messager
                                .confirm(
                                        '提示',
                                        "您确认注销系统，退出登录吗？",
                                        function(r) {
                                            if (r) {
                                                window.location.href = path
                                                        + '/synframe/security/loginManage.do?method=logout';
                                            }
                                        });
                    });

});

// 修改个人资料
function updateUserInfo(userId) {

    if (userId) {
        var src = path
                + "/synframe/organization/user/userManage.do?method=toUpdateUser&userId="
                + userId;
        $("#winFrame").attr("src", src);
        $("#dd").show();
        $('#dd').dialog({
            iconCls : "icon-edit",
            title : "&nbsp;修改个人信息",
            height : 280,
            width : 480,
            modal : true,// 屏蔽页面
            autoOpen : false,
            onClose : function() {
                destoryIframe($("#winFrame").get(0));
            }
        });
        if ($.browser.msie) {
            $(".window").corner("8px cc:#EBEBEB");
        }

    } else {
        $.messager.alert('提示', '请重新登录！', 'info');
    }
}

// 修改登录密码
function updateCurrentUserPassword(userId) {

    if (userId) {
        var src = path
                + "/synframe/organization/user/userManage.do?method=toUpdateUserPassword";
        $("#winFrame").attr("src", src);
        $("#dd").show();
        $('#dd').dialog({
            iconCls : "icon-edit",
            title : "&nbsp;修改密码",
            height : 210,
            width : 480,
            modal : true,// 屏蔽页面
            autoOpen : false,
            onClose : function() {
                destoryIframe($("#winFrame").get(0));
            }
        });
        if ($.browser.msie) {
            $(".window").corner("8px cc:#EBEBEB");
        }

    } else {
        $.messager.alert('提示', '请重新登录！', 'info');
    }
}

/**
 * 收起东布局块（未使用）
 */
function collapseWest() {
    if (!isCollapse) {
        // 去掉了东边的布局块$('.easyui-layout').layout('collapse','east') ;
        isCollapse = true;
    }
}

/**
 * 个性化函数，针对easyui-tab，手动销毁iframe
 */
function destoryTabIframe(currtabTitle) {
    var currTab = $('#tabs').tabs('getTab', currtabTitle);
    var iframe = $(currTab.panel('options').content);
    destoryIframe($("iframe[name='" + iframe.attr("src") + "']")[0]);
}
