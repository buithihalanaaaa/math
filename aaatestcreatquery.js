var createQueryString = function(queryMml)
{
	var backreferenceCounter = 0;
	var backreferenceNumberDict = {};

	var processSingleElement = function(e)
	{
		try
		{
			if($(e).hasClass('integration-node'))
			{
				var content = '';
				for(var i=0; i<e.children.length; i++)
				{
					content += processSingleElement(e.children[i]);
				}
				//
				return content;
			}
			else if($(e).hasClass('structure-node'))
			{
				var args = '';
				var i;
				if(e.localName.match(/msub|msup|msubsup/)) i=1;
				else									   i=0;
				for(; i<e.children.length; i++)
				{
					args += '{' + processSingleElement(e.children[i]) + '}';
				}
				//
				return '\\' + e.localName.substring(1) + args;
			}
			else if($(e).hasClass('character-node') && ! $(e).hasClass('wildcard') )
			{
				return escape(e.firstChild.nodeValue);
			}
			else if($(e).hasClass('regular-expression'))
			{
				if($(e).hasClass('wildcard'))
				{
					return '.';
				}
				else if($(e).hasClass('matrix-wildcard'))
				{
					return '.+';
				}
				else if($(e).hasClass('character-class'))
				{
					return '[' + processSingleElement($(e).find('.integration-node')[0]) + ']';
				}
				else if($(e).hasClass('negated-character-class'))
				{
					return '[^' + processSingleElement($(e).find('.integration-node')[0]) + ']';
				}
				else if($(e).hasClass('backreference'))
				{
					var number = processSingleElement($(e).find('.integration-node')[0]);
					return '\\' + backreferenceNumberDict[number];	
				}
				else if($(e).hasClass('enclosing-regular-expression'))
				{
					backreferenceCounter++;
					if($(e).hasClass('capturing'))
						{
						var backreferenceNumber = $(e).find('.mi-capturing-number')[0].firstChild.nodeValue;
						backreferenceNumberDict[backreferenceNumber] = backreferenceCounter;
					}
					//
					var content = '';
					if($(e).hasClass('boolean-or'))
					{
						var style = $(e).find('.style-boolean-or')[0];
						for(var i=0; i<style.children.length; i++)
						{
							content += processSingleElement($(style.children[i]).find('.integration-node')[0]) + '|';
						}
						content = content.substring(0, content.length-1);
					}
					else
					{
						content = processSingleElement($(e).find('.integration-node')[0]);
					}
					//
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
					//
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
				if(e.children.length > 1) throw new Error('ignored element has multiple children');
				return processSingleElement(e.children[0]);
			}

		}catch(e){
			alert("invailed query");
		}

	}

	return processSingleElement(queryMml);
};



//following functions for escaping should be integrated as a class.
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
