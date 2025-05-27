function getNextNodeByDFS(node) {
  if (node.firstChild) return node.firstChild;
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
}

function getNextNodeByDFSWithoutChildren(node) {
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
}

function normalizePmmlTree(argElement, document) {
  const name = argElement.localName;
  const parent = argElement.parentNode;
  const nextSibling = argElement.nextSibling;

  if (name === 'mrow' && argElement.childNodes.length === 0) return argElement;

  const dummy = document.createElementNS('', 'dummy');

  if (name === 'math') {
    const rootMrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
    while (argElement.firstChild) {
      rootMrow.appendChild(argElement.firstChild);
    }
    argElement.appendChild(rootMrow);
    dummy.appendChild(argElement);
  } else {
    dummy.appendChild(argElement);
  }

  let n = dummy;
  while (n) n = normalize(n, document);

  let returnElement;
  if (dummy.childNodes.length > 1) {
    returnElement = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
    while (dummy.firstChild) {
      returnElement.appendChild(dummy.firstChild);
    }
  } else {
    returnElement = dummy.firstChild;
  }

  if (parent) {
    parent.insertBefore(returnElement, nextSibling);
  }

  return returnElement;
}

function normalize(n, document) {
  if (n.parentNode === null) return getNextNodeByDFS(n);

  if (n.localName === "mi" || n.localName === "mo" || n.localName === "mn" || n.localName === "mtext") {
    if (!n.hasChildNodes()) {
      const next = getNextNodeByDFSWithoutChildren(n);
      n.parentNode.removeChild(n);
      return next;
    }
    return normalizeMimnmo(n, document);
  }

  if (n.localName === "mrow") return normalizeMrow(n, document);
  if (n.localName === "mfenced") return normalizeMfenced(n, document);

  if (!n.localName) {
    const next = getNextNodeByDFSWithoutChildren(n);
    n.parentNode.removeChild(n);
    return next;
  }

  return getNextNodeByDFS(n);
}

function normalizeMimnmo(n, document) {
  const text = n.textContent.replace(/[\u2061\u2062]/g, '');
  n.textContent = ''; // clear original
  const next = getNextNodeByDFSWithoutChildren(n);
  const attrs = Array.from(n.attributes);

  for (let i = 0; i < text.length; i++) {
    const mi = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
    attrs.forEach(attr => mi.setAttribute(attr.name, attr.value));
    if (text.length > 1 && attrs.length === 0) {
      mi.setAttribute('mathvariant', 'normal');
    }
    mi.appendChild(document.createTextNode(text.charAt(i)));
    n.parentNode.insertBefore(mi, n);
  }
  n.parentNode.removeChild(n);
  return next;
}

function normalizeMrow(n, document) {
  const keep = ['mfrac', 'msqrt', 'mroot', 'msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover', 'mstyle', 'mtd', 'math'];
  if (keep.includes(n.parentNode?.localName)) {
    return getNextNodeByDFS(n);
  } else {
    const next = getNextNodeByDFS(n);
    if (n.parentNode?.removeChild) {
      n.parentNode.removeChild(n);
    }
    return next;
  }
}

function normalizeMfenced(n, document) {
  const parent = n.parentNode;
  if (!parent) throw new Error("mfenced has no parent");

  const moOpen = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo');
  moOpen.appendChild(document.createTextNode(n.getAttribute('open') || '('));

  const moClose = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo');
  moClose.appendChild(document.createTextNode(n.getAttribute('close') || ')'));

  parent.insertBefore(moOpen, n);
  parent.insertBefore(moClose, n.nextSibling);

  while (n.firstChild) {
    parent.insertBefore(n.firstChild, moClose);
  }
  parent.removeChild(n);
  return moOpen;
}

module.exports = {
  normalizePmmlTree
};
