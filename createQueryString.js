var createQueryStringaa = function(queryMml)
{
    var backreferenceCounter = 0;
    var backreferenceNumberDict = {};

    var processSingleElement = function(e)
    {
        try
        {
            if(e.classList && e.classList.contains('integration-node'))
            {
                var content = '';
                for(var i=0; i<e.children.length; i++)
                {
                    content += processSingleElement(e.children[i]);
                }
                return content;
            }
            else if(e.classList && e.classList.contains('structure-node'))
            {
                var args = '';
                var i;
                if(e.localName.match(/msub|msup|msubsup/)) i=1;
                else									   i=0;
                for(; i<e.children.length; i++)
                {
                    args += '{' + processSingleElement(e.children[i]) + '}';
                }
                return '\\' + e.localName.substring(1) + args;
            }
            else if(e.classList && e.classList.contains('character-node') && !(e.classList.contains('wildcard')))
            {
                return escape(e.firstChild.nodeValue);
            }
            else if(e.classList && e.classList.contains('regular-expression'))
            {
                if(e.classList.contains('wildcard'))
                {
                    return '.';
                }
                else if(e.classList.contains('matrix-wildcard'))
                {
                    return '.+';
                }
                else if(e.classList.contains('character-class'))
                {
                    return '[' + processSingleElement(e.getElementsByClassName('integration-node')[0]) + ']';
                }
                else if(e.classList.contains('negated-character-class'))
                {
                    return '[^' + processSingleElement(e.getElementsByClassName('integration-node')[0]) + ']';
                }
                else if(e.classList.contains('backreference'))
                {
                    var number = processSingleElement(e.getElementsByClassName('integration-node')[0]);
                    return '\\' + backreferenceNumberDict[number];	
                }
                else if(e.classList.contains('enclosing-regular-expression'))
                {
                    backreferenceCounter++;
                    if(e.classList.contains('capturing'))
                    {
                        var backreferenceNumber = e.getElementsByClassName('mi-capturing-number')[0].firstChild.nodeValue;
                        backreferenceNumberDict[backreferenceNumber] = backreferenceCounter;
                    }
                    var content = '';
                    if(e.classList.contains('boolean-or'))
                    {
                        var style = e.getElementsByClassName('style-boolean-or')[0];
                        for(var i=0; i<style.children.length; i++)
                        {
                            content += processSingleElement(style.children[i].getElementsByClassName('integration-node')[0]) + '|';
                        }
                        content = content.substring(0, content.length-1);
                    }
                    else
                    {
                        content = processSingleElement(e.getElementsByClassName('integration-node')[0]);
                    }
                    var regexpString = '(' + content + ')';
                    if(e.classList.contains('more') && e.classList.contains('zero-or-one'))
                    {
                        regexpString += '*';
                    }
                    else if(e.classList.contains('more'))
                    {
                        regexpString += '+';
                    }
                    else if(e.classList.contains('zero-or-one'))
                    {
                        regexpString += '?';
                    }
                    return regexpString;
                }
                else
                {
                    var test = e;
                    throw new Error('node...'+e.toString());
                }
            }
            else
            {
                if(e.children.length === 0) return '';
                var result = '';
                for (var i = 0; i < e.children.length; i++) {
                    result += processSingleElement(e.children[i]);
                }
                return result;
            }

        }catch(e){
            console.error('Error processing element:', e);
            return '';
        }

    }

    return processSingleElement(queryMml);
};

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
module.exports = { createQueryStringaa };

