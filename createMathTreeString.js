/*
 * MathMLノードをツリー文字列に変換
 */



/*
 * 
 */



/*
 * 
 */
const { alias } = require("./constants");

var createMathTreeString = function(n) {
  var oneNode = function(n) {
    if (!n || !n.localName) return '';
    if (n.localName === 'mrow' && n.childNodes.length === 0) return '';

    if (n.localName.match(/munderover/)) {
      const a = oneNode(n.childNodes[0]);
      const b = oneNode(n.childNodes[1]);
      const c = oneNode(n.childNodes[2]);
      return '/' + alias[n.localName]
        + (a ? '/{' + a + '/}' : '')
        + (b ? '/{' + b + '/}' : '')
        + (c ? '/{' + c + '/}' : '');
    }
    else if (n.localName.match(/msubsup/)) {
      // baseは出さず、下付き・上付きのみ
      const b = n.childNodes[1] ? oneNode(n.childNodes[1]) : '';
      const c = n.childNodes[2] ? oneNode(n.childNodes[2]) : '';
      return '/' + alias[n.localName]
        + (b ? '/{' + b + '/}' : '')
        + (c ? '/{' + c + '/}' : '');
    }
    else if (n.localName.match(/munder|mover|mroot|mfrac/)) {
      // 最初と2番目の非空ノードを分子・分母に
      let num = '';
      let den = '';
      let found = 0;
      for (let i = 0; i < n.childNodes.length; i++) {
        const child = oneNode(n.childNodes[i]);
        if (child) {
          if (found === 0) {
            num = child;
            found++;
          } else if (found === 1) {
            den = child;
            break;
          }
        }
      }
      return '/' + alias[n.localName]
        + (num ? '/{' + num + '/}' : '')
        + (den ? '/{' + den + '/}' : '');
    }
    else if (n.localName.match(/msqrt|mtd/)) {
      let content = '';
      for (let i = 0; i < n.childNodes.length; i++) {
        const child = oneNode(n.childNodes[i]);
        if (child) content += child;
      }
      return '/' + alias[n.localName] + (content ? '/{' + content + '/}' : '');
    }
    else if (n.localName.match(/msub|msup/)) {
      let base = '';
  let sup = '';
  let found = 0;
  for (let i = 0; i < n.childNodes.length; i++) {
    const child = oneNode(n.childNodes[i]);
    if (child) {
      if (found === 0) {
        base = child;
        found++;
      } else if (found === 1) {
        sup = child;
        break;
      }
    }
  }
  return '/' + alias[n.localName]
    + (base ? '/{' + base + '/}' : '')
    + (sup ? '/{' + sup + '/}' : '');
    }
    else if (n.localName.match(/mtable|mtr/)) {
      var mtableXStr = '/' + alias[n.localName];
      for (var i = 0; i < n.childNodes.length; i++) {
        const child = oneNode(n.childNodes[i]);
        if (child) mtableXStr += '/{' + child + '/}';
      }
      return mtableXStr;
    }
    else if (n.localName === 'mrow' || n.localName === 'math') {
      var mrowXStr = '';
      for (var i = 0; i < n.childNodes.length; i++) {
        const child = oneNode(n.childNodes[i]);
        if (child) mrowXStr += child;
      }
      return mrowXStr;
    }
    else if (n.localName.match(/mi|mn|mo/)) {
      if (!n.firstChild || !n.firstChild.nodeValue) return '';
      const v = n.firstChild.nodeValue;
      if (v === '\\') {
        return '\\\\';
      } else if (v === '{' || v === '}' || v === ':') {
        return '\\' + v;
      } else {
        return v;
      }
    }
    else {
      // その他のノードは最初の子だけを再帰
      return n.childNodes && n.childNodes[0] ? oneNode(n.childNodes[0]) : '';
    }
  };

  return oneNode(n);
};


module.exports = { createMathTreeString};

var createMathTreeStringT = function(n)
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
