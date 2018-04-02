/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * dhtmlxTree节点搜索，要求：
 * 1、搜索框放在panel的第一位元素，并且title的值用“&nbsp;”占位，因搜索框将位移到panel的title栏上
 * 2、页面要提供一个树对象的变量，并且名字为tree，以下脚本将使用树对象变量
 * 
 * 如： <div id="p" class="easyui-panel" style="width:500px;height:200px;"
 * title="&nbsp;" > <!-- 树节点搜索框 --> <select id='cc'></select> <!--
 * dhtmlxTree树div --> <div id="tree" style="height: 88%; margin-left: 7px;
 * margin-top: 7px"></div> </div>
 * 
 * @author ljj
 * @param tree
 *            树对象
 * @param url
 *            指定搜索的url
 */
function searchTreeNode(tree, url) {

    var _this = this;

    // 某搜索结果的路径数组
    var pathArray;
    // 搜索结果，json格式封装
    var searchResult;
    // 搜索结果的索引
    var resultIndex;
    // 一些图片元素对象
    var arrowDownObj;
    var arrowUpObj;
    var zoomObj;

    /**
     * 搜索节点，ajax调用后台搜索，搜索结果是节点id路径，以json返回
     */
    _this.searchNode = function() {
        var searchStrObj = $('#cc').combo('textbox');
        var searchStr = $.trim(searchStrObj.val());

        if (searchStr == "") {
            $.messager.alert('提示', '请输入搜索关键字', 'info');
            searchStrObj.val("");
            searchStrObj.focus();
            return;
        }
        showLoadingBox($("#cc").parent().parent().parent(), "正在搜索节点，请稍后。。。");

        if ($(':input:radio:checked').val() == 1) {
            _this.searchInServer(searchStr);
        } else {
            _this.searchLoadedNode(searchStr);
        }
    };

    /**
     * 搜索已加载的节点
     * 
     * @param searchStr
     *            搜索关键字
     */
    _this.searchLoadedNode = function(searchStr) {
        // tree.findItem(searchStr);
        // 查找节点，多次调用将定位到下一个，如果是最后一个将定位到第一个
        var z = tree._findNodeByLabel(searchStr);

        if (z) {
            // 展开并选中节点，false表示不触发节点上的事件，否则触发
            tree.selectItem(z.id, false);
            // 滚动滚动条，使节点在可视范围内
            tree._focusNode(z);
            removeLoadingBox();
        } else {
            removeLoadingBox();
            $.messager.alert('提示', '已加载节点中没有找到符合的节点，建议使用服务端搜索', 'info');
        }
    };

    /**
     * 根据关键字服务端搜索
     * 
     * @param searchStr
     *            搜索关键字
     */
    _this.searchInServer = function(searchStr) {
        arrowDownObj = document.getElementById("arrowDown");
        arrowUpObj = document.getElementById("arrowUp");
        zoomObj = document.getElementById("zoom");

        jQuery.post(url, "keywords=" + searchStr, function(data) {
            if (data.length > 0) {
                // 打开第一个搜索结果
                pathArray = data[0].split("\\");
                _this.openNode(0);

                // 如果搜索结果大于1个，初始化上下查看结果的按钮的属性值，并隐藏搜索按钮
                if (data.length > 1) {
                    searchResult = data;
                    resultIndex = 0;

                    arrowDownObj.style.display = "inline";
                    arrowDownObj.src = path
                            + "/lib/custom/images/arrow_down.gif";
                    arrowDownObj.title = "下一条搜索结果，共" + data.length + "条，当前第1条";
                    arrowDownObj.style.cursor = "pointer";

                    if (window.detachEvent) {
                        arrowDownObj.detachEvent("onclick", _this.nextResult);
                    } else if (window.removeEventListener) {
                        arrowDownObj.removeEventListener("click",
                                _this.nextResult);
                    }

                    if (window.attachEvent) {
                        arrowDownObj.attachEvent("onclick", _this.nextResult);
                    } else if (window.addEventListener) {
                        arrowDownObj
                                .addEventListener("click", _this.nextResult);
                    }
                    arrowUpObj.style.display = "inline";
                    arrowUpObj.src = path + "/lib/custom/images/arrow_up1.gif";
                    arrowUpObj.removeAttribute("title");
                    arrowUpObj.style.cursor = "default";

                    if (window.detachEvent) {
                        arrowUpObj.detachEvent("onclick", _this.lastResult);
                    } else if (window.removeEventListener) {
                        arrowUpObj.removeEventListener("click",
                                _this.lastResult);
                    }
                    zoomObj.style.display = "none";
                }
            } else {
                removeLoadingBox();
                $.messager.alert('提示', '没有找到符合的节点', 'info');
                $('#cc').combo('textbox').focus();
            }
        });
    };

    /**
     * 根据某一条搜索结果，按路径打开最后一个节点前的所有节点，而最后一个节点为选中
     * 
     * @param index
     *            搜索结果的索引
     */
    _this.openNode = function(index) {
        var itemObject = tree._globalIdStorageFind(pathArray[index]);

        /*
         * 如果是未打开的节点，tree._openItem操作会访问后台查询子节点加载数据，
         * 需要一段时间才能完成，因此tree._globalIdStorageFind查询的节点可能在没加载出来
         */
        if (itemObject) {

            if (index != pathArray.length - 1) {
                // 展开节点，不要用tree._HideShow，因它触发不了setOnOpenEndHandler事件
                tree._openItem(itemObject);
                // 递归调用,打开下一个节点
                _this.openNode(index + 1);
            } else {
                tree._selectItem(itemObject);
                tree._focusNode(tree._globalIdStorageFind(pathArray[index]));
                removeLoadingBox();
            }
        } else {
            // 等待10毫秒再执行本方法
            setTimeout(function() {
                _this.openNode(index);
            }, 10);
        }
    };

    /**
     * 打开下一条搜索结果
     */
    _this.nextResult = function() {
        resultIndex++;
        pathArray = searchResult[resultIndex].split("\\");
        _this.openNode(0);

        arrowDownObj.title = "下一条搜索结果，共" + searchResult.length + "条，当前第"
                + (resultIndex + 1) + "条";
        arrowUpObj.title = "上一条搜索结果，共" + searchResult.length + "条，当前第"
                + (resultIndex + 1) + "条";

        // 如果向下翻动到第二条，改变向上查看按钮的属性值，以使向上查看按钮生效
        if (resultIndex == 1) {
            arrowUpObj.src = path + "/lib/custom/images/arrow_up.gif";
            arrowUpObj.style.cursor = "pointer";

            if (window.attachEvent) {
                arrowUpObj.attachEvent("onclick", _this.lastResult);
            } else if (window.addEventListener) {
                arrowUpObj.addEventListener("click", _this.lastResult);
            }
        }

        // 如果向下翻动到最后一条，使向下查看按钮失效
        if (resultIndex == searchResult.length - 1) {
            arrowDownObj.src = path + "/lib/custom/images/arrow_down2.gif";
            arrowDownObj.removeAttribute("title");
            arrowDownObj.style.cursor = "default";

            if (window.detachEvent) {
                arrowDownObj.detachEvent("onclick", _this.nextResult);
            } else if (window.removeEventListener) {
                arrowDownObj.removeEventListener("click", _this.nextResult);
            }
        }
    };

    /**
     * 打开上一条搜索结果
     */
    _this.lastResult = function() {
        resultIndex--;
        pathArray = searchResult[resultIndex].split("\\");
        _this.openNode(0);

        arrowDownObj.title = "下一条搜索结果，共" + searchResult.length + "条，当前第"
                + (resultIndex + 1) + "条";
        arrowUpObj.title = "上一条搜索结果，共" + searchResult.length + "条，当前第"
                + (resultIndex + 1) + "条";

        // 如果向上翻动到倒数第二条，改变向下查看按钮的属性值，以使向下查看按钮生效
        if (resultIndex == searchResult.length - 2) {
            arrowDownObj.src = path + "/lib/custom/images/arrow_down.gif";
            arrowDownObj.style.cursor = "pointer";

            if (window.attachEvent) {
                arrowDownObj.attachEvent("onclick", _this.nextResult);
            } else if (window.addEventListener) {
                arrowDownObj.addEventListener("click", _this.nextResult);
            }
        }

        // 如果向上翻动到第一条，使向上查看按钮失效
        if (resultIndex == 0) {
            arrowUpObj.src = path + "/lib/custom/images/arrow_up1.gif";
            arrowUpObj.removeAttribute("title");
            arrowUpObj.style.cursor = "default";

            if (window.detachEvent) {
                arrowUpObj.detachEvent("onclick", _this.lastResult);
            } else if (window.removeEventListener) {
                arrowUpObj.removeEventListener("click", _this.lastResult);
            }
        }
    };

    /**
     * 文档加载完毕后，初始化搜索栏
     */
    $('#cc')
            .wrap(
                    "<div style='position: absolute; margin-top: -23px; margin-left: 12px'></div>");
    $('#cc').before("搜索：");
    $('#cc')
            .append(
                    "<div id='sp'><div style='color:#99BBE8;background:#fafafa;padding:5px;'>"
                            + "选择搜索方式</div><input type='radio' name='lang' value='1' checked>"
                            + "<span>服务端</span><br/><input type='radio' name='lang' value='2'>"
                            + "<span>页面(已加载节点)</span><br/></div>");
    $('#cc')
            .after(
                    "<img id='arrowUp' title='上一条搜索结果' style='display: none; margin-left: 2px' />"
                            + "<img id='arrowDown' title='下一条搜索结果' style='display: none; margin-left: 2px' />"
                            + "<input type='button' id='zoom' title='当是页面搜索时，再次点击将定位到下一条'/>");

    // 使用input标签引入图片是为了配合DD_belatedPNG解决IE6下png图片不透明
    $('#zoom').css({
        "background" : "url('" + path + "/lib/custom/images/search.png')",
        height : "16px",
        width : "16px",
        border : "0px",
        cursor : "pointer",
        position : "absolute",
        margin : "3px",
        padding : "3px"
    });

    // 以下注释为jshint特有，用来去除特定校验
    /* jshint camelcase:false */
    if ($.browser.version == '6.0') {
        includeJsOrCssFile('', [ path
                + '/lib/other/DD_belatedPNG_0.0.8a-min.js' ]);
        DD_belatedPNG.fix('#zoom');
    }

    $('#zoom').on('click', function() {
        _this.searchNode();
    });

    $('#cc').combo({
        editable : true,
        panelHeight : 75,
        panelWidth : 119,
        width : 120
    });

    // 去掉边框，因默认的边框颜色和title栏底层相同，显的难看
    $('.combo').css({
        "border" : "0px"
    });

    $('#cc').combo('textbox').css({
        width : "98px",
        height : "19px",
        "padding-left" : "3px"
    });
    // $('#cc').combo('textbox').addClass("x-form-text x-form-field");
    $('#sp').appendTo($('#cc').combo('panel'));
    $('#sp input').click(function() {
        var v = $(this).val();
        $('#cc').combo('setValue', v).combo('hidePanel');
    });
    // 回车搜索
    $('#cc').combo('textbox').keydown(function(event) {
        if (event.keyCode == 13) {
            _this.searchNode();
        }
    });
    // 当在文本域中发生按下键盘按钮事件时（可输入字符的键盘按键），调用此函数，显示搜索按钮以便进行搜索
    $('#cc').combo('textbox').focus(function() {
        var arrowDownObj = document.getElementById("arrowDown");
        var arrowUpObj = document.getElementById("arrowUp");
        var zoomObj = document.getElementById("zoom");

        arrowDownObj.style.display = "none";
        arrowUpObj.style.display = "none";
        zoomObj.style.display = "inline";
    });
}

