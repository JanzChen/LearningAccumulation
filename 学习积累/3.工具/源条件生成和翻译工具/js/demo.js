var queryBuildCom = new QueryBuildCom();
// @queryBuild
var easyuiQueryBuild = new EasyuiQueryBuildObj();

$(function(){
	//初始化字段选择
	var testJson=[{"cname":"ID","name":"ID","widgetType":2},{"cname":"NAME","name":"NAME","widgetType":1},{"cname":"BIRTHDAY","name":"BIRTHDAY","widgetType":4},{"cname":"AGE","name":"AGE","widgetType":2},{"cname":"SALARY","name":"SALARY","widgetType":2},{"cname":"JOB","name":"JOB","widgetType":1},{"cname":"DEPARTMENT","name":"DEPARTMENT","widgetType":1},{"cname":"ADD_TIME","name":"ADD_TIME","widgetType":4},{"cname":"UPDATE_TIME","name":"UPDATE_TIME","widgetType":4}];
	queryBuildCom.setFieldJson(testJson);        
	//初始化字段参数Map
    queryBuildCom.initFieldMap();
	//默认新增一个条件
	easyuiQueryBuild.addCondition(1);
});
function showSQL(){
	var outJson=queryBuildCom.getQueryCondition();
	if(outJson==""||outJson==undefined){
	   alert("没有源条件");
	   return;
	}
	var sql=queryBuildCom.showSQL($.parseJSON(outJson));
	alert(sql);
	$("#outMsg").text("");
	$("#outMsg").text(sql);
}

function showJson(){
	var outJson=queryBuildCom.getQueryCondition();
	var sql=queryBuildCom.showSQL($.parseJSON(outJson));
	var solrSql=queryBuildCom.showSolrSQL($.parseJSON(outJson));
	//格式化JSON
	// outJson=JSON.stringify($.parseJSON(outJson),null,4);
	$("#outJson").text("");
	$("#outJson").text(outJson);
	console.log(outJson);
	$("#outSql").text("");
	$("#outSql").text(sql);
	$("#outSolrSql").text(solrSql);
}

function clearQueryCondition(){
	easyuiQueryBuild.clearQueryConditon();
	$("#outJson").text("");
	$("#outSql").text("");
	$("#outSolrSql").text("");
}

function demoCondition(){
	clearQueryCondition();
	var testSourceQuery={"rules":[{"field":"BIRTHDAY","op":"larEp","type":"4","value":"1990-01-01 00:00:00"},{"field":"JOB","op":"inner","type":"1","value":"CLERK,SALESMAN,SALESMAN"},{"field":"NAME","op":"leftLike","type":"1","value":"s"}],"op":"or","groups":[{"rules":[{"field":"AGE","op":"lar","type":"2","value":"20"},{"field":"AGE","op":"less","type":"2","value":"30"}],"op":"or","groups":[]}]};
	queryBuildCom.initQueryCondition(testSourceQuery);
	var sql=queryBuildCom.showSQL(testSourceQuery);
	var solrSql=queryBuildCom.showSolrSQL(testSourceQuery);
	$("#outJson").text("");
	$("#outJson").text(JSON.stringify(testSourceQuery));
	$("#outSql").text("");
	$("#outSql").text(sql);
	$("#outSolrSql").text(solrSql);
}

function translateJson(){
	var jsonstr=$("#outJson").val();
	if($.trim(jsonstr)==""){
		alert("请输入需要翻译的Json");
		return;
	}
	var sql=queryBuildCom.showSQL($.parseJSON(jsonstr));
	$("#outSql").val("");
	$("#outSql").val(sql);
}
