/*
 * pmmlの木を正規化．
 * arg: math要素，あるいは，pmmlの要素．
 * ret: math要素，あるいは，pmmlの要素．引数に親がある場合は，もとの親とつながれている状態で返る．
 *      返り値が複数の要素になるような場合は，mrowで束ねられて返る．
 *      空のmrowを渡したら，そのmrowは木から取り除かれて，nullが返る．
 */
var normalizePmmlTree = function(argElement)
{
  
  console.log(argElement);
  var name        = argElement.localName;
  var parent      = argElement.parentNode;
  var nextSibling = argElement.nextSibling;

  //渡されたのが空のmrowなら，何もせずにそのmrowを返して終了．
  //dummyの下につないで処理してしまうと，空のmrowが消えてしまう．
  if(name==='mrow' && argElement.childNodes.length === 0) return argElement;
  
  /*
   * 引数をダミーノードの子にして，ダミーノードに対して処理を行うようにする．これによって，dummyが根になるので，parentまで処理が貫通することを防げる．
   * dummyは最終的にmrowに置き換わるけど，最初からmrowにするのはダメ．最初からmrowにすると，mrowが正規化で消滅して，束ねる役割を果たさなくなる．
   */
  var dummy = document.createElementNS('','dummy');

  if(name === 'math')
  {
    var rootMrow = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
    while(argElement.childNodes.length > 0) rootMrow.appendChild(argElement.firstChild);
    argElement.appendChild(rootMrow);
    dummy.appendChild(argElement);
  }
  else
  {
    dummy.appendChild(argElement);
  }


  //各ノードに正規化処理を適用
  n = dummy;
  while(n)  n = normalize(n);

  //dummyが2つ以上の子を持つなら，mrowで束ねる．
  if(dummy.childNodes.length > 1)
  {
    returnElement = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
    //このループでdummyの子が返り値の要素の子に移り変わるので，実質，dummyの削除になっている．
    while(dummy.childNodes.length > 0) returnElement.appendChild(dummy.firstChild);
  }
  else
  {
    returnElement = dummy.firstChild;
  }

  //引数が親につながれていた場合は，親につなぎなおす．
  parent.insertBefore(returnElement, nextSibling);

  return returnElement;
};


//==============================================================
//==============================================================


