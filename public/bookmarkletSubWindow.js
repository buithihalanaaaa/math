/* todo
*order of caret move (i.e. order of focused mrow) should be adjusted case by case.
*/

/* note
*focused node must be mi(character), strucuture, or mrow(integration).
*/



var name;

var extractionNum = 6; // 学習項目抽出結果ウィンドウで検索する内容の数だけ、配列を定義したい。今は微分・行列・二次式の3種類それぞれの方程式と不等式の2パターンで3*2=6を定義
//var extractionFlag[extractionNum]; //extractionFlag[0]が微分方程式のフラグ、extractionFlag[1]が行列方程式のフラグ…と定義。学習項目抽出のところで使う.
var extractionFlag = new Array();
//図形の学習項目抽出結果ウィンドウで検索する内容の今は直線・円形・放物線・楕円・分子関数・対数関数・指数関数・無理関数・などを17パターンで定義
var extractionNum_zukei = 17;
var extractionFlag_zukei = new Array();
var select2;
var selectZukei;
var resetNum = 0;
var resetNum_zukei = 0;

while (resetNum < extractionNum) { //配列の値を全て初期化
    extractionFlag[resetNum] = 0;
    resetNum++;
}
while (resetNum_zukei < extractionNum_zukei) { //配列の値を全て初期化
    extractionFlag_zukei[resetNum_zukei] = 0;
    resetNum_zukei++;
}
var koushikiSearchFlag = 0;
var table_count = 0;
var jikken_flag = 0;
var replaceMath_jikken = new Array();

$(function() {
    var parameter = window.location.search.substring(1);
    // if(parameter === '')
    // {
    //  alert('urlの末尾に，「?name=名前」という形式で，お名前を入力してください．');
    //  return;
    // }
    // name = parameter.split('=')[1];

    // $.ajax({
    //     type: 'POST',
    //     url:  'logging.rb',
    //     async: false,
    //     traditional: true,
    //     contentType: 'application/json', // リクエストの Content-Type
    //     dataType: "json",           // レスポンスをJSONとしてパースする
    //     data: {
    //         name  : $('#ques')[0].firstChild.nodeValue + name,
    //         query : 'access!!!!',
    //     },
    //     success: function(json){
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //         alert('保存に失敗しました．通信環境をご確認の上，再度お試しください．');
    //     },
    // });


    testDriver();
});

/*
test driver
print fixed mml
*/


function WikipediaAPI() {
    //検索語
    var query = '数学';
    //API呼び出し
    $.ajax({
        url: 'http://wikipedia.simpleapi.net/api',
        data: {
            output: 'json',
            keyword: query
        },
        type: 'GET',
        dataType: 'jsonp', //Access-Control-Allow-Origin対策
        timeout: 1000,

        //var fs = WScript.CreateObject("Scripting.FileSystemObject");
        //var file = fs.CreateTextFile("wiki_test.txt");
        success: function(json) {
            if (json != null && json.length > 0) {
                //$('#word').html('');
                //結果表示
                for (i = 0; i < json.length; i++) {
                    //    $('#word').append(
                    //        '<dt>' + (i + 1) + '：<a href="' +
                    //        json[i].url + '">' +
                    //        json[i].title + '</a>' +
                    //        '&nbsp;(' + json[i].datetime +
                    //       ' 更新)</dt>' +
                    //      '<dd>' + json[i].body + '</dd>'
                    console.log(json[i].title);
                    //file.Write(json[i].url);
                    //file.Write("\n");
                    //file.Write(json[i].title);
                    //   );
                }
                //file.Close();

            } else {
                console.log('検索結果なし');
                //file.Write("結果なし");
                //file.Close();
            }
        }
    });
}

function execCopy(queryString) {
    var temp = document.createElement('div');

    temp.appendChild(document.createElement('pre')).textContent = string;

    var s = temp.style;
    s.position = 'fixed';
    s.left = '-100%';

    document.body.appendChild(temp);
    document.getSelection().selectAllChildren(temp);

    var result = document.execCommand('copy');

    document.body.removeChild(temp);
    // true なら実行できている falseなら失敗か対応していないか
    return result;
}



/*

function getCSVFile() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
    createArray(xhr.responseText);
    };

    xhr.open("get", "csv_test_file.csv", true);
    xhr.send(null);
}


function createXMLHttpRequest() {
    var XMLhttpObject = null;
    XMLhttpObject = new XMLHttpRequest();
    return XMLhttpObject;
}

function createArray(csvData) {
    var tempArray = csvData.split("\n");
    var csvArray = new Array();
    for(var i = 0; i<tempArray.length;i++){
    csvArray[i] = tempArray[i].split(",");
    }
    console.log(csvArray);
    console.log(csvArray[1]);
    //console.log(csvArray[1][1]);
}




*/







var testDriver = function() {

    /**
     * 参考url: http://www.hp-stylelink.com/news/2014/08/20140826.php
     * 公式のタイトル等の情報が詰まったcsvファイルを読み込んで、配列にぶち込む動作
     **/

    // 学習項目抽出結果にハイライトする用
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var responcet = xhr.responseText;
        //console.log(xhr.responseText);

        var tempArray = responcet.split("\n");
        csvArray = new Array(); /* グローバル変数にしたいので、varつけない */
        for (var i = 0; i < tempArray.length; i++) {
            csvArray[i] = tempArray[i].split(",");
        }
        //console.log(csvArray);
        //console.log(csvArray[1]);
        //console.log(csvArray.length);
    }
    xhr.open("get", "formula_flaged.csv", true);
    xhr.send(null);

    
     // 図形の学習項目抽出結果にハイライト用
     var xhr_zukei = new XMLHttpRequest();
     xhr_zukei.onload = function() {
         var responcet_zukei = xhr_zukei.responseText; 
         var tempArray_zukei = responcet_zukei.split("\n");
         csvArray_zukei = new Array(); /* グローバル変数にしたいので、varつけない */
         for (var i_zukei = 0; i_zukei < tempArray_zukei.length; i_zukei++) {
             csvArray_zukei[i_zukei] = tempArray_zukei[i_zukei].split(",");
         }
         console.log(csvArray);
         console.log(csvArray[1]);
         console.log(csvArray.length);
     }
     xhr_zukei.open("get", "formula_zukei.csv", true);
     xhr_zukei.send(null);
    
   /* var xhr_fnames = new XMLHttpRequest();
    xhr_fnames.onload = function() {
        var responcet_fnames = xhr_fnames.responseText;
        //console.log(xhr_non.responseText);

        var tempArray_fnames = responcet_fnames.split("\n");
        filenames = new Array(); /* グローバル変数にしたいので、varつけない */
        /*for (var j = 0; j < tempArray_fnames.length; j++) {
            filenames[j] = tempArray_fnames[j].split(",");
        }
        console.log(filenames);
        console.log(filenames.length);
    }
    xhr_fnames.open("get", "filenames.csv", true);
    xhr_fnames.send(null);*/


    // 学習項目抽出結果にハイライトしない用
    var xhr_non = new XMLHttpRequest();
    xhr_non.onload = function() {
        var responcet_non = xhr_non.responseText;
        //console.log(xhr_non.responseText);

        var tempArray_non = responcet_non.split("\n");
        csvArray_non = new Array(); /* グローバル変数にしたいので、varつけない */
        for (var j = 0; j < tempArray_non.length; j++) {
            csvArray_non[j] = tempArray_non[j].split(",");
        }
        console.log(csvArray_non);
        console.log(csvArray_non.length);
    }
    xhr_non.open("get", "formula_nonflaged2.csv", true);
    //xhr_non.open("get", "non-DB2.csv", true);
    xhr_non.send(null);


    //get target fo
    var svg = document.getElementById('queryView');
    var fo = document.getElementById('queryView-foreignObject');
    //set mml
    var mml;
    $.ajax({
        url: './test.mml',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(responce) {
            // mml = responce.firstElementChild;
            mml = $(responce)[0];
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(
                'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                'textStatus : ' + textStatus + '\n' +
                'errorThrown : ' + errorThrown.message
            );
        },
    });
    fo.appendChild(mml);
    //test::set null rect
    setNullRect(mml.children[0]); //中身をスッカラカンにする
    //
    //
    //
    var tokenManager = TokenManager(mml.children[0], svg);
    console.log("tokenManager");

    console.log(tokenManager);
    //set caret
    var caretManager = CaretManager(fo, svg);
    caretManager.setCaret(tokenManager.token); //structure
    console.log("caretManager");
    console.log(caretManager);
    //
    // 矩形選択(マウスによる範囲選択)
    var rectangleSelectionManager = RectangleSelectionManager(svg, tokenManager.setMathMLIncludedSvg, tokenManager.setRectangleSelectedTokens);
    //
    //test::caretmove
    setKeyboardEventHandler(window, tokenManager, caretManager, rectangleSelectionManager); //ショートカットキー
    //

    $('.search').click(function(e) {
        //var QueryView2 = document.getElementById("queryView");
        var left1_query = new RegExp("<mi>\\(<\/mi>", "g");
        var right1_query = new RegExp("<mi>\\)<\/mi>", "g");
        var left2_query = new RegExp("<mi>\\[<\/mi>", "g");
        var right2_query = new RegExp("<mi>\\]<\/mi>", "g");
        //履歴表示のための動作
        var history = document.getElementById("HistoryQueryView");
        var history_table = document.getElementById("history_table");
        var button = document.getElementById("copy");
        console.log("mml");
        console.log(mml);
        mml_history = mml;
        if (table_count != 0) {
            var newRow = history_table.insertRow(0);
            //var i;
            //for (i = 0; i < history_table.rows[0].cells.length; i++) {
            // 新しい行にセルを作っていく
            var newCell = newRow.insertCell();
            newCell.innerHTML = mml_history.outerHTML.replace("<mrow class=\"integration-node highlight\">", "<mrow class=\"integration-node\">");
            var newCell2 = newRow.insertCell();
            newCell2.innerHTML = "<input type=\"button\" value=\"copy\" class=\"copy\" id=\"copy\"/>";
            //newCell2.innerHTML = button.outerHTML;
            //}
            //newCell2.innerHTML = button.innerHTML;

        } else {
            history.innerHTML = mml_history.outerHTML.replace("<mrow class=\"integration-node highlight\">", "<mrow class=\"integration-node\">");
            //history.innerHTML = mml_history.innerHTML;
        }
        table_count++;
        var copy_buttons = document.body.getElementsByTagName('input');
        var index = 0;
        for (var i = 0; i < copy_buttons.length; i++) {
            //console.log(copy_buttons[i]);
            //var Answer = Answers[i];
            index = 0;
            copy_buttons[i].addEventListener("click", function() {
                var history_table = document.getElementById("history_table");
                index = $("[id=copy]").index(this);
                //var value = $('.HistoryQueryView').eq(index).val();
                //Answer_action(this);
                var value = history_table.rows[index].cells[0];
                console.log("copy");
                console.log("index: " + index);
                console.log(value);
            }, false);

        }
        // var index = $('.copy').index(this);


        //ここまで
        resetNum = 0;
        koushikiSearchFlag = 0;
        while (resetNum < extractionNum) { //配列の値を全て初期化
            extractionFlag[resetNum] = 0;
            resetNum++;
        }
        console.log(mml);
        var queryString = createQueryString(mml);
        console.log(queryString);
        // $('.query-string')[0].value = queryString;
        runMathRegexp(queryString);
    });

    $('.search_zukei').click(function(e) {
        //履歴表示のための動作
        var history_zukei = document.getElementById("HistoryQueryView");
        var history_table = document.getElementById("history_table");
        var button = document.getElementById("copy");
        console.log("mml");
        console.log(mml);
        mml_history = mml;
        if (table_count != 0) {
            var newRow = history_table.insertRow(0);
            //var i;
            //for (i = 0; i < history_table.rows[0].cells.length; i++) {
            // 新しい行にセルを作っていく
            var newCell = newRow.insertCell();
            newCell.innerHTML = mml_history.outerHTML.replace("<mrow class=\"integration-node highlight\">", "<mrow class=\"integration-node\">");
            var newCell2 = newRow.insertCell();
            newCell2.innerHTML = "<input type=\"button\" value=\"copy\" class=\"copy\" id=\"copy\"/>";
            //newCell2.innerHTML = button.outerHTML;
            //}
            //newCell2.innerHTML = button.innerHTML;

        } else {
            history_zukei.innerHTML = mml_history.outerHTML.replace("<mrow class=\"integration-node highlight\">", "<mrow class=\"integration-node\">");
            //history.innerHTML = mml_history.innerHTML;
        }
        table_count++;
        var copy_buttons = document.body.getElementsByTagName('input');
        var index = 0;
        for (var i = 0; i < copy_buttons.length; i++) {
            //console.log(copy_buttons[i]);
            //var Answer = Answers[i];
            index = 0;
            copy_buttons[i].addEventListener("click", function() {
                var history_table = document.getElementById("history_table");
                index = $("[id=copy]").index(this);
                //var value = $('.HistoryQueryView').eq(index).val();
                //Answer_action(this);
                var value = history_table.rows[index].cells[0];
                console.log("copy");
                console.log("index: " + index);
                console.log(value);
            }, false);

        }
        // var index = $('.copy').index(this);


        //ここまで
        resetNum = 0;
        koushikiSearchFlag = 0;
        while (resetNum_zukei < extractionNum_zukei) { //配列の値を全て初期化
            extractionFlag_zukei[resetNum_zukei] = 0;
            resetNum_zukei++;
        }
        console.log(mml);
        var queryString_zukei = createQueryString(mml);
        console.log(queryString_zukei);
        runMathFlagRegexp(queryString_zukei);
    });

    $('.study').click(function(e) {

        var queryString = createQueryString(mml);
        // $('.query-string')[0].value = queryString;
        extractingConcepts(queryString);
    });

    // $('.copy').click(function(e) {
    // $('.copy').click(function(e) {
    //     //$(document).on("click", ".copy", function (e) {
    //     //var history_table = document.getElementById("history_table");
    //     // var history_row = history_table.rows.item();
    //     // var history_cell = history_row.cells.item(0);
    //     //console.log('行:'+this.parentNode.rowIndex+'列:'+this.cellIndex);
    //     var copy_buttons = document.body.getElementsByTagName('input');
    //     for (var i = 0; i < copy_buttons.length; i++) {
    //         console.log(copy_buttons[i]);
    //         //var Answer = Answers[i];

    //         copy_buttons[i].addEventListener("click", function() {
    //             var index = $("[id=copy]").index(this);
    //             console.log("index" + index);
    //             var value = $('.HistoryQueryView').eq(index).val();
    //             //Answer_action(this);
    //         }, false);
    //     }
    //     // var index = $('.copy').index(this);


    //     console.log("copy");
    //     console.log(index);
    //     console.log(value);

    // });

    $('.paste').click(function(e) {
        fo.innerHTML = history_copy.outerHTML;

    });


    $('.ikyo').click(function(e) {

        henkeiIkyoGetter_test();
    });


    $('.ikyo_jikken').click(function(e) {
        //実験のとき使うはずだったやつ
        jikken_flag = 1;
        henkeiIkyoGetter_test();
        var TARGET_CLASS = 'highlighting';
        var CELL_COLOR = 'gray';
        //var subDoc2 = window.opener.document;
        //var tables = $(subDoc2).find("table");
        var tables = window.opener.document.body.getElementsByTagName('table');
        for (var i = 0; i < tables.length; i++) {
            //if (tables[i].className.indexOf(TARGET_CLASS) != -1) {
            AttachHighlighting(tables[i], CELL_COLOR);
            //}
        }
        console.log("tables");
        console.log(tables);

    });

    $('.ikyo_jikken2').click(function(e) {
        //実験のとき使うはずだったやつ
        console.log("やってやるぜ");
        jikken_flag = 1;
        henkeiIkyoGetter_test();
        var TARGET_CLASS = 'highlighting';
        var CELL_COLOR = 'gray';
        var tables = window.opener.document.body.getElementsByTagName('table');
        var Answers = window.opener.document.body.getElementsByTagName('input');
        for (var i = 0; i < Answers.length; i++) {
            console.log(Answers[i]);
            //var Answer = Answers[i];

            Answers[i].addEventListener("click", function() {
                var index = $("[id=Answer]").index(this);
                console.log("index" + index);

                Answer_action(this);
            }, false);
        }
        for (var i = 0; i < tables.length; i++) {
            AttachHighlighting_cell(tables[i], CELL_COLOR);
        }


        console.log("tables");
        console.log(tables);

    });



    // 入力中の数式全削除ボタンを作ってみたかった
    // 分数やら指数やらの四角にカーソルが合ってる状態(中身は空白)だと、queryView内の最後の要素がrectになっており、削除が上手くいかない
    // 実装する場合は要考察

    $('.reset').click(function(e) {
        //console.log("test");
        var parentElm = document.getElementById("queryView");
        //console.log(parentElm.lastElementChild.tagName);
        while (parentElm.lastElementChild.tagName == "line") { //全要素を削除した場合、最後の要素のタグ名はrectになる
            tokenManager.deleteToken(); //705行目辺り、backSpaceキーと同じ動作
            caretManager.setCaret(tokenManager.token);
        }
        WikipediaAPI();
    });

    $('.y_search').click(function(e) {
        var mml_y;
        select2 = document.forms.formName.selectName2;
        console.log(select2.options[select2.selectedIndex].value);

        //koushikiSearchFlag = 3;
        //koushikiSearchFlag = 0;
        if (select2.options[select2.selectedIndex].value == "ピタゴラスの定理") {
            koushikiSearchFlag = 3;
        }

        // csv使った版検索 学習項目抽出結果にカラーリングをする、方程式関係用
        var t;
        t = 0;
        while (t < csvArray.length) {
            if (select2.options[select2.selectedIndex].value == csvArray[t][1]) {
                resetNum = 0;
                while (resetNum < extractionNum) { //配列の値を全て初期化
                    extractionFlag[resetNum] = 0;
                    resetNum++;
                }

                // 学習項目抽出結果画面でどの公式をカラーリングするか、ここでフラグを建てる
                var flagindex;
                flagindex = csvArray[t][4];

                for (j = 0; j < 6; j++) {
                    if (j == flagindex) {
                        extractionFlag[j] = 1;
                        console.log('extractionFlag[' + j + ']=' + extractionFlag[j])
                    }
                }

                // 検索用クエリの階層情報
                var testurl = './searchStorage/';
                testurl += csvArray[t][2];


                console.log(testurl);

                $.ajax({
                    url:'./sample3.php', //送信先
                    type:'POST', //送信方法
                    datatype: 'html', //受け取りデータの種類
                    async: false,
                    data:{
                     'key' : csvArray[t][2]
                    }
                    })
                    // Ajax通信が成功した時
                    .done( function(data) {
                    mml_y = $(data)[0];
                    console.log('通信成功');
                    console.log(mml_y);
                    })
                    // Ajax通信が失敗した時
                    .fail( function(data) {
                    $('#result').html(data);
                    console.log('通信失敗');
                    console.log(data);
                });

                var queryString_y = createQueryString(mml_y);
                console.log(queryString_y);
                console.log("===== DEBUG Step 4 =====");
const mml_check = document.getElementById("testmml");
console.log("mml_check.outerHTML:", mml_check?.outerHTML);
console.log("mml_check.firstChild:", mml_check?.firstChild);
                runMathRegexp(queryString_y);

            }

            //console.log(t + '回目のループ終わり');
            t++;
        }

        // csv使った版検索 学習項目抽出結果にカラーリングをしない、方程式関係以外用
        t = 0;
        //console.log(csvArray_non[t][1]);
        while (t < csvArray_non.length) {
            //console.log(select2.options[select2.selectedIndex].value);
            //console.log(csvArray_non[t][1]);
            if (select2.options[select2.selectedIndex].value == csvArray_non[t][1]) {

                resetNum = 0;
                while (resetNum < extractionNum) { //配列の値を全て初期化
                    extractionFlag[resetNum] = 0;
                    resetNum++;
                }

                // 学習項目抽出結果画面にカラーリングしない検索なので、extractionflagは放置

                // どのmmlを使うか
                var testurl = './searchStorage/';
                testurl += csvArray_non[t][2];

                console.log(testurl);

                $.ajax({
                    url: testurl,
                    type: 'get',
                    dataType: 'html',
                    async: false,
                    success: function(responce) {
                        console.log(responce);
                        // mml_y = responce.firstElementChild;
                        mml_y = $(responce)[0];
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(
                            'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                            'textStatus : ' + textStatus + '\n' +
                            'errorThrown : ' + errorThrown.message
                        );
                    },
                });

                console.log(mml_y);

                var queryString_y = createQueryString(mml_y);
                console.log(queryString_y);
                runMathRegexp(queryString_y);

            }
            //console.log(t + '回目のループ終わり');
            t++;
        }





    });

