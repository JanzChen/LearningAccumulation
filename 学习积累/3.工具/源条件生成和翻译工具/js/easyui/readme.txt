本目录存放jquery easyui相关文件，如果对easyui的源码进行改造，务必登记：

1、修改jquery.easyui.min.js第6055-6056行。当验证框输入正确时移除提示消息
2、修改jquery.easyui.min.js的_297(_298)方法（见修改注释）。限制对cpos的改变，即：只有在panel可见时才改变，不可见时不做改变，分别对 north,south,east,west 四个都如此处理，现用于最大化主工作区。
3、修改jquery.easyui.min.js的13012行的function _4b(_50, _51, _52) 方法，并新增pageSearch ()方法。用于对jquery easyui的数据表格进行一项扩展：数据表格列数据过滤（列数据页面搜索）
4、修改jquery.easyui.min.js第14828-14835行。当datagrid没有数据显示时，显示提示信息。
5、修改jquery.easyui.min.js第788行。当datagrid没有数据显示时，记录数为0，显示起止数都设置为0。

synframe-v1.1.2 2015-07-28 ljj easyUI 版本升级

 jquery.easyui.min.js 修改如下：以后对easyui 修改都需加上注释 格式：处理IE圆角问题 add by finest_ljj on 2015-07-29
 用 finest 关键字标示，可以方便查找
 A.  处理IE圆角问题 add by finest_ljj on 2015-07-29
               if ($(this).hasClass("indexpanel")) {
                   $(this).parent().corner("bottom 8px");
                   $(this).prev().width($(this).prev().width() + 3).corner(
                       "top 8px");
               }
 B.  去掉dialog弹框边框的影子 add by finest_ljj on 2015-07-29
                    // _27f.shadow.css({display: "block", zIndex: $.fn.window.defaults.zIndex++, left: opts.left, top: opts.top, width: _27f.window._outerWidth(), height: _27f.window._outerHeight()});

 C.  处理datagrid数据列表没有数据显示提示 系统提示：没有相关数据 add by finest_ljj on 2015-07-29
             var vc = $(_7bd).datagrid('getPanel').children('div.datagrid-view');
             vc.children('div.datagrid-empty').remove();
             if (!$(_7bd).datagrid('getRows').length) {
                 var d = $('<div class="datagrid-empty"></div>').html(
                     '系统提示：没有相关数据').appendTo(vc);
                 d.css({
                     position : 'absolute',
                     left : 0,
                     top : '50%',
                     width : '100%',
                     color : '#ABABAB',
                     textAlign : 'center'
                 });
             }
 D.  并新增pageSearch ()方法。用于对jquery easyui的数据表格进行一项扩展：数据表格列数据过滤（列数据页面搜索）
      数据表格列数据过滤（列数据页面搜索） add by finest_ljj on 2015-07-29
             var queryTr = $("<tr style='display: none'></tr>").appendTo(
                 $("tbody", t));

      数据表格列数据过滤（列数据页面搜索） add by finest_ljj on 2015-07-29
              var queryTd = $(
                  "<td style='position:relative;height:23px;'></td>")
                  .appendTo(queryTr);

              if (col.query) {
                  queryTr.show();
                  $(
                      '<input type=\"text\" onkeyup=\"pageSearch()\" class=\"x-form-text x-form-field\" />')
                      .appendTo(queryTd);
              }

              queryTd.attr("field", col.field);

              queryTd.width(col.width);
              queryTd.find("input").width(_610+col.width+col.boxWidth-10);
              queryTd.css("text-align", ("center"));

 E.   dialog弹框按钮圆角处理（去掉linkbutton) add by finest_ljj on 2015-07-29
      去除了 plugins: ["draggable",.......] 这个数据里面的 linkbutton 并配合jquery。easyui.extension.js 里面的
       $(".easyui-linkbutton").each(function ().... 方法即可实现圆角

 F.   提示框圆角处理 add by finest_ljj on 2015-07-29
              win.window("window").addClass("messager-window").corner(
                  "8px  cc:#EBEBEB");

 G.    tab标签页圆角处理（加上.corner("top 5px")） add by finest_ljj on 2015-07-29
           ul.children("li").each(function () {
                           w += $(this).outerWidth(true);
                       }).corner("top 5px");

 H.      // 替换easyui自己验证提示 add by finest_ljj on 2015-07-29
               $(_485).bt(_486.message, {
                   width : 100,
                   fill : '#FFFFEE'
               }).btOn();
       //        $(_485).tooltip($.extend({}, opts.tipOptions, {content: _486.message, position: opts.tipPosition, deltaX: opts.deltaX})).tooltip("show");
          // 替换easyui自己验证提示 当验证框输入正确时移除提示消息 add by finest_ljj on 2015-07-29
                    $('.bt-wrapper').remove();



