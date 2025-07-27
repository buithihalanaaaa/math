/* todo
*order of caret move (i.e. order of focused mrow) should be adjusted case by case.

*/

/* note
*focused node must be mi(character), strucuture, or mrow(integration).

*/

$(function() {
	testDriver();
});



/*
test driver
print fixed mml
*/
var testDriver = function()
{
	//get target fo
	var svg = document.getElementById('queryView');
	var fo = document.getElementById('queryView-foreignObject');
	//set mml
	var mml;
	$.ajax({  
		url      :'./test.mml',  
		type     :'get',  
		dataType :'html',
		async    :false,
		success  :function(responce)
		{
			// mml = responce.firstElementChild;
			mml = $(responce)[0];
		},
		error    :function(XMLHttpRequest, textStatus, errorThrown) 
		{
			alert (
				'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
				'textStatus : '     + textStatus + '\n' +
				'errorThrown : '    + errorThrown.message 
			);
		},
	}); 
	fo.appendChild(mml);
	//test::set null rect
	setNullRect(mml.children[0].children[0].children[0]);
	//
	//
	//
	var tokenManager = TokenManager(mml.children[0], svg);
	//set caret
	var caretManager = CaretManager(fo, svg);
	caretManager.setCaret(tokenManager.token);//structure
	//
	//
	var rectangleSelectionManager = RectangleSelectionManager(svg, tokenManager.setMathMLIncludedSvg, tokenManager.setRectangleSelectedTokens);
	//
	//test::caretmove
	setKeyboardEventHandler(window, tokenManager, caretManager, rectangleSelectionManager);
	//
	$('.search').click(function(e){
		var queryString = createQueryString(mml);
		$('.query-string')[0].value = queryString;
		runMathRegexp(queryString);
	});
	//
	//
	return;
};





var runMathRegexp = function(queryString)
{	
    $('#matched').html('<br />');
    $('#num').html('<br />');	
    /*
      * query processing
      */
    var tokens = queryTokenize(queryString);//トークン列
    var parsedQuery = queryParse(tokens); //Onigmoパターン．parsedQueryは，queryとn(後方参照の数)の2つのプロパティから成る．
    if(!parsedQuery)
    {
        HTMLPrint.text('num', 'invalid query');
        return;
    }    
    // /*
    //   replacementを取得
    // */
    // var replacementString = $('#input_replacement').val();
    // var parsedReplacement = parseReplacement(replacementString, 0);
    /*
      * 数式集合を取得．
      */
    var targetsXMLDocument = loadXMLDoc("./test.xhtml");    
    /*********
      * ここから，検証(マッチング)．
      *********/
    //最初のmath要素を取得
    var targetMathElement = targetsXMLDocument.getNextNodeByLocalName("math");
    /*
      * 数式をすべてstr化
      */
    var strs = [];
    var nOfFormulae = 0; //数式の数
    while(targetMathElement)
    {
        var next = targetMathElement.getNextNodeByLocalName("math");
        if(nOfFormulae+1 )//テスト用．条件に'nOfFormulae+1===n'と書くと，n番の数式だけ処理できる．
        {
            normalizePmmlTree(targetMathElement); //正規化
            mathStr = createMathTreeString(targetMathElement); //数式木文字列化
            strs.push(mathStr); //保存
        }
        /*
          * 次の節をとる
          */
        targetMathElement = next;
        nOfFormulae++;
    }
    /*
      * 一括で処理
      */
    var rbFileName = '';
    // if(parsedReplacement === '')
    // {
        rbFileName = 'http://twatabe.com/public_html/cgi-bin/mreg/mreg.rb';//ハイライトのための処理
    // }
    // else
    // {
    //     rbFileName = 'http://twatabe.com/public_html/cgi-bin/mreg/replace.rb';//置換のための処理
    // }
    
    
    var results;
    $.ajax({
        type: 'POST',
        url:  rbFileName,
        async: false,
        traditional: true,
        data: {
            n: parsedQuery.n,
            originalQuery:queryString,
            query: parsedQuery.query,
            // replacement: parsedReplacement,
            math : strs,
        },
        success: function(json){
            results = json.results;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert (
                'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                'textStatus : '     + textStatus + '\n' +
                'errorThrown : '    + errorThrown.message
            );
        },
    });
    var nOfMatched = 0;  //マッチした式の数
    /*
      * 結果文字列を逆変換
      */
    for(var i=0; i<results.length; i++)
    {
        var tokens = tokenizeParsedString(results[i]);
        var replacedMath = buildMathMLFromParsedString(tokens, 0);

        HTMLPrint.text('matched',i+1 + ':');
        HTMLPrint.MathML('matched',replacedMath);
        HTMLPrint.br('matched');

    }
    /*
      * マッチした個数を出力．
      */
    // HTMLPrint.text('num', nOfMatched+' / '+nOfFormulae);
};




