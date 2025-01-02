// //継承をラクにするためのメソッド．the good parts p.26．
// //これを使って継承したら，プロトタイプチェーンの上のメンバまでは変更されない，自然なプロトタイプ型の継承ができる．
// //instance = Object.create(class);のように使う．
// //××継承だけでなく，オブジェクトのコピーにも使えそう．javascriptのオブジェクトの代入は参照渡しだから，コピーは必須．
// //↑×．createでは参照は外れないっぽい
// if (typeof Object.create !== 'function'){
    // Object.create = function(o){
        // var F = function(){};
        // F.prototype = o;
        // return new F();
    // };
// }
//
// //clone関数…挙動は怪しい．少なくともDOMのノードには使えないっぽい．
// //残してるけど使わないべき…．
// if (typeof Object.clone !== 'function'){
    // Object.clone = function(o){
        // clone = Object.create(o);
        // o     = Object.create(o);
        // return clone;
    // };
// }




//節がシンプルコンテントかどうか判定する．
//未チェック
Node.prototype.isSimpleContent = function(){
  if(this.hasChildNodes()){
    //テキストノードを何個も含んでる可能性があるから，子を全部見る．
    //微妙…テキストノードを何個も含んでてもシンプルコンテントなのか？DOM走査はめっちゃやりにくくなる．
    //少なくとも，DOMでつながないとテキストノードが隣り合っていくつもくっつくことはない．この仕様でほっとく．
    for(var i=0; i < this.childNodes.length; i++){
      if(this.childNodes[i].nodeType !== 3) return false;
    }
    return true;
  }else{//子がないなら，それもシンプルコンテント．
    return true;
  }
}





//引数をその要素の親とするメソッド．
//elementオブジェクト(既存)に追加する．
//仮動作確認済
Node.prototype.appendTo = function(node){
  if(this.parentNode === null){
    node.appendChild(this);
  }else{
    this.parentNode.replaceChild(node,this);
    node.appendChild(this);
  }
};


//第二引数をnullにした場合をテスト済
Node.prototype.insertAfter = function(appended, base){
  if(base === null){
    this.insertBefore(appended, this.firstChild);//baseにnullを指定したら，先頭に挿入
  }else{
    this.insertBefore(appended, base.nextSibling);//baseが最後の子だった時は，.nextSiblingがnullになるので，単に最後尾に追加される．
  }
};


//指定したノードを削除して，その子は，その親の子として繋ぎ直す．繋がれる位置は，指定したノードがあったところ．
//仮動作確認済
Node.prototype.removeChildOnly = function(node){
  if(this.nodeType === 9){//Documentオブジェクトの場合
    this.removeChild(node);
    this.appendChild(node.firstChild);
  }else{
    while(node.hasChildNodes()){
      this.insertBefore(node.firstChild, node);//nodeのfirstChildをnodeの前に移すから，nodeの子の数は減る．
    }
    this.removeChild(node);//nodeを除去する．
  }
};


//指定したノードだけを置き換えて，置き換えられたノードの子たちは，置き換えたあとのノードの最後の子として繋ぎ直す．子の順序は保存される．
//第一引数：置換後，第二引数：置換対象
//とりあえずテスト済
Node.prototype.replaceChildOnly = function(after, before){
  while(before.hasChildNodes()){
    after.appendChild(before.firstChild);//beforeの子をafterの子に繋ぎ直すから，beforeの子の数は減る．
  }
  this.replaceChild(after, before);//nodeを置き換える
};


//elementが何番目の子であるか判定する．ルートなら-1を返す．
//未テスト...
Node.prototype.indexOf = function(node){
  for(var i=0; i < this.childNodes.length; i++){
    if(node === this.childNodes[i]) return i;
  }
  return null;
};


//コールバックだけ引数に取る．．
//関数に引数を渡したい場合もあるけど，その時は引数を渡した関数をコールバックとして適切にラッピングする．
//このメソッドに，引数として，関数とその関数の引数を渡すよりは，その方がスマート．
//コールバックはNodeListを引数に取る．
//.forEach()のように，各要素に対してcallbackを適用するわけではないから，element,indexはコールバックの引数にしない．
Node.prototype.applyFunctionOnlyPartialTree = function(callback){
  var node = this;
  var parent = node.parentNode;
  var nextSibling = node.nextSibling;

  if(parent !== null) parent.removeChild(node);//切り離し
  var returnValue = callback(node);//処理
  if(parent !== null) parent.insertBefore(node, nextSibling);//再結合
  return returnValue;
}


//get next node by "Depth first searth".
Node.prototype.getNextNodeByLocalName = function(localName){
  var n = this.getNextNodeByDFS();
  while(n){
    if(n.localName === localName) return n;
    n = n.getNextNodeByDFS();
  }
  return null;
};


