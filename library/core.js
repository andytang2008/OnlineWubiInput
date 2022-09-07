if (document.all && !document.getElementById) {
	document.getElementById = function(id) {
		return document.all[id];
	}
}

function on_load() {
	if (navigator.appName.indexOf('Microsoft') != -1) {
		browser = 'IE';
	} else if (navigator.appName.indexOf('Netscape') != -1) {
		browser = 'NS';
		document.getElementById("copyAll").value = "选择全文";
	} else {
	if (navigator.appName.indexOf('Opera') != -1) {
		browser = 'OP';
	}
	}
	document.form1.edit_area.focus();
	document.form1.shanchu.disabled = true;
	document.getElementById("code_field").innerHTML = "　";
	document.getElementById("list_area").innerHTML = "　";
}

var code_field = "";
var candidates = "";
code_len = 12;
code_table = new Array();
pattern = /[a-z';]+[^a-z';]+/g;
pattern.compile("[a-z';]+[^a-z';]+", "g");
// "raw" is defined in *-table.js
while (pattern.exec(raw) != null) code_table.push(RegExp.lastMatch);

word_list = new Array();
left_yinhao1 = false;
left_yinhao2 = false;
ctrl_keydown = false;
right_arrow = false;
cancel_key_event = false;
start_mem = -1;
index_mem = 0;
start_stack = new Array();
index_stack = new Array();
key_en = "1234567890abcdefghijklmnopqrstuvwxyz";
key_EN = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
key_quan = "１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ";
key_QUAN = "！＠＃＄％＾＆＊（）ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ";
fuhao = new Array();
fuhao[1] = "。，、；：？！…—·ˉˇ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝︵︶︹︺︿﹀︽︾﹁﹂﹃﹄︻︼︷︸︱︳︴";
fuhao[2] = "≈≡≠＝≤≥＜＞≮≯∷±＋－×÷／∫∮∝∞∧∨∑∏∪∩∈∵∴⊥∥∠⌒⊙≌∽√≒≦≧⊿";
fuhao[3] = "ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇①②③④⑤⑥⑦⑧⑨⑩㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩";
fuhao[4] = "￥￠￡℅℉㎡℃♂♀°′″¤‰§№☆★○●◎◇◆□■△▲▼▽◢◣◤◥※→←↑↓↖↗↘↙〓＿￣―☉⊕〒";
fuhao[5] = "─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▓▔▕";
fuhao[6] = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω";
fuhao[7] = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
fuhao[8] = "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü";
fuhao[9] = "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ˙ˊˇˋ";
fuhao[10] = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん";
fuhao[11] = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";

pattern.compile("[^a-z';]");
function search_code_table(str) {
	var start = -1;
	var low = 0;
	var high = code_table.length - 1;
	var str_len = str.length;
	while (low <= high) {
		var mid = Math.floor((low+high)/2);
		var code = code_table[mid].substr(0, code_table[mid].search(pattern));
		if (code.substr(0,str_len) == str) {
			start = mid;
			high = mid-1;
		}
		else if (code.substr(0,str_len) > str) high = mid-1;
		else low = mid+1;
	}
	return(start);
}

