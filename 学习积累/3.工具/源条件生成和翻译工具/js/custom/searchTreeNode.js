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
 * @author lzh
 */

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
function searchNode() {
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
        searchInServer(searchStr);
    } else {
        searchLoadedNode(searchStr);
    }
}

/**
 * 搜索已加载的节点
 * 
 * @param searchStr
 *            搜索关键字
 */
function searchLoadedNode(searchStr) {
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
}

/**
 * 根据关键字服务端搜索
 * 
 * @param searchStr
 *            搜索关键字
 */
function searchInServer(searchStr) {
    arrowDownObj = document.getElementById("arrowDown");
    arrowUpObj = document.getElementById("arrowUp");
    zoomObj = document.getElementById("zoom");

    jQuery.post(setSearchNodeUrl(), "keywords=" + searchStr, function(data) {
        if (data.length > 0) {
            // 打开第一个搜索结果
            pathArray = data[0].split("\\");
            openNode(0);

            // 如果搜索结果大于1个，初始化上下查看结果的按钮的属性值，并隐藏搜索按钮
            if (data.length > 1) {
                searchResult = data;
                resultIndex = 0;

                arrowDownObj.style.display = "inline";
                arrowDownObj.src = path + "/lib/custom/images/arrow_down.gif";
                arrowDownObj.title = "下一条搜索结果，共" + data.length + "条，当前第1条";
                arrowDownObj.style.cursor = "pointer";

                if (window.detachEvent) {
                    arrowDownObj.detachEvent("onclick", nextResult);
                } else if (window.removeEventListener) {
                    arrowDownObj.removeEventListener("click", nextResult);
                }

                if (window.attachEvent) {
                    arrowDownObj.attachEvent("onclick", nextResult);
                } else if (window.addEventListener) {
                    arrowDownObj.addEventListener("click", nextResult);
                }
                arrowUpObj.style.display = "inline";
                arrowUpObj.src = path + "/lib/custom/images/arrow_up1.gif";
                arrowUpObj.removeAttribute("title");
                arrowUpObj.style.cursor = "default";

                if (window.detachEvent) {
                    arrowUpObj.detachEvent("onclick", lastResult);
                } else if (window.removeEventListener) {
                    arrowUpObj.removeEventListener("click", lastResult);
                }
                zoomObj.style.display = "none";
            }
        } else {
            removeLoadingBox();
            $.messager.alert('提示', '没有找到符合的节点', 'info');
            $('#cc').combo('textbox').focus();
        }
    });
}

/**
 * 根据某一条搜索结果，按路径打开最后一个节点前的所有节点，而最后一个节点为选中
 * 
 * @param index
 *            搜索结果的索引
 */
function openNode(index) {
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
            openNode(index + 1);
        } else {
            tree._selectItem(itemObject);
            tree._focusNode(tree._globalIdStorageFind(pathArray[index]));
            removeLoadingBox();
        }
    } else {
        // 等待10毫秒再执行本方法
        setTimeout("openNode(" + index + ")", 10);
    }
}

/**
 * 打开下一条搜索结果
 */
function nextResult() {
    resultIndex++;
    pathArray = searchResult[resultIndex].split("\\");
    openNode(0);

    arrowDownObj.title = "下一条搜索结果，共" + searchResult.length + "条，当前第"
            + (resultIndex + 1) + "条";
    arrowUpObj.title = "上一条搜索结果，共" + searchResult.length + "条，当前第"
            + (resultIndex + 1) + "条";

    // 如果向下翻动到第二条，改变向上查看按钮的属性值，以使向上查看按钮生效
    if (resultIndex == 1) {
        arrowUpObj.src = path + "/lib/custom/images/arrow_up.gif";
        arrowUpObj.style.cursor = "pointer";

        if (window.attachEvent) {
            arrowUpObj.attachEvent("onclick", lastResult);
        } else if (window.addEventListener) {
            arrowUpObj.addEventListener("click", lastResult);
        }
    }

    // 如果向下翻动到最后一条，使向下查看按钮失效
    if (resultIndex == searchResult.length - 1) {
        arrowDownObj.src = path + "/lib/custom/images/arrow_down2.gif";
        arrowDownObj.removeAttribute("title");
        arrowDownObj.style.cursor = "default";

        if (window.detachEvent) {
            arrowDownObj.detachEvent("onclick", nextResult);
        } else if (window.removeEventListener) {
            arrowDownObj.removeEventListener("click", nextResult);
        }
    }
}

/**
 * 打开上一条搜索结果
 */
function lastResult() {
    resultIndex--;
    pathArray = searchResult[resultIndex].split("\\");
    openNode(0);

    arrowDownObj.title = "下一条搜索结果，共" + searchResult.length + "条，当前第"
            + (resultIndex + 1) + "条";
    arrowUpObj.title = "上一条搜索结果，共" + searchResult.length + "条，当前第"
            + (resultIndex + 1) + "条";

    // 如果向上翻动到倒数第二条，改变向下查看按钮的属性值，以使向下查看按钮生效
    if (resultIndex == searchResult.length - 2) {
        arrowDownObj.src = path + "/lib/custom/arrow_down.gif";
        arrowDownObj.style.cursor = "pointer";

        if (window.attachEvent) {
            arrowDownObj.attachEvent("onclick", nextResult);
        } else if (window.addEventListener) {
            arrowDownObj.addEventListener("click", nextResult);
        }
    }

    // 如果向上翻动到第一条，使向上查看按钮失效
    if (resultIndex == 0) {
        arrowUpObj.src = path + "/lib/custom/arrow_up1.gif";
        arrowUpObj.removeAttribute("title");
        arrowUpObj.style.cursor = "default";

        if (window.detachEvent) {
            arrowUpObj.detachEvent("onclick", lastResult);
        } else if (window.removeEventListener) {
            arrowUpObj.removeEventListener("click", lastResult);
        }
    }
}

/**
 * 文档加载完毕后，初始化搜索栏
 */
$(function() {
    $('#cc')
            .wrap(
                    "<div style='position: absolute; margin-top: -23px; margin-left: 12px'></div>");
    $('#cc').before("搜索：");
    $('#cc')
            .append(
                    "<div id='sp'><div style='color:#99BBE8;background:#fafafa;padding:5px;'>选择搜索方式</div>"
                            + "<input type='radio' name='lang' value='1' checked><span>服务端</span><br/>"
                            + "<input type='radio' name='lang' value='2'><span>页面(已加载节点)</span><br/></div>");
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

    // 去掉插件的驼峰命名规则
    /* jshint camelcase:false */
    if ($.browser.version == '6.0') {
        includeJsOrCssFile('', [ path
                + '/lib/other/DD_belatedPNG_0.0.8a-min.js' ]);
        DD_belatedPNG.fix('#zoom');
    }

    $('#zoom').on('click', function() {
        searchNode();
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
            searchNode();
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
});