//get next node by "Depth first searth".
Node.prototype.getNextNodeByDFS = function(){
  var n = this;
    //子があるなら，最初の子を返す．
  if(n.firstChild) return n.firstChild;
  //子がないなら，妹を返す．自らに妹がいないなら，バックトラックして，「妹を持つ最初の祖先」の妹を返す
  while(n){
    if(n.nextSibling) return n.nextSibling;
    n = n.parentNode;
  }
  return null;//最後の節に至っていたらnullを返す
};


//get next node by "Depth first searth".
//木の構造の情報を引数に込める．子ならchild,妹ならバックトラックしたなら回数分でn．
Node.prototype.getNextNodeAndLocationalInformationByDFS = function(locationalInfomation){
  var n = this;
  var numOfBacktrack = 0;
    //子があるなら，最初の子を返す．
  if(n.firstChild) {
    locationalInfomation = "child";
    return n.firstChild;
  }
  //子がないなら，妹を返す．自らに妹がいないなら，バックトラックして，「妹を持つ最初の祖先」の妹を返す
  while(n){
    if(n.nextSibling) {
      locationalInfomation = numOfBacktrack+"";
      return n.nextSibling;
    }
    n = n.parentNode;
    numOfBacktrack++;
  }
  return null;//最後の節に至っていたらnullを返す
};


Node.prototype.getNextNodeByDFSWithoutChildren = function(){
  if(this.parentNode === null) return null;//ルートなら，子を飛ばしたら次に見る要素がないから，nullを返す．
  //thisはいったんちぎるから，親と妹をとっておく．
  var parent = this.parentNode;
  var nextSibling = this.nextSibling;
  parent.removeChild(this);
  //プレースホルダを入れる
  var placeHolder = document.createElementNS('','ph');
  parent.insertBefore(placeHolder, nextSibling);//プレースホルダをつなぐ
  //プレースホルダの次の要素を取る．
  var next = placeHolder.getNextNodeByDFS();
  //プレースホルダを消して，thisを戻す．
  parent.removeChild(placeHolder);//プレースホルダを消す
  parent.insertBefore(this, nextSibling);
  return next;
};



//get next node by "Depth first searth".
Node.prototype.getNextElementNodeByDFS = function(){
  var n = this;
  n = n.getNextNodeByDFS();
  while(n && n.nodeType !== 1){
    n = n.getNextNodeByDFS();
  }
  if(n===null) return null;
  else         return n;
};


//節の比較
//nは比較対象
//節が等しいなら結果は0．
Node.prototype.compareTo = function(n){
  if(this.nodeType !== n.nodeType) return 1;//nodeTypeチェック
  if(this.localName !== n.localName) return 1;//localNameチェック
  if(this.nodeType === 3){//テキストノードなら，nodeValueチェック
    if(this.nodeValue !== n.nodeValue) return 1;//localNameチェック
  }
  return 0;
  //属性は一致してなくていいことにする．
};


//部分木の比較
//木が等しいなら結果は0．
Node.prototype.compareTreeTo = function(n){
  //queryAndTargetは[0]にクエリ，[1]にターゲットのそれぞれの根が入ってるNodeArrayオブジェクト
  var compareTrees = function(queryAndTarget){
    var q = queryAndTarget[0];
    var t = queryAndTarget[1];
    var qInfo = "";//qが次の子を取得した時，どこを取得したか示す情報．
    var tInfo = "";
    while(true){
      if(!q.compareTo(t) && tInfo === qInfo){//節が等しい場合．節が同じ構造のもとに取ってこられたか否かも判定する．
        t = t.getNextNodeAndLocationalInformationByDFS(tInfo);
        q = q.getNextNodeAndLocationalInformationByDFS(qInfo);
      }else{//節が等しくない場合
        return false;
      }
      //終了判定
      if(q === null && t === null){//両方同時にたどり終わったら一致．
        return true;
      }
      if(q === null || t === null){
        return false;
      }
    }
  };

  var queryAndTarget = new NodeArray(0);

  queryAndTarget.push(n);
  queryAndTarget.push(this);
  return queryAndTarget.applyFunctionOnlyPartialTree(compareTrees);


};

