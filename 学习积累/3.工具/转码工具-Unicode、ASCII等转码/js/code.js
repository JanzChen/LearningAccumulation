function Native2Unicode() {
	var a_s=$("#a_source").val();
	if ('' == a_s) { 
    	alert('请输入Native字符串'); 
    	return; 
	}
	$("#n_source").val('');
	var msg='';
	for (var i=0; i<$("#a_source").val().length; i++){
		msg+='&#' + a_s.charCodeAt(i) + ';';
	}
	$("#n_source").val(msg);	
}

//Unicode 转换 Native
function Unicode2Native() { 
	var code = $("#n_source").val().match(/&#(\d+);/g);
	if (code == null) { 
    	alert('请输入正确的Unicode代码！'); $("#u_source").focus();
    	return; 
	}
	var msg='';
	$("#a_source").val('');
	for (var i=0; i<code.length; i++){
	  msg+=String.fromCharCode(code[i].replace(/[&#;]/g, ''));
	}
    $("#a_source").val(msg);
}

//native 转换 utf8
function Native2UTF8() {
	
	var a_s=$("#a_source").val();
	if ('' == a_s) { 
    	alert('请输入Native字符串'); 
    	return; 
	}
	$("#n_source").val(a_s.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") }));
	//$("#n_source").val(a_s.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") }));
}

//UTF-8 转换 Native
function UTF82Native() { 
	var code = $("#n_source").val();
	$("#a_source").val(unescape(code.replace(/&#x/g, '%u').replace(/;/g, '')));
}

function native2ascii(){
	var character=document.getElementById("a_source").value.split("");
	var ascii="";
	for(var i=0;i<character.length;i++){
		var code=Number(character[i].charCodeAt(0));
		if(!document.getElementById("ignoreLetter").checked||code>127){
			var charAscii=code.toString(16);
			charAscii=new String("0000").substring(charAscii.length,4)+charAscii;
			ascii+="\\u"+charAscii;
		}
		else{
			ascii+=character[i];
		}
	}
	document.getElementById("n_source").value=ascii;
}
function ascii2native(){
	var character=document.getElementById("n_source").value.split("\\u");
	var native1=character[0];
	for(var i=1;i<character.length;i++){
		var code=character[i];
		native1+=String.fromCharCode(parseInt("0x"+code.substring(0,4)));
		if(code.length>4){
			native1+=code.substring(4,code.length);
		}
	}
	document.getElementById("a_source").value=native1;
}

function encode_uri() {
	if($("#co_t").attr("checked"))
		$("#n_source").val(encodeURIComponent($("#a_source").val()));
	else
		$("#n_source").val(encodeURI($("#a_source").val()));
}

function decode_uri() { 
	if($("#co_t").attr("checked"))
		$("#a_source").val(decodeURIComponent($("#n_source").val()));
	else
		$("#a_source").val(decodeURI($("#n_source").val()));
}
