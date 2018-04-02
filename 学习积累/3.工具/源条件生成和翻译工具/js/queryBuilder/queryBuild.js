/**
 * 新增子分组
 */
function EasyuiQueryBuildObj() {
    _this = this;
    _this.addGroup = function(groupId) {
        var time = new Date().getTime();
        // 获取分组子分组序列的子元素
        var groupChildren = $('#groupDiv_' + groupId).children();
        // 获取分组条件序列的子元素
        var conditionChildren = $('#conditionDiv_' + groupId).children();
        // 当存在子分组，则创建连接符。判断子分组序列是否存在子元素来判断是否创建连接符
        if (groupChildren.length > 0) {
            queryBuildCom.createJoin($('#groupDiv_' + groupId), time, 1, '');
        }
        // 子分组开始
        var childGroup = '';
        childGroup += '<div id="conditionGroupDiv_'
                + time
                + '" style="border: 1px solid red;background: #C9EDCC; margin-top:6px;width: 522px;">';
        // 子分组序列，目前未实现，需要往下订制新的子分组，可以由此扩展
        childGroup += '<div id="groupDiv_' + time + '" class="group"></div>';
        // 子分组条件序列
        childGroup += '<div id="conditionDiv_' + time
                + '" class="condition"></div>';

        if (groupId == 1) {// 最外层分组
            childGroup += '<div style="text-align: right; margin-top: 10px">';
            childGroup += '<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.addGroup('
                    + time + ')">增加子分组</a>';
            childGroup += '<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.addCondition('
                    + time + ')">增加条件</a>';
            childGroup += '<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.removeGroup('
                    + time + ')">删除分组</a>';
            childGroup += '</div>';
        } else {
            childGroup += '<div style="text-align: right; margin-top: 10px">';
            childGroup += '<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.addCondition('
                    + time + ')">增加条件</a>';
            childGroup += '<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.removeGroup('
                    + time + ')">删除子分组</a>';
            childGroup += '</div>';
        }
        childGroup += '</div>';
        // 子分组序列新增子分组
        $('#groupDiv_' + groupId).append(childGroup);

        // 当不存在子分组，或存在子条件时，创建连接符
        if (groupChildren.length <= 0 && conditionChildren.length > 0) {
            // 获取第一个条件的时间戳，并插到第一个条件之前，以表示条件连接分组
            var timeId = conditionChildren.get(0).id.split('_')[1];
            queryBuildCom.createJoin($('#conditionDiv_' + groupId), timeId, 2,
                    '');
        }
    };

    /**
     * 新增条件
     */
    _this.addCondition = function(timeId) {
        var time = new Date().getTime();
        var groupChidren = $('#groupDiv_' + timeId).children();
        var conditionChidren = $('#conditionDiv_' + timeId).children();
        // 当存在分组，或存在条件时，创建连接符
        if (groupChidren.length > 0 || conditionChidren.length > 0) {
            queryBuildCom.createJoin($('#conditionDiv_' + timeId), time, 1, '');
        }
        queryBuildCom.createPolicyCondition(timeId, time, queryBuildCom
                .getFieldsJson()[0]);
        $("#selectField_" + time).combobox('clear');
    };

    /**
     * 获取此对象同级的连接符
     * 
     * @param obj
     * @returns {String}
     */
    _this.getJoinOp = function(obj) {
        var op = "";
        var child = obj.children();

        if (child.length >= 3) {// 获取原先选择的连接符，至少存在两个条件一个连接符
            for (var i = 1; i < child.length; i++) {// 从1开始，过滤child的第一个规则信息。
                var div = child.get(i);

                if (div.className == 'groupAndConditionJoinClass') {// 判断是否连接符
                    var id = div.id.split('_')[1];
                    op = $('#joinOp_' + id).combobox('getValue');
                    break;
                }
            }
        }
        return op;
    };

    /**
     * 获取原先的同级的连接符，没有则默认
     * 
     * @param obj
     * @returns op
     */
    _this.getGroupAndConditionJoinOp = function(obj) {
        var parent = obj.parent();
        var child = parent.children();// 取到一个分组
        var op = easyuiQueryBuild.getJoinOp($(child.get(0)));// 获取同级组的连接符
        if (op != "") {
            return op;
        }
        op = easyuiQueryBuild.getJoinOp($(child.get(1)));// 获取同级条件的连接符

        if (op == "") {// 未存在同级连接符，则默认and
            op = "or";
        }
        return op;
    };

    /**
     * 设置连接符选择项事件,同级的连接符选择必选保持一致。提高用户体验以及规定的规则具有逻辑性。
     * 
     * @param time
     */
    _this.setJoinSelectEvent = function(time) {
        $('#joinOp_' + time).combobox(
                {
                    editable : false,// 不可编辑，只能选择
                    onSelect : function(record) {
                        var joinParent = $('#groupAndConditionJoin_' + time)
                                .parent();
                        var child = joinParent.parent().children();
                        easyuiQueryBuild.setJoinOpCombobox($(child.get(0)),
                                record.value);// 设置同级条件连接符
                        easyuiQueryBuild.setJoinOpCombobox($(child.get(1)),
                                record.value);// 设置同级组连接符
                    }
                });
    };

    /**
     * 设置同级的连接符，以保持一致。
     * 
     * @param child
     * @param op
     */
    _this.setJoinOpCombobox = function(obj, op) {
        var child = obj.children();// 获取子组序列

        for (var i = 0; i < child.length; i++) {// 设置同级条件连接符
            var div = child.get(i);
            if (div.className == 'groupAndConditionJoinClass') {// 判断是否连接符
                var timeId = div.id.split('_')[1];
                $('#joinOp_' + timeId).combobox('setValue', op);
            }
        }
    };

    /**
     * 删除分组信息
     * 
     * @param groupId
     */
    _this.removeGroup = function(groupTimeId) {
        $.messager.confirm('提示', "确定删除这个分组吗？", function(r) {
            if (r) {
                // 判断是否删除的是某分组序列的第一个分组
                var parentDiv = $('#conditionGroupDiv_' + groupTimeId).parent();
                var childDiv = parentDiv.children();
                var firstChild = childDiv.get(0);// 第一个分组
                var twoChild = childDiv.get(1);

                if ('conditionGroupDiv_' + groupTimeId == firstChild.id) {// 删除的是第一个分组，则删除连接第一个连接符
                    if (childDiv.length > 1) {// 不止一个分组，否则要删除条件关联的连接符
                        $('#' + twoChild.id).remove();// 删除第一个分组与第二分组的连接符
                    } else {// 当只有一个分组，删除条件的连接符
                        var parentTimeId = parentDiv.get(0).id.split('_')[1];
                        var conditionDiv = $('#conditionDiv_' + parentTimeId);
                        var childConditionChild = conditionDiv.children();

                        if (childConditionChild.length > 1) {// 判断是否存在条件
                            $('#' + childConditionChild.get(0).id).remove();// 删除条件序列的第一个连接符
                        }
                    }
                }
                // 删除其与其他分组的连接符
                $('#groupAndConditionJoin_' + groupTimeId).remove();
                $('#conditionGroupDiv_' + groupTimeId).remove();
            }
        });
    };

    /**
     * 删除条件
     * 
     * @param conditionTimeId
     * @param index
     */
    _this.removeCondition = function(conditionTimeId) {
        $.messager
                .confirm(
                        '提示',
                        '确定删除这个条件吗？',
                        function(r) {
                            if (r) {
                                // 获取条件的父条件序列
                                var condiParent = $(
                                        '#conditionDiv_' + conditionTimeId)
                                        .parent();
                                var id = condiParent.get(0).id.split('_')[1];
                                var group = $('#groupDiv_' + id);
                                var groupChild = group.children();

                                if (groupChild.length <= 0) {// 不存在分组的情况下，判断是否删除的第一个条件
                                    var conditionChild = condiParent.children();
                                    var firstCondition = conditionChild.get(0);

                                    if (conditionChild.length > 1) {// 存在多个条件
                                        if ("conditionDiv_" + conditionTimeId == firstCondition.id) {// 判断删除的是否第一个条件
                                            $('#' + conditionChild.get(1).id)
                                                    .remove();// 删除第一个条件关联第二个条件的连接符
                                        }
                                    }
                                }
                                $('#groupAndConditionJoin_' + conditionTimeId)
                                        .remove();
                                $('#conditionDiv_' + conditionTimeId).remove();
                            }
                        });
    };
	//清空所有的条件
	_this.clearQueryConditon=function(){
		$("#groupDiv_1").empty();
        $("#conditionDiv_1").empty();
	};
}