$('.y_search_zukei').click(function(e) {
    console.log("図形公式検索ボタンがクリックされました");
    // フォームから選択された図形公式名を取得
    var mml_zukei;
    selectZukei = document.forms.formZukei.selectZukei2;
    var selectedName = selectZukei.options[selectZukei.selectedIndex].value;
    var t;

    while (t < csvArray_zukei.length) {
        if (csvArray_zukei[t][1] === selectedName) {
            // 図形用抽出フラグを初期化
            for (let i = 0; i < extractionFlag_zukei.length; i++) {
                extractionFlag_zukei[i] = 0;
            }

            // 対応フラグに 1 を立てる
            let flagindex = parseInt(csvArray_zukei[t][4]);
            if (!isNaN(flagindex)) extractionFlag_zukei[flagindex] = 1;

            // 図形公式用 MMLファイルの読み込み
            let testurl = './searchStorage/' + csvArray_zukei[t][2];
            $.ajax({
                url: testurl,
                type: 'get',
                dataType: 'html',
                async: false,
                success: function(responce) {
                    mml_zukei = $(responce)[0];
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(
                        'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                        'textStatus : ' + textStatus + '\n' +
                        'errorThrown : ' + errorThrown.message
                    );
                },
            });

            // MML → 正規表現パターンへ変換して検索実行
            const queryString_zukei = createQueryString(mml_zukei);
            runMathFlagRegexp(queryString_zukei);
            break;
        }
        t++;
    }
});

    //
    //
    return;
};





