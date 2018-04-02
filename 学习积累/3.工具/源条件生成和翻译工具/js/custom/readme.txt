本目录存放基础框架自定义的公用js、css或图片。

1、jquery.myDatagrid.js 本开发平台easyui数据表格常用方式封装，界面要使用数据表格，引用它既可，这样节省代码的同时也可以统一控制数据表格
2、menu.js 首页菜单树数据格式范例，没在程序中引用
3、message.js 页面帮助提示信息
4、outlook.js 初始化首页菜单及tab页脚本
5、searchTreeNode.js dhtmlxTree节点搜索脚本
6、sortNodeOrder.js dhtmlxTree同层节点排序脚本
7、selectConditions.js	查询条件选择窗口
8、toolkit.js 公用的工具类js
9、jquery.easyui.extension.js  对 Jquery EasyUI 的扩展方法 以后所有对 Jquery EasyUI 的方法全部放此文件中.
10.easyui-lang-zh_CN.js  中文支持扩展类

2015-07-17 JS/JSP 前端优化文件说明
主要做了对 datagrid（数据列表）、树对象（tree)、查询条件选择窗口 进行了对象化封装、全局变量等优化；
并保留以前版本的文件是用来兼容以引用框架的使用系统；后面版本一律使用新版本的引用方法；
1.easyui.myDatagrid.js     jquery.myDatagrid.js的优化版本 新系统请使用此文件替换原来的jquery.myDatagrid.js
2.setConditions.js  selectConditions.js 的优化版本 新系统请使用此文件替换原来的setConditions.js
3.treeNodeExtend.js  searchTreeNode.js、sortNodeOrder.js 的优化版本 新系统请使用此文件替换原来的searchTreeNode.js、sortNodeOrder.js

2015-08-05 样式、图片目录调整
在此文件夹下面新建css、images 两个文件夹来存放自定义的样式与图片
并把之前easyui/themes/defalult/ 文件下面自定义的样式和图片移动此处来 以后扩展的样式与图片都放此处
