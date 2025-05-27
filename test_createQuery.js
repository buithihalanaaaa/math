const cheerio = require('cheerio');
function unwrapDeep(node, process) {
  if (!node) return '';
  console.log("🔎 unwrapDeep visiting:", node.name, "text=", node.children?.map(c => c.data || c.name || '').join(' '));

  if (node.name === 'mrow') {
    return (node.children || []).map(child => unwrapDeep(child, process)).join('');
  }

  return process(node);
}




var createQueryString = function (queryMml) {
  const $ = cheerio.load(queryMml, { xmlMode: true });
  const root = $('math')[0];

  var backreferenceCounter = 0;
  var backreferenceNumberDict = {};

  var processSingleElement = function (e) {
    try {
      if (!e) return '';
      if (typeof e === 'object' && e.type === 'tag' && e.name && e.children === undefined) {
        e = e[0] || e;
      }

      console.log("🔎 visiting:", e.name, "class=", $(e).attr("class"));

      if (
        (!e.children || e.children.length === 0) &&
        (!e.firstChild || !e.firstChild.nodeValue?.trim())
      ) return '';

      // mrow flatten
      if (e.name === 'mrow') {
        return e.children.map(processSingleElement).join('');
      }

      if ($(e).attr('class')?.includes('integration-node')) {
        return e.children.map(processSingleElement).join('');
      }

      if ($(e).attr('class')?.includes('structure-node')) {
        const tag = e.name ? e.name.substring(1) : '';

        if (tag === 'sup' || tag === 'sub') {
          const base = unwrapDeep(e.children[0], processSingleElement);
          const exp  = unwrapDeep(e.children[1], processSingleElement);
          console.log("⚙️ sup/sub: base =", base, "exp =", exp);
          return base + '\\' + tag + '{' + exp + '}';
        }

        if (tag === 'subsup') {
          const base = unwrapDeep(e.children[0], processSingleElement);
          const sub  = unwrapDeep(e.children[1], processSingleElement);
          const sup  = unwrapDeep(e.children[2], processSingleElement);
          return base + '\\sub{' + sub + '}\\sup{' + sup + '}';
        }
    if (tag === 'frac') {
  const numerator = unwrapDeep(e.children[0], processSingleElement);
  const denominator = unwrapDeep(e.children[1], processSingleElement);
  return '\\frac{' + numerator + '}{' + denominator + '}';
}

        let args = '';
        for (let i = 0; i < e.children.length; i++) {
          args += '{' + processSingleElement(e.children[i]) + '}';
        }
        return '\\' + tag + args;
      }

      if (
        $(e).attr('class')?.includes('character-node') &&
        !$(e).attr('class')?.includes('wildcard')
      ) {
        const text = e.firstChild?.nodeValue || $(e).text() || '';
        console.log("🧪 character-node:", text);
        return escape(text.trim());
      }

      if ($(e).attr('class')?.includes('regular-expression')) {
        if ($(e).attr('class')?.includes('wildcard')) return '.';
        if ($(e).attr('class')?.includes('matrix-wildcard')) return '.+';
        if ($(e).attr('class')?.includes('character-class')) {
          return '[' + processSingleElement($(e).find('.integration-node').get(0)) + ']';
        }
        if ($(e).attr('class')?.includes('negated-character-class')) {
          return '[^' + processSingleElement($(e).find('.integration-node').get(0)) + ']';
        }
        if ($(e).attr('class')?.includes('backreference')) {
          var number = processSingleElement($(e).find('.integration-node').get(0));
          return '\\' + backreferenceNumberDict[number];
        }
        if ($(e).attr('class')?.includes('enclosing-regular-expression')) {
          backreferenceCounter++;
          if ($(e).attr('class')?.includes('capturing')) {
            var backreferenceNumber = $(e).find('.mi-capturing-number')[0].firstChild.nodeValue;
            backreferenceNumberDict[backreferenceNumber] = backreferenceCounter;
          }
          var content = '';
          if ($(e).attr('class')?.includes('boolean-or')) {
            var style = $(e).find('.style-boolean-or')[0];
            for (var i = 0; i < style.children.length; i++) {
              content += processSingleElement($(style.children[i]).find('.integration-node').get(0)) + '|';
            }
            content = content.substring(0, content.length - 1);
          } else if ($(e).hasClass('custom-regex-pattern')) {
            content = $(e).data('regex-pattern');
          } else {
            content = processSingleElement($(e).find('.integration-node').get(0));
          }
          var regexpString = '(' + content + ')';
          if ($(e).hasClass('more') && $(e).hasClass('zero-or-one')) regexpString += '*';
          else if ($(e).hasClass('more')) regexpString += '+';
          else if ($(e).hasClass('zero-or-one')) regexpString += '?';
          return regexpString;
        }
        if ($(e).hasClass('custom-regex-s')) return '\\s*';
        if ($(e).hasClass('custom-regex-d')) return '\\d';
        throw new Error('node...' + e.toString());
      }

      if (!e.children || e.children.length === 0) {
        const val = e.firstChild?.nodeValue?.trim();
        if (val) {
          console.log("🧪 fallback character-node:", val);
          return escape(val);
        }
        return '';
      }

      return e.children.map(processSingleElement).join('');

    } catch (e) {
      console.error("Invalid query:", e);
      throw e;
    }
  };

  return processSingleElement(root);
};

var escape = function (c) {
  const escapeChar = ['.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '^', '&', ';', '\\'];
  return escapeChar.includes(c) ? '\\' + c : c;
};

module.exports = { createQueryString };