//
var setKeyboardEventHandler = function(element, tokenManager, caretManager, rectangleSelectionManager)
{
	// privates
	$(element).keypress(function(e){
		if(e.keyCode === 39)//right
		{
			tokenManager.moveToNextToken();
			caretManager.setCaret(tokenManager.token);
		}
		else if(e.keyCode === 37)//left
		{
			tokenManager.moveToPreviousToken();
			caretManager.setCaret(tokenManager.token);
		}
		else if(e.keyCode === 8)  //BS
		{
			tokenManager.deleteToken();
			caretManager.setCaret(tokenManager.token);
		}
		else if(e.keyCode === 46) //delete
		{
			alert('del');
		}
		else // insertion
		{
			//create element
			var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
			var textNode = document.createTextNode(String.fromCharCode(e.charCode));
			$(mi).addClass('character-node');
			mi.appendChild(textNode);

			tokenManager.insertToken(mi);
			caretManager.setCaret(tokenManager.token);
		}
		return;
	});


	$('.input-structure').click(function(e){
		var structure;		
		if($(e.target).hasClass('input-msub')||$(e.target).hasClass('input-msup')||$(e.target).hasClass('input-msubsup'))
		{
			if($(e.target).hasClass('input-msub'))				structure = createInitialStructure('msub');
			else if($(e.target).hasClass('input-msup'))			structure = createInitialStructure('msup');
			else if($(e.target).hasClass('input-msubsup'))		structure = createInitialStructure('msubsup');
		}
		else
		{
			if($(e.target).hasClass('input-munder'))			structure = createInitialStructure('munder');
			else if($(e.target).hasClass('input-mover'))		structure = createInitialStructure('mover');
			else if($(e.target).hasClass('input-munderover'))	structure = createInitialStructure('munderover');
			else if($(e.target).hasClass('input-msqrt'))		structure = createInitialStructure('msqrt');
			else if($(e.target).hasClass('input-mroot'))		structure = createInitialStructure('mroot');
			else if($(e.target).hasClass('input-mfrac'))		structure = createInitialStructure('mfrac');
			else if($(e.target).hasClass('input-mtable'))       structure = createInitialStructure('mtable');
		}
		tokenManager.insertToken(structure);
		caretManager.setCaret(tokenManager.token);
	});





	$('.input-zero-or-one').click(function(e){
		if($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('zero-or-one'))
		{
			tokenManager.peelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
			caretManager.setCaret(tokenManager.token);
		}
		else if($(tokenManager.token).hasClass('style-enclosing-regular-expression'))
		{
			tokenManager.labelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
		}
		else
		{
			tokenManager.createRectWithLabeling(tokenManager.labelZeroOrOne);
			caretManager.setCaret(tokenManager.token);
		}
	});
	$('.input-more').click(function(e){
		if($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('more'))
		{
			tokenManager.peelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
			caretManager.setCaret(tokenManager.token);
		}
		else if($(tokenManager.token).hasClass('style-enclosing-regular-expression'))
		{
			tokenManager.labelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
		}
		else
		{
			tokenManager.createRectWithLabeling(tokenManager.labelMore);
			caretManager.setCaret(tokenManager.token);
		}
	});
	$('.input-boolean-or').click(function(e){
		if($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('boolean-or'))
		{
			tokenManager.addContentToEnclosingRect(null, $(tokenManager.token).closest('.enclosing-regular-expression'));
		}
		else if($(tokenManager.token).hasClass('style-enclosing-regular-expression'))
		{
			tokenManager.labelBooleanOr($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
		}
		else
		{
			tokenManager.createRectWithLabeling(tokenManager.labelBooleanOr);
			caretManager.setCaret(tokenManager.token);			
		}
	});
	//
	$('.input-wildcard').click(function(e){
		// size calculation
		var radius = 0.3;
		var offset = 0.1;
		//
		var whsvg = 2*radius + (offset*2);
		var cxcy =  radius + offset;
		//
		var xl1 = radius + offset;
		var yl1 = offset;
		var xl2 = (1/Math.sqrt(2))*radius + radius + offset;
		var yl2 = -(1/Math.sqrt(2))*radius + radius + offset;
		var xl3 = (radius*2) + offset;
		var yl3 = radius + offset;
		//
		var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		mpadded.setAttribute('lspace',  '-0.02em');
		mpadded.setAttribute('width',   '-0.04em');
		mpadded.setAttribute('voffset', '-0.1em');
		$(mpadded).addClass('character-node');
		$(mpadded).addClass('wildcard');
		$(mpadded).addClass('regular-expression');
		//
		var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width',  whsvg+'em');
		svg.setAttribute('height', whsvg+'em');
		//		
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', cxcy+'em');
		circle.setAttribute('cy', cxcy+'em');
		circle.setAttribute('r',  radius+'em');
		circle.setAttribute('stroke', 'black');
		circle.setAttribute('fill', 'none');
		var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line1.setAttribute('x1', xl1+'em');
		line1.setAttribute('y1', yl1+'em');
		line1.setAttribute('x2', yl1+'em');
		line1.setAttribute('y2', xl1+'em');
		line1.setAttribute('stroke', 'black');
		var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line2.setAttribute('x1', xl2+'em');
		line2.setAttribute('y1', yl2+'em');
		line2.setAttribute('x2', yl2+'em');
		line2.setAttribute('y2', xl2+'em');
		line2.setAttribute('stroke', 'black');
		var line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line3.setAttribute('x1', xl3+'em');
		line3.setAttribute('y1', yl3+'em');
		line3.setAttribute('x2', yl3+'em');
		line3.setAttribute('y2', xl3+'em');
		line3.setAttribute('stroke', 'black');
		//
		mpadded.appendChild(mi);
		mi.appendChild(svg);
		svg.appendChild(circle);
		svg.appendChild(line1);
		svg.appendChild(line2);
		svg.appendChild(line3);
		//
		tokenManager.insertToken(mpadded);
		caretManager.setCaret(tokenManager.token);
	});

	$('.input-character-class').click(function(e){
		var mrow = tokenManager.createEnclosingRect();
		tokenManager.addContentToEnclosingRect(null, mrow);
		//
		$(mrow).addClass('character-class');
		var style = $(mrow).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-character-class');
		//
		tokenManager.insertToken(mrow);
		caretManager.setCaret(tokenManager.token);
	});

	$('.input-negated-character-class').click(function(e){
		var mrow = tokenManager.createEnclosingRect();
		tokenManager.addContentToEnclosingRect(null, mrow);
		//
		$(mrow).addClass('negated-character-class');
		var style = $(mrow).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-negated-character-class');
		//
		tokenManager.insertToken(mrow);
		caretManager.setCaret(tokenManager.token);
	});

	$('.input-capturing').click(function(e){
		if($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('capturing'))
		{
			tokenManager.peelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
			caretManager.setCaret(tokenManager.token);
		}
		else if($(tokenManager.token).hasClass('style-enclosing-regular-expression'))
		{
			tokenManager.labelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
		}
		else
		{
			tokenManager.createRectWithLabeling(tokenManager.labelCapturing);
			caretManager.setCaret(tokenManager.token);
		}
	});

	$('.input-backreference').click(function(e){
		var mrow = tokenManager.createEnclosingRect();
		tokenManager.addContentToEnclosingRect(null, mrow);
		//
		$(mrow).addClass('backreference');
		var style = $(mrow).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-backreference');
		//
		style.setAttribute('lspace', '0.1875em');
		style.setAttribute('width', '+0.375em');
		//
		tokenManager.insertToken(mrow);
		caretManager.setCaret(tokenManager.token);
	});




	$('#queryView').click(function(e){
		if(! $(e.target).closest('math')[0]) return;

		var forcused = $(e.target).closest('.character-node')[0];
		if(!forcused)
		{
			forcused = $(e.target).closest('.integration-node')[0];
		}

		tokenManager.setToken(forcused);
		caretManager.setCaret(tokenManager.token);
	});
	/*
	* 矩形選択開始時と終了時の処理をバインド．
	* 領域内でマウスダウンが発生したら矩形選択開始．
	* 領域内でマウスアップが発生するか，領域からマウスリーブしたら，矩形選択終了
	* 矩形選択中フラグが立っている時にマウスムーブが発生したら矩形を変形させていく．
	*/
	var mousedownFlag = false;
	$(rectangleSelectionManager.svg).mousedown(function(e){
		mousedownFlag = true;
		rectangleSelectionManager.rectangleSelectionStart(e);
		return;
	});
	$(rectangleSelectionManager.svg).mouseup(function(e){
		mousedownFlag = false;
		rectangleSelectionManager.rectangleSelectionEnd();
		return;
	});
	$(rectangleSelectionManager.svg).mouseleave(function(e){
		if(mousedownFlag)
		{
			mousedownFlag = false;
			rectangleSelectionManager.rectangleSelectionEnd();
		}
		return;
	});
	$(rectangleSelectionManager.svg).mousemove(function(e){
		if(mousedownFlag)
		{
			rectangleSelectionManager.rectangleSelectionMove(e);
		}
		return;
	});

	return;
};


















var RectangleSelectionManager = function(svg, startFunction, endFunction)
{
	var self = {};

	self.svg = svg;

	var rectParameter = {left:0, top:0, width:0, height:0,};//矩形選択の矩形の座標とサイズ．svgの命名規則はX，Yだけど，css風に，left, topにする．
	var start = {left:0, top:0,};//矩形選択が開始された座標
	var end   = {left:0, top:0,};//矩形選択が終了した(mousemove中の)座標
	var selectingFlag = false;

	//矩形選択における「矩形」のrectをつないでおく．
	var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('style', 'fill:none; stroke:blue; stroke-width:1;');
	svg.appendChild(rect);

	/*
	* 矩形選択開始時，終了時，矩形変形時に，矩形の座標とサイズを取得する等の処理を行う関数を用意する．
	* rectangleSelectionStart(): 矩形選択開始時の処理に関する関数．
	* rectangleSelectionEnd(): 矩形選択終了時の処理に関する関数．
	* rectangleSelectionMove(): 矩形選択中の処理に関する関数．
	*/
	self.rectangleSelectionStart = function(e)
	{
		/*
		* svg要素の位置を取得しておく．svg要素内のx,yを決定する際の基点として使う．
		* オフセットはここで取得．前もって取得してしまうとズレる．
		* offsetはgetBoundingClientRectでは取らない．math要素のoffsetはgetBoundingClientRectでは取れなくて，jqueryのoffsetで取るから，全部それに合わせておかないとズレる．
		*/
		var svgOffset = $(svg).offset();
		startFunction(svg);//矩形選択開始時の処理の関数を呼ぶ
		selectingFlag = true;
		start.left = e.pageX - svgOffset.left;
		start.top = e.pageY - svgOffset.top;
		return;
	};

	self.rectangleSelectionEnd = function()
	{
		if(selectingFlag)
		{
			endFunction(svg, rectParameter);//矩形選択終了時の処理の関数を呼ぶ．
			selectingFlag = false;                   //矩形選択中フラグを落とす
			//矩形選択用rectを消す
			rectParameter.width = 0;//rectParameterは矩形選択終了時に呼ばれる関数に渡されるので，整合性を保つために0にしておく．
			rectParameter.height = 0;
			rect.setAttribute("width", rectParameter.width);
			rect.setAttribute("height", rectParameter.height);
		}
		return;
	};

	self.rectangleSelectionMove = function(e)
	{
		/*
		* svg要素の位置を取得しておく．svg要素内のx,yを決定する際の基点として使う．
		* オフセットはここで取得．前もって取得してしまうとズレる．
		* offsetはgetBoundingClientRectでは取らない．math要素のoffsetはgetBoundingClientRectでは取れなくて，jqueryのoffsetで取るから，全部それに合わせておかないとズレる．
		*/
		var svgOffset = $(svg).offset();
		if(selectingFlag)
		{
			end.left = e.pageX - svgOffset.left;
			end.top = e.pageY - svgOffset.top;
			//矩形選択用の矩形のX,Y,width,heightを計算
			rectParameter.width  = end.left - start.left;
			rectParameter.height = end.top - start.top;
			if(rectParameter.width > 0)//右側にドラッグした場合
			{  
				rectParameter.left = start.left;
			}
			else //左側にドラッグした場合
			{
				rectParameter.left = end.left;
				rectParameter.width = -rectParameter.width;
			}
			//
			if(rectParameter.height > 0) //下側にドラッグした場合
			{
				rectParameter.top = start.top;
			}
			else //上側にドラッグした場合
			{                   
				rectParameter.top = end.top;
				rectParameter.height = -rectParameter.height;
			}
			//矩形選択用rect要素の属性値を変化させる．
			rect.setAttribute("x", rectParameter.left);
			rect.setAttribute("y", rectParameter.top);
			rect.setAttribute("width", rectParameter.width);
			rect.setAttribute("height", rectParameter.height);
		}
		return;
	};


	// disable character selection
	var disableSelection = function(target){
		if (typeof target.onselectstart!="undefined") //IE route
			target.onselectstart=function(){return false}
		else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
			target.style.MozUserSelect="none"
		else //All other route (ie: Opera)
			target.onmousedown=function(){return false}
		target.style.cursor = "default"
	};
	disableSelection(svg);

	return self;
};