//自分が考えたアルゴリズムに従う，mathmlの部分一致
//qはqueryのrootNode．
Node.prototype.myMathMLSearch = function(qRoot){

  var mainOfMyMathMLSearch = function(queryAndTarget){
    var qBase = queryAndTarget[0].firstChild;
    var tBase = queryAndTarget[1].firstChild;
    var tMatchedBegin = null;

    var q = qBase;
    var t = tBase;
    while(true){
      if(q.compareTreeTo(t)) {//部分木が一致
        if(tMatchedBegin === null) tMatchedBegin = t;
        t = t.nextSibling;
        q = q.nextSibling;
      }else{//不一致
        if(tMatchedBegin === null) {
          t = t.getNextNodeByDFS();
        }else{
          t = tMatchedBegin.getNextNodeByDFS();
          tMatchedBegin = null;
        }
        q = qBase;
      }
      //終了判定
      if(q === null) return 1;
      if(t === null) return -1;
    }
  }


  var queryAndTarget = new NodeArray(0);

  queryAndTarget.push(qRoot);
  queryAndTarget.push(this);
  return queryAndTarget.applyFunctionOnlyPartialTree(mainOfMyMathMLSearch);

};

Node.prototype.searchForMathML = function(q){
  //クエリの兄弟を文字列化
  //ターゲットの兄弟を文字列化
  //文字列を正規表現で検索
  //クエリ中の，mi,mo,mn以外のタグを抜き出す．
  //ターゲット中の，クエリ中のmimomn以外と比べられるべきタグを抜き出す．！！ここが難しい．
  //再帰で比べていく．
  //全部一致したらOK．



};






//その要素を根とするDOM木をXML文字列にしたものを返す
//XMLDocumentオブジェクトか，部分木を，XML文字列にして返す
Node.prototype.toXMLString = function(){
  //木をたどりながらXML文字列を構成していくメソッドを定義
  var walk = function (node){
    var XMLString = "";
    var leafFlag = 0;

    var attrs = node.attributes;
    var name  = node.localName;
    var type  = node.nodeType;

    //要素なら開きタグを構成(属性とその値も出力)，テキストなら単に文字列を出力，その他なら何もしない．
    if(node.nodeType === 1){         //elementがタグの場合
      XMLString += "<" + node.localName; //開き括弧とタグ名
      if(attrs){                        //属性があれば属性を出力
        for(var i=0; i < attrs.length; i++){
          XMLString += " " + attrs[i].localName + "=\"" + attrs[i].nodeValue +"\"" ;
        }
      }
      XMLString += ">";                 //閉じ括弧
    }else if(node.nodeType === 3){  //テキストノードの場合
      XMLString += node.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    }

    //再帰で木を辿る
    node = node.firstChild;
    if(node === null) leafFlag = 1;//着目している節が葉か否か判断
    while(node){
      XMLString += walk(node);
      node = node.nextSibling;
    }

    //閉じタグを構成
    if(type === 1){
      if(leafFlag === 1){//要素ノードで葉なら，<tag/>の形式にする．
        XMLString = XMLString.substr(0, XMLString.length-1) + "/>";
        leafFlag = 0;
      }else{
        XMLString += "</" + name + ">";
      }
    }

    return XMLString;
  }

  //定義したメソッドを実際動かす．
  return walk(this);
};






var NodeArray = function(){};
NodeArray.prototype = new Array();

//コールバックだけ引数に取る．．
//関数に引数を渡したい場合もあるけど，その時は引数を渡した関数をコールバックとして適切にラッピングする．
//このメソッドに，引数として，関数とその関数の引数を渡すよりは，その方がスマート．
//コールバックはNodeListを引数に取る．
//.forEach()のように，各要素に対してcallbackを適用するわけではないから，element,indexはコールバックの引数にしない．
NodeArray.prototype.applyFunctionOnlyPartialTree = function(callback){
  var nodes = this;
  var parents = new NodeArray(0);
  var nextSiblings = new NodeArray(0);
  //parentsとnextSiblingsをセット
  var set = function(){
    for (var i=0; i < nodes.length; i++) {
      parents.push(nodes[i].parentNode);
      nextSiblings.push(nodes[i].nextSibling);
    }
  };
  //ノードを親から切り離す．
  var disjoin = function(){
    for (var i=0; i < nodes.length; i++) {
      if( parents[i] !== null ){
        parents[i].removeChild(nodes[i]);
      }
    }
  };
  //再結合する．ノードが親を持ってたらほっとく．.disjoin()してから使わないと一貫性を保てない．
  var rejoin = function(){
    for (var i=0; i < nodes.length; i++) {
      if( parents[i] !== null && nodes[i].parentNode === null ){
        parents[i].insertBefore(nodes[i], nextSiblings[i]);
      }
    }
  };

  set();
  disjoin();
  var returnValue = callback(nodes);
  rejoin();
  return returnValue;
}