var runMathRegexp = function(queryString) {


    $('#matched').html('<br />');
    $('#num').html('<br />');
    /*
     * queryString : 入力されたクエリ列
     * tokens      : クエリ列のトークン列
     * parsedQuery : 入力されたクエリ列のOnigmo
     */
    var tokens = queryTokenize(queryString);  //トークン列
    var parsedQuery = queryParse(tokens);     //Onigmoパターン．parsedQueryは，queryとn(後方参照の数)の2つのプロパティから成る．

    if (!parsedQuery) {
        HTMLPrint.text('num', 'invalid query');
        return;
    }
    console.log(queryString);
    console.log(parsedQuery);
    console.log(parsedQuery.query);
    //console.log(parsedQuery.n);

    if (koushikiSearchFlag != 0) {
        var queryparseindex;
        var parsetoken;
        queryparseindex = queryString.indexOf("=");
        if (queryparseindex == -1) {
            queryparseindex = queryString.indexOf("≤");
            if (queryparseindex == -1) {
                queryparseindex = queryString.indexOf("≥");
                if (queryparseindex == -1) {
                    queryparseindex = queryString.indexOf("\<");
                    if (queryparseindex == -1) {
                        queryparseindex = queryString.indexOf("\>");
                        if (koushikiindex == -1) {
                            koushikiindex = 0;
                            parsetoken = "";
                        } else {
                            parsetoken = "\>";
                        }
                    } else {
                        parsetoken = "\<";
                    }
                } else {
                    parsetoken = "≥";
                }
            } else {
                parsetoken = "≤";
            }
        } else {
            parsetoken = "=";
        }
        console.log(queryparseindex);
        var koushikiquery_l = queryString.substring(0, queryparseindex); //クエリの文字列版を左辺右辺に分解
        var koushikiquery_r = queryString.substr(queryparseindex + 1);
        console.log(koushikiquery_l);
        console.log(koushikiquery_r);
        var tokensl = queryTokenize(koushikiquery_l); //左辺右辺それぞれの一文字ずつの分解
        var tokensr = queryTokenize(koushikiquery_r);
        //console.log(tokensl);
        //console.log(tokensr);
        var parsedQueryl = queryParse(tokensl);
        var parsedQueryr = queryParse(tokensr);

        console.log(parsedQueryl);
        console.log(parsedQueryr);

        /*
        var tokens = queryTokenize(queryString);//トークン列
        var parsedQuery = queryParse(tokens);
        */
        //1221追加ここまで
    }
    // /*
    //   replacementを取得
    // */
    // var replacementString = $('#input_replacement').val();
    // var parsedReplacement = parseReplacement(replacementString, 0);
    /*
     * 数式集合を取得．
     */
    var test = document.createElement('div');
    test.getNextNodeByLocalName('test');

    var subDoc = window.opener.document;
    /*********
     * ここから，検証(マッチング)．
     *********/
    //最初のmath要素を全て取得
    var targetMathElements = $(subDoc).find("math");
    /*
     * 数式をすべてstr化
     */
    var strs = [];
    var distinctions = []; //数式特徴の配列
    var distinctionsOutput = [];
    var parents = [];
    // var nextSiblings = [];
    var nOfFormulae = 0; //数式の数

    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    // while(targetMathElement)
    // {
    //     var next = targetMathElement.getNextNodeByLocalName("math");
    //     if(nOfFormulae+1 )//テスト用．条件に'nOfFormulae+1===n'と書くと，n番の数式だけ処理できる．
    //     {
    //         normalizePmmlTree(targetMathElement); //正規化
    //         mathStr = createMathTreeString(targetMathElement); //数式木文字列化
    //         strs.push(mathStr); //保存
    //     }
    //     /*
    //       * 次の節をとる
    //       */
    //     targetMathElement = next;
    //     nOfFormulae++;
    // }
    var koushikistring_l = new Array();
    var koushikistring_r = new Array();
    var koushikiparsetoken = new Array();

    for (var i = 0; i < targetMathElements.length; i++) {

        normalizePmmlTree(targetMathElements[i]); //正規化。中身は普通にmathml文
        console.log(targetMathElements[i]);
        mathStr = createMathTreeString(targetMathElements[i]); //mathml文のmathStrを,onigmoパターンの文字列(:とかめっちゃ使うアレ)に変形している…
        console.log(mathStr);
        strs.push(mathStr); //保存

        //1218追加ここから

        var koushikiindex;

        koushikiindex = mathStr.indexOf("=");
        if (koushikiindex == -1) {
            koushikiindex = mathStr.indexOf("≤");
            if (koushikiindex == -1) {
                koushikiindex = mathStr.indexOf("≥");
                if (koushikiindex == -1) {
                    koushikiindex = mathStr.indexOf("\<");
                    if (koushikiindex == -1) {
                        koushikiindex = mathStr.indexOf("\>");
                        if (koushikiindex == -1) {
                            koushikiindex = 0;
                            koushikiparsetoken[i] = "";
                        } else {
                            koushikiparsetoken[i] = "\>";
                        }
                    } else {
                        koushikiparsetoken[i] = "\<";
                    }
                } else {
                    koushikiparsetoken[i] = "≥";
                }
            } else {
                koushikiparsetoken[i] = "≤";
            }
        } else {
            koushikiparsetoken[i] = "=";
        }


        console.log(koushikiindex);
        koushikistring_l[i] = mathStr.substring(0, koushikiindex); //onigmoパターンの左辺を保存
        koushikistring_r[i] = mathStr.substr(koushikiindex + 1); //onigmoパターンの右辺を保存
        //console.log(koushikistring_l);
        //console.log(koushikistring_r);
        //1218追加ここまで

        mathStr = createMathTreeStringT(targetMathElements[i]); //onigmoパターンの文字列になっていたmathStrを,通常のmathml文に戻す
        //console.log(mathStr); //この時点では、まだただの木構造
        distinctions.push(mathStr); /* ここで、distinctionsの中に、抽出結果ウィンドウに表示するmathml文が入る */
        parents.push(targetMathElements[i].parentNode);
        // nextSiblings.push(targetMathElements[i].nextSibling);

    }

    var distinctionStr;
    var outputStr;
    console.log(strs);
    var strssize = strs.length
    console.log(strssize);
    //console.log(targetMathElements[0]);
    //console.log(targetMathElements[1]);

    nwin = window.open("", "学習項目抽出結果", "width=720,height=720");
    nwin.document.open();
    nwin.document.write("<HTML><HEAD>");
    nwin.document.write("<TITLE>学習項目抽出結果</TITLE>");
    nwin.document.writeln("<BODY>");
    for (var mathStr of distinctions) {
        outputStr = mathStr;
        //console.log(outputStr);
        distinctionStr = expressionDistinction(mathStr);
        console.log(distinctionStr);
        if (extractionFlag[0] == 1 && distinctionStr.indexOf('微分方程式') != -1) {
            //console.log("微分方程式を検索していたので、微分方程式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag[1] == 1 && distinctionStr.indexOf('行列方程式') != -1) {
            //console.log("行列方程式を検索していたので、行列方程式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag[2] == 1 && distinctionStr.indexOf('二次方程式') != -1) {
            //console.log("二次方程式を検索していたので、二次方程式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag[3] == 1 && distinctionStr.indexOf('微分不等式') != -1) {
            //console.log("微分不等式を検索していたので、微分不等式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag[4] == 1 && distinctionStr.indexOf('行列不等式') != -1) {
            //console.log("行列不等式を検索していたので、行列不等式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag[5] == 1 && distinctionStr.indexOf('二次不等式') != -1) {
            //console.log("二次不等式を検索していたので、二次不等式を表す式を黄色にします。");
            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            //            outputStr = outputStr.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"lemonchiffon\"><mrow>");
            outputStr = outputStr.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }
        /*
        if (outputStr.match(left1) != null && outputStr.match(left1).length == outputStr.match(right1).length) {
            outputStr = outputStr.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする(mrowで括る)
            outputStr = outputStr.replace(right1, "<\/mrow><\/mfenced>");
        }
        if (outputStr.match(left2) != null && outputStr.match(left2).length == outputStr.match(right2).length) {
            outputStr = outputStr.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする(mrowで括る)
            outputStr = outputStr.replace(right2, "<\/mrow><\/mfenced>");
        }
        */
        nwin.document.writeln(outputStr);
        nwin.document.write("<br/>");
        distinctionStr = expressionDistinction(mathStr);
        nwin.document.writeln(distinctionStr);
        nwin.document.write("<br/>");
        nwin.document.write("<br/>");
    }
    nwin.document.write("</BODY></HTML>");
    nwin.document.close();
    /*
     * 一括で処理
     */
    var rbFileName = '';
    // if(parsedReplacement === '')
    // {
    //rbFileName = 'http://18.221.189.220/~ubuntu/MathematicaExpresssionSearchSystem/mreg.rb';//ハイライトのための処理
    //引き継ぎ先のアドレスに調整する必要あり
    // rbFileName = 'http://twatabe.com/public_html/cgi-bin/mreg/mreg.rb';//ハイライトのための処理
    // }
    // else
    // {
    //     rbFileName = 'http://twatabe.com/public_html/cgi-bin/mreg/replace.rb';//置換のための処理
    // }


    var results;
    console.log(strs);
    console.log(koushikiSearchFlag);


    if (koushikiSearchFlag == 0) {
        rbFileName = 'http://127.0.0.1:8000/mreg'; //ハイライトのための処理
        console.log(parsedQuery.query);
        console.log(strs);
        //var testquery = new RegExp(parsedQuery.query,"g");
        //console.log(testquery);

        $.ajax({
            type: 'POST',
            url: rbFileName,
            async: false,
            traditional: true,
            data: {
                n: parsedQuery.n, //後方参照の番号
                originalQuery: queryString, //検索クエリの通常の文字列
                query: parsedQuery.query, //検索クエリの
                math: strs,
            },
            success: function(json) {
                results = json.results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(
                    'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                    'textStatus : ' + textStatus + '\n' +
                    'errorThrown : ' + errorThrown.message
                );
            },
        });
    } else if (koushikiSearchFlag == 3) {
        rbFileName = 'http://127.0.0.1:8000/mreg'; /* ファイル名は.rb含めて7文字までじゃないとエラー */
        console.log('ここまできたよ');
        console.log(parsedQueryl.query);
        console.log(parsedQueryr.query);
        console.log(parsetoken);
        console.log(koushikistring_l);
        console.log(koushikistring_r);
        console.log(koushikiparsetoken);
        console.log(strs);



        $.ajax({
            type: 'POST',
            url: rbFileName,
            async: false,
            traditional: true,
            data: {
                n: parsedQuery.n, //後方参照の番号
                originalQuery: queryString, //検索クエリの通常の文字列
                query: parsedQuery.query, //検索クエリのクエリ部分
                queryl: parsedQueryl.query,
                queryr: parsedQueryr.query, //
                queryparser: parsetoken, //検索クエリの等号とか不等号部分。ピタゴラスなら＝、相加相乗なら>=
                mathl: koushikistring_l, //公式検索時に使用する、検索対象mathml文の左辺
                mathr: koushikistring_r, //公式検索時に使用する、検索対象mathml文の右辺
                mathparser: koushikiparsetoken, // 検索対象mathmlの等号とか不等号全部が入った配列
                math: strs,
                size: strssize,
            },
            success: function(json) {
                if (!json || !json.results) {
        alert("検索結果が取得できませんでした。サーバーエラーの可能性があります。");
        results = [];
        return;
    }
                results = json.results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(
                    'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                    'textStatus : ' + textStatus + '\n' +
                    'errorThrown : ' + errorThrown.message
                );
            },
        });
    }


    var nOfMatched = 0; //マッチした式の数
    console.log(results); //対称ページすべてのMathML文に検索をかけた後の、mstyle要素追加済みデータのOnigmo変換後
    //console.log(tokens); //入力したクエリを文字単位で分割したやつ
    /*
     * 結果文字列を逆変換
     */
    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    //var mstyle = new RegExp("mstyle","g");
    var math_tag = new RegExp("<math", "g");

    //div = div + "<br\/>" + "<math";

    var newinner;
    var newouter;
if (!results || !Array.isArray(results)) {
    alert("検索結果が取得できませんでした。サーバーエラーの可能性があります。");
    return;
}
    for (var i = 0; i < results.length; i++) {
        var tokens = tokenizeParsedString(results[i]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
        //console.log(tokens);
        var replacedMath = buildMathMLFromParsedString(tokens, 0);
        //console.log(replacedMath);

        /*
        if (replacedMath.innerHTML.match(left1) != null && replacedMath.innerHTML.match(left1).length == replacedMath.innerHTML.match(right1).length) {
            replacedMath.innerHTML = replacedMath.innerHTML.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする
            replacedMath.innerHTML = replacedMath.innerHTML.replace(right1, "<\/mrow><\/mfenced>");
        }
        if (replacedMath.innerHTML.match(left2) != null && replacedMath.innerHTML.match(left2).length == replacedMath.innerHTML.match(right2).length) {
            replacedMath.innerHTML = replacedMath.innerHTML.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする
            replacedMath.innerHTML = replacedMath.innerHTML.replace(right2, "<\/mrow><\/mfenced>");
        }
        */

        //0111追加 公式検索でマッチした部分は、その名前を追加表示
        //<math xmlns="http://www.w3.org/1998/Math/MathML" mathsize="350%">
        //<mstyle mathbackground="yellow">
        //<math xmlns="http://www.w3.org/1998/Math/MathML" mathsize="350%"><mrow><mfrac><mrow><mi>d</mi><mi>y</mi></mrow><mrow><mi>d</mi><mi>x</mi></mrow></mfrac><mi>+</mi><mi>x</mi><mi>c</mi><mi>o</mi><mi>t</mi><mi>y</mi><mi>=</mi><mi>0</mi></mrow></math>

        /*
                if(koushikiSearchFlag != 0 && replacedMath.innerHTML.match("mstyle") != null) {
                    var div = select2.options[select2.selectedIndex].value;
                    console.log(div);
                    newinner = replacedMath.innerHTML.replace(replacedMath.innerHTML, replacedMath.innerHTML + "<br\/>" + div + "<br\/>");
                    //newouter = replacedMath.outerHTML.replace(replacedMath.outerHTML, replacedMath.outerHTML + "<br\/>" + div + "<br\/>");
                    // なぜかinnerHTMLは置換できるのに、outerHTMLが置換できない()

                    //console.log(replacedMath.innerHTML);
                    //console.log(newinner);
                    console.log(replacedMath.outerHTML);
                    //console.log(newouter);

                    replacedMath.innerHTML = newinner;
                    //replacedMath.outerHTML = newouter;

                    //console.log(replacedMath.innerHTML);
                    console.log(replacedMath.outerHTML);
                }
                */
        //for demo
        replacedMath.setAttribute('mathsize', '350%');

        parents[i].replaceChild(replacedMath, targetMathElements[i]);
        // parents[i].insertBefore(replacedMath, nextSiblings[i]);
        // HTMLPrint.text('matched',i+1 + ':');
        // HTMLPrint.MathML('matched',replacedMath);
        // HTMLPrint.br('matched');

    }
    /*
     * マッチした個数を出力．
     */
    // HTMLPrint.text('num', nOfMatched+' / '+nOfFormulae);
};

var runMathFlagRegexp = function(queryString) {


    $('#matched').html('<br />');
    $('#num').html('<br />');
    //クリエのトークン化と解析
    var tokens_zukei = queryTokenize(queryString);  //トークン列
    var parsedQuery_zukei = queryParse(tokens_zukei);     //Onigmoパターン．parsedQuery_zukeiは，queryとn(後方参照の数)の2つのプロパティから成る．

    if (!parsedQuery_zukei) {
        HTMLPrint.text('num', 'invalid query');
        return;
    }
    console.log(queryString);
    console.log(parsedQuery_zukei);
    console.log(parsedQuery_zukei.query);

    if (koushikiSearchFlag != 0) {
        var queryparseindex;
        var parsetoken;
        queryparseindex = queryString.indexOf("=");
        if (queryparseindex == -1) {
            queryparseindex = queryString.indexOf("≤");
            if (queryparseindex == -1) {
                queryparseindex = queryString.indexOf("≥");
                if (queryparseindex == -1) {
                    queryparseindex = queryString.indexOf("\<");
                    if (queryparseindex == -1) {
                        queryparseindex = queryString.indexOf("\>");
                        if (koushikiindex == -1) {
                            koushikiindex = 0;
                            parsetoken = "";
                        } else {
                            parsetoken = "\>";
                        }
                    } else {
                        parsetoken = "\<";
                    }
                } else {
                    parsetoken = "≥";
                }
            } else {
                parsetoken = "≤";
            }
        } else {
            parsetoken = "=";
        }
        console.log(queryparseindex);
        var koushikiquery_l = queryString.substring(0, queryparseindex); //クエリの文字列版を左辺右辺に分解
        var koushikiquery_r = queryString.substr(queryparseindex + 1);
        console.log(koushikiquery_l);
        console.log(koushikiquery_r);
        var tokens_zukeil = queryTokenize(koushikiquery_l); //左辺右辺それぞれの一文字ずつの分解
        var tokens_zukeir = queryTokenize(koushikiquery_r);
        var parsedQuery_zukeil = queryParse(tokens_zukeil);
        var parsedQuery_zukeir = queryParse(tokens_zukeir);

        console.log(parsedQuery_zukeil);
        console.log(parsedQuery_zukeir);
    }

    var test = document.createElement('div');
    test.getNextNodeByLocalName('test');

    var subDoc = window.opener.document;
    /*********
     * ここから，検証(マッチング)．
     *********/
    //最初のmath要素を全て取得
    var targetMathElements = $(subDoc).find("math");
    /*
     * 数式をすべてstr化
     */
    var strs = [];
    var distinctions = []; //数式特徴の配列
    var distinctionsOutput = [];
    var parents = [];
    // var nextSiblings = [];
    var nOfFormulae = 0; //数式の数

    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    var koushikistring_l = new Array();
    var koushikistring_r = new Array();
    var koushikiparsetoken = new Array();

    for (var i = 0; i < targetMathElements.length; i++) {

        normalizePmmlTree(targetMathElements[i]); //正規化。中身は普通にmathml文
        console.log(targetMathElements[i]);
        mathStr = createMathTreeString(targetMathElements[i]); //mathml文のmathStrを,onigmoパターンの文字列(:とかめっちゃ使うアレ)に変形している…
        console.log(mathStr);
        strs.push(mathStr); //保存

        //1218追加ここから

        var koushikiindex;

        koushikiindex = mathStr.indexOf("=");
        if (koushikiindex == -1) {
            koushikiindex = mathStr.indexOf("≤");
            if (koushikiindex == -1) {
                koushikiindex = mathStr.indexOf("≥");
                if (koushikiindex == -1) {
                    koushikiindex = mathStr.indexOf("\<");
                    if (koushikiindex == -1) {
                        koushikiindex = mathStr.indexOf("\>");
                        if (koushikiindex == -1) {
                            koushikiindex = 0;
                            koushikiparsetoken[i] = "";
                        } else {
                            koushikiparsetoken[i] = "\>";
                        }
                    } else {
                        koushikiparsetoken[i] = "\<";
                    }
                } else {
                    koushikiparsetoken[i] = "≥";
                }
            } else {
                koushikiparsetoken[i] = "≤";
            }
        } else {
            koushikiparsetoken[i] = "=";
        }


        console.log(koushikiindex);
        koushikistring_l[i] = mathStr.substring(0, koushikiindex); //onigmoパターンの左辺を保存
        koushikistring_r[i] = mathStr.substr(koushikiindex + 1); //onigmoパターンの右辺を保存
        //console.log(koushikistring_l);
        //console.log(koushikistring_r);
        //1218追加ここまで

        mathStr = createMathTreeStringT(targetMathElements[i]); //onigmoパターンの文字列になっていたmathStrを,通常のmathml文に戻す
        //console.log(mathStr); //この時点では、まだただの木構造
        distinctions.push(mathStr); /* ここで、distinctionsの中に、抽出結果ウィンドウに表示するmathml文が入る */
        parents.push(targetMathElements[i].parentNode);
        // nextSiblings.push(targetMathElements[i].nextSibling);

    }

    var distinctionStr_zukei;
    var outputStr_zukei;
    console.log(strs);
    var strssize = strs.length
    console.log(strssize);
    //console.log(targetMathElements[0]);
    //console.log(targetMathElements[1]);

    nwin = window.open("", "図形の学習項目抽出結果", "width=720,height=720");
    nwin.document.open();
    nwin.document.write("<HTML><HEAD>");
    nwin.document.write("<TITLE>図形の学習項目抽出結果</TITLE>");
    nwin.document.writeln("<BODY>");
    for (var mathStr of distinctions) {
        outputStr_zukei = mathStr;
        //console.log(outputStr_zukei);
        distinctionStr_zukei = expressionDistinctionHash(mathStr);
        console.log(distinctionStr_zukei);
        if(extractionFlag_zukei[0] == 1 && distinctionStr_zukei.indexOf('直線') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag_zukei[1] == 1 && distinctionStr_zukei.indexOf('円形') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag_zukei[2] == 1 && distinctionStr_zukei.indexOf('放物線') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag_zukei[3] == 1 && distinctionStr_zukei.indexOf('対数関数') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag_zukei[4] == 1 && distinctionStr_zukei.indexOf('指数関数') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        } else if (extractionFlag_zukei[5] == 1 && distinctionStr_zukei.indexOf('楕円') != -1) {
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[6] == 1 && distinctionStr_zukei.indexOf('双曲線') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[7] == 1 && distinctionStr_zukei.indexOf('分子関数') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[8] == 1 && distinctionStr_zukei.indexOf('無理関数') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[9] == 1 && distinctionStr_zukei.indexOf('連立1次関数') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[10] == 1 && distinctionStr_zukei.indexOf('三角関数') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[11] == 1 && distinctionStr_zukei.indexOf('リサージュ曲線') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[12] == 1 && distinctionStr_zukei.indexOf('アステロイド曲線') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[13] == 1 && distinctionStr_zukei.indexOf('サイクロイド') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[14] == 1 && distinctionStr_zukei.indexOf('アルキメデスの渦巻線') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[15] == 1 && distinctionStr_zukei.indexOf('正葉曲線') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }else if(extractionFlag_zukei[16] == 1 && distinctionStr_zukei.indexOf('カージオイド') != -1){
            outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
            outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
        }
            /*if(distinctionStr_zukei.indexOf('直線') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            } else if (distinctionStr_zukei.indexOf('円形') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            } else if (distinctionStr_zukei.indexOf('放物線') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            } else if (distinctionStr_zukei.indexOf('対数関数') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            } else if (distinctionStr_zukei.indexOf('指数関数') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            } else if (distinctionStr_zukei.indexOf('楕円') != -1) {
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('双曲線') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('分子関数') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('無理関数') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('連立1次関数') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('三角関数') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('リサージュ曲線') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('アステロイド曲線') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('サイクロイド') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('アルキメデスの渦巻線') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('正葉曲線') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }else if(distinctionStr_zukei.indexOf('カージオイド') != -1){
                outputStr_zukei = outputStr_zukei.replace("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>", "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow><mstyle mathbackground=\"yellow\"><mrow>");
                outputStr_zukei = outputStr_zukei.replace("<\/mrow><\/math>", "<\/mrow><\/mstyle><\/mrow><\/math>");
            }*/
        
        nwin.document.writeln(outputStr_zukei);
        nwin.document.write("<br/>");
        distinctionStr_zukei = expressionDistinctionHash(mathStr);
        nwin.document.writeln(distinctionStr_zukei);
        nwin.document.write("<br/>");
        nwin.document.write("<br/>");
    }
    nwin.document.write("</BODY></HTML>");
    nwin.document.close();

    var rbFileName = '';

    var results;
    console.log(strs);
    console.log(koushikiSearchFlag);


    if (koushikiSearchFlag == 0) {
        rbFileName = 'http://127.0.0.1:8000/mreg'; //ハイライトのための処理
        console.log(parsedQuery_zukei.query);
        console.log(strs);
        //var testquery = new RegExp(parsedQuery_zukei.query,"g");
        //console.log(testquery);

        $.ajax({
            type: 'POST',
            url: rbFileName,
            async: false,
            traditional: true,
            data: {
                n: parsedQuery_zukei.n, //後方参照の番号
                originalQuery: queryString, //検索クエリの通常の文字列
                query: parsedQuery_zukei.query, //検索クエリの
                math: strs,
            },
            success: function(json) {
                if (!json || !json.results) {
        alert("検索結果が取得できませんでした。サーバーエラーの可能性があります。");
        results = [];
        return;
    }
                results = json.results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(
                    'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                    'textStatus : ' + textStatus + '\n' +
                    'errorThrown : ' + errorThrown.message
                );
            },
        });
    } else if (koushikiSearchFlag == 3) {
        rbFileName = 'http://127.0.0.1:8000/mreg';  /* ファイル名は.rb含めて7文字までじゃないとエラー */
        console.log('ここまできたよ');

        console.log(parsedQuery_zukeil.query);
        console.log(parsedQuery_zukeir.query);
        console.log(parsetoken);
        console.log(koushikistring_l);
        console.log(koushikistring_r);
        console.log(koushikiparsetoken);
        console.log(strs);



        $.ajax({
            type: 'POST',
            url: rbFileName,
            async: false,
            traditional: true,
            data: {
                n: parsedQuery_zukei.n, //後方参照の番号
                originalQuery: queryString, //検索クエリの通常の文字列
                query: parsedQuery_zukei.query, //検索クエリのクエリ部分
                queryl: parsedQuery_zukeil.query,
                queryr: parsedQuery_zukeir.query, //
                queryparser: parsetoken, //検索クエリの等号とか不等号部分。ピタゴラスなら＝、相加相乗なら>=
                mathl: koushikistring_l, //公式検索時に使用する、検索対象mathml文の左辺
                mathr: koushikistring_r, //公式検索時に使用する、検索対象mathml文の右辺
                mathparser: koushikiparsetoken, // 検索対象mathmlの等号とか不等号全部が入った配列
                math: strs,
                size: strssize,
            },
            success: function(json) {
                if (!json || !json.results) {
        alert("検索結果が取得できませんでした。サーバーエラーの可能性があります。");
        results = [];
        return;
    }
                results = json.results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(
                    'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                    'textStatus : ' + textStatus + '\n' +
                    'errorThrown : ' + errorThrown.message
                );
            },
        });
    }


    var nOfMatched = 0; //マッチした式の数
    console.log(results); //対称ページすべてのMathML文に検索をかけた後の、mstyle要素追加済みデータのOnigmo変換後
 
    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    //var mstyle = new RegExp("mstyle","g");
    var math_tag = new RegExp("<math", "g");

    //div = div + "<br\/>" + "<math";

    var newinner;
    var newouter;

    for (var i = 0; i < results.length; i++) {
        var tokens_zukei = tokenizeParsedString(results[i]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
        //console.log(tokens_zukei);
        var replacedMath = buildMathMLFromParsedString(tokens_zukei, 0);
        //console.log(replacedMath);

        replacedMath.setAttribute('mathsize', '350%');

        parents[i].replaceChild(replacedMath, targetMathElements[i]);
    }
};


// ショートカットキー
// キーコードは   http://shanabrian.com/web/javascript/keycode.php
var setKeyboardEventHandler = function(element, tokenManager, caretManager, rectangleSelectionManager) {
    // privates
    $(element).keydown(function(e2) { //ショートカットキー
        if (e2.ctrlKey == true) {
            if (e2.keyCode === 67) {
                //alert('Ctrl+C');
                if (execCopy(textarea.value)) {
                    alert('コピーできました');
                } else {
                    alert('このブラウザでは対応していません');
                }
            } else if (e2.keyCode === 86) {

            }
        } else if (e2.altKey == true) { //Alt
            if (e2.keyCode === 52 || e2.keyCode === 53 || e2.keyCode === 54 || e2.keyCode === 82 || e2.keyCode === 84 || e2.keyCode === 89 || e2.keyCode === 70 || e2.keyCode === 71 || e2.keyCode === 72) {
                var structure;
                if (e2.keyCode === 82) structure = createInitialStructure('msub');
                else if (e2.keyCode === 84) structure = createInitialStructure('msup');
                else if (e2.keyCode === 89) structure = createInitialStructure('msubsup');
                else if (e2.keyCode === 70) structure = createInitialStructure('munder');
                else if (e2.keyCode === 71) structure = createInitialStructure('mover');
                else if (e2.keyCode === 72) structure = createInitialStructure('munderover');
                else if (e2.keyCode === 53) structure = createInitialStructure('msqrt');
                else if (e2.keyCode === 54) structure = createInitialStructure('mroot');
                else if (e2.keyCode === 52) structure = createInitialStructure('mfrac');
                tokenManager.insertToken(structure);
                caretManager.setCaret(tokenManager.token);
            } else if (e2.keyCode === 55) //7
            {
                // size calculation
                var radius = 0.3;
                var offset = 0.1;
                //
                var whsvg = 2 * radius + (offset * 2);
                var cxcy = radius + offset;
                //
                var xl1 = radius + offset;
                var yl1 = offset;
                var xl2 = (1 / Math.sqrt(2)) * radius + radius + offset;
                var yl2 = -(1 / Math.sqrt(2)) * radius + radius + offset;
                var xl3 = (radius * 2) + offset;
                var yl3 = radius + offset;
                //
                var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
                mpadded.setAttribute('lspace', '-0.02em');
                mpadded.setAttribute('width', '-0.04em');
                mpadded.setAttribute('voffset', '-0.1em');
                $(mpadded).addClass('character-node');
                $(mpadded).addClass('wildcard');
                $(mpadded).addClass('regular-expression');
                //
                var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', whsvg + 'em');
                svg.setAttribute('height', whsvg + 'em');
                //
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cxcy + 'em');
                circle.setAttribute('cy', cxcy + 'em');
                circle.setAttribute('r', radius + 'em');
                circle.setAttribute('stroke', 'black');
                circle.setAttribute('fill', 'none');
                var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', xl1 + 'em');
                line1.setAttribute('y1', yl1 + 'em');
                line1.setAttribute('x2', yl1 + 'em');
                line1.setAttribute('y2', xl1 + 'em');
                line1.setAttribute('stroke', 'black');
                var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', xl2 + 'em');
                line2.setAttribute('y1', yl2 + 'em');
                line2.setAttribute('x2', yl2 + 'em');
                line2.setAttribute('y2', xl2 + 'em');
                line2.setAttribute('stroke', 'black');
                var line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line3.setAttribute('x1', xl3 + 'em');
                line3.setAttribute('y1', yl3 + 'em');
                line3.setAttribute('x2', yl3 + 'em');
                line3.setAttribute('y2', xl3 + 'em');
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
            } else if (e2.keyCode === 56) //8
            {
                var mrow = tokenManager.createEnclosingRect();
                tokenManager.addContentToEnclosingRect(null, mrow);
                //
                $(mrow).addClass('character-class');
                var style = $(mrow).find('.style-enclosing-regular-expression')[0];
                $(style).addClass('style-character-class');
                //
                tokenManager.insertToken(mrow);
                tokenManager.setToken(style); //ここはいつかリファクタリング...
                tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                caretManager.setCaret(tokenManager.token);
            } else if (e2.keyCode === 57) //9
            {
                var mrow = tokenManager.createEnclosingRect();
                tokenManager.addContentToEnclosingRect(null, mrow);
                //
                $(mrow).addClass('negated-character-class');
                var style = $(mrow).find('.style-enclosing-regular-expression')[0];
                $(style).addClass('style-negated-character-class');
                //
                tokenManager.insertToken(mrow);
                tokenManager.setToken(style); //ここはいつかリファクタリング...
                tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                caretManager.setCaret(tokenManager.token);
            } else if (e2.keyCode === 85) //u
            {
                if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('zero-or-one')) {
                    tokenManager.peelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                    caretManager.setCaret(tokenManager.token);
                } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
                    tokenManager.labelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                } else {
                    tokenManager.createRectWithLabeling(tokenManager.labelZeroOrOne);
                    tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                    caretManager.setCaret(tokenManager.token);
                }
            } else if (e2.keyCode === 73) //i
            {
                if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('more')) {
                    tokenManager.peelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                    caretManager.setCaret(tokenManager.token);
                } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
                    tokenManager.labelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                } else {
                    tokenManager.createRectWithLabeling(tokenManager.labelMore);
                    tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                    caretManager.setCaret(tokenManager.token);
                }
            } else if (e2.keyCode === 79) //o
            {
                if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('boolean-or')) {
                    tokenManager.addContentToEnclosingRect(null, $(tokenManager.token).closest('.enclosing-regular-expression'));
                } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
                    tokenManager.labelBooleanOr($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                } else {
                    tokenManager.createRectWithLabeling(tokenManager.labelBooleanOr);
                    //tokenManager.moveToNextToken();　//そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                    caretManager.setCaret(tokenManager.token);
                }
            } else if (e2.keyCode === 74) //j
            {
                if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('capturing')) {
                    tokenManager.peelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                    caretManager.setCaret(tokenManager.token);
                } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
                    tokenManager.labelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
                } else {
                    tokenManager.createRectWithLabeling(tokenManager.labelCapturing);
                    tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                    caretManager.setCaret(tokenManager.token);
                }
            } else if (e2.keyCode === 75) //k
            {
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
                tokenManager.setToken(style); //ここはいつかリファクタリング...
                tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
                caretManager.setCaret(tokenManager.token);
            }else if (e2.keyCode === 39) //right
            {
                tokenManager.moveToNextToken();
                caretManager.setCaret(tokenManager.token);
            } else if (e2.keyCode === 37) //left
            {
                tokenManager.moveToPreviousToken();
                caretManager.setCaret(tokenManager.token);
            } else if (e2.keyCode === 8) //BS
            {
                tokenManager.deleteToken();
                caretManager.setCaret(tokenManager.token);
            }
            // else if(

        }
        /*

                else if(e2.shiftKey == true){ //Shift
                    if(e2.keyCode === 55)
                    {
                        var structure;
                        if(e2.keyCode === 82)           structure = createInitialStructure('msub');
                        else if(e2.keyCode === 84)      structure = createInitialStructure('msup');
                        else if(e2.keyCode === 89)      structure = createInitialStructure('msubsup');
                        else if(e2.keyCode === 70)      structure = createInitialStructure('munder');
                        else if(e2.keyCode === 71)      structure = createInitialStructure('mover');
                        else if(e2.keyCode === 72)      structure = createInitialStructure('munderover');
                        else if(e2.keyCode === 53)      structure = createInitialStructure('msqrt');
                        else if(e2.keyCode === 54)      structure = createInitialStructure('mroot');
                        else if(e2.keyCode === 52)      structure = createInitialStructure('mfrac');
                        tokenManager.insertToken(structure);
                        caretManager.setCaret(tokenManager.token);
                    }
                }
                */


    });

    $(element).keypress(function(e) {
        if (e.altKey == true) {

        } else if (e.keyCode === 39) //right
        {
            tokenManager.moveToNextToken();
            caretManager.setCaret(tokenManager.token);
        } else if (e.keyCode === 37) //left
        {
            tokenManager.moveToPreviousToken();
            caretManager.setCaret(tokenManager.token);
        } else if (e.keyCode === 8) //BS
        {
            tokenManager.deleteToken();
            caretManager.setCaret(tokenManager.token);
        }
        // else if(e.keyCode === 46) //delete
        // {
        //  alert('del');
        // }
        else {
            //入力可能な文字なら受け付ける
            //スペースはとりあえず受け付けない
            if (33 <= e.charCode && e.charCode <= 126) {
                //create element
                var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
                var textNode = document.createTextNode(String.fromCharCode(e.charCode));
                $(mi).addClass('character-node');
                mi.appendChild(textNode);

                tokenManager.insertToken(mi);
                caretManager.setCaret(tokenManager.token);
            }
        }
        return;
    });

    $('#character-button-category-select-menu').change(function(e) {
        var operatorsButtonTable = $('.character-button-table-operators')[0];
        var greeksButtonTable = $('.character-button-table-greeks')[0];
        if ($('#character-button-category-select-menu option:selected').text() === 'operators') {
            operatorsButtonTable.style.display = '';
            greeksButtonTable.style.display = 'none';
        } else if ($('#character-button-category-select-menu option:selected').text() === 'Greek alphabet') {
            operatorsButtonTable.style.display = 'none';
            greeksButtonTable.style.display = '';
        }
        return;
    });


    $('.input-structure').click(function(e) {
        var target = null;
        if (e.target.localName === 'td') {
            target = e.target;
        } else {
            target = $(e.target).find('td')[0];
            if (!(target && target.localName === 'td')) {
                target = $(e.target).closest('td')[0];
            }
        }
        var structure;
        if ($(target).hasClass('input-msub') || $(target).hasClass('input-msup') || $(target).hasClass('input-msubsup')) {
            if ($(target).hasClass('input-msub')) structure = createInitialStructure('msub');
            else if ($(target).hasClass('input-msup')) structure = createInitialStructure('msup');
            else if ($(target).hasClass('input-msubsup')) structure = createInitialStructure('msubsup');
        } else {
            if ($(target).hasClass('input-munder')) structure = createInitialStructure('munder');
            else if ($(target).hasClass('input-mover')) structure = createInitialStructure('mover');
            else if ($(target).hasClass('input-munderover')) structure = createInitialStructure('munderover');
            else if ($(target).hasClass('input-msqrt')) structure = createInitialStructure('msqrt');
            else if ($(target).hasClass('input-mroot')) structure = createInitialStructure('mroot');
            else if ($(target).hasClass('input-mfrac')) structure = createInitialStructure('mfrac');
            else if ($(target).hasClass('input-mtable')) structure = createInitialStructure('mtable');
            else if ($(target).hasClass('input-mtable22')) structure = createInitialStructure2(2);
            else if ($(target).hasClass('input-mtable33')) structure = createInitialStructure2(3);
        }
        tokenManager.insertToken(structure);
        caretManager.setCaret(tokenManager.token);
    });


    /* htmlで設定されている記号がmi要素か確認し、合ってればmi要素として挿入する。 */
    $('.character-button-table td').click(function(e) {
        var target = null;
        if (e.target.localName === 'mi') {
            target = e.target;
            console.log(target);
        }
        /**/
        else if ($(e.target).find('msup')[0]) {
            target = $(e.target).find('msup')[0];
            console.log(target);
            if (!(target && target.localName === 'msup')) {
                target = $(e.target).closest('msup')[0];
            }
        }
        /**/
        else {
            target = $(e.target).find('mi')[0];
            if (!(target && target.localName === 'mi')) {
                target = $(e.target).closest('mi')[0];
            }
        }
        if (target) {
            var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
            $(mi).addClass('character-node');
            var text = document.createTextNode(target.firstChild.nodeValue);
            mi.appendChild(text);
            tokenManager.insertToken(mi);
            caretManager.setCaret(tokenManager.token);
        }
        return;
    });



    $('.input-zero-or-one').click(function(e) {
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('zero-or-one')) {
            tokenManager.peelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelZeroOrOne);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }
    });
    $('.input-more').click(function(e) {
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('more')) {
            tokenManager.peelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelMore);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }
    });
    $('.input-boolean-or').click(function(e) {
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('boolean-or')) {
            tokenManager.addContentToEnclosingRect(null, $(tokenManager.token).closest('.enclosing-regular-expression'));
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelBooleanOr($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelBooleanOr);
            //tokenManager.moveToNextToken();　//そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }
    });
    //
    $('.input-wildcard').click(function(e) {
        // size calculation
        var radius = 0.3;
        var offset = 0.1;
        //
        var whsvg = 2 * radius + (offset * 2);
        var cxcy = radius + offset;
        //
        var xl1 = radius + offset;
        var yl1 = offset;
        var xl2 = (1 / Math.sqrt(2)) * radius + radius + offset;
        var yl2 = -(1 / Math.sqrt(2)) * radius + radius + offset;
        var xl3 = (radius * 2) + offset;
        var yl3 = radius + offset;
        //
        var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
        mpadded.setAttribute('lspace', '-0.02em');
        mpadded.setAttribute('width', '-0.04em');
        mpadded.setAttribute('voffset', '-0.1em');
        $(mpadded).addClass('character-node');
        $(mpadded).addClass('wildcard');
        $(mpadded).addClass('regular-expression');
        //
        var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', whsvg + 'em');
        svg.setAttribute('height', whsvg + 'em');
        //
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cxcy + 'em');
        circle.setAttribute('cy', cxcy + 'em');
        circle.setAttribute('r', radius + 'em');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('fill', 'none');
        var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', xl1 + 'em');
        line1.setAttribute('y1', yl1 + 'em');
        line1.setAttribute('x2', yl1 + 'em');
        line1.setAttribute('y2', xl1 + 'em');
        line1.setAttribute('stroke', 'black');
        var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', xl2 + 'em');
        line2.setAttribute('y1', yl2 + 'em');
        line2.setAttribute('x2', yl2 + 'em');
        line2.setAttribute('y2', xl2 + 'em');
        line2.setAttribute('stroke', 'black');
        var line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line3.setAttribute('x1', xl3 + 'em');
        line3.setAttribute('y1', yl3 + 'em');
        line3.setAttribute('x2', yl3 + 'em');
        line3.setAttribute('y2', xl3 + 'em');
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

    $('.input-character-class').click(function(e) {
        var mrow = tokenManager.createEnclosingRect();
        tokenManager.addContentToEnclosingRect(null, mrow);
        //
        $(mrow).addClass('character-class');
        var style = $(mrow).find('.style-enclosing-regular-expression')[0];
        $(style).addClass('style-character-class');
        //
        tokenManager.insertToken(mrow);
        tokenManager.setToken(style); //ここはいつかリファクタリング...
        tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
        caretManager.setCaret(tokenManager.token);
    });

    $('.input-negated-character-class').click(function(e) {
        var mrow = tokenManager.createEnclosingRect();
        tokenManager.addContentToEnclosingRect(null, mrow);
        //
        $(mrow).addClass('negated-character-class');
        var style = $(mrow).find('.style-enclosing-regular-expression')[0];
        $(style).addClass('style-negated-character-class');
        //
        tokenManager.insertToken(mrow);
        tokenManager.setToken(style); //ここはいつかリファクタリング...
        tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
        caretManager.setCaret(tokenManager.token);
    });

    $('.input-capturing').click(function(e) {
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('capturing')) {
            tokenManager.peelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelCapturing);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }
    });

    $('.input-backreference').click(function(e) {
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
        tokenManager.setToken(style); //ここはいつかリファクタリング...
        tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
        caretManager.setCaret(tokenManager.token);
    });


    //<!--ここから組み合わせ-->

    $('.Any-of-the-formula-back').click(function(e) {
        //<!--後方参照->
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('capturing')) {
            tokenManager.peelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelCapturing($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelCapturing);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }

        //<!--入力文字列の1回以上の繰り返し-->
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('more')) {
            tokenManager.peelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelMore);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }


        //<!--任意の1文字-->
        // size calculation
        var radius = 0.3;
        var offset = 0.1;
        //
        var whsvg = 2 * radius + (offset * 2);
        var cxcy = radius + offset;
        //
        var xl1 = radius + offset;
        var yl1 = offset;
        var xl2 = (1 / Math.sqrt(2)) * radius + radius + offset;
        var yl2 = -(1 / Math.sqrt(2)) * radius + radius + offset;
        var xl3 = (radius * 2) + offset;
        var yl3 = radius + offset;
        //
        var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
        mpadded.setAttribute('lspace', '-0.02em');
        mpadded.setAttribute('width', '-0.04em');
        mpadded.setAttribute('voffset', '-0.1em');
        $(mpadded).addClass('character-node');
        $(mpadded).addClass('wildcard');
        $(mpadded).addClass('regular-expression');
        //
        var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', whsvg + 'em');
        svg.setAttribute('height', whsvg + 'em');
        //
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cxcy + 'em');
        circle.setAttribute('cy', cxcy + 'em');
        circle.setAttribute('r', radius + 'em');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('fill', 'none');
        var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', xl1 + 'em');
        line1.setAttribute('y1', yl1 + 'em');
        line1.setAttribute('x2', yl1 + 'em');
        line1.setAttribute('y2', xl1 + 'em');
        line1.setAttribute('stroke', 'black');
        var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', xl2 + 'em');
        line2.setAttribute('y1', yl2 + 'em');
        line2.setAttribute('x2', yl2 + 'em');
        line2.setAttribute('y2', xl2 + 'em');
        line2.setAttribute('stroke', 'black');
        var line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line3.setAttribute('x1', xl3 + 'em');
        line3.setAttribute('y1', yl3 + 'em');
        line3.setAttribute('x2', yl3 + 'em');
        line3.setAttribute('y2', xl3 + 'em');
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


    $('.Any-of-the-formula').click(function(e) {
        //<!--入力文字列の1回以上の繰り返し-->
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('more')) {
            tokenManager.peelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelMore($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelMore);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }


        //<!--任意の1文字-->
        // size calculation
        var radius = 0.3;
        var offset = 0.1;
        //
        var whsvg = 2 * radius + (offset * 2);
        var cxcy = radius + offset;
        //
        var xl1 = radius + offset;
        var yl1 = offset;
        var xl2 = (1 / Math.sqrt(2)) * radius + radius + offset;
        var yl2 = -(1 / Math.sqrt(2)) * radius + radius + offset;
        var xl3 = (radius * 2) + offset;
        var yl3 = radius + offset;
        //
        var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
        mpadded.setAttribute('lspace', '-0.02em');
        mpadded.setAttribute('width', '-0.04em');
        mpadded.setAttribute('voffset', '-0.1em');
        $(mpadded).addClass('character-node');
        $(mpadded).addClass('wildcard');
        $(mpadded).addClass('regular-expression');
        //
        var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', whsvg + 'em');
        svg.setAttribute('height', whsvg + 'em');
        //
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cxcy + 'em');
        circle.setAttribute('cy', cxcy + 'em');
        circle.setAttribute('r', radius + 'em');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('fill', 'none');
        var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', xl1 + 'em');
        line1.setAttribute('y1', yl1 + 'em');
        line1.setAttribute('x2', yl1 + 'em');
        line1.setAttribute('y2', xl1 + 'em');
        line1.setAttribute('stroke', 'black');
        var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', xl2 + 'em');
        line2.setAttribute('y1', yl2 + 'em');
        line2.setAttribute('x2', yl2 + 'em');
        line2.setAttribute('y2', xl2 + 'em');
        line2.setAttribute('stroke', 'black');
        var line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line3.setAttribute('x1', xl3 + 'em');
        line3.setAttribute('y1', yl3 + 'em');
        line3.setAttribute('x2', yl3 + 'em');
        line3.setAttribute('y2', xl3 + 'em');
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


    $('.multiplication').click(function(e) {
        //<!--input zero or one-->
        if ($(tokenManager.token).hasClass('style-enclosing-regular-expression') && $(tokenManager.token).closest('.enclosing-regular-expression').hasClass('zero-or-one')) {
            tokenManager.peelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
            caretManager.setCaret(tokenManager.token);
        } else if ($(tokenManager.token).hasClass('style-enclosing-regular-expression')) {
            tokenManager.labelZeroOrOne($(tokenManager.token).closest('.enclosing-regular-expression')[0]);
        } else {
            tokenManager.createRectWithLabeling(tokenManager.labelZeroOrOne);
            tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
            caretManager.setCaret(tokenManager.token);
        }

        //<!--charactorclass-->
        var mrow = tokenManager.createEnclosingRect();
        tokenManager.addContentToEnclosingRect(null, mrow);
        //
        $(mrow).addClass('character-class');
        var style = $(mrow).find('.style-enclosing-regular-expression')[0];
        $(style).addClass('style-character-class');
        //
        tokenManager.insertToken(mrow);
        tokenManager.setToken(style); //ここはいつかリファクタリング...
        tokenManager.moveToPreviousToken(); //そのままだとユーザが意図しない挙動を誘発するためtokenを1つずらす
        caretManager.setCaret(tokenManager.token);

    });



    $('#queryView').click(function(e) {
        if (!$(e.target).closest('math')[0]) return;

        var forcused = $(e.target).closest('.character-node')[0];
        if (!forcused) {
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
    $(rectangleSelectionManager.svg).mousedown(function(e) {
        mousedownFlag = true;
        rectangleSelectionManager.rectangleSelectionStart(e);
        return;
    });
    $(rectangleSelectionManager.svg).mouseup(function(e) {
        mousedownFlag = false;
        rectangleSelectionManager.rectangleSelectionEnd();
        return;
    });
    $(rectangleSelectionManager.svg).mouseleave(function(e) {
        if (mousedownFlag) {
            mousedownFlag = false;
            rectangleSelectionManager.rectangleSelectionEnd();
        }
        return;
    });
    $(rectangleSelectionManager.svg).mousemove(function(e) {
        if (mousedownFlag) {
            rectangleSelectionManager.rectangleSelectionMove(e);
        }
        return;
    });

    return;
};

var HistoryQueryViewmanager = function(svg) {
    $('#queryView').click(function(e) {
        if (!$(e.target).closest('math')[0]) return;

        var forcused = $(e.target).closest('.character-node')[0];
        if (!forcused) {
            forcused = $(e.target).closest('.integration-node')[0];
        }

        tokenManager.setToken(forcused);
        caretManager.setCaret(tokenManager.token);
    });
}

var RectangleSelectionManager = function(svg, startFunction, endFunction) {
    var self = {};

    self.svg = svg;

    var rectParameter = { left: 0, top: 0, width: 0, height: 0, }; //矩形選択の矩形の座標とサイズ．svgの命名規則はX，Yだけど，css風に，left, topにする．
    var start = { left: 0, top: 0, }; //矩形選択が開始された座標
    var end = { left: 0, top: 0, }; //矩形選択が終了した(mousemove中の)座標
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
    self.rectangleSelectionStart = function(e) {
        /*
         * svg要素の位置を取得しておく．svg要素内のx,yを決定する際の基点として使う．
         * オフセットはここで取得．前もって取得してしまうとズレる．
         * offsetはgetBoundingClientRectでは取らない．math要素のoffsetはgetBoundingClientRectでは取れなくて，jqueryのoffsetで取るから，全部それに合わせておかないとズレる．
         */
        var svgOffset = $(svg).offset();
        startFunction(svg); //矩形選択開始時の処理の関数を呼ぶ
        selectingFlag = true;
        start.left = e.pageX - svgOffset.left;
        start.top = e.pageY - svgOffset.top;
        return;
    };

    self.rectangleSelectionEnd = function() {
        if (selectingFlag) {
            endFunction(svg, rectParameter); //矩形選択終了時の処理の関数を呼ぶ．
            selectingFlag = false; //矩形選択中フラグを落とす
            //矩形選択用rectを消す
            rectParameter.width = 0; //rectParameterは矩形選択終了時に呼ばれる関数に渡されるので，整合性を保つために0にしておく．
            rectParameter.height = 0;
            rect.setAttribute("width", rectParameter.width);
            rect.setAttribute("height", rectParameter.height);
        }
        return;
    };

    self.rectangleSelectionMove = function(e) {
        /*
         * svg要素の位置を取得しておく．svg要素内のx,yを決定する際の基点として使う．
         * オフセットはここで取得．前もって取得してしまうとズレる．
         * offsetはgetBoundingClientRectでは取らない．math要素のoffsetはgetBoundingClientRectでは取れなくて，jqueryのoffsetで取るから，全部それに合わせておかないとズレる．
         */
        var svgOffset = $(svg).offset();
        if (selectingFlag) {
            end.left = e.pageX - svgOffset.left;
            end.top = e.pageY - svgOffset.top;
            //矩形選択用の矩形のX,Y,width,heightを計算
            rectParameter.width = end.left - start.left;
            rectParameter.height = end.top - start.top;
            if (rectParameter.width > 0) //右側にドラッグした場合
            {
                rectParameter.left = start.left;
            } else //左側にドラッグした場合
            {
                rectParameter.left = end.left;
                rectParameter.width = -rectParameter.width;
            }
            //
            if (rectParameter.height > 0) //下側にドラッグした場合
            {
                rectParameter.top = start.top;
            } else //上側にドラッグした場合
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
    var disableSelection = function(target) {
        if (typeof target.onselectstart != "undefined") //IE route
            target.onselectstart = function() { return false }
        else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
            target.style.MozUserSelect = "none"
        else //All other route (ie: Opera)
            target.onmousedown = function() { return false }
        target.style.cursor = "default"
    };
    disableSelection(svg);

    return self;
};

var henkeiIkyoGetter_test = function() {
    //冒頭部分はrun~のパクリ
    $('#matched').html('<br />');
    $('#num').html('<br />');

    var test = document.createElement('div');
    test.getNextNodeByLocalName('test');

    var subDoc = window.opener.document;
    /*********
     * ここから，検証(マッチング)．
     *********/
    //最初のmath要素を全て取得

    var targetMathElements = $(subDoc).find("math");
    var brElements = $(subDoc).find("br");

    console.log(brElements);

    /*
     * 数式をすべてstr化
     */
    var strs = [];
    var distinctions = []; //数式特徴の配列
    var distinctionsOutput = [];
    var parents = [];
    // var nextSiblings = [];
    var nOfFormulae = 0; //数式の数

    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    var mathStrparseindex_ikyo;
    var mathStr_ikyo_l = new Array();
    var mathStr_ikyo_r = new Array();
    var mathStrparser_ikyo = new Array();

    var zenshiki_space = new Array();
    var k = 0; //追加される数式に対応するためのindexナンバー

    console.log("2019");
    //    console.log(targetMathElements);
    for (var i = 0; i < targetMathElements.length; i++) {
        normalizePmmlTree(targetMathElements[i]);
        //        console.log("targetMathElements[i]" + targetMathElements[i]);

        mathStr = createMathTreeString(targetMathElements[i]);
        console.log("mathstr : " + mathStr);

        mathStrparseindex_ikyo = mathStr.indexOf("=");
        if (mathStrparseindex_ikyo == -1) {
            mathStrparseindex_ikyo = mathStr.indexOf("≤");
            if (mathStrparseindex_ikyo == -1) {
                mathStrparseindex_ikyo = mathStr.indexOf("≥");
                if (mathStrparseindex_ikyo == -1) {
                    mathStrparseindex_ikyo = mathStr.indexOf("\<");
                    if (mathStrparseindex_ikyo == -1) {
                        mathStrparseindex_ikyo = mathStr.indexOf("\>");
                        if (mathStrparseindex_ikyo == -1) {
                            mathStrparseindex_ikyo = mathStr.indexOf("≪"); // <<
                            if (mathStrparseindex_ikyo == -1) {
                                mathStrparseindex_ikyo = mathStr.indexOf("≫"); // >>
                                if (mathStrparseindex_ikyo == -1) {
                                    mathStrparseindex_ikyo = mathStr.indexOf("≠");
                                    if (mathStrparseindex_ikyo == -1) {
                                        mathStrparseindex_ikyo = 0;
                                        mathStrparser_ikyo[k] = "";
                                    } else {
                                        mathStrparser_ikyo[k] = "≠";
                                    }
                                } else {
                                    mathStrparser_ikyo[k] = "≫"; // >>
                                }
                            } else {
                                mathStrparser_ikyo[k] = "≪"; // <<
                            }
                        } else {
                            mathStrparser_ikyo[k] = "\>";
                        }
                    } else {
                        mathStrparser_ikyo[k] = "\<";
                    }
                } else {
                    mathStrparser_ikyo[k] = "≥";
                }
            } else {
                mathStrparser_ikyo[k] = "≤";
            }
        } else {
            mathStrparser_ikyo[k] = "=";
        }

        if (mathStr.indexOf("∑") != -1) {
            mathStrparser_ikyo[k] = "";
            mathStrparseindex_ikyo = 0;
        }

        //var tempArray = new Array();
        //var tempParser = new Array();
        //var tempParseIndex = new Array();
        //LeftRightParse(mathStr, tempArray, tempParser, tempParseIndex);

        //console.log(mathStrparseindex_ikyo);
        if (mathStrparser_ikyo[k] == "=" && mathStrparseindex_ikyo == 0) {
            mathStr_ikyo_l[k] = mathStr_ikyo_r[k - 1]; //onigmoパターンの左辺を保存
            mathStr_ikyo_r[k] = mathStr.substr(mathStrparseindex_ikyo + 1); //onigmoパターンの右辺を保存
            zenshiki_space[k] = zenshiki_space[k - 1] + 1;
            // console.log(zenshiki_space[k]);
            // console.log(mathStr_ikyo_l[k] + mathStrparser_ikyo[k] + mathStr_ikyo_r[k]);
            // console.log(mathStr_ikyo_l[k]);
            // console.log(mathStrparser_ikyo[k]);
            // console.log(mathStr_ikyo_r[k]);
        } else {
            mathStr_ikyo_l[k] = mathStr.substring(0, mathStrparseindex_ikyo); //onigmoパターンの左辺を保存
            mathStr_ikyo_r[k] = mathStr.substr(mathStrparseindex_ikyo + 1); //onigmoパターンの右辺を保存
            zenshiki_space[k] = 0;
            // console.log(zenshiki_space[k]);
            // console.log(mathStr_ikyo_l[k] + mathStrparser_ikyo[k] + mathStr_ikyo_r[k]);


        }
        //console.log(mathStr_ikyo_l);
        //console.log(mathStr_ikyo_r);
        //console.log("にゃ");
        console.log(mathStr_ikyo_l[k] + mathStrparser_ikyo[k] + mathStr_ikyo_r[k]);

        //右辺から、更に＝を抽出してみて、できたらiをさらに＋1し、右辺の中の左辺，右辺の中の右辺を分割して、i使って配列にmathStr_ikyo_l/rにぶち込む

        /*
        if(mathStrparser_ikyo[k] == "=") {
            mathStrparseindex_ikyo = mathStr_ikyo_r[k].indexOf("=");
            if(mathStrparseindex_ikyo == -1) {
                strs.push(mathStr_ikyo_l[k] + mathStrparser_ikyo[k] + mathStr_ikyo_r[k]);
            } else {

                strs.push(mathStr_ikyo_l[k] + mathStrparseindex_ikyo[k] + mathStr_ikyo_r[k]);
                k = k+1;
                mathStrparser_ikyo[k] = "=";
                mathStr_ikyo_l[k] = mathStr_ikyo_r[k-1].substring(0,mathStrparseindex_ikyo); //onigmoパターンの左辺を保存
                mathStr_ikyo_r[k] = mathStr_ikyo_r[k-1].substr(mathStrparseindex_ikyo+1);    //onigmoパターンの右辺を保存
                strs.push(mathStr_ikyo_l[k] + mathStrparseindex_ikyo[k] + mathStr_ikyo_r[k]);
            }
        }
        */

        if (zenshiki_space[k] == 0) {
            //通常のA=Bみたいな数式なら、mathStrをそのままstrsに入れる
            strs.push(mathStr);
            console.log("1870なう");
        } else {
            //＝から始まる =C みたいな途中式なら、前式の右辺 = C みたいにして入れたい。
            var tempStr = mathStr_ikyo_l[k] + mathStrparser_ikyo[k] + mathStr_ikyo_r[k];
            strs.push(tempStr);
            console.log("1875なう");
        }

        mathStr = createMathTreeStringT(targetMathElements[i]);
        //console.log(mathStr);
        distinctions.push(mathStr);
        parents.push(targetMathElements[i].parentNode);
        // console.log("targetMathElements[i].parentNode" + targetMathElements[i]);
        // console.log("parents:"+ parents);
        // console.log("distinction:"+ distinctions);
        k++;
    }


    //マッチング
    var strs_before = strs;
    //var strs_after = new Array();
    var mathStr_ikyo_hozon_left = new Array();
    var mathStr_ikyo_hozon_right = new Array();
    var matched_flag = new Array();
    var result_ikyo = new Array();
    var ikyo = new Array();
    var finish_flag = new Array();
    var mathStr_ikyo_l_to_after = new Array();
    var mathStr_ikyo_r_to_after = new Array();
    var brackets_flag_l = new Array();
    var brackets_flag_r = new Array();
    var nextdistinctions = [];
    var nextstrs = [];
    var nextparents = [];

    //マッチング
    ikyo = ikyo_matching(strs, mathStr_ikyo_l, mathStr_ikyo_r, k, mathStrparser_ikyo, distinctions);
    results_ikyo = ikyo[0];
    mathStr_ikyo_hozon_left = ikyo[1];
    mathStr_ikyo_hozon_right = ikyo[2];
    finish_flag = ikyo[3];
    mathStr_ikyo_l_to_after = ikyo[4];
    mathStr_ikyo_r_to_after = ikyo[5];
    brackets_flag_l = ikyo[6];
    brackets_flag_r = ikyo[7];

    console.table(mathStr_ikyo_l);

    var nextdtcid = new Array();

    var mathuri = new RegExp("<math mathsize=\"250%\" xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\">");
    var mathsep = new RegExp("<mi>\≥<\/mi>");
    var mathsep2 = new RegExp("<mi>\≤<\/mi>");
    var momi = new RegExp("<mi> <\/mi>");
    var rbFileName = '';
    rbFileName = './wapi.rb';
    console.table(finish_flag);
    var nextmathStrparseindex_ikyo;
    var nextmathStr_ikyo_l = new Array();
    var nextmathStr_ikyo_r = new Array();
    var nextmathStrparser_ikyo = new Array();

    var nextzenshiki_space = new Array();
    var nextikyo = new Array();
    var s = 0;

    for (var i = 0; i < targetMathElements.length; i++) {

        if(finish_flag[i] == 0){
            //nextdtcid[s] = i;
            nextdistinctions[i] = distinctions[i].replace(mathuri, "<math><mfrac><mn>1<\/mn><mn>2<\/mn><\/mfrac><mo>*<\/mo><mo>(<\/mo>");
            if(distinctions[i].indexOf("\≥") != -1 ){
                nextdistinctions[i] = nextdistinctions[i].replace(mathsep, "<mi>)<\/mi><mi>=<\/mi>");
            }
            if(distinctions[i].indexOf("\≤") != -1 ){
            nextdistinctions[i] = nextdistinctions[i].replace(mathsep2, "<mi>)<\/mi><mi>=<\/mi>");
            }
            if(distinctions[i].indexOf("\+") != -1){
                nextdistinctions[i] = nextdistinctions[i].replace("\+", "%2B");
            }
            nextdistinctions[i] = nextdistinctions[i].replace("<\/math>", "<mo>\/<\/mo><mn>2<\/mn><\/math>");

            $.ajax({
                type: 'POST',
                url: rbFileName,
                async: false,
                traditional: true,
                datatype: 'html',
                data:{
                'query': nextdistinctions[i]
                }
            })
            .done( function(results) {
                    var after_mathuri = new RegExp("<math xmlns=\'http:\/\/www\.w3\.org\/1998\/Math\/MathML\'        mathematica:form=\'StandardForm\'        xmlns:mathematica=\'http:\/\/www\.wolfram\.com\/XML\/\'>");
                    var fmath = results.indexOf("<mathml>");
                    var amath = results.indexOf("<\/mathml>");

                    presults = results.substring(fmath, amath+9);

                    fresults = presults.replace(/\r?\n/g, '');
                    mresults = fresults.replace(/>\s+/g, ">");

                    mresults = mresults.replace('=<','≥<');

                    if(mresults.indexOf("<mo>") != -1){
                        mresults = mresults.replace(/<mo>/g, "<mi>");
                    }
                    if(mresults.indexOf("<\/mo>") != -1){
                        mresults = mresults.replace(/<\/mo>/g, "<\/mi>");
                    }
                    if(mresults.indexOf("<mn>") != -1){
                        mresults = mresults.replace(/<mn>/g, "<mrow><mi>");
                    }
                    if(mresults.indexOf("<\/mn>") != -1){
                        mresults = mresults.replace(/<\/mn>/g, "<\/mi><\/mrow>");
                    }
                    if(mresults.indexOf("<mi>\u2062<\/mi>") != -1){
                        mresults = mresults.replace("<mi>\u2062<\/mi>", "");
                    }
                    nextdistinctions[i] = mresults;
                    console.log('通信成功');

                    nextdistinctions[i] = nextdistinctions[i].replace(after_mathuri, "<math mathsize=\"250%\" xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\">");
                    //nextdistinctions[i] = nextdistinctions[i].replace("<mathml>", "");
                    //nextdistinctions[i] = nextdistinctions[i].replace("<\/mathml>", "");
                })
            .fail( function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(
                        'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                        'textStatus : ' + textStatus + '\n' +
                        'errorThrown : ' + errorThrown.message
                    );
                });
        }else{
            nextdistinctions[i] = distinctions[i];
        }
    }
    /*
    for (var i = 0; i < targetMathElements.length; i++) {

    if(finish_flag[i] == 0){

const express = require('express');

const Mathml2latex = require('mathml-to-latex');
var {PythonShell} = require('python-shell');
var pyshell = new PythonShell('script.py');


      var mathml = `
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mn>2</mn><msqrt><mi>a</mi><mi>b</mi></msqrt><mo>≤</mo><mi>a</mi><mo>+</mo><mi>b</mi></math>
      `;



      var mathml = `
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mfenced>
      <msubsup>
      <mi>a</mi>
      <mn>1</mn>
      <mn>2</mn>
      </msubsup>
      <mo>+</mo>
      <msubsup>
      <mi>a</mi>
      <mn>2</mn>
      <mn>2</mn>
      </msubsup>
      </mfenced>
      <mfenced>
      <msubsup>
      <mi>b</mi>
      <mn>1</mn>
      <mn>2</mn>
      </msubsup>
      <mo>+</mo>
      <msubsup>
      <mi>b</mi>
      <mn>2</mn>
      <mn>2</mn>
      </msubsup>
      </mfenced>
      <mo>≥</mo>
      <msub>
      <mrow>
      <mfenced>
      <msubsup>
      <mi>a</mi>
      <mn>1</mn>
      <mn>2</mn>
      </msubsup>
      <msubsup>
      <mi>a</mi>
      <mn>2</mn>
      <mn>2</mn>
      </msubsup>
      <mo>+</mo>
      <msubsup>
      <mi>b</mi>
      <mn>1</mn>
      <mn>2</mn>
      </msubsup>
      <msubsup>
      <mi>b</mi>
      <mn>2</mn>
      <mn>2</mn>
      </msubsup>
      </mfenced>
      </mrow>
      <mn>2</mn>
      </msub>
      </math>
      `;

      var mathml = distinctions[i];

      console.log(mathml);


      var kekka = Mathml2latex.convert(mathml);

      console.log(kekka);

      let pythonshell = new PythonShell('script.py');

      pythonshell.send(kekka);

      var get;

       get = pythonshell.on("message", function (message) {
        console.log(message);
        });

        //console.log(test);

        exports.a = get;

        pythonshell.end();

            };
        }*/


    var l = 0;
    /*
    for(var i=0; i < targetMathElements.length; i++){
        normalizePmmlTree($(nextdistinctions[i])[0]);
        nextmathStr = createMathTreeString($(nextdistinctions[i])[0]);

        nextmathStrparseindex_ikyo = nextmathStr.indexOf("=");
        if (nextmathStrparseindex_ikyo == -1) {
            nextmathStrparseindex_ikyo = nextmathStr.indexOf("≤");
            if (nextmathStrparseindex_ikyo == -1) {
                nextmathStrparseindex_ikyo = nextmathStr.indexOf("≥");
                if (nextmathStrparseindex_ikyo == -1) {
                    nextmathStrparseindex_ikyo = nextmathStr.indexOf("\<");
                    if (nextmathStrparseindex_ikyo == -1) {
                        nextmathStrparseindex_ikyo = nextmathStr.indexOf("\>");
                        if (nextmathStrparseindex_ikyo == -1) {
                            nextmathStrparseindex_ikyo = nextmathStr.indexOf("≪"); // <<
                            if (nextmathStrparseindex_ikyo == -1) {
                                nextmathStrparseindex_ikyo = nextmathStr.indexOf("≫"); // >>
                                if (nextmathStrparseindex_ikyo == -1) {
                                    nextmathStrparseindex_ikyo = nextmathStr.indexOf("≠");
                                    if (nextmathStrparseindex_ikyo == -1) {
                                        nextmathStrparseindex_ikyo = 0;
                                        nextmathStrparser_ikyo[l] = "";
                                    } else {
                                        nextmathStrparser_ikyo[l] = "≠";
                                    }
                                } else {
                                    nextmathStrparser_ikyo[l] = "≫"; // >>
                                }
                            } else {
                                nextmathStrparser_ikyo[l] = "≪"; // <<
                            }
                        } else {
                            nextmathStrparser_ikyo[l] = "\>";
                        }
                    } else {
                        nextmathStrparser_ikyo[l] = "\<";
                    }
                } else {
                    nextmathStrparser_ikyo[l] = "≥";
                }
            } else {
                nextmathStrparser_ikyo[l] = "≤";
            }
        } else {
            nextmathStrparser_ikyo[l] = "=";
        }

        if (nextmathStr.indexOf("∑") != -1) {
            nextmathStrparser_ikyo[l] = "";
            nextmathStrparseindex_ikyo = 0;
        }

        if (nextmathStrparser_ikyo[l] == "=" && nextmathStrparseindex_ikyo == 0) {
            nextmathStr_ikyo_l[l] = nextmathStr_ikyo_r[l - 1]; //onigmoパターンの左辺を保存
            nextmathStr_ikyo_r[l] = nextmathStr.substr(nextmathStrparseindex_ikyo + 1); //onigmoパターンの右辺を保存
            nextzenshiki_space[l] = nextzenshiki_space[l - 1] + 1;
        } else {
            nextmathStr_ikyo_l[l] = nextmathStr.substring(0, nextmathStrparseindex_ikyo); //onigmoパターンの左辺を保存
            nextmathStr_ikyo_r[l] = nextmathStr.substr(nextmathStrparseindex_ikyo + 1); //onigmoパターンの右辺を保存
            nextzenshiki_space[l] = 0;
        }

        if (nextzenshiki_space[l] == 0) {
            //通常のA=Bみたいな数式なら、mathStrをそのままstrsに入れる
            nextstrs.push(nextmathStr);
            console.log("2196なう");
        } else {
            //＝から始まる =C みたいな途中式なら、前式の右辺 = C みたいにして入れたい。
            var nexttempStr = nextmathStr_ikyo_l[l] + nextmathStrparser_ikyo[l] + nextmathStr_ikyo_r[l]
            nextstrs.push(nexttempStr);
            console.log("2201なう");
        }

        nextmathStr = createMathTreeStringT($(nextdistinctions[i])[0]);
        //console.log(mathStr);
        nextdistinctions[i] = nextmathStr;
        nextparents.push($(nextdistinctions[i]).parentNode);
        l++;
    }*/
    //var nexttargetMathElements = nextdistinctions.find("math");
    //console.table(nexttargetMathElements);
    //for(var j=0; j < nextdistinctions.length; j++){
    //    normalizePmmlTree(nexttargetMathElements[j]);
    //    nextmathStr = createMathTreeString(nexttargetMathElements[j]);
    //    console.log("mathstr : " + nextmathStr);
    //}

    var nextmathStr_ikyo_hozon_left = new Array();
    var nextmathStr_ikyo_hozon_right = new Array();
    var nextmatched_flag = new Array();
    var nextresult_ikyo = new Array();
    var nextikyo = new Array();
    var nextfinish_flag = new Array();
    var nextmathStr_ikyo_l_to_after = new Array();
    var nextmathStr_ikyo_r_to_after = new Array();
    var nextbrackets_flag_l = new Array();
    var nextbrackets_flag_r = new Array();
    var nextkoushikimei;
    nextikyo = ikyo_matching(nextstrs, nextmathStr_ikyo_l, nextmathStr_ikyo_r, l, nextmathStrparser_ikyo, nextdistinctions);

    nextresult_ikyo = nextikyo[0];
    nextmathStr_ikyo_hozon_left = nextikyo[1];
    nextmathStr_ikyo_hozon_right = nextikyo[2];
    nextfinish_flag = nextikyo[3];
    nextmathStr_ikyo_l_to_after = nextikyo[4];
    nextmathStr_ikyo_r_to_after = nextikyo[5];
    nextbrackets_flag_l = nextikyo[6];
    nextbrackets_flag_r = nextikyo[7];

    console.table(results_ikyo);

    /*

    for(var i = 0; i < results_ikyo.length; i++){
        if(finish_flag[i] != nextfinish_flag[i]){
            var fromkousikimei = nextresult_ikyo[i].indexOf("←");
            nextkoushikimei = nextresult_ikyo[i].slice(fromkousikimei);
            results_ikyo[i] = "/::::::::::/{" + results_ikyo[i] + "/}" + nextkoushikimei;
            distinctions[i] = nextdistinctions[i];
        }
    }
*/
    console.table(results_ikyo);


    //表示
    var left1 = new RegExp("<mi>\\(<\/mi>", "g");
    var right1 = new RegExp("<mi>\\)<\/mi>", "g");
    var left2 = new RegExp("<mi>\\[<\/mi>", "g");
    var right2 = new RegExp("<mi>\\]<\/mi>", "g");

    var mstyle = new RegExp("<mstyle xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\" mathbackground=\"yellow\">", "g");
    //    var mstyle = new RegExp("<mstyle xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\" mathbackground=\"lemonchiffon\">", "g");

    var results_bunkai = new Array();

    //var mstyle = new RegExp("mstyle","g");
    var mstyle_tag = new RegExp('<mrow>', "g");
    //var string = '<math xmlns="http://www.w3.org/1998/Math/MathML" mathsize="350%">';
    //string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

    //var math_tag = new RegExp(string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), "g");
    //console.log(string);

    var mspace_tag = new RegExp('<mspace width=\\"100px\\" \\/>', "g");

    var Table = document.createElement('table');
    var c = 0;
    //div = div + "<br\/>" + "<math";
    console.log('henkeiIkyoGetter Finish!!!');
    //console.log("results_ikyo.length: " + results_ikyo.length);
    for (i = 0; i < results_ikyo.length; i++) {
        if (mathStrparser_ikyo[i] == "") {
            //console.log(results_ikyo[i]);
        }
        var spase_flag = 0;
        if (zenshiki_space[i] != 0 && results_ikyo[i].indexOf("/::::::::::/") == -1) { //もし頭が＝から始まる数式で，カラーリングが成されていなければ
            var ikyoparser = results_ikyo[i].indexOf("=");
            if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] != "") {
                results_ikyo[i] = "=" + mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(ikyoparser + 1) + mathStr_ikyo_hozon_right[i];
            } else if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] == "") {
                results_ikyo[i] = "=" + mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(ikyoparser + 1);
            } else if (mathStr_ikyo_hozon_right[i] != "" && mathStr_ikyo_hozon_left[i] == "") {
                results_ikyo[i] = results_ikyo[i].substring(ikyoparser) + mathStr_ikyo_hozon_right[i];
            } else {
                results_ikyo[i] = results_ikyo[i].substring(ikyoparser);
            }
            //console.log(i + "番目の数式の左辺を消しました");
            spase_flag = 1;
        }
        // console.log("表示");
        // console.table(results_ikyo);
        if (mathStrparser_ikyo[i] == "") {

            //console.log(results_ikyo[i]);
        }
        //検索結果をぶち込むためのテーブルを準備
        /*
        if(i == 0) {
            Table = document.createElement('table');
        }
        */
        var Row = Table.insertRow(-1);
        var a = 0;
        for (a = 0; a < 5; a++) {
            var Td = Row.insertCell(-1);
            if (a == 0) {
                Td.setAttribute('align', 'right');
            }
        }
        //Table.rows[0].cells[4].innerHTML = "<input type=\"button\" value=\"Answer\" class=\"Answer\" id=\"Answer\"/>";
        if (jikken_flag == 1) {
            Table.border = 1;
        }
        // for(a = 0; a < 5; a++){
        //     if(a != 4){
        //         Table.style.borderColor = "white";
        //     }
        // }

        //Table.rows[0].cells[4].innerText = "<input type=\"button\" value=\"Answer\" class=\"Answer\" id=\"Answer\"/>";

        //        console.log("3:" + mathStrparser_ikyo[i]);
        var ikyoindex = results_ikyo[i].indexOf(mathStrparser_ikyo[i]);
        if (mathStrparser_ikyo[i] != "") {
            //            console.log(results_ikyo[i]);
            var ikyokoushikimei = results_ikyo[i].indexOf("←∵");
            if (ikyokoushikimei != -1) { //依拠する公式があれば
                console.log("ここまでＯＫ");
                results_bunkai[0] = results_ikyo[i].substring(0, ikyoindex);
                results_bunkai[1] = mathStrparser_ikyo[i];
                results_bunkai[2] = results_ikyo[i].substring(ikyoindex + 1, ikyokoushikimei);
                //どうやって、公式名の後ろに、数式のマッチした部分のカラー無し版を挿入できるか考える
                //results_bunkai[3] = results_ikyo[i].substring(ikyokoushikimei); //もともと

                //ピタゴラスの定理については等号不等号で一度分解して左辺と右辺をそれぞれカラーリング（全体をカラーリングじゃない）なので、左辺右辺それぞれの"{", "}"の数は一致するはずだが、
                //他は数式全体がカラーリングされるので、分解時に括弧の数が合わなくなる。
                //一般的な公式検索は全体がカラーリングされるので、左辺に"/::::::::::/"があれば、"{"の数は左辺の方が多い(lnumber_zero > rnumber_zero)はず
                lnumber_zero = (results_bunkai[0].match(new RegExp("{", "g")) || []).length;
                rnumber_zero = (results_bunkai[0].match(new RegExp("}", "g")) || []).length;

                //一般的な公式検索は全体がカラーリングされるので、左辺に"/::::::::::/"があれば、"}"の数は右辺の方が多い(lnumber_two < rnumber_two)はず
                lnumber_two = (results_bunkai[2].match(new RegExp("{", "g")) || []).length;
                rnumber_two = (results_bunkai[2].match(new RegExp("}", "g")) || []).length;


                //左辺の中の{の数 > 左辺の中の}の数 なら、左辺の最後に閉じ括弧を入れる。

                if (lnumber_zero > rnumber_zero) {
                    if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] != "") {
                        results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_bunkai[0] + "/}" + mathStr_ikyo_hozon_right[i];
                    } else if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] == "") {
                        results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_bunkai[0] + "/}";
                    } else if (mathStr_ikyo_hozon_right[i] != "" && mathStr_ikyo_hozon_left[i] == "") {
                        results_bunkai[0] = results_bunkai[0] + "/}" + mathStr_ikyo_hozon_right[i];
                    } else {
                        results_bunkai[0] = results_bunkai[0] + "/}";
                    }
                }

                //                console.log("results_bunkai[0]:" + results_bunkai[0]);
                //右辺の中の{の数 > 右辺の中の}の数 なら、右辺の頭にmstyle要素と開き括弧を入れる。 (公式がマッチするやつだけやってるので、右辺全体をカラーリングで問題ない)
                if (lnumber_two < rnumber_two) {
                    if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] != "") {
                        results_bunkai[2] = mathStr_ikyo_hozon_left[i] + "/::::::::::/{" + results_bunkai[2] + mathStr_ikyo_hozon_right[i];
                    } else if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] == "") {
                        results_bunkai[2] = mathStr_ikyo_hozon_left[i] + "/::::::::::/{" + results_bunkai[2];
                    } else if (mathStr_ikyo_hozon_right[i] != "" && mathStr_ikyo_hozon_left[i] == "") {
                        results_bunkai[2] = "/::::::::::/{" + results_bunkai[2] + mathStr_ikyo_hozon_right[i];
                    } else {
                        results_bunkai[2] = "/::::::::::/{" + results_bunkai[2];
                    }
                    //                    }
                }


                //左辺から、色を付加している部分だけ抜き取る
                //参考: https://ja.stackoverflow.com/questions/32938/python%E3%81%A7%E6%8B%AC%E5%BC%A7%E3%81%AE%E5%85%A5%E3%82%8C%E5%AD%90%E3%82%92%E6%A4%9C%E5%87%BA

                //まず色付け部分がどこからスタートしてるか見つける
                var iroduke_index = results_bunkai[0].indexOf("/::::::::::/{");

                //左辺の、色付けされた部分以降をとりあえず全部切り取ってしまう
                var kari_onigmo = results_bunkai[0].substring(iroduke_index + 13);

                //左辺の色付けされた部分を最終的に格納する変数を定義
                var tmp_zero = "";

                //括弧は開きと閉じでペアになるはず
                //文字列の最初から1トークンずつ読んでいって、開き括弧"/{"があればレベルを+1、閉じ括弧"/}"があればレベルを-1にする
                //先ほど色付け部分をスタートしている開き括弧を消したので、レベルは1からスタート。
                //これをゼロにする閉じ括弧が、色付け部分を閉じる括弧
                var level = 1;

                //トークンに分解。使ってる関数は、検索の最後とかにも使われてるconvertReplacement.jsのtokenizeParsedString
                var tmptokens = tokenizeParsedString(kari_onigmo, 0);

                //1トークンずつ確認して、開き括弧があればレベルを+1、閉じ括弧があればレベルを-1する。
                for (var x = 0; x < tmptokens.length; x++) {
                    // console.log(x);
                    // console.log(tmptokens[x]);
                    if (tmptokens[x] == "/{") {
                        level = level + 1;
                    } else if (tmptokens[x] == "/}") {
                        level = level - 1;
                    }
                    //                    console.log(level);

                    //レベルがゼロになったら(現在見ているトークンが色付け部分の閉じ括弧だったら)、ループを強制終了
                    //レベルが0以外の状態(1とか2とか)なら、そこは色付け対象になっている部分なので、変数に格納
                    if (level == 0) {
                        //                        console.log(tmp_zero);
                        break;
                    } else {
                        tmp_zero = tmp_zero + tmptokens[x];
                    }

                    //これで、元々のkari_onigmoから、色付け部分を終了する閉じ括弧のみを消した文字列が、tmp_zeroに格納されるはず
                    //                    console.log(tmp_zero);
                }

                //ここまでで左辺の色付け部分抽出が終了
                //右辺についても、変数名だけ変えて、同様に処理
                iroduke_index = results_bunkai[2].indexOf("/::::::::::/{");
                kari_onigmo = results_bunkai[2].substring(iroduke_index + 13); //頭の色付け括弧が外れた状態になる
                var tmp_two = "";
                level = 1;
                tmptokens = tokenizeParsedString(kari_onigmo, 0);
                for (var x = 0; x < tmptokens.length; x++) {
                    // console.log(x);
                    // console.log(tmptokens[x]);
                    if (tmptokens[x] == "/{") {
                        level = level + 1;
                    } else if (tmptokens[x] == "/}") {
                        level = level - 1;
                    }
                    //                    console.log(level);
                    if (level == 0) {
                        //                        console.log(tmp_zero);
                        break;
                    } else {
                        tmp_two = tmp_two + tmptokens[x];
                    }
                    //                    console.log(tmp_two);
                }

                //最後に、←∵”公式名” + ( + 左辺の色付けされてた部分 + 等号や不等号 + 右辺の色付けされてた部分 + )
                results_bunkai[3] = results_ikyo[i].substring(ikyokoushikimei) + "(" + tmp_zero + mathStrparser_ikyo[i] + tmp_two + ")";


            } else {
                if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] != "" && spase_flag == 0) {
                    results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(0, ikyoindex) + mathStr_ikyo_hozon_right[i];
                    results_bunkai[1] = mathStrparser_ikyo[i];
                    results_bunkai[2] = mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(ikyoindex + 1) + mathStr_ikyo_hozon_right[i];
                    results_bunkai[3] = "";
                } else if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] == "" && spase_flag == 0) {
                    results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(0, ikyoindex);
                    results_bunkai[1] = mathStrparser_ikyo[i];
                    results_bunkai[2] = mathStr_ikyo_hozon_left[i] + results_ikyo[i].substring(ikyoindex + 1);
                    results_bunkai[3] = "";
                } else if (mathStr_ikyo_hozon_right[i] != "" && mathStr_ikyo_hozon_left[i] == "" && spase_flag == 0) {
                    results_bunkai[0] = results_ikyo[i].substring(0, ikyoindex) + mathStr_ikyo_hozon_right[i];
                    results_bunkai[1] = mathStrparser_ikyo[i];
                    results_bunkai[2] = results_ikyo[i].substring(ikyoindex + 1) + mathStr_ikyo_hozon_right[i];
                    results_bunkai[3] = "";
                } else {
                    results_bunkai[0] = results_ikyo[i].substring(0, ikyoindex);
                    results_bunkai[1] = mathStrparser_ikyo[i];
                    results_bunkai[2] = results_ikyo[i].substring(ikyoindex + 1);
                    results_bunkai[3] = "";
                }
                if (mathStrparser_ikyo[i] != "=") {
                    console.log("2234なう" + results_ikyo[i]);
                }
            }
        } else {
            if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] != "") {
                results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_ikyo[i] + mathStr_ikyo_hozon_right[i];
            } else if (mathStr_ikyo_hozon_left[i] != "" && mathStr_ikyo_hozon_right[i] == "") {
                results_bunkai[0] = mathStr_ikyo_hozon_left[i] + results_ikyo[i];
            } else if (mathStr_ikyo_hozon_right[i] != "" && mathStr_ikyo_hozon_left[i] == "") {
                results_bunkai[0] = results_ikyo[i] + mathStr_ikyo_hozon_right[i];
            } else {
                results_bunkai[0] = results_ikyo[i];
            }
            //results_bunkai[0] = results_ikyo[i];
            results_bunkai[1] = "";
            results_bunkai[2] = "";
            results_bunkai[3] = "";
            //console.log(results_ikyo[i]);
        }

        console.log(results_ikyo[i]);
        console.log(results_bunkai[0]);
        //console.table(results_bunkai[0]);
        console.log(results_bunkai[1]);
        console.log(results_bunkai[2]);
        console.log(results_bunkai[3]);

        console.table(result_ikyo[i]);
        console.log("c=" + c);

        if (ikyoindex != -1 /* && results_ikyo[i].indexOf("←∵") != -1*/ ) {

            if (zenshiki_space[i] != 0) {
                //if(results_bunkai[0].length != 0){
                console.log("1のとこ");
                var kara_flag = 0;
                if (results_bunkai[0].length > 0) {
                    console.log("空でない");

                    for (var a = 0; a <= 1; a++) {
                        if (results_bunkai[a] != null) {
                            var tokens = tokenizeParsedString(results_bunkai[a]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
                            console.log(tokens);

                            var replacedMath = buildMathMLFromParsedString(tokens, 0);
                            console.log(replacedMath);

                            /*
                            if (replacedMath.innerHTML.match(left1) != null && replacedMath.innerHTML.match(left1).length == replacedMath.innerHTML.match(right1).length) {
                                replacedMath.innerHTML = replacedMath.innerHTML.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする
                                replacedMath.innerHTML = replacedMath.innerHTML.replace(right1, "<\/mrow><\/mfenced>");
                            }
                            if (replacedMath.innerHTML.match(left2) != null && replacedMath.innerHTML.match(left2).length == replacedMath.innerHTML.match(right2).length) {
                                replacedMath.innerHTML = replacedMath.innerHTML.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする
                                replacedMath.innerHTML = replacedMath.innerHTML.replace(right2, "<\/mrow><\/mfenced>");
                            }
                            */

                            replacedMath.setAttribute('mathsize', '250%');
                            replacedMath.setAttribute('xmlns', 'http:\/\/www.w3.org\/1998\/Math\/MathML');
                            console.log(replacedMath);
                            if (a == 1) {
                                Table.rows[c].cells[a].innerHTML = replacedMath.outerHTML;
                            } else {
                                Table.rows[c].cells[2].innerHTML = replacedMath.outerHTML;
                            }
                            //                        Table.rows[i].cells[a].innerHTML = replacedMath.outerHTML;
                            if (jikken_flag == 1) {
                                Table.rows[c].cells[3].style.backgroundColor = 'gray';
                            }
                        } else {

                        }
                    }
                    c++;
                    console.log("c=" + c);

                    var Row = Table.insertRow(-1);
                    var a = 0;
                    for (a = 0; a < 4; a++) {
                        var Td = Row.insertCell(-1);
                        if (a == 0) {
                            Td.setAttribute('align', 'right');
                            //Table.rows[i].cells[0].innnerHTML = "<input type=\"button\" value=\"Answer\" class=\"Answer\" id=\"Answer\"/>";
                        }
                    }
                    //Table.rows[c].cells[4].innerHTML = "<input type=\"button\" value=\"Answer\" onclick= \"Answer_action()\"/>";
                    //Table.rows[c].cells[4].innerHTML = "<input type=\"button\" value=\"Answer\" class=\"Answer\" id=\"Answer\" />";
                    //Table.border = 1;
                } else {
                    console.log("空");
                    kara_flag = 1;
                }
                //results_bunkai[0] = 0;
                for (var a = 1; a < 4; a++) {
                    if (results_bunkai[a] != null) {
                        console.log(a);
                        var tokens = tokenizeParsedString(results_bunkai[a]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
                        console.log(tokens);

                        var replacedMath = buildMathMLFromParsedString(tokens, 0);
                        console.log(replacedMath);

                        /*
                        if (replacedMath.innerHTML.match(left1) != null && replacedMath.innerHTML.match(left1).length == replacedMath.innerHTML.match(right1).length) {
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(right1, "<\/mrow><\/mfenced>");
                        }
                        if (replacedMath.innerHTML.match(left2) != null && replacedMath.innerHTML.match(left2).length == replacedMath.innerHTML.match(right2).length) {
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(right2, "<\/mrow><\/mfenced>");
                        }
                        */

                        replacedMath.setAttribute('mathsize', '250%');
                        if (jikken_flag == 1 && a == 3) {
                            replacedMath.setAttribute('mathcolor', 'white');
                        }
                        replacedMath.setAttribute('xmlns', 'http:\/\/www.w3.org\/1998\/Math\/MathML');
                        console.log(replacedMath);
                        //                        Table.rows[c].cells[0].innerHTML = "";
                        // if(jikken_flag == 1 && a == 3){

                        // }else{
                        //     Table.rows[c].cells[a].innerHTML = replacedMath.outerHTML;
                        // }
                        Table.rows[c].cells[a].innerHTML = replacedMath.outerHTML;

                        if (jikken_flag == 1 && a == 3) {
                            replacedMath.setAttribute('mathcolor', 'black');
                            replaceMath_jikken[c] = replacedMath;
                            console.log("replaceMath_jikken[c]");
                            console.log(replaceMath_jikken[c]);
                        }
                        if (jikken_flag == 1 && kara_flag == 1 && a == 3) {
                            Table.rows[c].cells[3].style.backgroundColor = 'gray';
                        }

                        //                        Table.rows[i].cells[a].innerHTML = replacedMath.outerHTML;
                    } else {

                    }
                }
                c++;
                console.log("c=" + c);

            } else {

                console.log("2のとこ");
                for (var a = 0; a < 4; a++) {
                    if (results_bunkai[a] != null) {
                        var tokens = tokenizeParsedString(results_bunkai[a]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
                        console.log(tokens);

                        var replacedMath = buildMathMLFromParsedString(tokens, 0);
                        console.log(replacedMath.innerHTML);

                        /*
                        if (replacedMath.innerHTML.match(left1) != null && replacedMath.innerHTML.match(left1).length == replacedMath.innerHTML.match(right1).length) {
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(right1, "<\/mrow><\/mfenced>");
                        }
                        if (replacedMath.innerHTML.match(left2) != null && replacedMath.innerHTML.match(left2).length == replacedMath.innerHTML.match(right2).length) {
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする
                            replacedMath.innerHTML = replacedMath.innerHTML.replace(right2, "<\/mrow><\/mfenced>");
                        }
                        */

                        replacedMath.setAttribute('mathsize', '250%');
                        if (jikken_flag == 1 && a == 3) {
                            replacedMath.setAttribute('mathcolor', 'white');
                        }

                        replacedMath.setAttribute('xmlns', 'http:\/\/www.w3.org\/1998\/Math\/MathML');
                        console.log(replacedMath);
                        //                        Table.rows[i].cells[a].innerHTML = replacedMath.outerHTML;
                        // if(jikken_flag == 1 && a == 3){

                        // }else{
                        //     Table.rows[c].cells[a].innerHTML = replacedMath.outerHTML;
                        // }

                        Table.rows[c].cells[a].innerHTML = replacedMath.outerHTML;
                        if (jikken_flag == 1 && a == 3) {
                            replacedMath.setAttribute('mathcolor', 'black');
                            replaceMath_jikken[c] = replacedMath;
                            console.log("replaceMath_jikken[c]");
                            console.log(replaceMath_jikken[c]);
                        }


                    } else {

                    }
                }
                c++;
                console.log("c=" + c);

            }
        } else {
            console.log("3のとこ");
            var tokens = tokenizeParsedString(results_ikyo[i]); //ページ内全てのmathml文を分割し、一文字ずつ配列に格納。sinxなら[0]=s, [1]=i, ...
            console.log(tokens);

            var replacedMath = buildMathMLFromParsedString(tokens, 0);
            console.log(replacedMath);

            /*
            if (replacedMath.innerHTML.match(left1) != null && replacedMath.innerHTML.match(left1).length == replacedMath.innerHTML.match(right1).length) {
                replacedMath.innerHTML = replacedMath.innerHTML.replace(left1, "<mfenced><mrow>"); //mfencedの子を一要素のみにする
                replacedMath.innerHTML = replacedMath.innerHTML.replace(right1, "<\/mrow><\/mfenced>");
            }
            if (replacedMath.innerHTML.match(left2) != null && replacedMath.innerHTML.match(left2).length == replacedMath.innerHTML.match(right2).length) {
                replacedMath.innerHTML = replacedMath.innerHTML.replace(left2, "<mfenced open=\"[\" close=\"]\"><mrow>"); //mfencedの子を一要素のみにする
                replacedMath.innerHTML = replacedMath.innerHTML.replace(right2, "<\/mrow><\/mfenced>");
            }
            */

            replacedMath.setAttribute('mathsize', '250%');
            replacedMath.setAttribute('xmlns', 'http:\/\/www.w3.org\/1998\/Math\/MathML');
            Table.rows[c].cells[0].innerHTML = replacedMath.outerHTML;

            //            Table.rows[i].cells[0].innerHTML = replacedMath.outerHTML;
            //c++;
            console.log("c=" + c);

        }
        //for demo

        //console.log(replacedMath);
        if (i == 0) {
            for (var j = 0; j < brElements.length; j++) {
                parents[i].removeChild(brElements[j]);
                //console.log("br消したよ");
            }
        }
        /*
        if(zenshiki_space[i+1] > 0) {
            Row = Table.insertRow( -1 );
        }
        */
        parents[i].replaceChild(Table, targetMathElements[i]);
        //parents[i].replaceChild(replacedMath, targetMathElements[i]);
        // parents[i].insertBefore(replacedMath, nextSiblings[i]);
        // HTMLPrint.text('matched',i+1 + ':');
        // HTMLPrint.MathML('matched',replacedMath);
        // HTMLPrint.br('matched');
        //console.log(parents[i]);
        //for(var j = 0; j < brElements.length; j++) {
        //    parents[i].replaceChild(brElements[j]);
        //}
    }


}

function Answer_action(obj) {
    //var tables = window.opener.document.body.getElementsByTagName('table');
    var tables = window.opener.document.body.getElementsByTagName('table');
    console.log("Answer_action yobeta");
    //console.log(table_i);
    var tr = obj.parentNode.parentNode;
    console.log(tr);
    console.log(obj);
    //console.log(tables[obj].rows[obj].cells[3].innerText);
    // table.rows[this].cells[3].style.color = "red";
    // console.log(table.rows[this].cells[3].innerHTML);
}

function onCallBack(data) {
    console.log(data); //hoge
}

function AttachHighlighting_cell(table, CELL_COLOR) {
    console.log("呼び出せたよ");
    console.log("replaceMath_jikken");
    console.log(replaceMath_jikken.outerHTML);

    for (var i = 0; i < table.rows.length; i++) {
        var cells = table.rows[i].cells;
        var table_num = i;
        for (var k = 0; k < cells.length; k++) {
            var cell = cells[k];
            if (cell.tagName != 'TH') {
                //cell.click(function() {
                cell.addEventListener("click", function() {
                    console.log("click");
                    var row = this.parentNode;
                    var table = row.parentNode.parentNode;
                    var row2 = $(this).closest('tr').index();
                    console.log(row2);
                    //var col = this.cellIndex;
                    //console.log('Row: ' + row + ', Column: ' + table);

                    // for (var i = 0; i < table.rows.length; i++) {
                    //     table.rows[i].style.backgroundColor = (table.rows[i] == row) ? CELL_COLOR : '';
                    // }

                    //table.rows[table_num].cells[3].setAttribute('mathcolor', 'black');
                    table.rows[row2].cells[3].innerHTML = replaceMath_jikken[row2].outerHTML;
                    console.log(replaceMath_jikken[table_num]);
                    //window.open('http://example.co.jp', '_blank', 'width=800,height=600');
                    //var q_win = window.open('http://18.221.189.220/~ubuntu/MathematicaExpresssionSearchSystem/questionnaire.html?row2=' + row2, '_blank', 'width=800,height=600');


                }, false);
            } else {
                console.log("else");
            }
        }
    }
}


function AttachHighlighting(table, CELL_COLOR) {
    console.log("呼び出せたよ");
    for (var i = 0; i < table.rows.length; i++) {
        var cells = table.rows[i].cells;
        for (var k = 0; k < cells.length; k++) {
            var cell = cells[k];
            if (cell.tagName != 'TH') {
                cell.onmouseover = function() {
                    //cell.onClick = function() {
                    var row = this.parentNode;
                    var table = row.parentNode.parentNode;
                    // var cols = table.getElementsByTagName('col');

                    // for (var i = 0; i < row.cells.length; i++) {
                    //     cols[i].style.backgroundColor = (row.cells[i] == this) ? CELL_COLOR : '';
                    // }

                    for (var i = 0; i < table.rows.length; i++) {
                        table.rows[i].style.backgroundColor = (table.rows[i] == row) ? CELL_COLOR : '';
                    }
                }
            }
        }
    }

    // var colgroups = table.getElementsByTagName('colgroup');
    // for (var i = 0; i < colgroups.length; i++) {
    //     var colgroup = colgroups[i];
    //     var cols = colgroup.getElementsByTagName('col');

    //     for (var k = cols.length; k < colgroup.span; k++) {
    //         var col = document.createElement('col');
    //         colgroup.appendChild(col);
    //     }
    // }

    table.onmouseout = function() {
        // var cols = this.getElementsByTagName('col');
        // for (var i = 0; i < cols.length; i++) {
        //     cols[i].style.backgroundColor = '';
        // }

        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].style.backgroundColor = '';
        }
    }
}
//hash関数
// var key = function(str){
//     var hash = 0;
//     for(var i = 0; i < str.length; i++){
//         hash += Math.pow(31, str.length - i - 1) * str[i].charCodeAt(0);
//     }
//     return hash;
// }

