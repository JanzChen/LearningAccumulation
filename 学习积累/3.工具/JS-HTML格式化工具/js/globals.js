var AjaxLite = {
    Browser: {
        IE:     !!(window.attachEvent && !window.opera),
        Opera:  !!window.opera,
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
    },
    IE: __getIE(),
    mode:{
        Post:   "Post",
        Get:    "Get"
    },
    getRequest:function()
    {
        if(window.XMLHttpRequest)
        {
            return new XMLHttpRequest();
        }
        else
        {
            try{
                return new ActiveXObject("MSXML2.XMLHTTP"); 
            }
            catch(e)
            {
                try{
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch(e)
                {
                    return false;
                }
            }
        }
    }
}

function __getIE(){
    if(window.ActiveXObject)
    {
       var v=navigator.userAgent.match(/MSIE ([^;]+)/)[1];
       return parseFloat(v.substring(0,v.indexOf("."))); 
    }
    return false;
}

Object.prototype.inherit = function(src)
{
    for(var p in src)
    {
        this[p] = src[p];
    }
    return this;
}
Array.prototype.foreach = function(func)
{
    if(func&&this.length>0)
    {
        for(var i=0;i<this.length;i++)
        {
            func(this[i]);
        }
    }
}
String.format = function()
{
    if(arguments.length==0)
        return null;
    var str = arguments[0];
    for(var i=1;i<arguments.length;i++)
    {
      var regExp = new RegExp('\\{' + (i-1) + '\\}','gm');
      str = str.replace(regExp,arguments[i]);
    } 
    return str;
}
String.prototype.startWith = function(s)
{
    return this.indexOf(s) == 0;
}
String.prototype.startWith = function(s)
{
    var d = this.length - s.length;
    return (d >= 0 && this.lastIndexOf(s) === d);
}
String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, '');
}
function getid(id)
{
    return (typeof id == 'string')?document.getElementById(id):id; 
}
document.getElementsByIDs = function(id)
{
    if(arguments.length>1)
    {
        var els = [];
        for(var i=0;i<arguments.length;i++)
        {
            els.push(new Element(arguments[i]));
        }
        return els;
    }
    return new Element(id)
}
var $ = document.getElementsByIDs;
document.getElementsByClassName=function(name)
{
    var tags = document.getElementsByTagName('*')||document.all;
    var els = [];
    for(var i=0;i<tags.length;i++)
    {
        if(tags[i].className)
        {
            var cs = tags[i].className.split(' ');
            for(var j=0;j<cs.length;j++)
            {
                if(name == cs[j])
                {
                    els.push(tags[i]);
                    break;
                }
            }
        }
    }
    return els;
}
var getby = document.getElementsByClassName;
function Element(id){
    this.inherit(getid(id));
}
Element.prototype.getText = function()
{
    if(AjaxLite.IE)
    {
        return this.innerText;
    }
    return this.textContent;
}
Element.prototype.getAtt = function(n)
{
    return this.attributes[n];
}
Element.prototype.getValue = function(n)
{
    var att = this.getAtt(n);
    if(att)
        return att.value;
    return null;
}
Element.copy = function(id)
{
    try{
       var obj = getid(id);
       obj.focus();
       obj.select();
       var cid = obj.createTextRange();
       cid.execCommand("Copy");
    }catch(e){}
}
function Cookie(){}
Cookie.save = function(n, v, mins, dn, path)
{
    if(n)
    {
	    if(!mins) mins = 365 * 24 * 60;
		if(!path) path = "/";
	    var date = new Date();
	    date.setTime(date.getTime() + (mins * 60 * 1000));
	    var expires = "; expires=" + date.toGMTString();
	    if(dn) dn = "domain=" + dn + "; ";
	    document.cookie = name + "=" + value + expires + "; " + dn + "path=" + path;
    }
}
Cookie.del = function(n)
{
    save(n,'',-1);
}
Cookie.get = function(n)
{
    var name = n + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i<ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}
function $post(url)
{
///<summary>发送表单。</summary>
///<param name="url" type="String">要发送的对方网页地址。</param>
///<param name="k" type="Stirng">发送表达Input的name属性值，服务端接收使用。</param>
///<param name="v" type="String">要发送的值。</param>
    document.forms[0].action = url;
    document.forms[0].method = 'post';
    if(arguments.length>1)
    {
        for(var i=1;i<arguments.length;i++)
        {
            var ipt = document.createElement('INPUT');
            ipt.name = arguments[i].k;
            ipt.type = 'text';
            ipt.style.display = 'none';
            ipt.value = arguments[i].v;
            document.forms[0].appendChild(ipt);
        }
    }
    document.forms[0].submit();
}
function $postb(url)
{
///<summary>发送表单。</summary>
///<param name="url" type="String">要发送的对方网页地址。</param>
///<param name="k" type="Stirng">发送表达Input的name属性值，服务端接收使用。</param>
///<param name="v" type="String">要发送的值。</param>
    document.forms[0].action = url;
    document.forms[0].method = 'post';
    document.forms[0].target = '_blank';
    if(arguments.length>1)
    {
        for(var i=1;i<arguments.length;i++)
        {
            var ipt = document.createElement('INPUT');
            ipt.name = arguments[i].k;
            ipt.type = 'text';
            ipt.style.display = 'none';
            ipt.value = arguments[i].v;
            document.forms[0].appendChild(ipt);
        }
    }
    document.forms[0].submit();
}