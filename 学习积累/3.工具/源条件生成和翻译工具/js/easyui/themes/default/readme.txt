注意！！！
1、这里的css文件是基于easyui 1.2.4原版修改过的
2、icon图片及icon.css在easyui原版中是放在上级目录的，放到这级目录是因为扩充了一些，并且现在是用的这一份

2015-07-28  ljj
easyui 版本升级为1.4.3  去除了多余的样式文件
（此处只存放easyui框架的样式与图片，自定义的图片与样式请放到lib/custom/文件夹下面）
1、easyui.css  tabs标签工具条的背景颜色
.tabs-tool {
     background-color: #096BA8;
 }

2、修改提示框 样式
.messager-button {
    background-color: #F0F0F0;
    margin-bottom: -10px;
    margin-left: -9px;
    margin-right: -10px;
    padding-bottom: 6px;
    padding-right: 10px;
    padding-top: 5px;
    text-align: right;
}

3、修改提示框按钮的边框颜色
.l-btn {
    color: #444;
    background: #fafafa;
    background-repeat: repeat-x;
    border: 1px solid #707070; // 只修改了此处的颜色值
    background: -webkit-linear-gradient(top,#ffffff 0,#eeeeee 100%);
    background: -moz-linear-gradient(top,#ffffff 0,#eeeeee 100%);
    background: -o-linear-gradient(top,#ffffff 0,#eeeeee 100%);
    background: linear-gradient(to bottom,#ffffff 0,#eeeeee 100%);
    background-repeat: repeat-x;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffff,endColorstr=#eeeeee,GradientType=0);
    -moz-border-radius: 5px 5px 5px 5px;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
}

4、 IE上显示不出箭头 修改
.tooltip {
    position: absolute;
    display: none;
    z-index: 9900000;
    outline: none;
    opacity: 1;
    /*filter: alpha(opacity=100); 注释掉此行代码可以IE上显示箭头 */
    padding: 5px;
    border-width: 1px;
    border-style: solid;
    border-radius: 5px;
    -moz-border-radius: 5px 5px 5px 5px;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
}
