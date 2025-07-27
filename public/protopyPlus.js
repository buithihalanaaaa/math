// prototypeMethods.js の Node.prototype 拡張をユーティリティ関数に変換

function isSimpleContent(node) {
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType !== 3) return false;
    }
    return true;
  } else {
    return true;
  }
}

function appendTo(child, parent) {
  if (child.parentNode === null) {
    parent.appendChild(child);
  } else {
    child.parentNode.replaceChild(parent, child);
    parent.appendChild(child);
  }
}

function insertAfter(parent, newNode, referenceNode) {
  if (referenceNode === null) {
    parent.insertBefore(newNode, parent.firstChild);
  } else {
    parent.insertBefore(newNode, referenceNode.nextSibling);
  }
}

function removeChildOnly(parent, node) {
  if (parent.nodeType === 9) {
    parent.removeChild(node);
    parent.appendChild(node.firstChild);
  } else {
    while (node.hasChildNodes()) {
      parent.insertBefore(node.firstChild, node);
    }
    parent.removeChild(node);
  }
}

function replaceChildOnly(parent, newNode, oldNode) {
  while (oldNode.hasChildNodes()) {
    newNode.appendChild(oldNode.firstChild);
  }
  parent.replaceChild(newNode, oldNode);
}

function indexOf(parent, node) {
  for (let i = 0; i < parent.childNodes.length; i++) {
    if (node === parent.childNodes[i]) return i;
  }
  return null;
}

function getNextNodeByDFS(node) {
  if (node.firstChild) return node.firstChild;
  while (node) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode;
  }
  return null;
}

function getNextNodeByDFSWithoutChildren(node) {
  if (node.parentNode === null) return null;
  const parent = node.parentNode;
  const nextSibling = node.nextSibling;
  parent.removeChild(node);
  const placeholder = document.createElementNS('', 'ph');
  parent.insertBefore(placeholder, nextSibling);
  const next = getNextNodeByDFS(placeholder);
  parent.removeChild(placeholder);
  parent.insertBefore(node, nextSibling);
  return next;
}

function getNextElementNodeByDFS(node) {
  node = getNextNodeByDFS(node);
  while (node && node.nodeType !== 1) {
    node = getNextNodeByDFS(node);
  }
  return node;
}
function applyFunctionOnlyPartialTree(node, callback) {
  const parent = node.parentNode;
  const nextSibling = node.nextSibling;
  if (parent !== null) parent.removeChild(node);
  const returnValue = callback(node);
  if (parent !== null) parent.insertBefore(node, nextSibling);
  return returnValue;
}

function getNextNodeByLocalName(node, localName, getNextNodeByDFS) {
  let n = getNextNodeByDFS(node);
  while (n) {
    if (n.localName === localName) return n;
    n = getNextNodeByDFS(n);
  }
  return null;
}

function getNextNodeAndLocationalInformationByDFS(node, infoRef) {
  let n = node;
  let numOfBacktrack = 0;
  if (n.firstChild) {
    infoRef.value = "child";
    return n.firstChild;
  }
  while (n) {
    if (n.nextSibling) {
      infoRef.value = String(numOfBacktrack);
      return n.nextSibling;
    }
    n = n.parentNode;
    numOfBacktrack++;
  }
  return null;
}

function compareTo(n1, n2) {
  if (n1.nodeType !== n2.nodeType) return 1;
  if (n1.localName !== n2.localName) return 1;
  if (n1.nodeType === 3 && n1.nodeValue !== n2.nodeValue) return 1;
  return 0;
}

function compareTreeTo(n1, n2, getNextNodeAndInfo = getNextNodeAndLocationalInformationByDFS, cmp = compareTo) {
  const qInfo = { value: "" };
  const tInfo = { value: "" };
  let q = n2;
  let t = n1;
  while (true) {
    if (cmp(q, t) === 0 && qInfo.value === tInfo.value) {
      t = getNextNodeAndInfo(t, tInfo);
      q = getNextNodeAndInfo(q, qInfo);
    } else {
      return false;
    }
    if (q === null && t === null) return true;
    if (q === null || t === null) return false;
  }
}