function create_word_list(start, index, str) {
	var str_len = str.length;
	var cnt = 1;
	var same_code_words = code_table[start].replace(/[a-z';]+/, '').split(',');
	candidates = "";
	while (cnt <= 10) {
		candidates += (cnt % 10) + '.' + same_code_words[index] + ' ';
		word_list[cnt-1] = same_code_words[index];
		++index;
		if (index >= same_code_words.length) {
			index = 0;
			++start;
			if (start >= code_table.length || code_table[start].substr(0, str_len) != str) {
				start = -1;
				break;
			}
			same_code_words = code_table[start].replace(/[a-z';]+/, '').split(',');
		}
		++cnt;
	}
	if (start > 0) {
		if (start_stack.length > 1) {
			candidates += '<PgUp  PgDn>';
		} else {
			candidates += ' PgDn>';
		}
	} else if (start_stack.length > 1) {
		//for (i=cnt+1; i<=10; i++) document.form1.list_area.value += '\n';
		candidates += '<PgUp';
	} else {
		candidates += '';//FIXME';
	}
	start_mem = start;
	index_mem = index;
	document.getElementById("list_area").innerHTML = candidates + "　"; 
}

function on_code_change(str){
	for (i=0;i<=9;i++) {
		word_list[i] = "";
	}
	candidates = "";
	start_stack = new Array();
	index_stack = new Array();
	if (str != "") {
		start = search_code_table(str);
		start_stack.push(start);
		index_stack.push(0);
		if (start >= 0) create_word_list(start, 0, str);
	}
	document.getElementById("code_field").innerHTML =  str + "　";
	document.getElementById("list_area").innerHTML =  candidates + "　";
}

function insert_char(str) {
	if (str == "") return;
	if (document.form1.diji.checked) {
		if (/==/.test(document.form1.edit_area.value)) {
			document.form1.edit_area.value = document.form1.edit_area.value.replace(/==/, str+"==");	
		} else {
			document.form1.edit_area.value += str;
		}
	} else {
		switch (browser) {
			case 'IE':
				var r = document.selection.createRange();
				r.text=str;
				r.select();
				break;
			case 'NS':
				var obj = document.form1.edit_area;
				var selectionStart = obj.selectionStart;
				var selectionEnd = obj.selectionEnd;
				var oldScrollTop = obj.scrollTop;
				var oldScrollHeight = obj.scrollHeight;
				var oldLen = obj.value.length;
				
				obj.value = obj.value.substring(0, selectionStart) + str + obj.value.substring(selectionEnd);
				obj.selectionStart = obj.selectionEnd = selectionStart + str.length;
				if (obj.value.length == oldLen) {
					obj.scrollTop = obj.scrollHeight;
				} else if (obj.scrollHeight > oldScrollHeight) {
					obj.scrollTop = oldScrollTop + obj.scrollHeight - oldScrollHeight;
				} else {
					obj.scrollTop = oldScrollTop;
				}
				break;
			default:
				document.form1.edit_area.value += str;
		}
	}
}

function key_down(e) {
	var key = e.which ? e.which : e.keyCode;
	//key_down(e);
	//key_press(e); //Andy Tang key_press will not work to insert in this location. 10-11-2014
	
	if (key!=33 && key!=57383 && key!=34 && key!=57384) {
		if (document.form1.select1.selectedIndex!=0 || document.form1.select2.selectedIndex!=0) {
			document.form1.select1.selectedIndex=0;
			document.form1.select2.selectedIndex=0;
		}
	}
	var key_char = String.fromCharCode(key);
	ctrl_keydown = false;
	switch (key) {
		// Backspace
		case 8:
			if (code_field != "") {
				var str = code_field;
				code_field = str.substr(0, str.length-1);
				on_code_change(code_field);
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
				
				return false;
			}
			return true;
		// Tab
		case 9:
			insert_char('　');
			cancel_key_event = true;
			key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
			
			document.getElementById("edit_area").click();	
			return false; 
		// Esc
		case 27:
			clear_all();
			cancel_key_event = true;
			key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
			return false;
		// PageUp
		case 33:
		case 57383:
			if (code_field != "") {
				if(start_stack.length > 1) {
					start_stack.pop();	index_stack.pop();
					create_word_list(start_stack[start_stack.length-1], index_stack[index_stack.length-1], code_field);
				}
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
				return false;
			}
/*			else if (getEl("iFrame").num != undefined) {
				if (getEl("iFrame").start > 0) {
					last_page();
					cancel_key_event = true;
					return false;
				}
			}*/
			return true;
		// PageDown
		case 34:
		case 57384:
			if (code_field != "") {
				if (start_mem != -1) {
					start_stack.push(start_mem);
					index_stack.push(index_mem);
					for(i=0; i<=9; i++) {
						word_list[i] = "";
					}
					create_word_list(start_mem, index_mem, code_field);
				}
				
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
				return false;
			}
			/*else if (getEl("iFrame").num != undefined) {
				if ((getEl("iFrame").shurufa=='bihua' && getEl("iFrame").num>100) || (getEl("iFrame").shurufa!='bihua' && getEl("iFrame").num>36)) {
					next_page();
					cancel_key_event = true;
					return false;
				}
			}*/
			return true;
		// Space
		case 32:
		
			if (code_field != "") {
				insert_char(word_list[0]);
				code_field = "";
				document.getElementById("code_field").innerHTML = "　";
				candidates = "";
				document.getElementById("list_area").innerHTML = "　";
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will only work to insert in this location. 10-11-2014
				return false;
			} 
			/*else if (getEl("iFrame").num != undefined) {
				insert_char(getEl("iFrame").words[0]);
				blank_page();
				cancel_key_event = true;
				return false;
			}*/
			
			return true;
		// Enter
		case 13:
			if (code_field!="") {
				//wait_message();
				//str = "getwords.php?shurufa="+shurufa+"&para2="+jianfan+"&para3="+code_field.toLowerCase()+"&start=0";
				//getEl("iFrame").location.replace(str);
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
				document.getElementById("edit_area").click();	
				return false;
			}
			return true;
			
		/*case 188:
			if (code_field != "") {
				code_field = "";
				document.getElementById("code_field").innerHTML = "　";
				candidates = "";
				document.getElementById("list_area").innerHTML = "　";
				cancel_key_event = true;
				key_press(e); //Andy Tang key_press will only work to insert in this location. 10-11-2014
				return false;
			} 
			return true;*/

			
		// Ctrl
		case 17:
		case 57402:
			ctrl_keydown = true;
			break;
			
		
		

	}
	document.getElementById("edit_area").click();	
	
	if (e.ctrlKey) return true;
	
	//Andy Tang, next paragraph is dealing with digital number input
	if (/\d/.test(key_char)) {   //judge whether the user input digital number from keyboard, if it is, run commands below
		if (e.shiftKey) {
			if (document.form1.full_shape.checked || document.form1.ch_en_switch[0].checked) {
				if (document.form1.ch_en_switch[0].checked && key_char=='4') insert_char('￥');
				else {
					pos = key_EN.indexOf(key_char);
					insert_char(key_QUAN.substr(pos,1));
				}
				cancel_key_event = true;
				return false;
			}
		} else {
			if (code_field == "") {
			/*	if (getEl("iFrame").num != undefined) {
					if(key_en.indexOf(key_char) < getEl("iFrame").num) {
						insert_char(getEl("iFrame").words[key_en.indexOf(key_char)]);
						blank_page();
					}
					cancel_key_event = true;
					return false;
				} else if (document.form1.full_shape.checked || document.form1.ch_en_switch[0].checked) {
					pos = key_EN.indexOf(key_char);
					insert_char(key_quan.substr(pos,1));
					cancel_key_event = true;
					return false;
				}*/
					if (document.form1.ch_en_switch[1].checked) {  //如果英文选中,
					     if (document.form1.full_shape.checked ){  //并且如果全角选中,输出全角中文数字
								pos = key_EN.indexOf(key_char);
								insert_char(key_quan.substr(pos,1));
								cancel_key_event = true;
								return false;
						 }else
						 {                                     //如果英文选中,半角选中,输入半角中文数字
								pos = key_EN.indexOf(key_char);
								insert_char(key_en.substr(pos,1));
								cancel_key_event = true;
								return false;							 
						 }
						 

					}
					
					
					
			} else {
				if (document.form1.ch_en_switch[0].checked) {
					insert_char(word_list[(9+parseInt(key_char))%10]);
					code_field = "";
					document.getElementById("code_field").innerHTML = "　";
					candidates = "";
					document.getElementById("list_area").innerHTML = "　";
					cancel_key_event = true;
						key_press(e); //Andy Tang 10-11-2014 prvent keyboard stuck after inputing digital number
					return false;
				}
			}
		}
		return true;
	}

	if (document.form1.full_shape.checked || document.form1.ch_en_switch[0].checked) {  //Andy Tang 全角选中 , 并且中文输入选中
//		if ((key>=186 && key<=192) || (key>=219 && key<=222) ) {
		if (key == 186 || (key>=188 && key<=192) || (key>=219 && key<=222) ) {  //coma and period and other sign in keyboard, Andy Tang 10-11-2014
			if (key == 186) {
				if (document.form1.ch_en_switch[0].checked) {
					if (e.shiftKey) insert_char('：');
					else if (code_field == "") insert_char('；');
					else return true;
				} else {
					insert_char( e.shiftKey ? '：' : '；' );
				}
			}
//			else if (key == 187) insert_char( e.shiftKey ? '＋' : '＝' );
			else if (key == 188) insert_char( e.shiftKey ? ((document.form1.ch_en_switch[0].checked)? '《' :'＜') : '，' );
			else if (key == 189) insert_char( e.shiftKey ? '＿' : '－' );
			else if (key == 190) insert_char( e.shiftKey ? ((document.form1.ch_en_switch[0].checked)? '》' :'＞') : (document.form1.ch_en_switch[0].checked)? '。' :'．');
			else if (key == 191) insert_char( e.shiftKey ? '？' : '／' );
			else if (key == 192) insert_char( e.shiftKey ? '～' : '｀' );
			else if (key == 219) insert_char( e.shiftKey ? '｛' : '［' );
			else if (key == 220) insert_char( e.shiftKey ? '｜' : (document.form1.ch_en_switch[0].checked)? '、' :'＼');
			else if (key == 221) insert_char( e.shiftKey ? '｝' : '］' );
			else {
				if (document.form1.ch_en_switch[0].checked) {
					if (e.shiftKey) insert_char( (left_yinhao2 = !left_yinhao2) ? '“' : '”' );
					else if (code_field == "") insert_char( (left_yinhao1 = !left_yinhao1) ? '‘' : '’' );
					else return true;
				} else {
					insert_char( e.shiftKey ? '＂' : '＇' );
				}
			}
				
			cancel_key_event = true;
			key_press(e); //Andy Tang 10-11-2014 prvent keyboard stuck after inputing digital number
			return false;
		}
		if (document.form1.ch_en_switch[1].checked && key == 187) {
			insert_char( e.shiftKey ? '＋' : '＝' );
			cancel_key_event = true;
			return false;
		}
	}    
	
	if (browser == 'NS') {
		if (document.form1.full_shape.checked || document.form1.ch_en_switch[0].checked) {
			if (key == 59) {  									 //符号:
				if (document.form1.ch_en_switch[0].checked) {
					if (e.shiftKey) insert_char('：');
					else if (code_field == "") insert_char('；');
					else return true;
				} else {
					insert_char( e.shiftKey ? '：' : '；' );
				}
				cancel_key_event = true;
				return false;
			}
			else if (key == 61) {							//符号_
				if (document.form1.ch_en_switch[1].checked) {
					insert_char( e.shiftKey ? '＋' : '＝' );
					cancel_key_event = true;
					return false;
				}
			}
			else if (key == 109) {							//符号-
				insert_char( e.shiftKey ? '＿' : '－' );
				cancel_key_event = true;
				return false;
			}
		}
	}

	right_arrow = (key == 39)? true : false;
	
	return(true);
}

function key_up(e) {
	var key = e.which ? e.which : e.keyCode;
	// Ctrl
	if (key == 17 || key == 57402) {
		if (ctrl_keydown == true) {
			if (document.form1.ch_en_switch[0].checked) {
				document.form1.ch_en_switch[1].checked = true;
				clear_all();
			}
			else document.form1.ch_en_switch[0].checked = true;
		}
	}
	return true;
}

function highlight_copy() {
	if (browser == 'IE') {
		str_len = document.form1.edit_area.value.length;
		document.form1.edit_area.value += '';
		range = document.form1.edit_area.createTextRange();
		range.execCommand("Copy");
		document.form1.edit_area.value = document.form1.edit_area.value.substr(0,str_len);
	} 
	document.form1.edit_area.select();
	document.execCommand("Copy");  //added by Andy 02-2019
}

function clear_all() {
	code_field = "";
	document.getElementById("code_field").innerHTML = "　";
	candidates = "";
	document.getElementById("list_area").innerHTML = "　";
}

function key_press(e) {
	var key = e.which ? e.which : e.keyCode;
	var key_char = String.fromCharCode(key);
	//alert(key_char); //added by andy for test
	if (browser == 'NS' || browser == 'OP') {
			//alert(key_char); //added by andy for test
		if (cancel_key_event) {
			//alert(key_char); // 在用鼠标点击button输入中文后,再用键盘输入中文,这行被执行了,执行的结果是从这个funnction return了,没有执行下面的(/[a-z';]/.test(key_char)语句.如果不用鼠标,直接用键盘输入中文,这行没有被执行. 在用鼠标输入中文后,用鼠标按了数字键后,要run cancel_key_event=false;
			cancel_key_event = false;
			return false;
		}
	}
	
	if (e.ctrlKey) return true; 
	
	if (/[A-Z]/.test(key_char)) {
		//alert(key_char);
		if (document.form1.ch_en_switch[1].checked) {
			if (document.form1.full_shape.checked) {
				pos = key_EN.indexOf(key_char)
				insert_char(key_QUAN.substr(pos,1));
				return false;
			}
			return true;
		}
		else key_char = key_char.toLowerCase();
	}
	
	if (/[a-z';]/.test(key_char) && !right_arrow) {
	//	if (/[a-z';]/.test(key_char)) {
		//alert(key_char);
		/*if (/[a-z]/.test(key_char) && getEl("iFrame").num != undefined) {
			if(key_en.indexOf(key_char) < getEl("iFrame").num) {
				insert_char(getEl("iFrame").words[key_en.indexOf(key_char)]);
				blank_page();
			}
			return false;
		}*/
		if (document.form1.ch_en_switch[1].checked) {
			if (document.form1.full_shape.checked) {
				pos = key_en.indexOf(key_char)
				insert_char(key_quan.substr(pos,1));
				return false;
			}
			return true;
		} else {
			if (code_field.length < code_len) {
				code_field += key_char;
				on_code_change(code_field);
			}
			return false;
		}
	}
	

	
	if (browser == 'NS' && (key == 47 || key == 63)) {
		if (document.form1.ch_en_switch[0].checked || document.form1.full_shape.checked) return false;
	}

	return true;
}





//**/***********************************************************************************************************************************************
//**************************************************************************************************************************************************
function keyprocessing(key) {
	//alert(key);
	//var key = e.which ? e.which : e.keyCode;
	//var key_char = String.fromCharCode(key);
	
	//alert(key); key is original letter or digit
	var xxkey=key.charCodeAt(0);
	//alert(xxkey); xxkey is the code of key
	
				switch (xxkey) {
					
					case 44:  //coma
						if (document.form1.full_shape.checked) {
							insert_char("，");
						}else{
							insert_char(",");
						}
						break;
					case 46:   //period
						if (document.form1.full_shape.checked) {
							insert_char("。");
						}else{
							insert_char(".");
						}
						break;	
					case 91:   //[
						if (document.form1.full_shape.checked) {
							insert_char("［");
						}else{
							insert_char("[");
						}
						break;	
					case 93:   //]
						if (document.form1.full_shape.checked) {
							insert_char("］");
						}else{
							insert_char("]");
						}
						break;	
					case 123:   //{
						if (document.form1.full_shape.checked) {
							insert_char("｛");
						}else{
							insert_char("{");
						}
						break;	
					case 125:   //}
						if (document.form1.full_shape.checked) {
							insert_char("｝");
						}else{
						insert_char("}");
						}
						break;	

					case 47:   //   slash
						if (document.form1.full_shape.checked) {
							insert_char("／");
						}else{
							insert_char("/");
						}
						break;	
					case 92:   // backslash
						if (document.form1.full_shape.checked) {
							insert_char("＼");
						}else{
							insert_char("\\");
						}
						break;		

					case 124:   //   pipe
						if (document.form1.full_shape.checked) {
							insert_char("｜");
						}else{
							insert_char("|");
						}
						break;	
					case 43:   // plus
						if (document.form1.full_shape.checked) {
							insert_char("＋");
						}else{
						insert_char("+");
						}
						break;	

					case 45:   //   minus
						if (document.form1.full_shape.checked) {
							insert_char("－");
						}else{
							insert_char("-");
						}
						break;	
					case 61:   // equal
						if (document.form1.full_shape.checked) {
							insert_char("＝");
						}else{
						insert_char("=");
						}
						break;						
					case 95:   //   underscore
						if (document.form1.full_shape.checked) {
							insert_char("＿");
						}else{
							insert_char("_");
						}
						break;	
					case 58:   // colon
						if (document.form1.full_shape.checked) {
							insert_char("：");
						}else{
						insert_char(":");
						}
						break;	
					case 59:   //   semicolon
						if (document.form1.full_shape.checked) {
							insert_char("＿");
						}else{
							insert_char(";");
						}
						break;	
					case 34:   // double quote
						if (document.form1.full_shape.checked) {
							insert_char(String.fromCharCode(34));
						}else{
						insert_char(String.fromCharCode(34));
						}
						break;							
					case 40:   //   left bracket
						if (document.form1.full_shape.checked) {
							insert_char("（");
						}else{
							insert_char("(");
						}
						break;	
					case 41:   // right bracket
						if (document.form1.full_shape.checked) {
							insert_char("）");
						}else{
						insert_char(")");
						}
						break;							
					case 60:   //   left bracket
						if (document.form1.full_shape.checked) {
							insert_char("＜");
						}else{
							insert_char("<");
						}
						break;	
					case 62:   // right bracket
						if (document.form1.full_shape.checked) {
							insert_char("＞");
						}else{
						insert_char(">");
						}
						break;							
					case 39:   //   single quote
						if (document.form1.full_shape.checked) {
							insert_char("＇");
						}else{
							insert_char("'");
						}
						break;	
					case 63:   // question mark
						if (document.form1.full_shape.checked) {
							insert_char("？");
						}else{
						insert_char("?");
						}
						break;							
					case 126:   //   tilde
						if (document.form1.full_shape.checked) {
							insert_char("～");
						}else{
							insert_char("~");
						}
						break;	
					case 96:   // backquote
						if (document.form1.full_shape.checked) {
							insert_char("｀");
						}else{
						insert_char("`");
						}
						break;	
					case 33:   //   exclamation
						if (document.form1.full_shape.checked) {
							insert_char("！");
						}else{
							insert_char("!");
						}
						break;	
					case 64:   // ambersat
						if (document.form1.full_shape.checked) {
							insert_char("＠");
						}else{
						insert_char("@");
						}
						break;						
					case 35:   //   pound
						if (document.form1.full_shape.checked) {
							insert_char("＃");
						}else{
							insert_char("#");
						}
						break;	
					case 36:   // dollar
						if (document.form1.full_shape.checked) {
							insert_char("＄");
						}else{
						insert_char("$");
						}
						break;	
					case 37:   //   percent
						if (document.form1.full_shape.checked) {
							insert_char("％");
						}else{
							insert_char("%");
						}
						break;	
					case 94:   // caret
						if (document.form1.full_shape.checked) {
							insert_char("＾");
						}else{
						insert_char("^");
						}
						break;
					case 38:   //   Ampersand
						if (document.form1.full_shape.checked) {
							insert_char("＆");
						}else{
							insert_char("&");
						}
						break;	
					case 42:   // asterisk
						if (document.form1.full_shape.checked) {
							insert_char("＊");
						}else{
						insert_char("*");
						}
						break;						
						
						
					case 8:  //backspace
						if (code_field != "") {
							var str = code_field;
							code_field = str.substr(0, str.length-1);
							on_code_change(code_field);
							//cancel_key_event = true; //why this line is setup as true
								cancel_key_event = false; // Andy set it up as fase at Feb 2018
							//key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
							document.getElementById("edit_area").click();
							return false;
						}else{
							Backspace();
							cancel_key_event = false;
							document.getElementById("edit_area").click();
							return false;
							//insert_char(String.fromCharCode(8));
							//no codes works in simulating the delete button

						}
						break;
					case 13:  //enter key
						if (code_field!="") {
							//wait_message();
							//str = "getwords.php?shurufa="+shurufa+"&para2="+jianfan+"&para3="+code_field.toLowerCase()+"&start=0";
							//getEl("iFrame").location.replace(str);
							//insert_char(String.fromCharCode(13));
							cancel_key_event = false;
							//key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
							return false;
						}else
						{
							insert_char(String.fromCharCode(13));
							cancel_key_event = false;
							//key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
							document.getElementById("edit_area").click();
							return false;
						}
						return true;
						break;
								

					case 32:  //space key is pressed
					//	alert(xxkey);
								if (code_field != "") {
									insert_char(word_list[0]);
									code_field = "";
									document.getElementById("code_field").innerHTML = "　";
									candidates = "";
									document.getElementById("list_area").innerHTML = "　";
									cancel_key_event = true;//why this line is setup as true
									cancel_key_event = false;//Andy set it up as fase at Feb 2018
									document.getElementById("edit_area").click();	
									//key_press(e); //Andy Tang key_press will only work to insert in this location. 10-11-2014
									return false;
								} else{
									
									insert_char(" ");
									document.getElementById("edit_area").click();
									
								}
									
								/*else if (getEl("iFrame").num != undefined) {
									insert_char(getEl("iFrame").words[0]);
									blank_page();
									cancel_key_event = true;
									return false;
								}*/
				        break;
						
					case 501:  //page down is pressed
						// alert(xxkey);
								if (code_field != "") {
									if (start_mem != -1) {
										start_stack.push(start_mem);
										index_stack.push(index_mem);
										for(i=0; i<=9; i++) {
											word_list[i] = "";
										}
										create_word_list(start_mem, index_mem, code_field);
									}
									
									cancel_key_event = true;
									key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
									return false;
								}
								/*else if (getEl("iFrame").num != undefined) {
									if ((getEl("iFrame").shurufa=='bihua' && getEl("iFrame").num>100) || (getEl("iFrame").shurufa!='bihua' && getEl("iFrame").num>36)) {
										next_page();
										cancel_key_event = true;
										return false;
									}
								}*/
								break;
							
						case 502:  // PageUp
							if (code_field != "") {
								if(start_stack.length > 1) {
									start_stack.pop();	index_stack.pop();
									create_word_list(start_stack[start_stack.length-1], index_stack[index_stack.length-1], code_field);
								}
								cancel_key_event = true;
								key_press(e); //Andy Tang key_press will work to insert in this location. 10-11-2014
								return false;
							}
				/*			else if (getEl("iFrame").num != undefined) {
								if (getEl("iFrame").start > 0) {
									last_page();
									cancel_key_event = true;
									return false;
								}
							}*/
							break;	
	
						case 9: //tab is pressed
								insert_char('	');
								cancel_key_event = true;
								document.getElementById("edit_area").click();	
								return false; 
								break;
								
						case 555: //delete button is pressed
						    Delete();
							cancel_key_event = false;
							document.getElementById("edit_area").click();
							return false;
							break;
						case 556: //paste button, used to paste from textarea internal
						           // alert(myGlobalVariable);
							var textarea = document.getElementById('edit_area');
							var currentPos = getCaret(textarea); 
							
							
							var myGlobalVariable_length=myGlobalVariable_copy.length;
								 // alert(myGlobalVariable_length);
								
									var textarea = document.getElementById('edit_area');
							var currentPos = getCaret(textarea); 
						  //   alert(currentPos);
							//var text = $(textarea).text();
							var text = textarea.value;
							//alert(text);
							var xSpace = text.substr(0, currentPos) + myGlobalVariable_copy + text.substr(currentPos, text.length);

							//$(textarea).text(backSpace);
							textarea.value=xSpace;
							//alert("middle");
							//alert(currentPos);
							//alert(currentPos + myGlobalVariable_length);
							var mm=resetCursor(textarea, currentPos + myGlobalVariable_length);
							cancel_key_event = false;
							document.getElementById("edit_area").click();
							return false;
							break;
						case 557: //paste button, used to paste from textarea internal
						           // alert(myGlobalVariable);
							var textarea = document.getElementById('edit_area');
							var currentPos = getCaret(textarea); 

							var mm=resetCursor(textarea, currentPos + myGlobalVariable_length);
							cancel_key_event = false;
							jQuery(document).on('paste', function() {alert('text pasted!')});
							document.getElementById("edit_area").click();
							return false;

							
							
								return true;
					//return false;	
				}	

				
			document.getElementById("edit_area").click();	
				
			var key_char=key;
			if (/\d/.test(key_char)) {  //判断是否输入的是数字, 如果是的话,执行以下语句
						if (code_field == "") {  //如果中文字词备选栏是空的话,输入数字
							if (document.form1.full_shape.checked) { //如果全角打开,输入全角数字
									pos = key_EN.indexOf(key_char);
									insert_char(key_quan.substr(pos,1));
									document.getElementById("edit_area").click();
							}else          //如果半角打开的话,输入半角数字
							{
									pos = key_EN.indexOf(key_char);
									insert_char(key_en.substr(pos,1));	
									document.getElementById("edit_area").click();
							}

						} else {               //如果中文字词备选栏有待输入字词,用数字来选择它们
							if (document.form1.ch_en_switch[0].checked) {   //如果中文输入打开的话,执行以下语句
								insert_char(word_list[(9+parseInt(key_char))%10]);
								code_field = "";
								document.getElementById("code_field").innerHTML = "　";
								candidates = "";
								document.getElementById("list_area").innerHTML = "　";
										document.getElementById("edit_area").click();
										
								//cancel_key_event = true;// if it is true, it will cause when we key in the key through keyboard, there is no response in textarea.
								cancel_key_event = false;  //Andy changed this value to false at Feb 2018
								//key_press(e);
									//key_press2(e); //Andy Tang 10-11-2014 prvent keyboard stuck after inputing digital number
								return false;
								//return true;
							}
						}
			}
			
			document.getElementById("edit_area").click();  //garantee to send click manipulation to form so that form can recalculate the caret or cusor location. Andy 02-2019
	
	var key_char =key
	//alert(key_char);
	//pos = key_en.indexOf(key_char)
	//alert(pos);
//	if (/[A-Z]/.test(key_char)) {
	if (/[a-z]/.test(key_char)) {   //判断是否输入的是小写字母,是的话,执行以下语句
		pos = key_en.indexOf(key_char)
			//alert(pos);
			// below display the letters key in the left side of the 全角半角切换
			if (document.form1.ch_en_switch[0].checked) {     //如果中文输入选项被checked,无论是upper case 或者lower case,准备输入中文
						if (code_field.length < code_len) {
						code_field += key_char;
						on_code_change(code_field);
								document.getElementById("edit_area").click();
						}
			//alert(key_QUAN.substr(pos,1));
			
			}
					//	insert_char2(key_QUAN.substr(pos,1));
					
			if (document.form1.ch_en_switch[1].checked) {  //查看是不是英文切换打开 如果英文输入打开的话，执行下面语句
					if (document.form1.full_shape.checked) {  //如果全角打开，输入全角lower case 英文
						pos = key_en.indexOf(key_char)
						insert_char(key_quan.substr(pos,1));
								document.getElementById("edit_area").click();
						return false;
					}
					else　　　　　　　　　　　　　　　　　　　//如果全角关闭,输入半角lower case英文
					{
						pos = key_en.indexOf(key_char)
						insert_char(key_en.substr(pos,1));
								document.getElementById("edit_area").click();
						return false;				
						
					}	
					
					return true;
			} 
				
				//如果英文输入关闭的话,执行下面语句,不care是否全角半角打开
			/**	else {                                      
					if (code_field.length < code_len) {
						code_field += key_char;
						on_code_change(code_field);
					}
					return false;
				}*/
				
			
		}
		
		
		
		
	if (/[A-Z]/.test(key_char)) {   //判断是否输入的是大写字母,是的话,执行以下语句
	
	     pos = key_EN.indexOf(key_char)
			//alert(pos);
			// below display the letters key in the left side of the 全角半角切换
			if (document.form1.ch_en_switch[0].checked) {     //如果中文输入选项被checked,无论是upper case 或者lower case,准备输入中文
					   key_char=key_char.toLowerCase();
						if (code_field.length < code_len) {
						code_field += key_char;
						on_code_change(code_field);
								document.getElementById("edit_area").click();
						}
			//alert(key_QUAN.substr(pos,1));
			
			}
					//	insert_char2(key_QUAN.substr(pos,1));
					
			if (document.form1.ch_en_switch[1].checked) {  //查看是不是英文切换打开 如果英文输入打开的话，执行下面语句
			    key_char=key_char.toUpperCase();
					if (document.form1.full_shape.checked) {  //如果全角打开，输入全角upper case 英文
						pos = key_EN.indexOf(key_char)
						insert_char(key_QUAN.substr(pos,1));
								document.getElementById("edit_area").click();
						return false;
					}
					else　　　　　　　　　　　　　　　　　　　//如果全角关闭,输入半角upper case英文
					{
						pos = key_EN.indexOf(key_char)
						insert_char(key_EN.substr(pos,1));
								document.getElementById("edit_area").click();
						return false;				
						
					}	
					return true;
			} 
				
				//如果英文输入关闭的话,执行下面语句,不care是否全角半角打开
			/**	else {                                      
					if (code_field.length < code_len) {
						code_field += key_char;
						on_code_change(code_field);
					}
					return false;
				}*/
			
		}
	
		
	
}