//最長キーワード優先探索
//渡された文字列からキーワードを探す．最長のキーワードを優先して取得して，すべてのキーワードを取得する．同じ文字が複数のキーワードに兼用されることはない．キーワードがabcdとcdeだったとして，aabcdeeという文字列を検索したら，abcdにのみ一致する．
//返り値は，[[キーワード1の開始位置，キーワード1の終了位置], [キーワード2の開始位置，キーワード2の終了位置], ...]．
//String.search()を使ってもよかったけど，それで長さ優先探索したかったら，keywordsを長さ順にしないとダメだったりするから，自分で書いた．
//仮テスト済
String.prototype.longLengthFirstKeywordSearch = function(keywords){
  var result = [];//[[キーワード1の開始位置，キーワード1の終了位置], [キーワード2の開始位置，キーワード2の終了位置], ...]が格納される．

  //再帰でキーワードを探す処理．ここでは定義するだけ．
  //searchedは探索される文字列，baseは，「大元の文字列から考えて，いまの文字列の基点はどこか」を示す．
  var recursiveProcess = function(searched, base){
    for (var i=searched.length; i > 0; i--) {//iは，探索する文字列長．最長を最初に見て，徐々に減らしていく．
      for (var j=0; j+i-1 < searched.length; j++) {//jは，文字列の開始インデクス．j+i-1は終端インデクス．
        //かなり複雑だけど，「着目している文字列がいずれかのキーワードと一致したら」という条件になってる．
        if( keywords.some(function(element, index, array) {//.some()は，配列の全要素に対してcallbackを実行していく．callbackは，element,index,arrayを伴ってコールされ，trueかfalseをreturnする必要がある．
              return (element === searched.substr(j, i));
            }) ){//substr(開始インデクス[,文字列長])．文字列長を省略したら終端まで取得．
          recursiveProcess(searched.substring(0,j), 0);//現在のiより短いキーワードも抽出するために，取得したキーワードより前の部分を探索([...ココを探索...][keyword][......])
                                                    //substring(開始インデクス，終了インデクス).終了インデクスで指定される文字の直前までが含まれる．
          result.push([base+j,base+j+i]);//インデクスのペア(配列)を結果配列につなぐ．(.substring()の仕様に倣って，終端は含まない．)
          recursiveProcess(searched.substr(j+i), j+i);//キーワードより後の部分を探索
          return;
        }
      }
    }
  };
  //定義した再帰的キーワード探索を実際に動かす
  recursiveProcess(this, 0);

  //resultを返す
  return result;
}




//テスト済
String.prototype.toXMLDocument = function(){
  //XML文字列をjQueryオブジェクトに変換．
  var jQueryPackedXML = $.xmlDOM(this);
  //PMDOMはXMLDocumentオブジェクト．jQueryオブジェクトの[0]を取ったらXMLDocumentオブジェクトになるっぽい．
  return jQueryPackedXML[0];
}



function spaces(len)
{
        var s = '';
        var indent = len*4;
        for (i=0;i<indent;i++) {s += " ";}

        return s;
}

function format_xml(str)
{
        var xml = '';

        // add newlines
        str = str.replace(/(>)(<)(\/*)/g,"$1\r$2$3");

        // add indents
        var pad = 0;
        var indent;
        var node;

        // split the string
        var strArr = str.split("\r");

        // check the various tag states
        for (var i = 0; i < strArr.length; i++) {
                indent = 0;
                node = strArr[i];

                if(node.match(/.+<\/\w[^>]*>$/)){ //open and closing in the same line
                        indent = 0;
                } else if(node.match(/^<\/\w/)){ // closing tag
                        if (pad > 0){pad -= 1;}
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)){ //opening tag
                        indent = 1;
                } else
                        indent = 0;
                //}

                xml += spaces(pad) + node + "\r";
                pad += indent;
        }

        return xml;
}



//dnameで指定されたファイル名のxml文書を読み込む
//var xml=loadXMLDoc("test.xml");で，test.xmlをパースしたドキュメントオブジェクトがxmlに代入される
function loadXMLDoc(dname){
  xhttp=new XMLHttpRequest();

  xhttp.open("GET",dname,false);
  xhttp.send("");
  return xhttp.responseXML;
}










Debug = {
  printErrorMessageOnHTMLDiv : function(messageString){
    var error = $("#error")[0];//HTML文からid="error"のdiv要素を取得
    error.appendChild(document.createTextNode(messageString));
    error.appendChild(document.createElement("br"));
  }
}




HTMLPrint = {
  text : function(divId, textString){
    var div = $("#"+divId)[0];
    div.appendChild(document.createTextNode(textString));
  },

  MathML : function(divId,mathElement){
    var div = $("#"+divId)[0];
    div.appendChild(mathElement);
  },

  br : function(divId){
    var div = $("#"+divId)[0];
    div.appendChild(document.createElement("br"));
  },

}
