/**
 * hash
 * ハッシュ関数
 * @param {int} x
 */
// var hash = function(str, i) {
//     var hash_num = 0;
//     hash_num += Math.pow(31, str.length - i - 1) * str[i].charCodeAt(0);
//     return hash_num; // tableのサイズを5とした（=メモリに応じたサイズ）
// }


/**
 * setTable
 * 要素のハッシュ値をキーにした配列に変換
 * @param {Array} ary
 */
// var setTable = function(ary) {
//     var table = [];
//     for (var i = 0; i < a.length; i++) {
//         var key = hash(a, i);
//         if (!table[key]) { // 衝突した場合
//             table[key] = []; // 通常は連結リストを使用するが簡略化のため配列を使用
//             table[key].push(a[i]); // （要素の追加・削除の用途が多いので）
//         } else {
//             table[key].push(a[i]);
//         }
//     }
//     return table;
// }

var ikyo_matching = function(strs, mathStr_ikyo_l, mathStr_ikyo_r, k, mathStrparser_ikyo, distinctions) {
    var strs_before = strs;
    var strs_after = new Array();
    var mathStr_ikyo_l_before = mathStr_ikyo_l;
    var mathStr_ikyo_r_before = mathStr_ikyo_r;
    var split = new Array();
    var mathStr_ikyo_hozon_left = new Array();
    var mathStr_ikyo_hozon_right = new Array();
    var mathStr_ikyo_l_to_after = new Array();
    var mathStr_ikyo_r_to_after = new Array();
    var matched_flag = new Array();
    var brackets_flag_l = new Array();
    var brackets_flag_r = new Array();
    var strs_after_before = new Array();

    for (j = 0; j < k; j++) {
        console.log(j + "個目");
        //両辺から同じ要素をとりのぞく
        //        console.log("mathStr_ikyo_l: " + mathStr_ikyo_l);
        //        console.log("mathStr_ikyo_r: " + mathStr_ikyo_r)
        split = Split_SameElement(mathStr_ikyo_l[j], mathStr_ikyo_r[j], mathStrparser_ikyo[j]);
        strs_after[j] = split[0];
        mathStr_ikyo_l_to_after[j] = split[1];
        mathStr_ikyo_r_to_after[j] = split[2];
        mathStr_ikyo_hozon_left[j] = split[3];
        mathStr_ikyo_hozon_right[j] = split[4];
        matched_flag[j] = split[5];

        strs_after_before[j] = strs_after[j];

        // console.table(finish_flag);
        // for (var j = 0; j < results_ikyo.length; j++) {
        //     if (finish_flag[j] == 0) {


        //console.log("スタック " + com_stack_l + ":" + com_stack_r);

        while (1) {
            //while (1) {
            // var mathStr_ikyo_l_stack = Create_Stack(mathStr_ikyo_l_to_after[j]);
            // var mathStr_ikyo_r_stack = Create_Stack(mathStr_ikyo_r_to_after[j]);
            // var mathStr_ikyo_l_stack_com = mathStr_ikyo_l_stack.shift();
            // var mathStr_ikyo_r_stack_com = mathStr_ikyo_r_stack.shift();
            console.log("while");
            var mathStr_ikyo_l_stack_com = mathStr_ikyo_l_to_after[j];
            var mathStr_ikyo_r_stack_com = mathStr_ikyo_r_to_after[j];
            var com_stack_l = Create_Stack(mathStr_ikyo_l_stack_com);
            var com_stack_r = Create_Stack(mathStr_ikyo_r_stack_com);
            console.log("スタック " + com_stack_l + ":" + com_stack_r);

            if (com_stack_l.length == com_stack_r.length) {
                if (mathStr_ikyo_l_stack_com.indexOf("/::::/") == 0 && mathStr_ikyo_r_stack_com.indexOf("/::::/") == 0) {
                    console.log("while frac");
                    var x = 0;
                    var level = 0;
                    var flag_right = 0;
                    var final_point = 0;
                    var tmp_zero = new Array();
                    var tmptokens_l = tokenizeParsedString(mathStr_ikyo_l_stack_com, 0);
                    var tmptokens_r = tokenizeParsedString(mathStr_ikyo_r_stack_com, 0);
                    var temp_numerator_l = new Array();
                    var temp_numerator_r = new Array();
                    var temp_denominator_l = new Array();
                    var temp_denominator_r = new Array();


                    //console.log("tmptokens.length: " + tmptokens.length);
                    for (x = 0; x < tmptokens_l.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens[x]" + tmptokens[x]);
                        if (tmptokens_l[x] == "/{") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_l[x] == "/}") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                        } else {
                            tmp_zero = tmp_zero + tmptokens_l[x];
                        }
                    }
                    temp_numerator_l = tmp_zero.replace("/::::/{", "");
                    console.log("temp_numerator_l: " + temp_numerator_l);
                    tmp_zero = [];
                    flag_right = 0;
                    level = 0;
                    for (x = final_point + 1; x < tmptokens_l.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens_l[x]" + tmptokens_l[x]);
                        if (tmptokens_l[x] == "/{") {
                            //console.log("/{");
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_l[x] == "/}") {
                            //console.log("/}");
                            level = level - 1;
                        }
                        //console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            //final_point = x;
                            //console.log("break");
                            break;
                        } else if (x == final_point + 1 && tmptokens_l[x] == "/{" && level == 1) {
                            //console.log("else if");
                        } else {
                            //console.log("else");
                            tmp_zero = tmp_zero + tmptokens_l[x];
                        }
                    }
                    //temp_numerator_l = tmp_zero.replace("/::::/{", "");
                    temp_denominator_l = tmp_zero;
                    console.log("temp_denominator_l: " + temp_denominator_l);

                    level = 0;
                    flag_right = 0;
                    final_point = 0;
                    tmp_zero = [];
                    for (x = 0; x < tmptokens_r.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens[x]" + tmptokens[x]);
                        if (tmptokens_r[x] == "/{") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_r[x] == "/}") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                        } else {
                            tmp_zero = tmp_zero + tmptokens_r[x];
                        }
                    }
                    temp_numerator_r = tmp_zero.replace("/::::/{", "");
                    console.log("temp_numerator_r: " + temp_numerator_r);
                    tmp_zero = [];
                    flag_right = 0;
                    level = 0;
                    for (x = final_point + 1; x < tmptokens_r.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens_l[x]" + tmptokens_l[x]);
                        if (tmptokens_r[x] == "/{") {
                            //console.log("/{");
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_r[x] == "/}") {
                            //console.log("/}");
                            level = level - 1;
                        }
                        //console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            //final_point = x;
                            //console.log("break");
                            break;
                        } else if (x == final_point + 1 && tmptokens_r[x] == "/{" && level == 1) {
                            //console.log("else if");
                        } else {
                            //console.log("else");
                            tmp_zero = tmp_zero + tmptokens_r[x];
                        }
                    }
                    //temp_numerator_l = tmp_zero.replace("/::::/{", "");
                    temp_denominator_r = tmp_zero;
                    console.log("temp_denominator_r: " + temp_denominator_r);

                    if (temp_numerator_l != temp_numerator_r && temp_denominator_r == temp_denominator_l) {
                        var ikyo_frac_num = Split_SameElement(temp_numerator_l, temp_numerator_r, mathStrparser_ikyo[j]);
                        strs_after[j] = ikyo_frac_num[0];
                        mathStr_ikyo_l_to_after[j] = ikyo_frac_num[1];
                        mathStr_ikyo_r_to_after[j] = ikyo_frac_num[2];
                        mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "/::::/{" + ikyo_frac_num[3];
                        mathStr_ikyo_hozon_right[j] = ikyo_frac_num[4] + "/}/{" + temp_denominator_l + "/}" + mathStr_ikyo_hozon_right[j];
                        matched_flag[j] = ikyo_frac_num[5];
                        //if (matched_flag[j] == 0) {
                        if (strs_after[j] != strs_after_before[j]) {
                            strs_after_before[j] = strs_after[j];

                        } else {
                            break;
                        }
                    } else if (temp_numerator_l == temp_numerator_r && temp_denominator_r != temp_denominator_l) {
                        var ikyo_frac_num = Split_SameElement(temp_denominator_l, temp_denominator_r, mathStrparser_ikyo[j]);
                        strs_after[j] = ikyo_frac_num[0];
                        mathStr_ikyo_l_to_after[j] = ikyo_frac_num[1];
                        mathStr_ikyo_r_to_after[j] = ikyo_frac_num[2];
                        mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "/::::/{" + temp_numerator_l + "/}/{" + ikyo_frac_num[3];
                        mathStr_ikyo_hozon_right[j] = ikyo_frac_num[4] + "/}" + mathStr_ikyo_hozon_right[j];
                        matched_flag[j] = ikyo_frac_num[5];
                        //if (matched_flag[j] == 0) {
                        if (strs_after[j] != strs_after_before[j]) {
                            strs_after_before[j] = strs_after[j];
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }

                    //break;
                    // split = Split_SameElement(temp_numerator_l,temp_numerator_r,mathStrparser_ikyo[j]);
                    // console.log(split[0] + "," + split[1] + "," + split[0] + ",");
                } else if (mathStr_ikyo_l_stack_com.indexOf("/:::/") == 0 && mathStr_ikyo_r_stack_com.indexOf("/:::/") == 0) {
                    console.log("while  squire");
                    //console.log("()または()付き三角関数");
                    var x = 0;
                    var level = 0;
                    var flag_right = 0;
                    var final_point = 0;
                    var tmp_zero = new Array();
                    var tmptokens_l = tokenizeParsedString(mathStr_ikyo_l_stack_com, 0);
                    var tmptokens_r = tokenizeParsedString(mathStr_ikyo_r_stack_com, 0);
                    var temp_root_l = new Array();
                    var temp_root_r = new Array();
                    //console.log("tmptokens.length: " + tmptokens.length);
                    for (x = 0; x < tmptokens_l.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens[x]" + tmptokens[x]);
                        if (tmptokens_l[x] == "/{") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_l[x] == "/}") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                        } else {
                            tmp_zero = tmp_zero + tmptokens_l[x];
                        }
                    }
                    temp_root_l = tmp_zero.replace("/:::/{", "");
                    console.log("temp_root_l: " + temp_root_l);

                    level = 0;
                    flag_right = 0;
                    final_point = 0;
                    tmp_zero = [];
                    for (x = 0; x < tmptokens_r.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens[x]" + tmptokens[x]);
                        if (tmptokens_r[x] == "/{") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_r[x] == "/}") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                        } else {
                            tmp_zero = tmp_zero + tmptokens_r[x];
                        }
                    }
                    temp_root_r = tmp_zero.replace("/:::/{", "");
                    root_str = temp_root_l + mathStrparser_ikyo[j] + temp_root_r;
                    console.log("temp_root_l: " + temp_root_l);
                    console.log("temp_root_r: " + temp_root_r);
                    // var temp_root_l_to = new Array();
                    // var temp_root_r_to = new Array();
                    // temp_root_l_to.push(temp_root_l);
                    // temp_root_r_to.push(temp_root_r);
                    //                var ikyo_root = ikyo_matching(root_str, temp_root_l_to, temp_root_r_to, 1, mathStrparser_ikyo[j], distinctions);
                    var ikyo_root = Split_SameElement(temp_root_l, temp_root_r, mathStrparser_ikyo[j]);
                    strs_after[j] = ikyo_root[0];
                    mathStr_ikyo_l_to_after[j] = ikyo_root[1];
                    mathStr_ikyo_r_to_after[j] = ikyo_root[2];
                    mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "/:::/{" + ikyo_root[3];
                    mathStr_ikyo_hozon_right[j] = ikyo_root[4] + "/}" + mathStr_ikyo_hozon_right[j];
                    matched_flag[j] = ikyo_root[5];

                    // console.log("results_ikyo: " + results_ikyo[j]);
                    // console.log("mathStr_ikyo_hozon_left: " + mathStr_ikyo_hozon_left[j]);
                    // console.log("mathStr_ikyo_hozon_right: " + mathStr_ikyo_hozon_right[j]);
                    // console.log("finish_flag: " + finish_flag[j]);
                    //                    if (matched_flag[j] == 0) {
                    if (strs_after[j] != strs_after_before[j]) {
                        strs_after_before[j] = strs_after[j];

                    } else {
                        break;
                    }
                } else if ((mathStr_ikyo_l_stack_com.indexOf("(") == 0 && mathStr_ikyo_r_stack_com.indexOf("(") == 0) || (mathStr_ikyo_l_stack_com.indexOf("sin(") == 0 && mathStr_ikyo_r_stack_com.indexOf("sin(") == 0) || (mathStr_ikyo_l_stack_com.indexOf("cos(") == 0 && mathStr_ikyo_r_stack_com.indexOf("cos(") == 0) || (mathStr_ikyo_l_stack_com.indexOf("tan(") == 0 && mathStr_ikyo_r_stack_com.indexOf("tan(") == 0)) {
                    console.log("while ()または()付き三角関数");
                    var x = 0;
                    var level = 0;
                    var flag_right = 0;
                    var final_point = 0;
                    var tmp_zero = new Array();
                    var tmptokens_l = tokenizeParsedString(mathStr_ikyo_l_stack_com, 0);
                    var tmptokens_r = tokenizeParsedString(mathStr_ikyo_r_stack_com, 0);
                    var temp_brackets_l = new Array();
                    var temp_brackets_r = new Array();
                    var check_l = new Array();
                    var check_r = new Array();
                    //console.log("tmptokens.length: " + tmptokens.length);
                    for (x = 0; x < tmptokens_l.length; x++) {
                        console.log("x:" + x);
                        console.log("tmptokens_l[x]" + tmptokens_l[x]);
                        if (tmptokens_l[x] == "(") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_l[x] == ")") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                            //} else if(x = 0 && tmptokens_l[x] == "(" && level == 1){
                        } else {
                            tmp_zero = tmp_zero + tmptokens_l[x];
                        }
                    }
                    if (tmptokens_l[x + 1] != null) {
                        for (x = final_point + 1; x < tmptokens_l.length; x++) {
                            check_l = check_l + tmptokens_l[x];
                        }
                    } else {
                        check_l = 0;
                    }
                    console.log("check_l: " + check_l);
                    if (mathStr_ikyo_l_stack_com.indexOf("(") == 0) {
                        temp_brackets_l = tmp_zero.replace("(", "");
                    } else if (mathStr_ikyo_l_stack_com.indexOf("sin(") == 0) {
                        temp_brackets_l = tmp_zero.replace("sin(", "");
                    } else if (mathStr_ikyo_l_stack_com.indexOf("cos(") == 0) {
                        temp_brackets_l = tmp_zero.replace("cos(", "");
                    } else if (mathStr_ikyo_l_stack_com.indexOf("tan(") == 0) {
                        temp_brackets_l = tmp_zero.replace("tan(", "");
                    }

                    console.log("temp_brackets_l: " + temp_brackets_l);
                    level = 0;
                    flag_right = 0;
                    final_point = 0;
                    tmp_zero = [];
                    for (x = 0; x < tmptokens_r.length; x++) {
                        //console.log("x:" + x);
                        //console.log("tmptokens[x]" + tmptokens[x]);
                        if (tmptokens_r[x] == "(") {
                            level = level + 1;
                            flag_right = 1;
                        } else if (tmptokens_r[x] == ")") {
                            level = level - 1;
                        }
                        ///console.log("level:" + level);
                        if (level == 0 && flag_right == 1) {
                            //console.log(tmp_zero);
                            //tmp_zero = tmp_zero + tmptokens[x];
                            final_point = x;
                            break;
                            //} else if(x == 0 && tmptokens_r[x] == "(" && level == 1){
                        } else {
                            tmp_zero = tmp_zero + tmptokens_r[x];
                        }
                    }
                    if (tmptokens_r[x + 1] != null) {
                        for (x = final_point + 1; x < tmptokens_r.length; x++) {
                            check_r = check_r + tmptokens_r[x];
                        }
                    } else {
                        check_r = 0;
                    }
                    console.log("check_r: " + check_r);
                    if (mathStr_ikyo_r_stack_com.indexOf("(") == 0) {
                        temp_brackets_r = tmp_zero.replace("(", "");
                    } else if (mathStr_ikyo_r_stack_com.indexOf("sin(") == 0) {
                        temp_brackets_r = tmp_zero.replace("sin(", "");
                    } else if (mathStr_ikyo_r_stack_com.indexOf("cos(") == 0) {
                        temp_brackets_r = tmp_zero.replace("cos(", "");
                    } else if (mathStr_ikyo_r_stack_com.indexOf("tan(") == 0) {
                        temp_brackets_r = tmp_zero.replace("tan(", "");
                    }
                    console.log("temp_brackets_r: " + temp_brackets_r);

                    if (check_r == check_l) {

                        //root_str = temp_root_l + mathStrparser_ikyo[j] + temp_root_r;
                        console.log("temp_brackets_l: " + temp_brackets_l);
                        console.log("temp_brackets_r: " + temp_brackets_r);
                        // var temp_root_l_to = new Array();
                        // var temp_root_r_to = new Array();
                        // temp_root_l_to.push(temp_root_l);
                        // temp_root_r_to.push(temp_root_r);
                        //                var ikyo_root = ikyo_matching(root_str, temp_root_l_to, temp_root_r_to, 1, mathStrparser_ikyo[j], distinctions);
                        var ikyo_brackets = Split_SameElement(temp_brackets_l, temp_brackets_r, mathStrparser_ikyo[j]);
                        strs_after[j] = ikyo_brackets[0];
                        mathStr_ikyo_l_to_after[j] = ikyo_brackets[1];
                        mathStr_ikyo_r_to_after[j] = ikyo_brackets[2];
                        matched_flag[j] = ikyo_brackets[5];
                        if (mathStr_ikyo_l_stack_com.indexOf("(") == 0) {
                            mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "(" + ikyo_brackets[3];
                            mathStr_ikyo_hozon_right[j] = ikyo_brackets[4] + ")" + mathStr_ikyo_hozon_right[j];
                        } else if (mathStr_ikyo_l_stack_com.indexOf("sin(") == 0) {
                            mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "sin(" + ikyo_brackets[3];
                            mathStr_ikyo_hozon_right[j] = ikyo_brackets[4] + ")" + mathStr_ikyo_hozon_right[j];
                        } else if (mathStr_ikyo_l_stack_com.indexOf("cos(") == 0) {
                            mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "cos(" + ikyo_brackets[3];
                            mathStr_ikyo_hozon_right[j] = ikyo_brackets[4] + ")" + mathStr_ikyo_hozon_right[j];
                        } else if (mathStr_ikyo_l_stack_com.indexOf("tan(") == 0) {
                            mathStr_ikyo_hozon_left[j] = mathStr_ikyo_hozon_left[j] + "tan(" + ikyo_brackets[3];
                            mathStr_ikyo_hozon_right[j] = ikyo_brackets[4] + ")" + mathStr_ikyo_hozon_right[j];
                        }


                        // console.log("results_ikyo: " + results_ikyo[j]);
                        // console.log("mathStr_ikyo_hozon_left: " + mathStr_ikyo_hozon_left[j]);
                        // console.log("mathStr_ikyo_hozon_right: " + mathStr_ikyo_hozon_right[j]);
                        // console.log("finish_flag: " + finish_flag[j]);
                        //                        if (matched_flag[j] == 0) {
                        if (strs_after[j] != strs_after_before[j]) {
                            strs_after_before[j] = strs_after[j];

                        } else {
                            break;
                        }
                    } else {
                        break;
                    }

                } else {
                    console.log("その他");
                    break;
                }
            } else {
                break;
            }
        }

        //不要な()をとりのぞく
        if (mathStr_ikyo_l_to_after[j].indexOf("(") == 0) {
            console.log("()左");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens_l = tokenizeParsedString(mathStr_ikyo_l_to_after[j], 0);
            //            var tmptokens_r = tokenizeParsedString(mathStr_ikyo_r_to_after[j], 0);
            // var temp_brackets_l = new Array();
            // var temp_brackets_r = new Array();

            //console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens_l.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens_l[x] == "(") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens_l[x] == ")") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    if (tmptokens_l[x + 1] == null) {
                        mathStr_ikyo_l_to_after[j] = tmp_zero.replace("(", "");
                        strs_after[j] = mathStr_ikyo_l_to_after[j] + mathStrparser_ikyo[j] + mathStr_ikyo_r_to_after[j];
                        final_point = x;
                        brackets_flag_l[j] = 1;
                        break;
                    } else {
                        //console.log(tmp_zero);
                        //tmp_zero = tmp_zero + tmptokens[x];
                        final_point = x;
                        break;
                    }
                    //} else if(x = 0 && tmptokens_l[x] == "(" && level == 1){
                } else {
                    tmp_zero = tmp_zero + tmptokens_l[x];
                }
            }
        }
        if (mathStr_ikyo_r_to_after[j].indexOf("(") == 0) {
            console.log("()右");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            //var tmptokens_l = tokenizeParsedString(mathStr_ikyo_l_to_after[j], 0);
            var tmptokens_r = tokenizeParsedString(mathStr_ikyo_r_to_after[j], 0);
            //console.log("tmptokens_r: " + tmptokens_r);

            for (x = 0; x < tmptokens_r.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens_r[x]" + tmptokens_r[x]);
                if (tmptokens_r[x] == "(") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens_r[x] == ")") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    if (tmptokens_r[x + 1] == null) {
                        mathStr_ikyo_r_to_after[j] = tmp_zero.replace("(", "");
                        strs_after[j] = mathStr_ikyo_l_to_after[j] + mathStrparser_ikyo[j] + mathStr_ikyo_r_to_after[j];
                        final_point = x;
                        brackets_flag_r[j] = 1;

                        break;
                    } else {
                        //console.log(tmp_zero);
                        //tmp_zero = tmp_zero + tmptokens_r[x];
                        final_point = x;
                        break;
                    }
                    //} else if(x = 0 && tmptokens_l[x] == "(" && level == 1){
                } else {
                    tmp_zero = tmp_zero + tmptokens_r[x];
                }
            }
            //console.log("mathStr_ikyo_r_to_after[j]: " + mathStr_ikyo_r_to_after[j]);

        }
    }
    //     }


    // }
    console.log("mathStr_ikyo_hozon_left");

    console.table(mathStr_ikyo_hozon_left);

    console.log("mathStr_ikyo_hozon_right");
    console.table(mathStr_ikyo_hozon_right);
    // console.log("mathStr_ikyo_l_to_after");
    // console.table(mathStr_ikyo_l_to_after);
    // console.log("mathStr_ikyo_r_to_after");
    // console.table(mathStr_ikyo_r_to_after);
    console.log("strs_after");
    console.table(strs_after);

    //console.table(matched_flag);



    mathStr_ikyo_l = [];
    mathStr_ikyo_r = [];
    mathStr_ikyo_l = mathStr_ikyo_l_to_after;
    mathStr_ikyo_r = mathStr_ikyo_r_to_after;

    math_count = k;

    // var mathStr_ikyo_l_after = mathStr_ikyo_l;
    // var mathStr_ikyo_r_after = mathStr_ikyo_r;


    var distinctionStr;
    var outputStr;
    //console.log(strs);
    //    var strssize = strs.length
    var strssize = strs_after.length

    //console.log(strssize);
    //console.log(targetMathElements[0]);
    //console.log(targetMathElements[1]);


    //パクリここまで
    var nijouFlag = 0;
    var sinFlag = 0;
    var cosFlag = 0;
    var tanFlag = 0;
    var gyouretsuFlag = 1; //変形依拠公式提示で、行列の検索はいらない気がした。


    for (var mathStr of distinctions) {
        distinctionStr = expressionDistinction(mathStr);

        console.log("ここです");

        //console.log(distinctionStr);
        if (distinctionStr.indexOf('二次') != -1) {
            nijouFlag = 1;
            //console.log("nijouFlag=1");
        }
        if (distinctionStr.indexOf('正弦') != -1) {
            sinFlag = 1;
            //console.log("sinFlag=1");
        }
        if (distinctionStr.indexOf('余弦') != -1) {
            cosFlag = 1;
            //console.log("cosFlag=1");
        }
        if (distinctionStr.indexOf('正接') != -1) {
            tanFlag = 1;
            //console.log("tanFlag=1");
        }
        if (distinctionStr.indexOf('行列') != -1) {
            gyouretsuFlag = 1;
            //console.log("gyouretsuFlag=1");
        }
    }

    var t;
    t = 1;
    var ikyo_res;
    var queryString_ikyo = new Array();
    var ikyo_name = new Array();
    // csv使った版検索 学習項目抽出結果にカラーリングをしない、方程式関係以外用
    //console.log(csvArray_non[t][1]);

    var k = 0;
    //console.log("csvArray_non.length" + csvArray_non.length);
    //while (t < csvArray_non.length) {






    for (t = 1; t < csvArray_non.length; t++) {
        resetNum = 0;
        while (resetNum < extractionNum) { //配列の値を全て初期化
            extractionFlag[resetNum] = 0;
            resetNum++;
        }

        // 学習項目抽出結果画面にカラーリングしない検索なので、extractionflagは放置
        // どのmmlを使うか
        var testurl = './searchStorage/';
        testurl += csvArray_non[t][2];
        console.log("t: " + t);
        //console.log(testurl);

        ikyo_name[t - 1] = csvArray_non[t][1];
        //console.log(ikyo_name);
        // if ((ikyo_name[t - 1].indexOf('sin') != -1 && sinFlag == 0) || (ikyo_name[t - 1].indexOf('tan') != -1 && tanFlag == 0) ||
        //     (ikyo_name[t - 1].indexOf('cos') != -1 && cosFlag == 0) || (ikyo_name[t - 1].indexOf('ピタゴラス') != -1 && nijouFlag == 0) ||
        //     (ikyo_name[t - 1].indexOf('行列') != -1 && gyouretsuFlag == 1)) {
        //     console.log("検索対象の数式に要素が含まれていないため，この公式の検索は行いません。");
        //     //ピタゴラス、sin/cos/tanの～～定理、行列の　　　行列とか対角行列とか)をここで弾いてる。
        if (cosFlag == 0 && t == 2 || sinFlag == 0 && t == 23 || tanFlag == 0 && t == 42 || gyouretsuFlag == 1 && t == 74 || nijouFlag == 0 && t == 84) {
            //t = 22;
            cosFlag = 2;
            console.log("検索対象の数式に要素が含まれていないため，この公式の検索は行いません。/cos");
        } else {

            //var pf = csvArray_non[t][2].indexOf("/");
            //var pl = csvArray_non[t][2].length;

            //filename = csvArray_non[t][2].substring(pf+1,pl);
            fileid = t;

            //$.ajax({
            //    url:'./sample4.php', //送信先
            //    type:'POST', //送信方法
            //    datatype: 'html', //受け取りデータの種類
            //    async: false,
            //    data:{
            //    'key' : fileid
            //    }
            //    })
            //    // Ajax通信が成功した時
            //    .done( function(data) {
            //        ikyo_res = $(data)[0];
            //        console.log('通信成功');
            //        //console.log(data);
            //    })
                // Ajax通信が失敗した時
            //    .fail( function(data) {
            //        $('#result').html(data);
            //        console.log('通信失敗');
            //        console.log(data);
            //    });

            $.ajax({
                url: testurl,
                type: 'get',
                dataType: 'html',
                async: false,
                success: function(responce) {
                    // mml_y = responce.firstElementChild;
                  ikyo_res = $(responce)[0];
                    console.log(responce);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(
                        'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                       'textStatus : ' + textStatus + '\n' +
                        'errorThrown : ' + errorThrown.message + '\n' +
                        'ikyo中のmml呼び出し' + testurl
                    );
                },
            });
            queryString_ikyo[k] = createQueryString(ikyo_res);
            //console.log("queryString_ikyo[k]");
            console.log(queryString_ikyo[k]);
            ikyo_name[k] = csvArray_non[t][1];
            k++;
            //console.log(ikyo_name[k]);
        }


        console.log(t + '回目のループ終わり');
        //t++;

    }




    //k = k - 1; //これでtは配列queryString_ikyoの要素数になる
    var i = 0;
    //i = 0;
    var tokens_ikyo = new Array();
    var parsedQuery_ikyo = new Array();


    for (i = 0; i < k; i++) {
        tokens_ikyo[i] = queryTokenize(queryString_ikyo[i]); //トークン列
        parsedQuery_ikyo[i] = queryParse(tokens_ikyo[i]); //Onigmoパターン．parsedQueryは，queryとn(後方参照の数)の2つのプロパティから成る．
        // console.log(parsedQuery_ikyo[i].query);
        // console.log(parsedQuery_ikyo[i].n);
        // console.log(queryString_ikyo[i]);
    }


    var results_ikyo;
    var results_ikyo_before;
    results_ikyo_before = strs;

    var rbFileName_ikyo = '';
    rbFileName_ikyo = 'http://127.0.0.1:8000/mreg';
    //rbFileName_ikyo = 'http://18.221.189.220/~ubuntu/MathematicaExpresssionSearchSystem/preg.rb';

    console.log("ここまでok");

    results_ikyo = strs_after;
    console.log("ここみて");
    console.table(results_ikyo);



    // var result_ikyo_l = new Array();
    // var result_ikyo_r = new Array();
    // var result_queryparseindex;
    // var result_parsetoken = new Array();
    var finish_flag = new Array();

    // for (i = 0; i < math_count; i++) {
    //     console.log("result_ikyo");
    //     console.log(results_ikyo[i]);
    // }

    //kはqueryString_ikyo
    for (i = 0; i < k; i++) {
        console.log("現在" + i + "回目");
        // console.log("parsedQuery_ikyo[i]: " + parsedQuery_ikyo[i]);
        // console.log("queryString_ikyo[i]: " + queryString_ikyo[i]);
        // console.log("results_ikyo: " + results_ikyo);
        // console.log("strssize:" + strssize);
        console.log(ikyo_name[i] + "を検索します");
        (function(i) {
            $.ajax({
                type: 'POST',
                url: rbFileName_ikyo,
                //url:  rbFileName_ikyo2,
                async: false,
                traditional: true,
                data: {
                    n: parsedQuery_ikyo[i].n, //後方参照の番号
                    originalQuery: queryString_ikyo[i], //検索クエリの通常の文字列
                    query: parsedQuery_ikyo[i].query, //検索クエリの
                    math: results_ikyo,
                    size: strssize,
                    //mathB: strs_before,
                },
                success: function(json) {
                    if (!json || !json.results) {
        alert("検索結果が取得できませんでした。サーバーエラーの可能性があります。");
        results = [];
        return;
    }
                    results_ikyo = json.results;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(
                        'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                        'textStatus : ' + textStatus + '\n' +
                        'errorThrown : ' + errorThrown.message + '\n' +
                        'ikyo中のrbファイル呼び出し'
                    );
                },
            });

        })(i);



        //新たに色付けされたmathml文については、検索した公式の名前を後ろにくっつける
        for (var t = 0; t < strs_before.length; t++) {
            if (results_ikyo[t].indexOf("/::::::::::/") != -1 && results_ikyo[t] != results_ikyo_before[t]) {
                results_ikyo[t] = results_ikyo[t] + '←∵' + ikyo_name[i];
                //results_ikyo[t] = strs_before[t] + '←∵' + ikyo_name[i];
            }
        }
        //        console.log("results_ikyo:" + results_ikyo);
        console.table(results_ikyo);


        //beforeの上書き(次のループでの比較に使用)
        results_ikyo_before = results_ikyo;
        //strs_before = results_ikyo;
    }

    for (var j = 0; j < results_ikyo.length; j++) {
        if (results_ikyo[j].indexOf("/::::::::::/") != -1) {
            finish_flag[j] = 1;
        } else {
            finish_flag[j] = 0;

        }
    }

    //console.log(results_ikyo);
    //console.log(strs);
    return [results_ikyo, mathStr_ikyo_hozon_left, mathStr_ikyo_hozon_right, finish_flag, mathStr_ikyo_l, mathStr_ikyo_r, brackets_flag_l, brackets_flag_r];

}

