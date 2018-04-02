/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
// 禁止ajax缓存,同步请求
$.ajaxSetup({
    cache : false
});

function QueryBuildCom() {
    var _this = this;
    // 保存受控子对象信息
    var map = new Map_();
    // 保存选择的字段、业务对象信息
    var fieldsMap = new Map_();
    // 获取受控子对象列表信息
    var fieldsJson;
    /*
     * 1、与后台工具类DataWherePolicy的代码保持一致。
     * 2、在queryBuildCom.js的getWidgetTypeStr()具体对应生成显示何种控件。
     */
    _this.GET_WIDGET_TYPE = function() {
        var WIDGET_TYPE = new Map_();
        WIDGET_TYPE.put("1", "文本框");
        WIDGET_TYPE.put("2", "微调控件");
        WIDGET_TYPE.put("3", "日期控件");
        WIDGET_TYPE.put("4", "时间控件");
        WIDGET_TYPE.put("5", "下拉框(数字类型)");
        WIDGET_TYPE.put("6", "下拉框(字符类型)");
        WIDGET_TYPE.put("7", "组合框(数字类型)");
        WIDGET_TYPE.put("8", "组合框(字符类型)");
        WIDGET_TYPE.put("9", "人员控件(单选)");
        WIDGET_TYPE.put("10", "人员控件(多选)");
        WIDGET_TYPE.put("11", "部门控件(单选)");
        WIDGET_TYPE.put("12", "部门控件(多选)");
        WIDGET_TYPE.put("13", "自定义控件");
        return WIDGET_TYPE;
    };

    /*
     * 1、与后台接口DataWherePolicy的代码保持一致。
     * 2、与jsrender4queryBuild..jsp中的opMap模板html保持一致。
     */
    _this.OP = function() {
        var OP = new Map_();
        OP.put("eq", "相等");
        OP.put("not", "不相等");
        OP.put("lar", "大于");
        OP.put("less", "小于");
        OP.put("larEp", "大于等于");
        OP.put("lessEp", "小于等于");
        OP.put("inner", "包括");
        OP.put("notInner", "不包括");
        OP.put("leftLike", "左模糊匹配");
        OP.put("rightLike", "右模糊匹配");
        OP.put("leftRightLike", "左右模糊匹配");
        return OP;
    };
    _this.initFieldMap = function() {
        for (var index = 0; index < fieldsJson.length; index++) {
            var fieldObj = fieldsJson[index];
            map.put(fieldObj.name, fieldObj);// 英文名作为key
        }
    };

    _this.setFieldJson = function(dataJson) {
        if (dataJson !== null && dataJson !== undefined) {
            fieldsJson = dataJson;
        }
    };

    /**
     * 设置控件值
     * 
     * @param time
     * @param rule
     * @param fieldObj
     */
    _this.setWidgetValue = function(time, rule, fieldObj) {
        var widgetType = fieldObj.widgetType;
        if (widgetType == 2) {// 数字微调控件
            $('#conditionVal_' + time).numberspinner('setValue', rule.value);
        } else {
            $('#conditionVal_' + time).val(rule.value);// 其他类型
        }
    };

    /**
     * 创建一个条件
     * 
     * @param time
     */
    _this.createPolicyCondition = function(faterTime, chilTime, fieldObj) {
        var div = '<div id="conditionDiv_' + chilTime
                + '" style="margin-top: 2px;"></div>';
        $('#conditionDiv_' + faterTime).append(div);// 新增一个条件Div

        $("#conditionDiv_" + chilTime).append($("#dataPolicyRender").render({
            "chilTime" : chilTime
        }));
        _this.setConditionDiv(fieldObj, chilTime);// 设置条件内容

        $.parser.parse($('#conditionDiv_' + chilTime));
        _this.setConditionSelectEvent(chilTime);// 设置受控对象对应的控件类型
    };

    /**
     * 设置条件内容
     * 
     * @param fieldObj
     * @param time
     * 
     */
    _this.setConditionDiv = function(fieldObj, time) {
        // 字段名称下拉框
        var fieldDiv = [];
        var selectField = '<select id="selectField_' + time;
        selectField += '" class="easyui-combobox" name="selectFieldName" style="width: 157px;"';
        selectField += 'data-options="editable:true"  panelHeight="120px" required="true">';
        fieldDiv.push(selectField);
        // 控件类型Div
        var typeDiv = '<input id="type_' + time + '" type="text" value="'
                + fieldObj.widgetType + '">';

        for (var index = 0; index < fieldsJson.length; index++) {
            var selectField = fieldsJson[index];
            fieldDiv.push('<option value="' + selectField.name + '">'
                    + selectField.cname + '</option>');
        }
        fieldDiv.push('</select>');

        // 字段名称
        $('#fieldDiv_' + time).append(fieldDiv.join(""));
        // 操作符
        $('#opDiv_' + time).append($("#opMap").render({
            "time" : time
        }));
        // 控件类型
        $('#widgetType_' + time).append(typeDiv);
        // 控件值和控件备注
        $('#valueSelect_' + time)
                .append(_this.getWidgetTypeStr(fieldObj, time));
    };

    /**
     * 控件类型
     */
    _this.getWidgetTypeStr = function(fieldObj, timeId) {
        var selectStr = [];
        var conditionInputHtml = '<input id="conditionVal_' + timeId;

        if (fieldObj == '' || fieldObj == null) {
            conditionInputHtml += '" type="text" ';
            conditionInputHtml += 'class="easyui-validatebox x-form-text x-form-field"';
            conditionInputHtml += ' required="true" size="20">';
            selectStr.push(conditionInputHtml);
            return selectStr;
        }
        var widgetType = fieldObj.widgetType;
        var jsUrl = "'" + fieldObj.valueSelect + "'";
        // 文本框
        if (widgetType == 1) {
            conditionInputHtml += '" type="text" class="easyui-validatebox x-form-text x-form-field"';
            conditionInputHtml += ' required="true" size="21" style="height: 16px;">';
        }
        // 微调控件
        if (widgetType == 2) {
            conditionInputHtml += '" name="valueSelect" class="easyui-numberspinner" increment="1" ';
            conditionInputHtml += 'min="-100000000000" max="100000000000"';
            conditionInputHtml += ' required="true" value="0" style="width: 132px;"></input>';
        }
        // 日期控件
        if (widgetType == 3) {
            var formatterT = "yyyy-MM-dd";
            conditionInputHtml += '" type="text" class="Wdate"';
            conditionInputHtml += ' style="width:125px; height: 16px;" ';
            conditionInputHtml += ' onfocus="WdatePicker({dateFmt:\''
                    + formatterT + '\'});"';
            conditionInputHtml += ' required="true"/>';
        }
        // 时间控件
        if (widgetType == 4) {
            var formatterF = "yyyy-MM-dd HH:mm:ss";
            conditionInputHtml += '" type="text" class="Wdate"';
            conditionInputHtml += ' style="width:125px; height: 16px;" ';
            conditionInputHtml += ' onfocus="WdatePicker({dateFmt:\''
                    + formatterF + '\'});"';
            conditionInputHtml += ' required="true"/>';
        }
        selectStr.push(conditionInputHtml);
        return selectStr.join("");
    };

    /**
     * 创建连接符
     * 
     * @param obj
     * @param time
     */
    _this.createJoin = function(obj, time, location, op) {
        var tt = '<div id=groupAndConditionJoin_'
                + time
                + ' class="groupAndConditionJoinClass" style="margin-top:8px"></div>';

        if (location == 1) {
            obj.append(tt);// 新增一个连接符Div,放到对象之后
        } else {
            obj.prepend(tt);// 新增一个连接符Div,放到对象之前
        }

        $('#groupAndConditionJoin_' + time)
                .append(_this.getJoinSelectStr(time));// 将连接符部分增加到DIV
        $.parser.parse($('#groupAndConditionJoin_' + time));// 解析jquery easyui
        // 对象
        easyuiQueryBuild.setJoinSelectEvent(time);// 设置连接符事件
        if (op == '') {
            op = easyuiQueryBuild.getGroupAndConditionJoinOp(obj);// 获取同级的连接符
        }
        $('#joinOp_' + time).combobox('setValue', op);// 显式设置连接符选择框，缺少这一句会显示空白不显示默认值
    };

    /**
     * 返回连接符
     * 
     * @param time
     */
    _this.getJoinSelectStr = function(time) {
        // 新连接符
        var joinSelectStr = [];
        var joinHtml = '<select id="joinOp_' + time;
        joinHtml += '" class="easyui-combobox" panelHeight="48px" style="width: 60px;"';
        joinHtml += ' required="true" editable="false">'
        joinSelectStr.push(joinHtml);
        joinSelectStr.push('<option value="or">或者</option>');
        joinSelectStr.push('<option value="and">并且</option>');
        joinSelectStr.push('</select>');
        return joinSelectStr.join("");
    };

    /**
     * 创建条件选择项事件
     * 
     * @param time
     */
    _this.setConditionSelectEvent = function(time) {
        $('#selectField_' + time).combobox({
            editable : true,// 不可编辑，只能选择
            onSelect : function(record) {
                var fieldObj = map.get(record.value);// 英文名作为key，以取出一个子受控对象
                if (fieldObj != null && fieldObj != '') {
                    var widgetTypeStr = _this.getWidgetTypeStr(fieldObj, time);
                    $("#valueSelect_" + time).html(widgetTypeStr);// 设置选择字段对应的控件类型显示
                    $.parser.parse($("#valueSelect_" + time));
                    $('#type_' + time).val(fieldObj.widgetType);// 设置类型
                }
            }
        });
    };

    /**
     * 显示SQL
     */
    _this.showSQL = function(conditionJson) {
        var where = _this.getRowSqlWhere(conditionJson);
		where=where.replace("''","'");
        return where;
    };

	 /**
     * 显示solrSQL
     */
	  _this.showSolrSQL = function(conditionJson) {
        var where = _this.getRowSolrWhere(conditionJson);
		where=where.replace("''","'");
        return where;
    };

    /**
     * 返回SQL的where条件
     * 
     * @param groupJson
     * @returns {String}
     */
    _this.getRowSqlWhere = function(groupJson) {
        var rowSql = "";

        if (groupJson == null || groupJson == '') {
            return rowSql;
        }
        var rules = groupJson.rules;
        var groups = groupJson.groups;
        var op = groupJson.op;

        if (rules != '' && rules != undefined && rules != null) {// 条件规则
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                var filterStr = _this.getFilterTypeStr(rule);

                if (filterStr == '') {
                    continue;
                }

                if (rowSql == "") {
                    rowSql = filterStr + " ";
                } else {
                    rowSql += op + " " + filterStr + " ";
                }
            }
        }

        if (groups != '' && groups != undefined && groups != null) {
            for (var j = 0; j < groups.length; j++) {
                var group = groups[j];
                var groupWhere = _this.getRowSqlWhere(group);// 递归子分组序列

                if (groupWhere == "") {
                    continue;
                }

                if (rowSql != "") {
                    rowSql += op + " (" + groupWhere + ") ";
                } else {
                    rowSql = " (" + groupWhere + ") ";
                }
            }
        }
        return rowSql;
    };

    /**
     * 返回某个规则解析的where 条件
     * 
     * @param filterRule
     * @return
     */
    _this.getFilterTypeStr = function(rule) {
        var field = rule.field;// 字段名称
        var type = rule.type;// 类型
        var operate = rule.op;// 操作符
        var value = rule.value;// 字段值

        if (value == "" || value == null) {
            return "";
        }

        // 以下控件做特殊处理，其余控件按原始值处理
        var WIDGET_TYPE = _this.GET_WIDGET_TYPE();
        if ("文本框" == WIDGET_TYPE.get(type)) {
            value = "'" + value + "'";
        }

        if ("日期控件" == WIDGET_TYPE.get(type)) {
            value = "TO_DATE('" + value + "','YYYY-MM-DD')";
        }

        if ("时间控件" == WIDGET_TYPE.get(type)) {
            value = "TO_DATE('" + value + "','YYYY-MM-DD HH24:MI:SS')";
        }
        return _this.getFilterStr(field, operate, value);
    };


    _this.getFilterStr = function(filed, operate, value) {
        var filterStr = "";
        var OP = _this.OP();
        var opValue = OP.get(operate);

        if ("相等" == opValue) {
            filterStr = filed + " =" + value;
        }
        if ("不相等" == opValue) {
            filterStr = filed + " !=" + value;
        }
        if ("大于" == opValue) {
            filterStr = filed + " >" + value;
        }
        if ("小于" == opValue) {
            filterStr = filed + " <" + value;
        }
        if ("大于等于" == opValue) {
            filterStr = filed + " >=" + value;
        }
        if ("小于等于" == opValue) {
            filterStr = filed + " <=" + value;
        }
        if ("包括" == opValue) {
			var manyValue=_this.dealWithManyValue(value);
            filterStr = filed + " in (" + manyValue + ")";
        }
        if ("不包括" == opValue) {
			var manyValue=_this.dealWithManyValue(value);
            filterStr = filed + " not in (" + manyValue + ")";
        }
        if ("左模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + " like '" + value + "%'";
        }
        if ("右模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + " like '%" + value + "'";
        }
        if ("左右模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + " like '%" + value + "%'";
        }
        return filterStr;
    };



    /**
     * 返回solr的查询条件
     * 
     * @param groupJson
     * @returns {String}
     */
    _this.getRowSolrWhere = function(groupJson) {
        var solrSql = "";

        if (groupJson == null || groupJson == '') {
            return solrSql;
        }
        var rules = groupJson.rules;
        var groups = groupJson.groups;
        var op = groupJson.op;

        if (rules != '' && rules != undefined && rules != null) {// 条件规则
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                var filterStr = _this.getFilterTypeSolrStr(rule);

                if (filterStr == '') {
                    continue;
                }

                if (solrSql == "") {
                    solrSql = filterStr + " ";
                } else {
                    solrSql += op + " " + filterStr + " ";
                }
            }
        }

        if (groups != '' && groups != undefined && groups != null) {
            for (var j = 0; j < groups.length; j++) {
                var group = groups[j];
                var groupWhere = _this.getRowSolrWhere(group);// 递归子分组序列

                if (groupWhere == "") {
                    continue;
                }

                if (solrSql != "") {
                    solrSql += op + " (" + groupWhere + ") ";
                } else {
                    solrSql = " (" + groupWhere + ") ";
                }
            }
        }
        return solrSql;
    };

    /**
     * 返回某个规则解析的where 条件
     * 
     * @param filterRule
     * @return
     */
    _this.getFilterTypeSolrStr = function(rule) {
        var field = rule.field;// 字段名称
        var type = rule.type;// 类型
        var operate = rule.op;// 操作符
        var value = rule.value;// 字段值

        if (value == "" || value == null) {
            return "";
        }

        // 以下控件做特殊处理，其余控件按原始值处理
        var WIDGET_TYPE = _this.GET_WIDGET_TYPE();
        if ("文本框" == WIDGET_TYPE.get(type)) {
            value = "'" + value + "'";
        }

        if ("日期控件" == WIDGET_TYPE.get(type)) {
            value = _this.formatSolrTime(value);
        }

        if ("时间控件" == WIDGET_TYPE.get(type)) {
             value = _this.formatSolrTime(value);
        }
        return _this.getFilterSolrStr(field, operate, value);
    };

	_this.formatSolrTime=function (value){
		var fmtDate=_this.getFmtDate(value);
		var year=fmtDate.getFullYear();
		var month=fmtDate.getMonth()+1<10?'0'+(fmtDate.getMonth()+1):fmtDate.getMonth()+1; //月份           
        var day=fmtDate.getDate()<10?'0'+fmtDate.getDate():fmtDate.getDate();//日           
        var hour=fmtDate.getHours()<10 ?'0'+fmtDate.getHours() : fmtDate.getHours();  //小时                  
        var minute=fmtDate.getMinutes()<10?'0'+fmtDate.getMinutes():fmtDate.getMinutes(); //分           
        var second=fmtDate.getSeconds()<10?'0'+fmtDate.getSeconds():fmtDate.getSeconds();//秒     
		return year+'-'+month+'-'+day+'T'+hour+':'+minute+':'+second+'Z';  
   }

   _this.getFmtDate=function(strDate){
	  var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, 
	   function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	  return date;
   }

    _this.getFilterSolrStr = function(filed, operate, value) {
        var filterStr = "";
        var OP = _this.OP();
        var opValue = OP.get(operate);

        if ("相等" == opValue) {
            filterStr = filed + ":" + value;
        }
        if ("不相等" == opValue) {
            filterStr = filed + ": not " + value;
        }
        if ("大于" == opValue) {
            filterStr = filed + "{" + value+" TO *]";
        }
        if ("小于" == opValue) {
            filterStr = filed + ":" + "[* TO"+value+"}";
        }
        if ("大于等于" == opValue) {
            filterStr = filed + ":" +"["+ value+" TO *]";
        }
        if ("小于等于" == opValue) {
            filterStr = filed + ":" +"[ * TO "+ value+"]";
        }
        if ("包括" == opValue) {
			var manyValue=_this.dealWithManyValue(value);
            filterStr = '+'+filed + ":" +"("+ manyValue.split(",").join(' ') + ")";
        }
        if ("不包括" == opValue) {
			var manyValue=_this.dealWithManyValue(value);
            filterStr = '-'+filed + ":" +"("+ manyValue.spit(",").join(' ') + ")";
        }
        if ("左模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + ":" + value+"*" ;
        }
        if ("右模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + ":*" + value;
        }
        if ("左右模糊匹配" == opValue) {
            value = value.replace("'", "");
            value = value.replace("'", "");
            filterStr = filed + ":*" + value + "*";
        }
        return filterStr;
    };


    /**
     * TODO 行数据可操作策略需要完善
     */
    _this.getQueryCondition = function() {
        var queryCondition = "";
        var filterGroup = _this.getGroup($('#conditionDiv_1'));// 规则的集合即一个分组
        filterGroup = _this.getGroups($('#groupDiv_1'), filterGroup);
        if (filterGroup === undefined || $.isEmptyObject(filterGroup)) {
            return "";
        }
        if (filterGroup.groups.length == 0 && filterGroup.rules === undefined) {// 条件和子分组为空，即判断为空分组
            queryCondition = "";
        } else if (filterGroup.groups.length == 0
                && filterGroup.rules.length == 0) {
            queryCondition = "";
        } else {
            queryCondition = JSON.stringify(filterGroup);
        }
        return queryCondition;
    };

    /**
     * 递归分组信息，TODO 后续考虑getGroups和getGroup()合并在一起，提高代码重用性。
     * 
     * @param groupsDiv
     * @returns {Array}
     */
    _this.getGroups = function(groupsDiv, filterGroup) {
        var groups = [];
        var groupChild = groupsDiv.children();

        if (filterGroup == undefined) {
            filterGroup = {};
        }

        if (groupChild.length > 0) {// 获取分组信息
            for (var i = 0; i < groupChild.length; i++) {
                var div = groupChild.get(i);
                var timeId = div.id.split('_')[1];
                if (div.className == 'groupAndConditionJoinClass') {// 组序列的连接符
                    // 当大组的不存在条件时，说明没有连接符，那么则获取组与组之间的连接符
                    if (filterGroup.op == "") {
                        var joinVal = $('#joinOp_' + timeId).combobox(
                                'getValue');
                        filterGroup.op = joinVal;
                    }
                    continue;
                }
                var group = _this.getGroup($('#conditionDiv_' + timeId));// 递归遍历
                group = _this.getGroups($('#groupDiv_' + timeId), group);
                if (group.rules.length == 0 && group.groups.length == 0) {// 条件和子分组为空，即判断为空分组
                    $.messager.alert('提示', "存在空的分组！", 'info');
                } else {
                    groups.push(group);
                }
            }
        }
        filterGroup.groups = groups;
        return filterGroup;
    };

    /**
     * 获取一个分组信息，子分组集合默认为空
     * 
     * @param groupDiv
     * @return group
     */
    _this.getGroup = function(groupDiv) {
        var group = {};
        var rules = [];
        var op = "";
        var groupChild = groupDiv.children();
        if (groupChild.length > 0) {
            for (var index = 0; index < groupChild.length; index++) {
                var div = groupChild.get(index);
                var timeId = div.id.split('_')[1];
                var rule = {};

                if (div.className == 'groupAndConditionJoinClass') {// 判断是否连接符
                    if (op == "") {
                        var joinVal = $('#joinOp_' + timeId).combobox(
                                'getValue');
                        op = joinVal;
                    }
                    continue;
                } else {// 读取条件信息
                    var queryConditionObj = $('#selectField_' + timeId);// 选择的受控对象
                    var queryConditionOp = $('#op_' + timeId);// 属性条件
                    var queryConditionType = $('#type_' + timeId);// 受控对象类型
                    var queryConditonVal = $('#conditionVal_' + timeId);// 选择受控对象的输入值
                    var fieldName = queryConditionObj.attr('name');
                    var v1 = queryConditionObj.combobox('getValue');
                    if (v1 === undefined || v1 === '') {
                        return [];
                    }
                    var v2 = queryConditionOp.combobox('getValue');
                    var v3 = queryConditionType.val();
                    var v4 = "";// 字段值
                    v4 = queryConditonVal.val();
                    rule.field = v1;
                    rule.op = v2;
                    rule.type = v3;
                    rule.value = v4;
                    rules.push(rule);
                }
            }
        }
        group.rules = rules;
        group.op = op;
        return group;
    };

    /**
     * 验证某些操作符不能存在多选值情况
     * 
     * @param op
     * @param value
     * @returns {Boolean}
     */
    _this.isOpValueSelect = function(op, value) {
        var flag = false;
        var opValue = _this.OP().get(op);
        if (opValue != "包括" && opValue != "不包括") {
            var array = value.split(",");

            if (array.length > 1) {
                flag = true;
            }
        }
        return flag;
    };

    /**
     * TODO,需要继续完善行数据操作策略
     */
    _this.initQueryCondition = function(dataJson) {
        _this.createRowDataPolicy(1, dataJson);// 1为页面id为rowDataPolicyDiv_1的最外层div组元素下划线标识
    };

    /**
     * 行数据策略
     */
    _this.createRowDataPolicy = function(parentDivId, groupJson) {
        var rules = groupJson.rules;
        var groups = groupJson.groups;
        var op = groupJson.op;

        if (rules != '' && rules != undefined) {
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                _this.createCondition(parentDivId, rule, groups, op);// 生成条件
            }
        }

        if (groups != '' && groups != undefined) {
            for (var g = 0; g < groups.length; g++) {
                var group = groups[g];
                var time = _this.createGroup(parentDivId, op);// 创建一个div组
                _this.createRowDataPolicy(time, group);// 递归遍历，time说明当前group的数据添加到哪个组
            }
        }
    };

    /**
     * 创建组
     */
    _this.createGroup = function(parentDivId, op) {
        var time = new Date().getTime();

        // 获取分组子分组序列的子元素
        var groupChildren = $('#groupDiv_' + parentDivId).children();
        // 获取分组条件序列的子元素
        var conditionChildren = $('#conditionDiv_' + parentDivId).children();
        // 当存在子分组，则创建连接符。判断子分组序列是否存在子元素来判断是否创建连接符
        if (groupChildren.length > 0) {
            _this.createJoin($('#groupDiv_' + parentDivId), time, 1, op);
        }

        // 子分组开始
        var childGroup = [];
        childGroup
                .push('<div id="conditionGroupDiv_'
                        + time
                        + '" style="border: 1px solid red;background: #C9EDCC; margin-top:6px;width: 522px;">');
        // 子分组序列，目前未实现，需要往下订制新的子分组，可以由此扩展
        childGroup.push('<div id="groupDiv_' + time + '" class="group"></div>');
        // 子分组条件序列
        childGroup.push('<div id="conditionDiv_' + time
                + '" class="condition"></div>');

        if (parentDivId == 1) {// 最外层分组
            childGroup
                    .push('<div style="text-align: right; margin-top: 10px">');
            childGroup
                    .push('<a href="javascript:void(0)" class=easyui-linkbutton onclick="easyuiQueryBuild.addGroup('
                            + time + ')">增加子分组</a>');
            childGroup
                    .push('<a href="javascript:void(0)" class=easyui-linkbutton onclick="easyuiQueryBuild.addCondition('
                            + time + ')">增加条件</a>');
            childGroup
                    .push('<a href="javascript:void(0)" class=easyui-linkbutton onclick="easyuiQueryBuild.removeGroup('
                            + time + ')">删除分组</a>');
            childGroup.push('</div>');
        } else {
            childGroup
                    .push('<div style="text-align: right; margin-top: 10px">');
            childGroup
                    .push('<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.addCondition('
                            + time + ')">增加条件</a>');
            childGroup
                    .push('<a href="javascript:void(0)" class="easyui-linkbutton" onclick="easyuiQueryBuild.removeGroup('
                            + time + ')">删除子分组</a>');
            childGroup.push('</div>');
        }

        // 子分组序列新增子分组
        $('#groupDiv_' + parentDivId).append(childGroup.join(""));

        return time;// 以便确认将条件序列添加到哪个组
    };

    /**
     * 新增条件
     */
    _this.createCondition = function(parentDivId, rule, groups, op) {
        var time = new Date().getTime() + "id";// 加上ID为了防止parentDivId与time相同
        var conditionChidren = $('#conditionDiv_' + parentDivId).children();
        // 设置值
        var fieldObj = map.get(rule.field);

        // 当存在分组，或存在条件时，创建连接符
        if (groups != '' || conditionChidren.length > 0) {
            _this.createJoin($('#conditionDiv_' + parentDivId), time, 1, op);
        }
        _this.createPolicyCondition(parentDivId, time, fieldObj);
        $('#selectField_' + time).combobox('setValue', rule.field);
        $('#op_' + time).combobox('setValue', rule.op);
        $('#type_' + time).val(fieldObj.widgetType);
        _this.setWidgetValue(time, rule, fieldObj);

        var t = $('#type_' + time).val();
        var tt = t;
    };
    _this.getFieldsMap = function() {
        return fieldsMap;
    };

    _this.getFieldsJson = function() {
        return fieldsJson;
    };
	_this.dealWithManyValue=function(value){
		//处理中文的逗号
		value=value.replace("，",",");
		//处理单引号
		value=value.replace("'","");
		var valArr=value.split(",");
		var manyVal="'"+valArr[0]+"'";
		for(var i=1;i<valArr.length;i++){
			manyVal+=",'"+valArr[i]+"'";
		}
		return manyVal;
	}
}