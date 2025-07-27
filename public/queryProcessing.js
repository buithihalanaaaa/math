$(function() {

    $('#process').click(function()
    {
        clear();//まず表示をぜんぶ消す．
        /*
          * クエリを取得
          */
        var queryString   = $('#input_query').val();//クエリの文字列
        var tokens = queryTokenize(queryString);//トークン列
        var parsedQuery = queryParse(tokens); //Onigmoパターン．parsedQueryは，queryとn(後方参照の数)の2つのプロパティから成る．
        if(!parsedQuery)
        {
            HTMLPrint.text('num', 'invalid query');
            return;
        }
        
        /*
          replacementを取得
        */
        var replacementString = $('#input_replacement').val();
        var parsedReplacement = parseReplacement(replacementString, 0);
        
        /*
          * 数式集合を取得．
          */
        var targetsXMLDocument = loadXMLDoc("test.xhtml");
        // var targetsXMLDocument = loadXMLDoc("debug.xhtml");
        // var targetsXMLDocument = loadXMLDoc("word2007m.xhtml");
        
        
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
        if(parsedReplacement === '')
        {
            rbFileName = 'mreg.rb';//ハイライトのための処理
        }
        else
        {
            rbFileName = 'replace.rb';//置換のための処理
        }
        
        
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
                replacement: parsedReplacement,
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

        // console.profileEnd();
        /*
          * マッチした個数を出力．
          */
        HTMLPrint.text('num', nOfMatched+' / '+nOfFormulae);
    });




    $('#clear').click(function(){
        clear();
    });


    var clear = function()
    {
        // document.getElementById('processed_query1').value = '';
        // document.getElementById('processed_query2').value = '';


        $('#matched').html('<br />');
        $('#num').html('<br />');
        $('#debug1').html('<br />');
        $('#debug2').html('<br />');
    }


});








