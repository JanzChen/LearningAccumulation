/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * 本开发平台easyui数据表格常用方式封装，注意： <br>
 * 1、数据表格必须放在center布局里面 <br>
 * 2、如果不适合比较特殊的情况，请自己直接使用DataGrid <br>
 * 3、如果需要修改此封装，请提出来讨论，避免影响已经在采用的页面
 * 
 * @author lzh
 * @time 2012.03.22
 */
$(function() {
    var _h = 0;
    var _w = 0;
    var center = null;

    if ($('.eventLayout')[0]) {
        // datagrid必须放在easyui的center布局内
        center = $('.eventLayout').layout('panel', 'center');
        // 如果存在south布局，比如有时需要子datagrid来显示其他信息，则减去其高度
        var south = $('.eventLayout').layout('panel', 'south');

        _h = (center.height() || 0) - (south.height() || 0);
        _w = center.width();

        center.panel({
            onResize : function(w, h) {
                resizeMainGrid();
            }
        });
    }
    var dataUrl = window['datagridUrl'];
    // 默认是服务端排序
    var remoteSort = window['datagridRemoteSort'] || true;
    var idField = window['datagridIdField'];
    // 默认是带复选框，如果不需要复选框，自定义datagridFrozenColumns值为[ [ ] ]，注意不需要用引号
    var frozenColumns = window['datagridFrozenColumns'] || [ [ {
        field : 'opt',
        width : 40,
        align : 'center',
        checkbox : 'true'
    }, {
        field : 'opt_ck',
        checkbox : true
    } ] ];
    var columns = window['datagridColumns'];
    // 不需要显示的列的名字，数组类型，如['deptId','addTime']
    var hideColumns = window['datagridHideColumns'] || [];
    // 查询条件的默认参数
    var queryParams = window['datagridQueryParams'] || {};
    // 我们约定用于做datagrid的table的id值是datagridTb
    var datagridTb = $('#datagridTb');

    var currentSelectIndex = null;

    if (!dataUrl || dataUrl == "") {
        $.messager
                .alert('错误', '请定义datagridUrl变量并赋值，用于指定datagrid的url！', 'error');
    }

    if (!idField || idField == "") {
        $.messager.alert('错误', '请定义datagridIdField变量并赋值，用于指定datagrid的idField！',
                'error');
    }

    if (datagridTb.length == 0) {
        $.messager
                .alert('错误', '我们约定用于做datagrid的table的id值是datagridTb！', 'error');
        return;
    }

    datagridTb.datagrid({
        // 数据表格高度
        height : _h,
        // 是否需要分页栏
        pagination : true,
        // 每页行数，默认为10
        pageSize : 20,
        // 是否显示行数列
        rownumbers : true,
        // 数据是否在一行内显示，默认为true
        nowrap : true,
        // 是否显示行条纹，默认为false
        striped : true,
        // 是否只允许选中一行，默认为false
        singleSelect : false,
        // 是否可调整大小
        resizable : true,
        // 数据表格不需要边框，和center面板的边框重复的话就不好看
        border : false,
        // 是否适应列，就是填充整个列
        fitColumns : true,
        // 列表是否合适的高度。在此开发平台上，不要设为true
        // fit: true,
        // 数据路径
        url : dataUrl,
        // 加载查询条件的参数(默认为空)
        queryParams : queryParams,
        // 设置可排序的列，此设置貌似没有效果，columns上设置有效
        // sortName : 'id',
        // 设置升序还是降序排序
        // sortOrder: 'asc',
        // 按页面端排序
        remoteSort : false,
        // 指定哪个是id字段，用于做复选框多选时，按此id计算选择几行，如有重复值，视为一行
        idField : idField,
        // 左边第一列复选框，且冻结
        frozenColumns : frozenColumns,
        // 显示列名称和内容
        columns : columns
    });
    // 隐藏不需要显示的列
    $.each(hideColumns, function(index, columnName) {
        datagridTb.datagrid('hideColumn', columnName);
    });

    $(".datagrid-view1 tr td:last").hide();

    // 调整表格宽度，如果不做调整，横向不会填满整个空间，百分比的列宽无效
    datagridTb.datagrid('resize', {
        width : _w
    });
});

/**
 * 根据传入的参数及重置当前页为第一页，重新加载datagrid <br>
 * 已知使用场景：<br>
 * 1、当查询数据时，需要设置查询条件及重置当前页为第一页 <br>
 * 2、点击树节点时，重设父节点这个查询条件及重置当前页为第一页
 * 
 * @param queryParams
 */
function reloadGridAndToFirstPage(queryParams) {
    // 我们约定用于做datagrid的table的id值是datagridTb
    var datagridTb = $('#datagridTb');

    if (datagridTb.length == 0) {
        $.messager
                .alert('错误', '我们约定用于做datagrid的table的id值是datagridTb！', 'error');
        return;
    }

    // 当点击查询的时候把页面设置成第一页
    datagridTb.datagrid('getPager').pagination({
        pageNumber : 1
    });

    if (queryParams != undefined) {
        datagridTb.datagrid('options').queryParams = queryParams;
    }
    // 清空当前选择的行
    datagridTb.datagrid('clearSelections');

    datagridTb.datagrid('reload');
}