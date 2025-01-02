
/*
current: caret ('line' (for character) or 'mstyle' (for null rect))
*/
var CaretManager = function(foreignObject, svg)
{
	var self = {};

	self.caret = null; // caret is 'line' or 'mstyle'

	self.highlightedMrow = null;
	


	self.setCaret = function(token)
	{
		//remove current caret
		if(self.caret)
		{
			if($(self.caret).hasClass('blink')) $(self.caret).removeClass('blink');
			else                                self.caret.parentNode.removeChild(self.caret);
		} 
		//
		//
		if($(token).hasClass('integration-node') && $(token.children[0]).hasClass('null-rect'))
		{
			//blink null rect
			$(token.children[0]).addClass('blink');
			self.caret = token.children[0];
		}
		else if($(token).hasClass('style-enclosing-regular-expression'))
		{
			$(token).addClass('blink');
			self.caret = token;
		}
		else
		{
			var animateBlink = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
			animateBlink.setAttribute('attributeName', 'stroke');
			animateBlink.setAttribute('begin', '0s');
			animateBlink.setAttribute('dur', '1s');
			animateBlink.setAttribute('from', 'black');
			animateBlink.setAttribute('to', 'rgba(0,0,0,0)');
			animateBlink.setAttribute('repeatCount', 'indefinite');
			animateBlink.setAttribute('calcMode', 'discrete');
			/*
			set line ('at the left most of integration' and 'at the right of the focused' can be commonly proccessed)
			*/
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('stroke', 'black');
			var lineParam = getCaretParam(token);
			//set caret	
			line.setAttribute('x1', lineParam['x1']);
			line.setAttribute('x2', lineParam['x2']);
			line.setAttribute('y1', lineParam['y1']);
			line.setAttribute('y2', lineParam['y2']);
			line.appendChild(animateBlink);
			svg.appendChild(line);
			self.caret = line;
		}
		//
		self.setHighlight(token);
		//
		return;
	};

	self.setHighlight = function(token)
	{
		var toBeHighlighted;
		if($(token).hasClass('integration-node')) 	toBeHighlighted = token;
		else							toBeHighlighted = token.parentNode;
		//
		if(self.highlightedMrow !== toBeHighlighted)
		{
			//remove highlight
			$(self.highlightedMrow).removeClass('highlight');
			$(toBeHighlighted).addClass('highlight');
			self.highlightedMrow = toBeHighlighted;
		}
		return;
	};

	return self;
};


/*
get caret params
arg: foreignObject (including mml and having x and y)
   : mmlelement (focused, i.e., a left character of caret) or null

leftmost in null integration node and right of focused node are commonly proccessed by this function.

mark mmlelement by attribute
make clone of mml
insert 'mi-a' after markedelement
print clone with "visibility:hidden"
y, w, h are these of inserted 'mi-a'
x is markedelement's x plus markedelement's w
*/
var getCaretParam = function(focused)
{
	//mark mmlelement 
	focused.setAttribute('id', 'focused');
	//
	//create clone
	var svg = $(focused).closest('svg')[0];
	var foreignObject = $(focused).closest('foreignObject')[0];
	var clone = foreignObject.cloneNode(true);
	//get clone's focused node
	var target = $(clone).find('#focused')[0];
	//create and insert mi-a
	var mi_a = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
	mi_a.appendChild(document.createTextNode('a'));
	if($(focused).hasClass('integration-node'))
	{
		target.insertBefore(mi_a, target.children[0]);	
	}
	else
	{
		target.parentNode.insertBefore(mi_a, target.nextSibling);
	}
	//set visibility:hidden
	clone.setAttribute('style', 'visibility: hidden');
	//insert clone (i.e., hidden math expression)
	foreignObject.parentNode.insertBefore(clone, foreignObject);
	//get x
	/*
	use 'focused'. not 'target'. 
	*/
	var x;
	if($(focused).hasClass('integration-node'))
	{
		x = $(focused).offset().left - $(svg).offset().left;
	}
	else
	{
		x = ($(focused).offset().left - $(svg).offset().left) + focused.getBoundingClientRect().width;
	}
	//get y and h
	var y = $(mi_a).offset().top - $(svg).offset().top;
	var h = mi_a.getBoundingClientRect().height;
	//
	//delete clone
	foreignObject.parentNode.removeChild(clone);
	//unmark mmlelement
	focused.removeAttribute('id');
	//
	return {
		x1: x,
		x2: x,
		y1: y,
		y2: y+h
	};
};