//まとめられる部分はwhileループなどでまとめよう

// 学習項目を追加したい時
// 1. 検索したいものを表す数式を、ワイルドカードや後方参照を用いつつ作り、firefoxで「要素を検証」やりつつsearchする
// 2. bookmarkletSubWindow.jsの292行目辺りのconsole.log二つにより、以下で使う「original」「conceptQuery(Objectの中身)」が何か分かる。
// 3. コピペした後に中身を書き換え。この時、\を\\に変換する。 cf. 「\\\\」は「\\\\\\\\」に変換する
// 4. outputStringを、抽出したい学習項目の名前に書き換え。

var extractingConcepts = function(query) {
    var tokens = queryTokenize(query);//トークン列
    var parsedQuery = queryParse(tokens); //Onigmoパターン．parsedQueryは，queryとn(後方参照の数)の2つのプロパティから成る．
    var strs = [];

    var outputString = "抽出した学習項目：";
    
    var num;
    var original;
    var conceptQuery;
    
    num = 9;
    original = '\\table{\\tr{\\td{(.)+}}{\\td{((.)+)}}{\\td{((.)+)}}}{\\tr{\\td{\\2}}{\\td{(.)+}}{\\td{((.)+)}}}{\\tr{\\td{\\4}}{\\td{\\7}}{\\td{(.)+}}}';
    
    //検索したいやつの文字列版が入るらしい
    conceptQuery = '(?<c0>/::::::::::::::/{/:::::::::::::/{/:::::::::::/{((?<c1>(?<arb>(?<arbc>[^{}:/\\\\]|/(?![{}:])|\\\\{|\\\\}|\\\\:|\\\\\\\\)|(?<arbm>/:+(/{(\\g<arbc>|\\g<arbm>)*/})+))))+/}/}/{/:::::::::::/{(?<c2>((?<c3>\\g<arb>))+)/}/}/{/:::::::::::/{(?<c4>((?<c5>\\g<arb>))+)/}/}/}/{/:::::::::::::/{/:::::::::::/{\\k<c2>/}/}/{/:::::::::::/{((?<c6>\\g<arb>))+/}/}/{/:::::::::::/{(?<c7>((?<c8>\\g<arb>))+)/}/}/}/{/:::::::::::::/{/:::::::::::/{\\k<c4>/}/}/{/:::::::::::/{\\k<c7>/}/}/{/:::::::::::/{((?<c9>\\g<arb>))+/}/}/})';

    strs.push(parsedQuery.query);
    console.log(strs);
    if(!parsedQuery)
    {
        HTMLPrint.text('num', 'invalid query');
        return;
    }
    var rbFileName = 'http://18.221.189.220/~ubuntu/hcii2015_new/mreg.rb';

    var results;
    $.ajax({
        type: 'POST',
        url:  rbFileName,
        async: false,
        traditional: true,
        data: {
            n: num,
            originalQuery: original,
            query:conceptQuery,
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
    console.log(results);
    if(results[0].indexOf('/::::::::::/') != -1){
      console.log("あった");
      outputString += "対称行列 ";
    }






// 追加時はここから





    num = 9;
    //検索したいやつの文字列版が入る
    original = '(c=πd|(L=2πr|l=(2πr|π(d|D))))';
    
    //検索したいやつの文字列版が入る
    conceptQuery = '(?<c0>(?<c1>c=πd|(?<c2>L=2πr|l=(?<c3>2πr|π(?<c4>d|D)))))';

    strs.push(parsedQuery.query);
    console.log(strs);
    if(!parsedQuery)
    {
        HTMLPrint.text('num', 'invalid query');
        return;
    }

    $.ajax({
        type: 'POST',
        url:  rbFileName,
        async: false,
        traditional: true,
        data: {
            n: num,
            originalQuery: original,
            query:conceptQuery,
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
    console.log(results);
    if(results[0].indexOf('/::::::::::/') != -1){
      console.log("あった");
      outputString += "円周の公式 ";
    }









    num = 9;
    //検索したいやつの文字列版が入る
    original = '(tanh|tgh)';
    
    //検索したいやつの文字列版が入る
    conceptQuery = '(?<c0>(?<c1>tanh|tgh))';

    strs.push(parsedQuery.query);
    console.log(strs);
    if(!parsedQuery)
    {
        HTMLPrint.text('num', 'invalid query');
        return;
    }

    $.ajax({
        type: 'POST',
        url:  rbFileName,
        async: false,
        traditional: true,
        data: {
            n: num,
            originalQuery: original,
            query:conceptQuery,
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
    console.log(results);
    if(results[0].indexOf('/::::::::::/') != -1){
      console.log("あった");
      outputString += "双曲線正接 ";
    }


    num = 9;
    //検索したいやつの文字列版が入る
    original = '\\sqrt{((.)+)\\+((.)+)\\+2\\sqrt{\\1([×⋅])?\\3}}=\\sqrt{\\1}\+\\sqrt{\\3}';
    
    //検索したいやつの文字列版が入る
    conceptQuery = '(?<c0>/:::/{(?<c1>((?<c2>(?<arb>(?<arbc>[^{}:/\\\\]|/(?![{}:])|\\\\{|\\\\}|\\\\:|\\\\\\\\)|(?<arbm>/:+(/{(\\g<arbc>|\\g<arbm>)*/})+))))+)\\+(?<c3>((?<c4>\\g<arb>))+)\\+2/:::/{\\k<c1>((?<c5>[×⋅]))?\\k<c3>/}/}=/:::/{\\k<c1>/}\\+/:::/{\\k<c3>/})';

    strs.push(parsedQuery.query);
    console.log(strs);
    if(!parsedQuery)
    {
        HTMLPrint.text('num', 'invalid query');
        return;
    }

    $.ajax({
        type: 'POST',
        url:  rbFileName,
        async: false,
        traditional: true,
        data: {
            n: num,
            originalQuery: original,
            query:conceptQuery,
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
    console.log(results);
    if(results[0].indexOf('/::::::::::/') != -1){
      console.log("あった");
      outputString += "二重根号を外す ";
    }


    nwin = window.open("", "特徴抽出結果","width=480,height=300");
    nwin.document.open();
    nwin.document.write("<HTML><HEAD>");
    nwin.document.write("<TITLE>特徴抽出結果</TITLE>");
    nwin.document.writeln("<BODY>");
    nwin.document.writeln(outputString);
    nwin.document.write("</BODY></HTML>");
    nwin.document.close();


}