function applyDomExtensions(document) {
  const proto = document.defaultView.Element.prototype;

  if (!proto.getNextNodeByDFS) {
    proto.getNextNodeByDFS = function () {
      if (this.firstChild) return this.firstChild;
      let current = this;
      while (current) {
        if (current.nextSibling) return current.nextSibling;
        current = current.parentNode;
      }
      return null;
    };
  }

  if (!proto.getNextNodeByDFSWithoutChildren) {
    proto.getNextNodeByDFSWithoutChildren = function () {
      let current = this;
      while (current) {
        if (current.nextSibling) return current.nextSibling;
        current = current.parentNode;
      }
      return null;
    };
  }

  if (!proto.appendTo) {
    proto.appendTo = function (parent) {
      parent.appendChild(this);
    };
  }

  if (!proto.removeChildOnly) {
    proto.removeChildOnly = function (target) {
      while (target.firstChild) {
        this.insertBefore(target.firstChild, target);
      }
      this.removeChild(target);
    };
  }
}

module.exports = { applyDomExtensions };