//両辺から同じ数式をとりのぞく
var Split_SameElement = function(mathStr_ikyo_l, mathStr_ikyo_r, mathStrparser_ikyo) {
    //console.log("k:" + k);
    var j = 0;
    var mathStr_ikyo_hozon_left = new Array();
    var mathStr_ikyo_hozon_right = new Array();
    var hozon = new Array();
    var mathStr_ikyo_l_to_after = new Array();
    var mathStr_ikyo_r_to_after = new Array();
    var strs_after = new Array();
    var matched_flag = 0;

    console.log(mathStr_ikyo_l);
    var mathStr_ikyo_l_stack = [];
    var mathStr_ikyo_l_to = mathStr_ikyo_l;
    //        console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
    mathStr_ikyo_l_stack = Create_Stack(mathStr_ikyo_l_to);
    console.log("左辺スタック" + j + ": " + mathStr_ikyo_l_stack);

    console.log("---------");
    //console.log(j + "個目 右辺");
    console.log(mathStr_ikyo_r);
    var mathStr_ikyo_r_stack = [];
    var mathStr_ikyo_r_to = mathStr_ikyo_r;

    mathStr_ikyo_r_stack = Create_Stack(mathStr_ikyo_r_to);
    console.log("右辺スタック" + j + ": " + mathStr_ikyo_r_stack);
    console.log("---------");
    console.log("---------");

    //マッチングしていらないもの削除
    console.log("要素数左: " + mathStr_ikyo_l_stack.length);
    console.log("要素数右: " + mathStr_ikyo_r_stack.length);
    hozon = matching_Tree(mathStr_ikyo_l_stack, mathStr_ikyo_r_stack);
    mathStr_ikyo_hozon_left = hozon[0];
    mathStr_ikyo_hozon_right = hozon[1];
    mathStr_ikyo_l_to_after = hozon[2];
    mathStr_ikyo_r_to_after = hozon[3];
    matched_flag = hozon[4];

    console.log("mathStr_ikyo_hozon_left: " + mathStr_ikyo_hozon_left);
    console.log("mathStr_ikyo_hozon_right: " + mathStr_ikyo_hozon_right);
    console.log("mathStr_ikyo_l_to_after: " + mathStr_ikyo_l_to_after);
    console.log("mathStr_ikyo_r_to_after: " + mathStr_ikyo_r_to_after);
    var tempStr_after = mathStr_ikyo_l_to_after + mathStrparser_ikyo + mathStr_ikyo_r_to_after;
    //strs_after.push(tempStr_after);
    strs_after = tempStr_after;

    return [strs_after, mathStr_ikyo_l_to_after, mathStr_ikyo_r_to_after, mathStr_ikyo_hozon_left, mathStr_ikyo_hozon_right, matched_flag];
}