/**
 * dhtmlxTree同层节点排序
 * 
 * @author ljj
 * @param tree
 *            树对象
 * @param url
 *            指定服务端排序的url
 */
function sortNodeOrder(tree, url) {

    var _this = this;

    var tag;
    var xPos;
    var yPos;

    /**
     * 节点拖放，当拖发生时触发的动作
     * 
     * @param dragNodeId
     *            被拖的节点id
     * @param targetNodeId
     *            目标节点的id
     * @returns {Boolean} 如果函数不能返回true,那么放将会被取消
     */
    _this.drag = function(dragNodeId, targetNodeId) {
        if ((tag != null && tag != tree.getParentId(dragNodeId))
                || targetNodeId != tree.getParentId(dragNodeId)) {
            $.messager.alert('提示', '只允许同层次内拖动排序！', 'warning');
            return false;
        }

        if (tag == null) {
            tag = tree.getParentId(dragNodeId);
        }
        return true;
    };
    /**
     * 获取鼠标的位置，兼容IE和火狐
     * 
     * @param ev
     */
    _this.mouseMove = function(ev) {
        ev = ev || window.event;

        if (ev.pageX || ev.pageY) {
            xPos = ev.pageX;
            yPos = ev.pageY;
        } else {
            xPos = ev.clientX + document.body.scrollLeft
                    - document.body.clientLeft;
            yPos = ev.clientY + document.body.scrollTop
                    - document.body.clientTop;
        }
    };
    document.onmousemove = _this.mouseMove;
    /**
     * 节点拖放，当放发生时触发的动作
     * 
     * @param dragNodeId
     *            被拖的节点id
     * @param targetNodeId
     *            目标节点的id
     */
    _this.drop = function(dragNodeId, targetNodeId) {
        var sortButtonDiv = $('#sortButtonDiv');

        if (sortButtonDiv.css("display") == "none") {
            sortButtonDiv.css("display", "inline");
        }

        if (navigator.userAgent.indexOf("Firefox") > 0) {
            sortButtonDiv.css("left", xPos + 30);
            sortButtonDiv.css("top", yPos - 18);
        } else if (navigator.userAgent.indexOf("MSIE") > 0) {
            sortButtonDiv.css("left", xPos + 30);
            sortButtonDiv.css("top", yPos - 18);
        }
    };

    /**
     * 文档加载完毕后，初始化拖放结果操作菜单
     */
    // 节点排序时，需要下面四个设置
    tree.setDragBehavior('sibling');
    tree.enableDragAndDrop(true);
    tree.setDragHandler(_this.drag);
    tree.setDropHandler(_this.drop);

    if ($('#tree').size() == 0) {
        $.messager.alert('提示', '要使用树节点排序，请把存放树的div的id值设置为“tree”', 'warning');
        return;
    }
    $('#tree')
            .append(
                    "<div id='sortButtonDiv'><div id='confirm' style='cursor: hand'>确定</div><div id='cancel' style='cursor: hand'>取消</div></div>");
    $('#sortButtonDiv').css({
        "z-index" : "999999999",
        position : "absolute",
        border : "1px solid blue",
        width : "30px",
        height : "35px",
        display : "none",
        "background-color" : "ffffff",
        "border-width" : "1px",
        "border-color" : "gray"
    });

    $('#confirm')
            .on(
                    'click',
                    function() {
                        var nodeInfos = [];
                        var childNodeIds = tree.getSubItems(tag).split(",");

                        tag = null;
                        var sortButtonDiv = $('#sortButtonDiv');
                        sortButtonDiv.css("display", "none");

                        for (var i = 0; i < childNodeIds.length; i++) {
                            var id = childNodeIds[i];
                            var index = tree.getIndexById(id) + 1;
                            var code = tree.getUserData(id, "orderCode");
                            var level = tree.getLevel(id);

                            // 允许使用typeof
                            /* jshint notypeof:true */
                            if (id != -1 && typeof (code) != 'undifined'
                                    && code != "" && index != code) {
                                if (index.toString().length == 1) {
                                    index = "00" + index;
                                }

                                if (index.toString().length == 2) {
                                    index = "0" + index;
                                }
                                nodeInfos.push(id + "#" + index + "#" + level);
                            }
                        }

                        if (nodeInfos.length > 0) {
                            showLoadingBox($("#tree").parent(),
                                    "正在同步节点顺序到数据库，请稍后。。。");

                            jQuery
                                    .post(
                                            url,
                                            "nodeInfos=" + nodeInfos.join(","),
                                            function(data) {
                                                if (data == "success") {
                                                    for (var i = 0; i < nodeInfos.length; i++) {
                                                        var itemId = nodeInfos[i]
                                                                .split("-")[0];
                                                        var code = parseInt(nodeInfos[i]
                                                                .split("-")[1]);
                                                        tree.setUserData(
                                                                itemId,
                                                                "orderCode",
                                                                code);
                                                    }
                                                }
                                                removeLoadingBox();
                                            });
                        }
                    });

    $('#cancel').on('click', function() {
        var sortButtonDiv = $('#sortButtonDiv');
        sortButtonDiv.css("display", "none");

        if (tag != 0) {
            tree.refreshItem(tag);
        }
        tag = null;
    });

    // 提示信息，注意顶级节点的节点名称需要包含“树”字眼
    setTimeout(function() {
        $("span:contains('树')").bt('可拖动节点排序', {
            width : 86,
            windowMargin : 35,
            centerPointX : 0.11,
            shadow : true,
            padding : 8
        }).btOn();
    }, 500);
    setTimeout(function() {
        $("span:contains('树')").btOff();
    }, 10000);
}