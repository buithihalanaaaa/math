// JSDOMのwindowを受け取り、そのNode/Elementにprototype拡張を行う関数としてエクスポート

module.exports = function(jsdomWindow) {
  const jsdomNode = jsdomWindow.Node;

  // --- ここから下、すべてjsdomNode.prototype に対して拡張 ---
  jsdomNode.prototype.isSimpleContent = function(){
    if(this.hasChildNodes()){
      for(var i=0; i < this.childNodes.length; i++){
        if(this.childNodes[i].nodeType !== 3) return false;
      }
      return true;
    }else{
      return true;
    }
  };

  jsdomNode.prototype.appendTo = function(node){
    if(this.parentNode === null){
      node.appendChild(this);
    }else{
      this.parentNode.replaceChild(node,this);
      node.appendChild(this);
    }
  };

  jsdomNode.prototype.insertAfter = function(appended, base){
    if(base === null){
      this.insertBefore(appended, this.firstChild);
    }else{
      this.insertBefore(appended, base.nextSibling);
    }
  };

  jsdomNode.prototype.removeChildOnly = function(node){
    if(this.nodeType === 9){
      this.removeChild(node);
      this.appendChild(node.firstChild);
    }else{
      while(node.hasChildNodes()){
        this.insertBefore(node.firstChild, node);
      }
      this.removeChild(node);
    }
  };

  jsdomNode.prototype.replaceChildOnly = function(after, before){
    while(before.hasChildNodes()){
      after.appendChild(before.firstChild);
    }
    this.replaceChild(after, before);
  };

  jsdomNode.prototype.indexOf = function(node){
    for(var i=0; i < this.childNodes.length; i++){
      if(node === this.childNodes[i]) return i;
    }
    return null;
  };

  jsdomNode.prototype.applyFunctionOnlyPartialTree = function(callback){
    var node = this;
    var parent = node.parentNode;
    var nextSibling = node.nextSibling;
    if(parent !== null) parent.removeChild(node);
    var returnValue = callback(node);
    if(parent !== null) parent.insertBefore(node, nextSibling);
    return returnValue;
  };

  jsdomNode.prototype.getNextNodeByLocalName = function(localName){
    var n = this.getNextNodeByDFS();
    while(n){
      if(n.localName === localName) return n;
      n = n.getNextNodeByDFS();
    }
    return null;
  };

  jsdomNode.prototype.getNextNodeByDFS = function() {
    var n = this;
    if(n.firstChild) return n.firstChild;
    while(n){
      if(n.nextSibling) return n.nextSibling;
      n = n.parentNode;
    }
    return null;
  };

  jsdomNode.prototype.getNextNodeAndLocationalInformationByDFS = function(locationalInfomation){
    var n = this;
    var numOfBacktrack = 0;
    if(n.firstChild) {
      locationalInfomation = "child";
      return n.firstChild;
    }
    while(n){
      if(n.nextSibling) {
        locationalInfomation = numOfBacktrack+"";
        return n.nextSibling;
      }
      n = n.parentNode;
      numOfBacktrack++;
    }
    return null;
  };

  jsdomNode.prototype.getNextNodeByDFSWithoutChildren = function(){
    if(this.parentNode === null) return null;
    var parent = this.parentNode;
    var nextSibling = this.nextSibling;
    parent.removeChild(this);
    var placeHolder = this.ownerDocument.createElementNS('','ph');
    parent.insertBefore(placeHolder, nextSibling);
    var next = placeHolder.getNextNodeByDFS();
    parent.removeChild(placeHolder);
    parent.insertBefore(this, nextSibling);
    return next;
  };

  jsdomNode.prototype.getNextElementNodeByDFS = function(){
    var n = this;
    n = n.getNextNodeByDFS();
    while(n && n.nodeType !== 1){
      n = n.getNextNodeByDFS();
    }
    if(n===null) return null;
    else         return n;
  };

  jsdomNode.prototype.compareTo = function(n){
    if(this.nodeType !== n.nodeType) return 1;
    if(this.localName !== n.localName) return 1;
    if(this.nodeType === 3){
      if(this.nodeValue !== n.nodeValue) return 1;
    }
    return 0;
  };

  jsdomNode.prototype.compareTreeTo = function(n){
    var compareTrees = function(queryAndTarget){
      var q = queryAndTarget[0];
      var t = queryAndTarget[1];
      var qInfo = "";
      var tInfo = "";
      while(true){
        if(!q.compareTo(t) && tInfo === qInfo){
          t = t.getNextNodeAndLocationalInformationByDFS(tInfo);
          q = q.getNextNodeAndLocationalInformationByDFS(qInfo);
        }else{
          return false;
        }
        if(q === null && t === null){
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

  jsdomNode.prototype.myMathMLSearch = function(qRoot){
    var mainOfMyMathMLSearch = function(queryAndTarget){
      var qBase = queryAndTarget[0].firstChild;
      var tBase = queryAndTarget[1].firstChild;
      var tMatchedBegin = null;
      var q = qBase;
      var t = tBase;
      while(true){
        if(q.compareTreeTo(t)) {
          if(tMatchedBegin === null) tMatchedBegin = t;
          t = t.nextSibling;
          q = q.nextSibling;
        }else{
          if(tMatchedBegin === null) {
            t = t.getNextNodeByDFS();
          }else{
            t = tMatchedBegin.getNextNodeByDFS();
            tMatchedBegin = null;
          }
          q = qBase;
        }
        if(q === null) return 1;
        if(t === null) return -1;
      }
    };
    var queryAndTarget = new NodeArray(0);
    queryAndTarget.push(qRoot);
    queryAndTarget.push(this);
    return queryAndTarget.applyFunctionOnlyPartialTree(mainOfMyMathMLSearch);
  };

  jsdomNode.prototype.searchForMathML = function(q){
    // 未実装
  };

  jsdomNode.prototype.toXMLString = function(){
    var walk = function (node){
      var XMLString = "";
      var leafFlag = 0;
      var attrs = node.attributes;
      var name  = node.localName;
      var type  = node.nodeType;
      if(node.nodeType === 1){
        XMLString += "<" + node.localName;
        if(attrs){
          for(var i=0; i < attrs.length; i++){
            XMLString += " " + attrs[i].localName + "=\"" + attrs[i].nodeValue +"\"" ;
          }
        }
        XMLString += ">";
      }else if(node.nodeType === 3){
        XMLString += node.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
      }
      node = node.firstChild;
      if(node === null) leafFlag = 1;
      while(node){
        XMLString += walk(node);
        node = node.nextSibling;
      }
      if(type === 1){
        if(leafFlag === 1){
          XMLString = XMLString.substr(0, XMLString.length-1) + "/>";
          leafFlag = 0;
        }else{
          XMLString += "</" + name + ">";
        }
      }
      return XMLString;
    };
    return walk(this);
  };

  // --- NodeArray拡張 ---
  var NodeArray = function(){};
  NodeArray.prototype = new Array();

  NodeArray.prototype.applyFunctionOnlyPartialTree = function(callback){
    var nodes = this;
    var parents = new NodeArray(0);
    var nextSiblings = new NodeArray(0);
    var set = function(){
      for (var i=0; i < nodes.length; i++) {
        parents.push(nodes[i].parentNode);
        nextSiblings.push(nodes[i].nextSibling);
      }
    };
    var disjoin = function(){
      for (var i=0; i < nodes.length; i++) {
        if( parents[i] !== null ){
          parents[i].removeChild(nodes[i]);
        }
      }
    };
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
  };

  // --- String拡張 ---
  String.prototype.longLengthFirstKeywordSearch = function(keywords){
    var result = [];
    var recursiveProcess = function(searched, base){
      for (var i=searched.length; i > 0; i--) {
        for (var j=0; j+i-1 < searched.length; j++) {
          if( keywords.some(function(element) {
                return (element === searched.substr(j, i));
              }) ){
            recursiveProcess(searched.substring(0,j), 0);
            result.push([base+j,base+j+i]);
            recursiveProcess(searched.substr(j+i), j+i);
            return;
          }
        }
      }
    };
    recursiveProcess(this, 0);
    return result;
  };

  String.prototype.toXMLDocument = function(){
    var jQueryPackedXML = $.xmlDOM(this);
    return jQueryPackedXML[0];
  };

  // --- その他の関数 ---
  jsdomWindow.spaces = function(len) {
    var s = '';
    var indent = len*4;
    for (var i=0;i<indent;i++) {s += " ";}
    return s;
  };

  jsdomWindow.format_xml = function(str) {
    var xml = '';
    str = str.replace(/(>)(<)(\/*)/g,"$1\r$2$3");
    var pad = 0;
    var indent;
    var node;
    var strArr = str.split("\r");
    for (var i = 0; i < strArr.length; i++) {
      indent = 0;
      node = strArr[i];
      if(node.match(/.+<\/\w[^>]*>$/)){
        indent = 0;
      } else if(node.match(/^<\/\w/)){
        if (pad > 0){pad -= 1;}
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)){
        indent = 1;
      } else
        indent = 0;
      xml += jsdomWindow.spaces(pad) + node + "\r";
      pad += indent;
    }
    return xml;
  };

  // --- デバッグ・HTML出力 ---
  jsdomWindow.Debug = {
    printErrorMessageOnHTMLDiv : function(messageString){
      var error = $("#error")[0];
      error.appendChild(document.createTextNode(messageString));
      error.appendChild(document.createElement("br"));
    }
  };

  jsdomWindow.HTMLPrint = {
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
    }
  };

  // --- 必要ならwindowにNodeArrayを追加 ---
  jsdomWindow.NodeArray = NodeArray;
};