function myMathMLSearch(targetRoot, queryRoot, compareTree = compareTreeTo, getNextNode = () => null) {
  let qBase = queryRoot.firstChild;
  let tBase = targetRoot.firstChild;
  let tMatchedBegin = null;

  let q = qBase;
  let t = tBase;
  while (true) {
    if (compareTree(t, q)) {
      if (tMatchedBegin === null) tMatchedBegin = t;
      t = t.nextSibling;
      q = q.nextSibling;
    } else {
      if (tMatchedBegin === null) {
        t = getNextNode(t);
      } else {
        t = getNextNode(tMatchedBegin);
        tMatchedBegin = null;
      }
      q = qBase;
    }
    if (q === null) return 1;
    if (t === null) return -1;
  }
}
// ✅ Node.prototype.searchForMathML をユーティリティ関数化
function searchForMathML(targetRoot, queryRoot, options = {}) {
  // TODO: 未完成の元コードの意図を保ちつつ、アルゴリズムを構築する必要あり
  throw new Error("searchForMathML: 実装未完了です。compareTreeTo 等のサブルーチンが必要です。");
}

// ✅ Node.prototype.toXMLString をユーティリティ関数化
function toXMLString(node) {
  function walk(n) {
    let XMLString = "";
    let leafFlag = false;

    const attrs = n.attributes;
    const name = n.localName;
    const type = n.nodeType;

    if (type === 1) {
      XMLString += "<" + name;
      if (attrs) {
        for (let i = 0; i < attrs.length; i++) {
          XMLString += ` ${attrs[i].localName}="${attrs[i].nodeValue}"`;
        }
      }
      XMLString += ">";
    } else if (type === 3) {
      XMLString += n.nodeValue
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&/g, "&amp;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    let child = n.firstChild;
    if (child === null) leafFlag = true;
    while (child) {
      XMLString += walk(child);
      child = child.nextSibling;
    }

    if (type === 1) {
      if (leafFlag) {
        XMLString = XMLString.slice(0, -1) + "/>";
      } else {
        XMLString += `</${name}>`;
      }
    }

    return XMLString;
  }

  return walk(node);
}

// ✅ NodeArray の代替: Array<Node> + ユーティリティ関数で処理
function applyFunctionOnlyPartialTreeToArray(nodes, callback) {
  const parents = nodes.map(n => n.parentNode);
  const nextSiblings = nodes.map(n => n.nextSibling);

  // detach
  nodes.forEach((n, i) => {
    if (parents[i]) parents[i].removeChild(n);
  });

  const returnValue = callback(nodes);

  // re-attach
  nodes.forEach((n, i) => {
    if (parents[i] && n.parentNode === null) {
      parents[i].insertBefore(n, nextSiblings[i]);
    }
  });

  return returnValue;
}
// ✅ Stringユーティリティ関数として書き換え
function longLengthFirstKeywordSearch(text, keywords) {
  const result = [];

  function recursiveProcess(searched, base) {
    for (let i = searched.length; i > 0; i--) {
      for (let j = 0; j + i - 1 < searched.length; j++) {
        if (keywords.some(element => element === searched.substr(j, i))) {
          recursiveProcess(searched.substring(0, j), 0);
          result.push([base + j, base + j + i]);
          recursiveProcess(searched.substr(j + i), j + i);
          return;
        }
      }
    }
  }

  recursiveProcess(text, 0);
  return result;
}

// ✅ XML文字列をjQueryでパースする関数（jQuery依存）
function toXMLDocumentFromString(xmlString) {
  const jQueryPackedXML = $.xmlDOM(xmlString);
  return jQueryPackedXML[0];
}

// ✅ フォーマッタ関数
function spaces(len) {
  return ' '.repeat(len * 4);
}

function formatXML(str) {
  let xml = '';
  str = str.replace(/(>)(<)(\/*)/g, '$1\r$2$3');
  let pad = 0;

  const strArr = str.split('\r');
  for (let i = 0; i < strArr.length; i++) {
    let indent = 0;
    const node = strArr[i];

    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad > 0) pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    }

    xml += spaces(pad) + node + '\r';
    pad += indent;
  }

  return xml;
}

// ✅ 同期的にXMLファイルを読み込む関数（非推奨方式）
function loadXMLDoc(dname) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", dname, false);
  xhttp.send();
  return xhttp.responseXML;
}

// ✅ エラーメッセージ表示
const Debug = {
  printErrorMessageOnHTMLDiv(messageString) {
    const error = document.querySelector("#error");
    if (error) {
      error.appendChild(document.createTextNode(messageString));
      error.appendChild(document.createElement("br"));
    }
  },
};

// ✅ HTML出力ユーティリティ
const HTMLPrint = {
  text(divId, textString) {
    const div = document.getElementById(divId);
    if (div) div.appendChild(document.createTextNode(textString));
  },
  MathML(divId, mathElement) {
    const div = document.getElementById(divId);
    if (div) div.appendChild(mathElement);
  },
  br(divId) {
    const div = document.getElementById(divId);
    if (div) div.appendChild(document.createElement("br"));
  },
};