//1要素ずつ正規化していく
var normalize = function(n){
  //ルートならほっとく
  if(n.parentNode === null){
    return n.getNextNodeByDFS();
  }

  switch(n.localName){
    //====math要素．直下をmrowにする．
    case "math":
      n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
      return n.getNextNodeByDFS();
      break

    //====単体の記号
    case "mi":
    case "mo":
    case "mn":
    case "mtext":
      if(!n.hasChildNodes()){
        var next = n.getNextNodeByDFSWithoutChildren();
        n.parentNode.removeChild(n);
        return next;
      }
      return normalizeMimnmo(n);
      break;

    //====子が1つ
    case "msqrt"://平方根だから子は1つ
    case "mtd":
      //msqrtは子を任意の個数取れるので，他と違って，ループでキッチリ全部動かす
      var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
      while(n.children.length > 0)
      {
        mrow.appendChild(n.children[0]);
      }
      n.appendChild(mrow);
      return n.getNextNodeByDFS();//単に次の子を見る．
      break;

    case "mtable":
      var i;
      var mtdMax = 0;
      for(i = 0; i<n.children.length; i++){
        if(mtdMax < n.children[i].children.length) mtdMax = n.children[i].children.length;
      }
      var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
      var mtd = document.createElementNS('http://www.w3.org/1998/Math/MathML','mtd');
      var j;
      var mtdNum;
      mtd.appendChild(mrow);
      for(i = 0; i<n.children.length; i++){
        if(mtdMax > n.children[i].children.length){
          mtdNum = n.children[i].children.length;
          for(j=0; j < mtdMax - mtdNum; j++){
            n.children[i].appendChild(mtd);
          }
        }
      }
      return n.getNextNodeByDFS();
      break;

    case "mtr":
      return n.getNextNodeByDFS();
      break;

    //====子が2つ
    case "mover":
      if(n.firstChild.localName == "munder"){
        var munderover = document.createElementNS('http://www.w3.org/1998/Math/MathML','munderover');
        var child1 = n.firstChild.childNodes[0];
        var child2 = n.firstChild.childNodes[1];
        var child3 = n.childNodes[1];
        munderover.appendChild(child1);
        munderover.appendChild(child2);
        munderover.appendChild(child3);
        munderover.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        munderover.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        munderover.childNodes[2].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        n.parentNode.insertBefore(munderover, n);
        n.parentNode.removeChild(n);
        return munderover.getNextNodeByDFS();
      }else{
        n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
        n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//2つ目の子のルートをmrowにする．
        return n.getNextNodeByDFS();//単に次の子を見る．
      }
      break;

    case "munder":
      if(n.firstChild.localName == "mover"){
        var munderover = document.createElementNS('http://www.w3.org/1998/Math/MathML','munderover');
        var child1 = n.firstChild.childNodes[0];
        var child2 = n.childNodes[1];
        var child3 = n.firstChild.childNodes[1];
        munderover.appendChild(child1);
        munderover.appendChild(child2);
        munderover.appendChild(child3);
        munderover.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        munderover.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        munderover.childNodes[2].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
        n.parentNode.insertBefore(munderover, n);
        n.parentNode.removeChild(n);
        return munderover.getNextNodeByDFS();
      }else{
        n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
        n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//2つ目の子のルートをmrowにする．
        return n.getNextNodeByDFS();//単に次の子を見る．
      }
      break;

    case "mroot"://n方根だから子は2つ
    case "mfrac"://分子と分母で子は2つ
      n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
      n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//2つ目の子のルートをmrowにする．
      return n.getNextNodeByDFS();//単に次の子を見る．
      break;

    //====子が3つ
    case "munderover"://munderoverをmunderとmoverに分離することはできない．
      n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
      n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//2つ目の子のルートをmrowにする．
      n.childNodes[2].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//3つ目の子のルートをmrowにする．
      return n.getNextNodeByDFS();//単に次の子を見る．
      break;

    //====下付き，上付き，上下付き
    case "msup":
    case "msub":
      var firstChild = n.firstChild;
      n.parentNode.insertBefore(firstChild, n);//最初の子を引きずりだす．引きずりだしてから処理しないと，mrowがうまく消されない．
      var newOrg1stChild = normalizePmmlTree(firstChild);//最初の子を処理．
      if(newOrg1stChild.localName==='mrow')//根がmrowである場合は除去．この時点でfirstchildは消えてる可能性があるから，またnから辿る．
      {
        newOrg1stChild.parentNode.removeChildOnly(newOrg1stChild);
      }
      n.insertBefore(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'), n.childNodes[0]);//msupの第一の子として，子を持たないmrowを入れる．msupは子を2つ持つので，validなら確実にmsub.childNodes[0]は存在する．
      n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//第二の子のルートをmrowにする．
      return n.childNodes[1];//[0]は空のmrowなのでもう走査しなくて良い．第二の子を処理する．
      break;
    case "msubsup":
      // msubとmsupに分解するバージョン
      // var next = n.getNextNodeByDFSWithoutChildren();
      // var nChild0 = n.childNodes[0];
      // var nChild1 = n.childNodes[1];
      // var nChild2 = n.childNodes[2];
      // n.parentNode.insertBefore(nChild0, n);//最初の子を引きずりだす．引きずりだしてから処理しないと，mrowがうまく消されない．
      // var newOrgChild0 = normalizePmmlTree(nChild0);//最初の子を処理．
      // if(newOrgChild0.localName==='mrow')//根がmrowである場合は除去．
      // {
      //   newOrgChild0.parentNode.removeChildOnly(newOrgChild0);
      // }
      // //msubを構成．
      // var msub = document.createElementNS('http://www.w3.org/1998/Math/MathML','msub');
      // msub.appendChild(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子を空のmrowにする．
      // var mrowForMsub = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
      // mrowForMsub.appendChild(nChild1);//2つ目の子はmsubsupの最後の子．上付き添え字に相当する部分．
      // msub.appendChild(mrowForMsub);
      // //msupを構成．
      // var msup = document.createElementNS('http://www.w3.org/1998/Math/MathML','msup');
      // msup.appendChild(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子を空のmrowにする．
      // var mrowForMsup = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
      // mrowForMsup.appendChild(nChild2);//2つ目の子はmsubsupの最後の子．上付き添え字に相当する部分．
      // msup.appendChild(mrowForMsup);
      // //msub,msupをつなぐ．
      // n.parentNode.insertAfter(msub,n);//構成したmsubをmsubsupの後ろにつなぐ．
      // n.parentNode.insertAfter(msup,msub);//構成したmsupをmsubの後ろにつなぐ．
      // normalize(msub);//部分木として処理．
      // normalize(msup);//部分木として処理．

      // n.parentNode.removeChild(n);//msubsupを消す．下付き添字部分ごと．
      // return next;//msubsupの中身だった部分，すなわち置換後の部分はすでに全部処理したから，次の節を見ていい．
      var firstChild = n.firstChild;
      n.parentNode.insertBefore(firstChild, n);//最初の子を引きずりだす．引きずりだしてから処理しないと，mrowがうまく消されない．
      var newOrg1stChild = normalizePmmlTree(firstChild);//最初の子を処理．
      if(newOrg1stChild.localName==='mrow')//根がmrowである場合は除去．この時点でfirstchildは消えてる可能性があるから，またnから辿る．
      {
        newOrg1stChild.parentNode.removeChildOnly(newOrg1stChild);
      }
      n.insertBefore(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'), n.childNodes[0]);//msupの第一の子として，子を持たないmrowを入れる．msupは子を2つ持つので，validなら確実にmsub.childNodes[0]は存在する．
      n.childNodes[1].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//第二の子のルートをmrowにする．
      n.childNodes[2].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//第二の子のルートをmrowにする．
      return n.childNodes[1];//[0]は空のmrowなのでもう走査しなくて良い．第二の子を処理する．
      break;

    //====特別な処理が必要な要素
    case "mstyle":
    case "semantics":
    case "mpadded":
    case "menclose":
      // // mstyle残すバージョン
      // // n.childNodes[0].appendTo(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));//1つ目の子のルートをmrowにする．
      // var mrowForStyle = document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow');
      // while(n.children.length > 0)
      // {
      //   mrowForStyle.appendChild(n.children[0]);
      // }
      // n.appendChild(mrowForStyle);
      // return n.getNextNodeByDFS();//単に次の子を見る．

      // mstyle消すバージョン
      var next = n.getNextNodeByDFS();
      while(n.children.length > 0)
      {
        n.parentNode.insertBefore(n.children[0], n.nextSibling);
      }
      n.parentNode.removeChild(n);
      return next;

      break;

    case "mmultiscripts":
      //mmultiscriptsの子を外しながらmmultiscriptsの後ろに要素を並べていく
      //基準の要素を外に追い出す(mmultiscriptsの直前に)
      var base = n.children[0];
      var nextSibling = n.nextSibling;
      n.parentNode.insertBefore(n.children[0], nextSibling);
      //
      var mprescriptsFlag = false;//mprescriptsが来たらtrueになる
      while(n.children.length > 0)
      {
        if(n.children[0].localName === 'mprescripts')
        {
          n.removeChild(n.children[0]);
          mprescriptsFlag = true;
        }
        else
        {
          if(n.children[0].localName !== 'none' && n.children[1].localName !== 'none' )
          {
            var msubsup = document.createElementNS('http://www.w3.org/1998/Math/MathML','msubsup');
            msubsup.appendChild(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
            msubsup.appendChild(n.children[0]);
            msubsup.appendChild(n.children[0]);//sub分で0を外したから，1つズレるので，0でOK.
            if(mprescriptsFlag) n.parentNode.insertBefore(msubsup, base);
            else                n.parentNode.insertBefore(msubsup, nextSibling);
          }
          else if(n.children[0].localName !== 'none' && n.children[1].localName === 'none' )
          {
            var msub = document.createElementNS('http://www.w3.org/1998/Math/MathML','msub');
            msub.appendChild(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
            msub.appendChild(n.children[0]);
            n.removeChild(n.children[0]);//noneを外す
            if(mprescriptsFlag) n.parentNode.insertBefore(msub, base);
            else                n.parentNode.insertBefore(msub, nextSibling);
          }
          else if(n.children[0].localName === 'none' && n.children[1].localName !== 'none' )
          {
            var msup = document.createElementNS('http://www.w3.org/1998/Math/MathML','msup');
            msup.appendChild(document.createElementNS('http://www.w3.org/1998/Math/MathML','mrow'));
            n.removeChild(n.children[0]);//noneを外す
            msup.appendChild(n.children[0]);
            if(mprescriptsFlag) n.parentNode.insertBefore(msup, base);
            else                n.parentNode.insertBefore(msup, nextSibling);
          }
          else if(n.children[0].localName === 'none' && n.children[1].localName === 'none' )
          {
            n.removeChild(n.children[0]);//noneを外す
            n.removeChild(n.children[0]);//noneを外す
          }
        }
      }
      //空っぽになったmmlutiscriptsの後ろに，その内容があるので，次はそこからチェック．
      var next = n.getNextNodeByDFS();
      //空っぽのmmultiscriptsを消す
      n.parentNode.removeChild(n);
      return next;
      break;
/*
    case "mspace":
      var next = n.getNextNodeByDFS();
      while(n.children.length > 0)
      {
        n.parentNode.insertBefore(n.children[0], n.nextSibling);
      }
      n.parentNode.removeChild(n);
      return next;
      break;
*/
    case "mrow":
      return normalizeMrow(n);
      break;

    case "mfenced":
      return normalizeMfenced(n);
      break;

    case "annotation":
    case "mspace":
    case "mphantom":
    case "merror":
    case "maligngroup":
    case "malignmark":
      var next = n.getNextNodeByDFSWithoutChildren();
      n.parentNode.removeChild(n);
      return next;
      break;
  }
  if(!n.localName)
  {
      var next = n.getNextNodeByDFSWithoutChildren();
      n.parentNode.removeChild(n);
      return next;
  }
  return n.getNextNodeByDFS();
};




var normalizeMimnmo = function(n)
{
  //子がなかったらエラー．
  //if(!n.hasChildNodes()) throw new Error('There is an empty mi, mn, or mo.');

  //見えない演算子を消す．
  var childText = n.firstChild.nodeValue;
  //--このコードブロックは重要．ここで，正規表現の内容と置換先を書き換えたら，mi,mn,moの内容をいくらでも変えられる．
  regexString = '(' + String.fromCharCode(0x2062) + '|' + String.fromCharCode(0x2061) + ')';
  childText = childText.replace(new RegExp(regexString,'g'), '');
  //--
  n.removeChild(n.firstChild);
  n.appendChild(document.createTextNode(childText));

  //mi, mo, mnの子を1字ずつに分解．
  var next = n.getNextNodeByDFSWithoutChildren();

  /*
   * mimnmoがもともと持ってた属性を保存しておく．
   */
  var attrs = n.attributes;
  for (var i=0; i < n.firstChild.nodeValue.length; i++)
  {
    var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML','mi');
    for(var j=0; j < attrs.length; j++)
    {
      mi.setAttribute(attrs[j].name, attrs[j].value);
    }
    //undone::ここの条件節，もうちょっと細かい調整すべき．けど，どういう調整をすべきかはレンダラ依存のところも…．
    if(n.firstChild.nodeValue.length > 1 && attrs.length === 0)
    {
      mi.setAttribute('mathvariant','normal');
    }

    mi.appendChild( document.createTextNode(n.firstChild.nodeValue.charAt(i)) );
    n.parentNode.insertBefore(mi, n);//キーワードを囲むmiタグを，2文字以上含むmiの直前に入れる．直前に入れて行かないと，順序が保存されない．
  }
  n.parentNode.removeChild(n);//2文字以上含むmiを消す．
  return next;
};


var normalizeMrow = function(n)
{
  var keep = [ //mrowと併用されるべきタグ
    'mfrac', 'msqrt', 'mroot',
    'msub', 'msup', 'msubsup',
    'mover', 'munder', 'munderover',
    'mstyle', 'mtd',
    'math'
  ];

  //mrowの親のノードのノード名が，keepに含まれる場合，残す．
  if(keep.some(function(element, index, array) {//.some()は，配列の全要素に対してcallbackを実行していく．callbackは，element,index,arrayを伴ってコールされ，trueかfalseをreturnする必要がある．callbackが一度でもtrueを返したら.some()はtrueを返す
    return (element === n.parentNode.localName);
  })){
    return n.getNextNodeByDFS();
  //mrowが余計なところにあるなら，消す．
  }else{
    var next = n.getNextNodeByDFS();
    n.parentNode.removeChildOnly(n);
    return next;
  }
};

var normalizeMfenced = function(n)
{
  parent = n.parentNode;
  if(!parent) throw new Error('An mfenced has no parent.')

  //開きカッコを作る．open属性が指定されているか否かでカッコ記号を変更．
  var moOpen = document.createElementNS('http://www.w3.org/1998/Math/MathML','mo');
  var openValue = n.getAttribute('open');
  if(openValue === null)   moOpen.appendChild( document.createTextNode('(') );
  else                     moOpen.appendChild( document.createTextNode(openValue) );

  //閉じカッコを作る
  var moClose = document.createElementNS('http://www.w3.org/1998/Math/MathML','mo');
  var closeValue = n.getAttribute('close');
  if(closeValue === null)  moClose.appendChild( document.createTextNode(')') );
  else                     moClose.appendChild( document.createTextNode(closeValue) );

  //開きカッコと閉じカッコを，mfencedの前後に挿入．
  parent.insertBefore(moOpen , n);
  parent.insertAfter (moClose, n);

  //mfencedを削除して，mfencedの子を繋ぎ直す
  parent.removeChildOnly(n);

  //moOpenから再走査．
  return moOpen;
};







