const cheerio = require('cheerio');

var createQueryString = function(queryMml)
{
    const $ = cheerio.load(queryMml, { xmlMode: true });
    const root = $('math')[0]; // ルート要素取得

    var backreferenceCounter = 0;
    var backreferenceNumberDict = {};

    var processSingleElement = function(e)
    {
        try
        {
			if (e.name === 'mrow' && e.children.length === 0) {
  return '';
}

			if (!e || e.type === 'text' && !e.data.trim()) {
  return '';
}  
            if($(e).attr('class')?.includes('integration-node'))
            {
                var content = '';
                for(var i=0; i<e.children.length; i++)
                {
                    content += processSingleElement(e.children[i]);
                }
                return content;
            }
            else if($(e).attr('class')?.includes('structure-node'))
            {
               var args = '';
    var i;
    if(e.name && e.name.match(/msub|msup|msubsup/)) {
        // 空mrowを飛ばす
        i = 0;
        while (e.children[i] && e.children[i].name === 'mrow' && e.children[i].children.length === 0) {
            i++;
        }
    } else {
        i = 0;
    }

    for(; i<e.children.length; i++)
    {
        const childStr = processSingleElement(e.children[i]);
        if (childStr !== '') {
            args += '{' + childStr + '}';
        }
    }

    return '\\' + (e.name ? e.name.substring(1) : '') + args;
            }




            else if($(e).attr('class')?.includes('character-node') && ! $(e).attr('class')?.includes('wildcard') )
            {
                const node = $(e).get(0);
                const text = node && node.firstChild ? node.firstChild.nodeValue : '';
                return escape(text);
            }
            else if($(e).attr('class')?.includes('regular-expression'))
            {
                if($(e).attr('class')?.includes('wildcard'))
                {
                    return '.';
                }
                else if($(e).attr('class')?.includes('matrix-wildcard'))
                {
                    return '.+';
                }
                else if($(e).attr('class')?.includes('character-class'))
                {
                    return '[' + processSingleElement($(e).find('.integration-node')[0]) + ']';
                }
                else if($(e).attr('class')?.includes('negated-character-class'))
                {
                    return '[^' + processSingleElement($(e).find('.integration-node')[0]) + ']';
                }
                else if($(e).attr('class')?.includes('backreference'))
                {
                    var number = processSingleElement($(e).find('.integration-node')[0]);
                    return '\\' + backreferenceNumberDict[number];	
                }
                else if($(e).attr('class')?.includes('enclosing-regular-expression'))
                {
                    backreferenceCounter++;
                    if($(e).attr('class')?.includes('capturing'))
                    {
                        var backreferenceNumber = $(e).find('.mi-capturing-number')[0].firstChild.nodeValue;
                        backreferenceNumberDict[backreferenceNumber] = backreferenceCounter;
                    }
                    var content = '';
                    if($(e).attr('class')?.includes('boolean-or'))
                    {
                        var style = $(e).find('.style-boolean-or')[0];
                        for(var i=0; i<style.children.length; i++)
                        {
                            content += processSingleElement($(style.children[i]).find('.integration-node')[0]) + '|';
                        }
                        content = content.substring(0, content.length-1);
                    }
                    else if($(e).hasClass('custom-regex-pattern')){
                        content = $(e).data('regex-pattern'); 
                    }
                    else
                    {
                        content = processSingleElement($(e).find('.integration-node')[0]);
                    }
                    var regexpString = '(' + content + ')';
                    if($(e).hasClass('more') && $(e).hasClass('zero-or-one'))
                    {
                        regexpString += '*';
                    }
                    else if($(e).hasClass('more'))
                    {
                        regexpString += '+';
                    }
                    else if($(e).hasClass('zero-or-one'))
                    {
                        regexpString += '?';
                    }
                    return regexpString;
                }
                else if($(e).hasClass('custom-regex-s'))
                {
                    return '\\s*';
                }
                else if($(e).hasClass('custom-regex-d'))
                {
                    return '\\d';
                }
                else
                {
                    throw new Error('node...' + e.toString());
                }
            }
            else
            {  if (!e.attribs || !e.attribs.class) {
        // タグ名で判定
        if (e.name === 'mfrac') {
            // 分数
            return '\\frac{' + processSingleElement(e.children[0]) + '}{' + processSingleElement(e.children[1]) + '}';
        }
        if (e.name === 'msup') {
            // 上付き
            return processSingleElement(e.children[0]) + '\\sup{' + processSingleElement(e.children[1]) + '}';
        }
        if (e.name === 'mi' || e.name === 'mn') {
            // 変数や数字
            return escape(e.children && e.children[0] ? e.children[0].data : '');
        }
        if (e.name === 'mo') {
            // 演算子
            return escape(e.children && e.children[0] ? e.children[0].data : '');
        }
        // 他のタグも必要に応じて追加
    }
                // childrenが存在しない場合は、そのまま値を返す
                if (!e.children || e.children.length === 0) {
                    return e.data || '';
                }
                // 複数子要素がある場合もすべて処理して連結
                if (e.children.length > 1) {
                    let content = '';
                    for (let i = 0; i < e.children.length; i++) {
                        content += processSingleElement(e.children[i]);
                    }
                    return content;
                }
                return processSingleElement(e.children[0]);
            }
        }catch(e){
            console.error("Invalid query:", e);
            throw e;
        }
    }

    return processSingleElement(root);
};

// エスケープ関数
var escape = function(c)
{
    var escapeChar = [
        '.', '*', '+', '?', '|', 
        '(', ')', '[', ']', '{', '}', 
        '^', '&', ';', '\\',
    ];
    for(var i=0; i<escapeChar.length; i++)
    {
        if(c === escapeChar[i]) return '\\' + c;
    }
    return c;
};

module.exports = { createQueryString };

