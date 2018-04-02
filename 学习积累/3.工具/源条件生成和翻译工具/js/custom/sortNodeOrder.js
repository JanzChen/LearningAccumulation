/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * dhtmlxTree同层节点排序
 * 
 * @author lzh
 */
var tag;

/**
 * 节点拖放，当拖发生时触发的动作
 * 
 * @param dragNodeId
 *            被拖的节点id
 * @param targetNodeId
 *            目标节点的id
 * @returns {Boolean} 如果函数不能返回true,那么放将会被取消
 */
function drag(dragNodeId, targetNodeId) {
    if ((tag != null && tag != tree.getParentId(dragNodeId))
            || targetNodeId != tree.getParentId(dragNodeId)) {
        $.messager.alert('提示', '只允许同层次内拖动排序！', 'warning');
        return false;
    }

    if (tag == null) {
        tag = tree.getParentId(dragNodeId);
    }
    return true;
}

document.onmousemove = mouseMove;
var xPos;
var yPos;

/**
 * 获取鼠标的位置，兼容IE和火狐
 * 
 * @param ev
 */
function mouseMove(ev) {
    ev = ev || window.event;

    if (ev.pageX || ev.pageY) {
        xPos = ev.pageX;
        yPos = ev.pageY;
    } else {
        xPos = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
        yPos = ev.clientY + document.body.scrollTop - document.body.clientTop;
    }
}

/**
 * 节点拖放，当放发生时触发的动作
 * 
 * @param dragNodeId
 *            被拖的节点id
 * @param targetNodeId
 *            目标节点的id
 */
function drop(dragNodeId, targetNodeId) {
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
}

/**
 * 文档加载完毕后，初始化拖放结果操作菜单
 */
$(function() {
    // 节点排序时，需要下面四个设置
    tree.setDragBehavior('sibling');
    tree.enableDragAndDrop(true);
    tree.setDragHandler(drag);
    tree.setDropHandler(drop);

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

                            if (id != -1 && typeof (code) != 'undefined'
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
                                            setSortNodeOrderUrl(),
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
            windowMargin : 33,
            centerPointX : 11,
            shadow : true,
            padding : 8
        }).btOn();
    }, 500);
    setTimeout(function() {
        $("span:contains('树')").btOff();
    }, 10000);
});