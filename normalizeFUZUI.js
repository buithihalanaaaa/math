/*
 * pmmlの木を正規化・木構造文字列を生成
 */

const { applyDomExtensions } = require("./domExtensions");

var normalizePmmlTree = function(argElement) {
  const document = argElement.ownerDocument;
  const window = document.defaultView;
  if (!window || !window.Element) {
    throw new Error("DOMの Element.prototype に拡張できません");
  }
  applyDomExtensions(window);

  var name = argElement.localName;
  var parent = argElement.parentNode;
  var nextSibling = argElement.nextSibling;

  if (name === 'mrow' && argElement.childNodes.length === 0) return argElement;

  var dummy = document.createElementNS('', 'dummy');

  if (name === 'math') {
    var rootMrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
    while (argElement.childNodes.length > 0) rootMrow.appendChild(argElement.firstChild);
    argElement.appendChild(rootMrow);
    dummy.appendChild(argElement);
  } else {
    dummy.appendChild(argElement);
  }

  let current = dummy.firstChild;
  while (current) {
    if (current.nodeType === 1 && typeof current.getNextNodeByDFS === 'function') {
      normalize(current);
      current = current.getNextNodeByDFS();
    } else {
      current = null;
    }
  }
  

  var returnElement;
  if (dummy.childNodes.length > 1) {
    returnElement = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
    while (dummy.childNodes.length > 0) returnElement.appendChild(dummy.firstChild);
  } else {
    returnElement = dummy.firstChild;
  }

  if (parent) parent.insertBefore(returnElement, nextSibling);

  //console.log("\ud83c\udf31 normalizePmmlTree output:", returnElement.outerHTML);
  return returnElement;
};
module.exports = { normalizePmmlTree };

var normalize = function(n) {
  const document = n.ownerDocument;
  if (n.parentNode === null || typeof n.getNextNodeByDFS !== 'function') return;

  switch (n.localName) {
    case "math": {
      let mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
      while (n.childNodes.length > 0) mrow.appendChild(n.firstChild);
      n.appendChild(mrow);
      return;
    }
    case "mi":
    case "mo":
    case "mn":
    case "mtext": {
      if (!n.hasChildNodes() || !n.firstChild || n.firstChild.nodeType !== 3) {
        let next = n.getNextNodeByDFSWithoutChildren();
        n.parentNode.removeChild(n);
        return;
      }
      return normalizeMimnmo(n);
    }
    case "msqrt":
    case "mtd": {
      let mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
      while (n.children.length > 0) mrow.appendChild(n.children[0]);
      n.appendChild(mrow);
      return;
    }
  }
};

var normalizeMimnmo = function(n) {
  const document = n.ownerDocument;
  var childText = n.firstChild.nodeValue;
  var regexString = '(' + String.fromCharCode(0x2062) + '|' + String.fromCharCode(0x2061) + ')';
  childText = childText.replace(new RegExp(regexString, 'g'), '');

  n.removeChild(n.firstChild);
  n.appendChild(document.createTextNode(childText));

  var next = n.getNextNodeByDFSWithoutChildren();

  var attrs = n.attributes;
  for (var i = 0; i < n.firstChild.nodeValue.length; i++) {
    var mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
    for (var j = 0; j < attrs.length; j++) {
      mi.setAttribute(attrs[j].name, attrs[j].value);
    }
    if (n.firstChild.nodeValue.length > 1 && attrs.length === 0) {
      mi.setAttribute('mathvariant', 'normal');
    }
    mi.appendChild(document.createTextNode(n.firstChild.nodeValue.charAt(i)));
    n.parentNode.insertBefore(mi, n);
  }
  n.parentNode.removeChild(n);
  return next;
};