//スタックに数式を分解してつむ
var Create_Stack = function(mathStr_ikyo_l_to) {
    console.log("Create_Stack");
    var mathStr_ikyo_l_stack = [];
    var i = 0;
    while (1) {
        if (mathStr_ikyo_l_to.indexOf("/:::::::::/") == 0) {
            console.log("underover");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            for (x = final_point + 1; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            for (x = final_point + 1; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }

            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

        } else if (mathStr_ikyo_l_to.indexOf("/::::::::/") == 0) {
            console.log("subsup");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            for (x = final_point + 1; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }

            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                var mathStr_ikyo_l_stack_pop = mathStr_ikyo_l_stack.pop();
                tmp_zero = mathStr_ikyo_l_stack_pop + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                var mathStr_ikyo_l_stack_pop = mathStr_ikyo_l_stack.pop();
                tmp_zero = mathStr_ikyo_l_stack_pop + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

        } else if (mathStr_ikyo_l_to.indexOf("/::::/") == 0 || mathStr_ikyo_l_to.indexOf("/:::::/") == 0 || mathStr_ikyo_l_to.indexOf("/::::::/") == 0 || mathStr_ikyo_l_to.indexOf("/:::::::/") == 0) {
            console.log("frac or root");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                ///console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            for (x = final_point + 1; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }

            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

        } else if (mathStr_ikyo_l_to.indexOf("/:::/") == 0) {
            console.log("sqrt");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            //console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
        } else if (mathStr_ikyo_l_to.indexOf("/::/") == 0 || mathStr_ikyo_l_to.indexOf("/:/") == 0) {
            console.log("上付き下付");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            //console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "/{") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == "/}") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                var mathStr_ikyo_l_stack_pop = mathStr_ikyo_l_stack.pop();
                tmp_zero = mathStr_ikyo_l_stack_pop + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                var mathStr_ikyo_l_stack_pop = mathStr_ikyo_l_stack.pop();
                tmp_zero = mathStr_ikyo_l_stack_pop + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

        } else if (mathStr_ikyo_l_to.indexOf("(") == 0 || mathStr_ikyo_l_to.indexOf("sin(") == 0 || mathStr_ikyo_l_to.indexOf("cos(") == 0 || mathStr_ikyo_l_to.indexOf("tan(") == 0) {
            console.log("()または()付き三角関数");
            var x = 0;
            var level = 0;
            var flag_right = 0;
            var final_point = 0;
            var tmp_zero = new Array();
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            //console.log("tmptokens.length: " + tmptokens.length);
            for (x = 0; x < tmptokens.length; x++) {
                //console.log("x:" + x);
                //console.log("tmptokens[x]" + tmptokens[x]);
                if (tmptokens[x] == "(") {
                    level = level + 1;
                    flag_right = 1;
                } else if (tmptokens[x] == ")") {
                    level = level - 1;
                }
                //console.log("level:" + level);
                if (level == 0 && flag_right == 1) {
                    //console.log(tmp_zero);
                    tmp_zero = tmp_zero + tmptokens[x];
                    final_point = x;
                    break;
                } else {
                    tmp_zero = tmp_zero + tmptokens[x];
                }
            }
            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point + 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

        } else if (mathStr_ikyo_l_to.indexOf("sin") == 0 || mathStr_ikyo_l_to.indexOf("cos") == 0 || mathStr_ikyo_l_to.indexOf("tan") == 0 || mathStr_ikyo_l_to.indexOf("log") == 0) {
            // mathStr_ikyo_l_stack.push("sin");
            // var kari_mathStr_ikyo_l_to = mathStr_ikyo_l_to.replace("sin", "");
            // mathStr_ikyo_l_to = [];
            // mathStr_ikyo_l_to = kari_mathStr_ikyo_l_to;
            console.log("三角関数 log");
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            var final_point = 0;
            var tmp_zero = new Array();
            mathStr_ikyo_l_to = [];
            //var flag = 0;
            for (var x = 3; x < tmptokens.length; x++) {
                var fini_flag = 0;
                //console.log("tmptokens[x]: " + tmptokens[x]);
                if (tmptokens[x] == "+" || tmptokens[x] == "-" || tmptokens[x] == "(" || /*tmptokens[x].indexOf("/:") == 0 ||*/ (tmptokens[x] == "s" && tmptokens[x + 1] == "i" && tmptokens[x + 2] == "n") || (tmptokens[x] == "c" && tmptokens[x + 1] == "o" && tmptokens[x + 2] == "s") || (tmptokens[x] == "t" && tmptokens[x + 1] == "a" && tmptokens[x + 2] == "n")) {
                    //console.log("brek");
                    //tmp_zero = tmp_zero + tmptokens[x];
                    //flag = 1;
                    final_point = x;
                    break;

                } else {
                    //console.log("else");
                    tmp_zero = tmp_zero + tmptokens[x];
                    //mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
            }
            if (tmptokens[x + 1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                tmp_zero = tmptokens[0] + tmptokens[1] + tmptokens[2] + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;

                //break
            } else {
                mathStr_ikyo_l_to = [];
                for (x = final_point; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                tmp_zero = tmptokens[0] + tmptokens[1] + tmptokens[2] + tmp_zero;
                mathStr_ikyo_l_stack.push(tmp_zero);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }

            // } else if (mathStr_ikyo_l_to.indexOf("cos") == 0) {
            //     mathStr_ikyo_l_stack.push("cos");
            //     var kari_mathStr_ikyo_l_to = mathStr_ikyo_l_to.replace("cos", "");
            //     mathStr_ikyo_l_to = [];
            //     mathStr_ikyo_l_to = kari_mathStr_ikyo_l_to;
            // } else if (mathStr_ikyo_l_to.indexOf("tan") == 0) {
            //     mathStr_ikyo_l_stack.push("tan");
            //     var kari_mathStr_ikyo_l_to = mathStr_ikyo_l_to.replace("tan", "");
            //     mathStr_ikyo_l_to = [];
            //     mathStr_ikyo_l_to = kari_mathStr_ikyo_l_to;
        } else {
            console.log("その他");
            var tmptokens = tokenizeParsedString(mathStr_ikyo_l_to, 0);
            var final_point = 0;
            //if (mathStr_ikyo_l_to.indexOf("+") == 0 || mathStr_ikyo_l_to.indexOf("-") == 0) {
            console.log(tmptokens[0]);
            mathStr_ikyo_l_stack.push(tmptokens[0]);
            mathStr_ikyo_l_to = [];

            // for (var x = 1; x < tmptokens.length; x++) {
            //     //console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
            //     mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
            // }
            if (tmptokens[1] == null) {
                console.log("nullのほう");
                //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
                //mathStr_ikyo_l_stack.push(tmptokens[0]);
                // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
                // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
                break;
                //break
            } else {
                //mathStr_ikyo_l_to = [];
                for (x = 1; x < tmptokens.length; x++) {
                    //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
                    mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
                }
                //mathStr_ikyo_l_stack.push(tmptokens[0]);
                //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            }

            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
            //} else {
            //     var tmp_zero = new Array();
            //     mathStr_ikyo_l_to = [];
            //     //var flag = 0;
            //     for (var x = 0; x < tmptokens.length; x++) {
            //         var fini_flag = 0;
            //         //console.log("tmptokens[x]: " + tmptokens[x]);
            //         if (tmptokens[x] == "+" || tmptokens[x] == "-" || tmptokens[x] == "("|| tmptokens[x].indexOf("/:") == 0||(tmptokens[x] == "s" && tmptokens[x+1] == "i" && tmptokens[x+2] == "n")||(tmptokens[x] == "c" && tmptokens[x+1] == "o" && tmptokens[x+2] == "s")||(tmptokens[x] == "t" && tmptokens[x+1] == "a" && tmptokens[x+2] == "n")) {
            //             //console.log("brek");
            //             //tmp_zero = tmp_zero + tmptokens[x];
            //             //flag = 1;
            //             final_point = x;
            //             break;

            //         } else {
            //             //console.log("else");
            //             tmp_zero = tmp_zero + tmptokens[x];
            //             //mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
            //         }
            //     }
            // if (tmptokens[x + 1] == null) {
            //     console.log("nullのほう");
            //     //            mathStr_ikyo_l_stack.push(mathStr_ikyo_l_to.substring(0,final_point));
            //     mathStr_ikyo_l_stack.push(tmp_zero);
            //     // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            //     // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);
            //     break;

            //     //break
            // } else {
            //     mathStr_ikyo_l_to = [];
            //     for (x = 1; x < tmptokens.length; x++) {
            //         //                console.log("mathStr_ikyo_l_to[" + x + "]: " + mathStr_ikyo_l_to);
            //         mathStr_ikyo_l_to = mathStr_ikyo_l_to + tmptokens[x];
            //     }
            //     mathStr_ikyo_l_stack.push(tmp_zero);
            //     //            mathStr_ikyo_l_to = mathStr_ikyo_l_to.substr(final_point+1);
            // }
            // console.log("mathStr_ikyo_l_stack: " + mathStr_ikyo_l_stack);
            // console.log("mathStr_ikyo_l_to: " + mathStr_ikyo_l_to);

            //}
        }
        i++;
        //        console.log(i + "回目");
    }

    return mathStr_ikyo_l_stack;
}


//両辺に同じ要素がないか検索してあったら削除
var matching_Tree = function(mathStr_ikyo_l_stack, mathStr_ikyo_r_stack) {
    var matched_flag = 0;
    var mathStr_ikyo_hozon_left = new Array();
    var mathStr_ikyo_hozon_right = new Array();
    var mathStr_ikyo_l = new Array();
    var mathStr_ikyo_r = new Array();
    var mathStr_ikyo_l_stack_before = mathStr_ikyo_l_stack;
    var mathStr_ikyo_r_stack_before = mathStr_ikyo_r_stack;

    while (1) {
        var mathStr_ikyo_l_stack_com = mathStr_ikyo_l_stack.shift();
        var mathStr_ikyo_r_stack_com = mathStr_ikyo_r_stack.shift();
        if (mathStr_ikyo_l_stack_com == mathStr_ikyo_r_stack_com && mathStr_ikyo_l_stack_com != null && mathStr_ikyo_r_stack_com != null) {
            console.log("一致1: " + mathStr_ikyo_l_stack_com + ": " + mathStr_ikyo_r_stack_com);
            mathStr_ikyo_hozon_left = mathStr_ikyo_hozon_left + mathStr_ikyo_l_stack_com;
            matched_flag = 1;
        } else {
            console.log("不一致1: " + mathStr_ikyo_l_stack_com + ": " + mathStr_ikyo_r_stack_com);
            mathStr_ikyo_l_stack.unshift(mathStr_ikyo_l_stack_com);
            mathStr_ikyo_r_stack.unshift(mathStr_ikyo_r_stack_com);
            break;
        }
    }
    var mathStr_ikyo_l_stack_com = mathStr_ikyo_l_stack.pop();
    var mathStr_ikyo_r_stack_com = mathStr_ikyo_r_stack.pop();
    if (mathStr_ikyo_l_stack_com != null && mathStr_ikyo_r_stack_com != null) {
        while (1) {
            if (mathStr_ikyo_l_stack_com == mathStr_ikyo_r_stack_com) {
                console.log("一致2: " + mathStr_ikyo_l_stack_com + ": " + mathStr_ikyo_r_stack_com);
                mathStr_ikyo_hozon_right.unshift(mathStr_ikyo_l_stack_com);
                var mathStr_ikyo_l_stack_com = mathStr_ikyo_l_stack.pop();
                var mathStr_ikyo_r_stack_com = mathStr_ikyo_r_stack.pop();
                matched_flag = 1;
            } else {
                console.log("不一致2: " + mathStr_ikyo_l_stack_com + ": " + mathStr_ikyo_r_stack_com);
                mathStr_ikyo_l_stack.push(mathStr_ikyo_l_stack_com);
                mathStr_ikyo_r_stack.push(mathStr_ikyo_r_stack_com);
                break;
            }
        }
    }

    mathStr_ikyo_hozon_right = mathStr_ikyo_hozon_right.join('');
    console.log("mathStr_ikyo_hozon_right: " + mathStr_ikyo_hozon_right);
    mathStr_ikyo_l = mathStr_ikyo_l_stack.join('');
    mathStr_ikyo_r = mathStr_ikyo_r_stack.join('');

    return [mathStr_ikyo_hozon_left, mathStr_ikyo_hozon_right, mathStr_ikyo_l, mathStr_ikyo_r, matched_flag];
}



var LeftRightParse = function(beforeString, newArrayl, newArrayr, mathStrparser, k) {
    var parseindex = beforeString.indexOf("=");
    if (parseindex == -1) {
        parseindex = beforeString.indexOf("≤");
        if (parseindex == -1) {
            parseindex = beforeString.indexOf("≥");
            if (parseindex == -1) {
                parseindex = beforeString.indexOf("\<");
                if (parseindex == -1) {
                    parseindex = beforeString.indexOf("\>");
                    if (parseindex == -1) {
                        parseindex = 0;
                        mathStrparser[k] = "";
                    } else {
                        mathStrparser[k] = "\>"
                    }
                } else {
                    mathStrparser[k] = "\<"
                }
            } else {
                mathStrparser[k] = "≥";
            }
        } else {
            mathStrparser[k] = "≤";
        }
    } else {
        mathStrparser[k] = "=";
    }

    newArrayl[k] = beforeString.substring(0, parseindex);
    newArrayr[k] = beforeString.substring(parseindex + 1);

    if (newArrayr[k].indexOf("=") != -1) {
        k++;
        var tmpArrayl = newArrayr;
        LeftRightParse(newArrayr[k - 1], tmpArrayl, newArrayr, mathStrparser, k);
    }

    console.log(k);
}


//LeftRightParse(mathStr, mathStr_ikyo_l, mathStr_ikyo_r, mathStrparser_ikyo, k);
