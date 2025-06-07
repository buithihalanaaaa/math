


/*
 * 
 */
const { alias } = require("./constants");

var createMathTreeStringAA = function(n)
{
  var oneNode = function(n)
  {
    //sliceは接頭辞'm'を削除するためのもの．
      if (!n || !n.localName) return ""; // ← これを追加
    if     (n.localName.match(/munderover/))//munderoverがmunderに当たらないように，先にマッチング．
    {
      return '/' + alias[n.localName] +
             '/{' + oneNode(n.childNodes[0]) + '/}' +
             '/{' + oneNode(n.childNodes[1]) + '/}' +
             '/{' + oneNode(n.childNodes[2]) + '/}';
    }
    else if(n.localName.match(/msubsup/))//msubsupがmsubに当たらないように，先マッチング．
    {
      return '/' + alias[n.localName] +
             '/{' + oneNode(n.childNodes[1]) + '/}' +
             '/{' + oneNode(n.childNodes[2]) + '/}';
    }
    else if(n.localName.match(/munder|mover|mroot|mfrac/))
    {
      return '/' + alias[n.localName] +
             '/{' + oneNode(n.childNodes[0]) + '/}' +
             '/{' + oneNode(n.childNodes[1]) + '/}';
    }
    else if(n.localName.match(/msqrt|mtd/))
    {
      return '/' + alias[n.localName] +
             '/{' + oneNode(n.childNodes[0]) + '/}';
    }
    else if(n.localName.match(/msub|msup/))
    {
      return '/' + alias[n.localName] +
             '/{' + oneNode(n.childNodes[1]) + '/}';
    }
    else if(n.localName.match(/mtable|mtr/))
    {
      var mtableXStr = '/' + alias[n.localName];
      for(var i=0; i<n.childNodes.length; i++)
      {
        //mtableXStr += oneNode(n.childNodes[i]);
        mtableXStr += '/{' +oneNode(n.childNodes[i])+ '/}';
      }
      return mtableXStr;
    }
    else if(n.localName === 'mrow' || n.localName === 'math')
    {
      var mrowXStr = '';
      for(var i=0; i<n.childNodes.length; i++)
      {
        mrowXStr += oneNode(n.childNodes[i]);
      }
      return mrowXStr;
    }
    else if(n.localName.match(/mi|mn|mo/))
    {
      if(n.firstChild.nodeValue.match(/[{}\\:]/))
      {
        return '\\' + n.firstChild.nodeValue;
      }
      else
      {
        return n.firstChild.nodeValue;
      }
    }
    else
    {
      return oneNode(n.childNodes[0]);
    }
  };

  /*
   * ここで，関数内関数をコール．
   */
  return oneNode(n);
};


var createMathTreeStringTAA = function(n)
 {
  var oneNode = function(n)
  {
    //console.log(n);
    //sliceは接頭辞'm'を削除するためのもの．
    var mrowXStr = '';
    if(n.localName === 'mi' || n.localName === 'mn'|| n.localName === 'mo'){
      if (n.firstChild.nodeValue === '>'){
        return '<' + n.localName + '>' + '&lt;'+ '</' + n.localName + '>';

      } else if (n.firstChild.nodeValue === '<'){
        return '<' + n.localName + '>' + '&gt;'+ '</' + n.localName + '>';

      /*
      } else if (n.firstChild.nodeValue == '&'){
        return '<' + n.localName + '>' + '&amp;'+ '</' + n.localName + '>';

      } else if (n.firstChild.nodeValue == '"'){
        return '<' + n.localName + '>' + '&quot;'+ '</' + n.localName + '>';

      } else if (n.firstChild.nodeValue == '\''){
        return '<' + n.localName + '>' + '&apos;'+'</' + n.localName + '>';
      */
      }else {
        return '<' + n.localName + '>' + n.firstChild.nodeValue+ '</' + n.localName + '>';
      }

    }else {
      mrowXStr += '<' + n.localName;
      if(n.localName === 'math'){
        mrowXStr += ' mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\"'; /* ここで、抽出結果ウィンドウのmathタグ内を操作できる */
        //mrowXStr += ' xmlns=\"http://www.w3.org/1998/Math/MathML\"';
      }
      mrowXStr += '>';
      for(var i=0; i<n.childNodes.length; i++)
      {
        mrowXStr += oneNode(n.childNodes[i]);
      }
      mrowXStr += '</' + n.localName + '>';
      return mrowXStr;
    }
  };
  return oneNode(n);
};
module.exports = { createMathTreeStringAA }; // ← 必ずオブジェクト形式でエクスポート
