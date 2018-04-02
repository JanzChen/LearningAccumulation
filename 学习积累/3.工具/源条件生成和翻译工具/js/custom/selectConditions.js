/* jshint -W041 *///屏蔽jshint的 “eqeqeq” 检查规则   加此行是为了针对已经有的代码相应问题太多，不做修改。
/**
 * 查询条件选择.<br>
 * 本部件需要联合selectConditions.jsp，已经通过spring mvc映射到此jsp页面
 * 
 * @author 省公司界面规范
 * @update lzh
 */
var conditionWidth = 214; // 每个查询条件的宽度

function openEditWin() {
    var url = path + "/common/selectConditions.do";
    var options = {
        width : 500,
        height : 400,
        iconCls : "icon-config",
        title : '&nbsp;查询条件选择',
        collapsible : false,
        onClose : function() {
            $('#ifr').get(0).contentWindow.$('body').children().remove();
        }
    };
    $('#ifr').attr('src', url);
    if (options) {
        options.top = ($(window).height() - options.height) * 0.5;
        options.left = ($(window).width() - options.width) * 0.5;
        $('#w').window(options);
    }
    $('#w').window('open');

    // 使弹出的窗口圆角（为了兼容IE）
    if ($.browser.msie) {
        $(".window").corner("8px cc:#EBEBEB");
    }
}

function buildCondition(conditions) {
    defaultConditions = conditions || defaultConditions; // 全局变量
    var html = [];
    $(conditions)
            .each(
                    function() {
                        if ("textbox" == this.type) {
                            html.push('<li class="x-form-label-right">');
                            html
                                    .push('	<label class="label x-form-item-label">'
                                            + this.text + '：</label>');
                            html.push('	<input type="text" id="' + this.id
                                    + '" name="' + this.id
                                    + '" class="x-form-text x-form-field"/>');
                            html.push('</li>');
                        } else if ("numberspinner" == this.type) {
                            if (this.increment == undefined
                                    || this.increment == "undefined") {
                                this.increment = "1";
                            }
                            html.push('<li class="x-form-label-right">');
                            html
                                    .push('	<label class="label x-form-item-label">'
                                            + this.text + '：</label>');
                            html.push('	<input id="' + this.id + '" name="'
                                    + this.id
                                    + '" class="easyui-numberspinner" min="'
                                    + this.min + '" increment="'
                                    + this.increment + '" max="' + this.max
                                    + '"/>');
                            html.push('</li>');
                        } else if ("datebox" == this.type) {
                            if (this.formatter == undefined
                                    || this.formatter == "undefined") {
                                this.formatter = "yyyy-MM-dd HH:mm:ss";
                            }
                            html.push('<li class="x-form-label-right">');
                            html
                                    .push('	<label class="label x-form-item-label">'
                                            + this.text + '：</label>');
                            html
                                    .push('	<input type="text" id="'
                                            + this.id
                                            + (this.value == undefined ? ''
                                                    : '" value="' + this.value)
                                            + '" name="'
                                            + this.id
                                            + '" onfocus="WdatePicker({dateFmt:'
                                            + "'"
                                            + this.formatter
                                            + "'"
                                            + '})" class="Wdate" style="width:150px"/>');
                            html.push('</li>');
                        } else if ("select" == this.type) {
                            var obj = $.parseJSON(this.options);
                            html.push('<li class="x-form-label-right">');
                            html
                                    .push('	<label class="label x-form-item-label">'
                                            + this.text + '：</label>');
                            html.push('	<select id="' + this.id + '" name="'
                                    + this.id + '">');

                            if (this.needreset != false) {
                                html.push(' <option value="">'
                                        + '---- 置空 -----' + '</option>');
                            }

                            for ( var p in obj) {
                                if (p == this.value) {
                                    html.push(' <option value="' + p
                                            + '" selected="selected">' + obj[p]
                                            + '</option>');
                                } else {
                                    html.push(' <option value="' + p + '">'
                                            + obj[p] + '</option>');
                                }
                            }
                            html.push(' </select>');
                            html.push('</li>');
                        }
                    });

    $('#conditionUl').html(html.join(''));
    setCss();
    $.parser.parse($('#conditionUl'));
    resizeMainGrid();
    // 下拉列表清空值，不然默认选中第一项
    var selectObj = $("#searchDiv").find("ul").find("li").find("select");
    if (selectObj.combobox('getValue') == '') {
        selectObj.combobox('clear');
    }
}

function setCss() {
    $("#searchDiv").css({
        padding : "3px 5px",
        background : "rgb(223, 232, 246)",
        margin : "2px",
        border : "1px solid rgb(223, 232, 246)",
        "*z-index" : "-1"
    });
    $("#searchDiv").find("ul").css({
        "list-style" : "none",
        margin : "0px"
    });
    $("#searchDiv").find("ul").find("li").css({
        "float" : "left",
        "width" : conditionWidth,
        "height" : "20px",
        "margin" : "2px"
    });
    $("#searchDiv").find("ul").find("li").find("label").css({
        width : "85px",
        "float" : "left"
    });
    $("#searchDiv").find("ul").find("li").find("input").css({
        width : "118px",
        "text-align" : "left"
    });
    $("#searchDiv").find("ul").find("li").find(".easyui-numberspinner").css({
        width : "126px"
    });
    var selectObj = $("#searchDiv").find("ul").find("li").find("select");

    if (selectObj.length > 0) {
        selectObj.css({
            width : "123px",
            "text-align" : "left"
        });
        selectObj.combobox({
            panelHeight : '100',
            editable : false
        });

        if ($.browser.version != '6.0') {
            $.each(selectObj, function() {
                $(this).combobox('textbox').css({
                    height : "19px",
                    "font-family" : "tahoma,arial,helvetica,sans-serif",
                    "vertical-align" : "middle",
                    "padding-left" : "3px"
                });
            });
        } else {
            $.each(selectObj, function() {
                $(this).combobox('textbox').css({
                    "padding-left" : "3px"
                });
            });
        }

        // 选中置空选项时，清空下拉列表
        $.each(selectObj, function() {
            $(this).combobox({
                onHidePanel : function() {
                    if ($(this).combobox('getValue') == '') {
                        $(this).combobox('clear');
                    }
                }
            });
        });
    }
    $("#searchConBlockDiv").css({
        "margin-left" : "30px"
    });
    $("#searchFieldSet").css({
        margin : "0px 2px 2px 2px",
        padding : "0px 2px 2px 2px"
    });
}

$(function() {
    $('.eventLayout')
            .layout('panel', 'center')
            .prepend(
                    "<FIELDSET id='searchFieldSet' class='x-fieldset x-form-label-right'><LEGEND>"
                            + "<SPAN id='span' class=x-fieldset-header-text>查询条件 </SPAN></LEGEND>"
                            + "<div id='searchDiv'><div id='searchConBlockDiv'><ul id='conditionUl'></ul></div>"
                            + "<div style='clear: both;'></div></div></FIELDSET>");
    $('body')
            .append(
                    "<div id='w' class='easyui-window' modal='true' closed='true' style='padding: 5px;'>"
                            + "<iframe frameborder='0' id='ifr' src='javascript:void(0)' style='width: 100%; height: 100%;' /></div>");

    // 计算能放下的查询条件个数
    var conditionUlWidth = $('#conditionUl').width();
    var count = parseInt((conditionUlWidth - 30) / conditionWidth);
    var defaultConditions = conditions.slice(0, count);
    buildCondition(defaultConditions);
});