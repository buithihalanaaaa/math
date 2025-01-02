var TokenManager = function(token, svg)
{
	var self = {};

	self.token = token;


	self.setToken = function(newToken)
	{
		self.token = newToken;
		return;
	};

	self.moveToNextToken = function()
	{
		var n = self.token;
		if($(n).hasClass('selected'))
		{
			var integration = n.children[0]
			self.token = integration.children[integration.children.length - 1];
			$(removeMrowAsSelected(n));
		}
		else if($(n).hasClass('style-enclosing-regular-expression')) 
		{
			self.token = $(n).find('.integration-node')[0];
		}
		else
		{
			var nextToken;
			if($(n).hasClass('integration-node')) nextToken = n.children[0];
			else                                  nextToken = n.nextSibling;
			//
			if($(nextToken).hasClass('character-node'))
			{
				self.token = nextToken;
			}
			else if($(nextToken).hasClass('structure-node')) //nextToken is structure
			{
				if(nextToken.localName.search(/^(msub|msup|msubsup)$/) !== -1)
				{
					self.token = nextToken.children[1];
				}
				else if(nextToken.localName.search(/^(mtable)$/) !== -1)
				{
					self.token = nextToken.children[0].children[0].children[0];
				}
				else if(nextToken.localName.search(/^(mtr)$/) !== -1)
				{
					self.token = nextToken.children[0].children[0];
				}
				else if(nextToken.localName.search(/^(mtd)$/) !== -1)
				{
					self.token = nextToken.children[0];
				}
				else
				{
					self.token = nextToken.children[0];
				}
			}
			else if($(nextToken).hasClass('enclosing-regular-expression'))
			{
				self.token = $(nextToken).find('.style-enclosing-regular-expression')[0];
			}
			else if($(nextToken).hasClass('null-rect'))// null mrow
			{
				if(nextToken.parentNode.parentNode.localName !== 'math')
				{
					self.token = nextToken;
					self.moveToNextToken(); // call recursively for passing null-rect
				}
			}
			else if(nextToken === null)
			{
				if(n.parentNode.nextSibling) // last token in last integration in structure
				{
					self.token = n.parentNode.nextSibling;
				}
				else
				{
					if(checkChildOfRegularExpression(n.parentNode))
					{
						if($(n).closest('.style-enclosing-regular-expression-content')[0].nextSibling) // boolean-or's not-tail alternative's tail
						{
							self.token = $( $(n).closest('.style-enclosing-regular-expression-content')[0].nextSibling ).find('.integration-node')[0];
						}
						else
						{
							self.token = $(n.parentNode).closest('.enclosing-regular-expression')[0];
						}
					}
					else
					{
						if(n.parentNode.parentNode.localName == "mtd"){
							if(n.parentNode.parentNode.nextSibling == null)
							{
								if(n.parentNode.parentNode.parentNode.nextSibling ==null)
								{
									self.token = n.parentNode.parentNode.parentNode.parentNode;
								}
								else
								{
									self.token = n.parentNode.parentNode.parentNode.nextSibling.children[0].children[0];
								}
							}
							else
							{
								self.token = n.parentNode.parentNode.nextSibling.children[0];
							}
						}
						else
						{
							self.token = n.parentNode.parentNode;//structure
						}
					}
				}
			}
			else throw new Error('moveToNextToken');
		}
		//
		if(self.token.localName === 'math') self.token = n;
		return;
	};

	self.moveToPreviousToken = function()
	{
		var n = self.token;

		if($(n).hasClass('selected'))
		{
			if(n.previousSibling)
			{
				self.token = n.previousSibling;
				removeMrowAsSelected(n);
			}
			else
			{
				self.token = removeMrowAsSelected(n); // i.e. mrow
			}                  
		}
		/*
		move to previous Token
		*/
		else if($(n).hasClass('character-node') ||
				($(n).hasClass('integration-node') && (! $(n.previousSibling).hasClass('integration-node') && ! ($(n).closest('.style-enclosing-regular-expression-content')[0] && $(n).closest('.style-enclosing-regular-expression-content')[0].previousSibling) ) ))
		{
			var focusedToken;
			if($(n).hasClass('character-node'))       focusedToken = n;
			else if(checkChildOfRegularExpression(n)) focusedToken = $(n).closest('.enclosing-regular-expression')[0];
			else                                      focusedToken = n.parentNode;
			//
			if(focusedToken.localName === 'math') self.token = n;
			else if(focusedToken.previousSibling){
				if(focusedToken.previousSibling.localName === 'mtd' && $(focusedToken.previousSibling.children[0].children[0]).hasClass('null-rect')) self.token = focusedToken.previousSibling.children[0];
				else if(focusedToken.previousSibling.localName === 'mtd') self.token = focusedToken.previousSibling.children[0].children[focusedToken.previousSibling.children[0].children.length-1];
				else self.token = focusedToken.previousSibling;
			}
			else if(focusedToken.parentNode.localName === 'mtr')
			{
				if(focusedToken.parentNode.previousSibling && $(focusedToken.parentNode.previousSibling.children[focusedToken.parentNode.previousSibling.children.length-1].children[0].children[0]).hasClass('null-rect')) self.token = focusedToken.parentNode.previousSibling.children[focusedToken.parentNode.previousSibling.children.length-1].children[0];
				else if(focusedToken.parentNode.previousSibling) self.token = focusedToken.parentNode.previousSibling.children[focusedToken.parentNode.previousSibling.children.length-1].children[0].children[focusedToken.parentNode.previousSibling.children[focusedToken.parentNode.previousSibling.children.length-1].children[0].children.length-1];
				else if(focusedToken.parentNode.parentNode.previousSibling) self.token = focusedToken.parentNode.parentNode.previousSibling;
				else self.token = focusedToken.parentNode.parentNode.parentNode;
			}
			else self.token = focusedToken.parentNode;
		}
		/*
		move to previous integration
		*/
		else if($(n).hasClass('structure-node') || 
				$(n).hasClass('style-enclosing-regular-expression') || 
				($(n).hasClass('integration-node') && ($(n.previousSibling).hasClass('integration-node') || $(n).closest('.style-enclosing-regular-expression-content')[0].previousSibling) ))
		{
			var previousIntegration;
			if($(n).hasClass('structure-node')) previousIntegration = n.children[n.children.length-1];
			else if($(n.previousSibling).hasClass('integration-node')) previousIntegration = n.previousSibling;
			else if($(n).hasClass('style-enclosing-regular-expression')) previousIntegration = $(n).find('.integration-node')[$(n).find('.integration-node').length-1];
			else if($(n).closest('.style-enclosing-regular-expression-content')[0].previousSibling) previousIntegration = $( $(n).closest('.style-enclosing-regular-expression-content')[0].previousSibling ).find('.integration-node')[0];
			else                                previousIntegration = n.previousSibling;
			//
			if($(previousIntegration.children[0]).hasClass('null-rect')) self.token = previousIntegration;
			else if(previousIntegration.localName === 'mtr'){
				if ($(previousIntegration.children[previousIntegration.children.length - 1].children[0].children[0]).hasClass('null-rect')) self.token = previousIntegration.children[previousIntegration.children.length - 1].children[0];
				else self.token = previousIntegration.children[previousIntegration.children.length - 1].children[0].children[previousIntegration.children[previousIntegration.children.length - 1].children[0].children.length-1];
			}
			else self.token = previousIntegration.children[previousIntegration.children.length - 1];
		}
		/*
		*/
		else if($(n).hasClass('enclosing-regular-expression'))
		{
			self.token = $(n).find('.style-enclosing-regular-expression')[0];
		}
		//
		if(self.token.localName === 'math') self.token = n;
		return;
	};


	self.insertToken = function(newToken)
	{
		var focused = self.token;	
		//
		// insertion (or replacing)
		if($(focused).hasClass('selected')) // replace
		{
			focused.parentNode.replaceChild(newToken, focused);
		}
		else if($(focused).hasClass('integration-node'))
		{
			// for nullMrow
			if($(focused.children[0]).hasClass('null-rect'))
			{
				focused.removeChild(focused.children[0]);//remove null rect
			}
			//
			focused.insertBefore(newToken, focused.children[0]);
		}
		else if($(focused).hasClass('style-enclosing-regular-expression'))//スコープを持つ正規表現
		{
			var integration = $(focused).find('.integration-node')[0];
			if($(integration.children[0]).hasClass('null-rect'))
			{
				integration.removeChild(integration.children[0]);//null rectを削除
			}
			integration.appendChild(newToken);//末尾に追加
		}
		else
		{
			focused.parentNode.insertBefore(newToken, focused.nextSibling);
		}
		//
		// reset self.token
		if($(newToken).hasClass('character-node') || $(newToken).hasClass('character-class') || $(newToken).hasClass('negated-character-class'))
		{
			self.token = newToken;
		}
		else if(newToken.localName.search(/^(msub|msup|msubsup)$/) !== -1)
		{
			self.token = newToken.children[1];
		}
		else if(newToken.localName.search(/^(mtable)$/) !== -1)
		{
			self.token = newToken.children[0].children[0].children[0];
		}
		else
		{
			self.token = newToken.children[0];
		}
		//
		return;
	};

	self.deleteToken = function()
	{
		var token = self.token;
		//
		if(token.parentNode.localName === 'math') return;
		//
		if($(token).hasClass('style-enclosing-regular-expression'))
		{
			if($(token).hasClass('style-capturing'))
			{
				var number = parseInt($(token).find('.mi-capturing-number')[0].firstChild.nodeValue);
				backreferenceNumberManager.free(number);
			}
			//
			var enclosingRect    = $(token).closest('.enclosing-regular-expression')[0];
			var parent           = enclosingRect.parentNode;
			var nextSibling      = enclosingRect.nextSibling;
			var firstIntegration = $(token).find('.integration-node')[0];
			var last             = firstIntegration.children[firstIntegration.children.length-1];
			//
			if(!$(firstIntegration.children[0]).hasClass('null-rect'))
			{
				parent.appendChild(firstIntegration);
				parent.removeChild(enclosingRect);
				//
				while(firstIntegration.children.length > 0)
				{
					parent.insertBefore(firstIntegration.children[0], nextSibling);
				}
				parent.removeChild(firstIntegration);
				//
				self.token = last;
			}
			else
			{
				self.token = firstIntegration;
				self.moveToPreviousToken();
				parent.removeChild(enclosingRect);				
			}
		}
		else if($(token).hasClass('character-node') || $(token).hasClass('selected') ) // mi or selected group
		{
			var parentMrow = token.parentNode;
			var previousSibling = token.previousSibling;
			parentMrow.removeChild(token);
			if(previousSibling)
			{
				self.token = previousSibling;
			}
			else 
			{
				if(parentMrow.children.length === 0)
				{
					setNullRect(parentMrow);
				}
				self.token = parentMrow;	
			}
		}
		else  // unselected structure
		{		
			if(checkChildOfRegularExpression(token)) // 正規表現矩形の子の空のmrow
			{
				token = $(token).closest('.enclosing-regular-expression')[0];
			}
			else if($(token).hasClass('integration-node'))
			{
				token = token.parentNode;//structure	
			}
			var parent = token.parentNode;
			var parentForMtable = token.parentNode.parentNode.parentNode;
			var nextSibling = token.nextSibling;
			var nextSiblingForMtable = token.parentNode.parentNode.nextSibling;
			var selected;
			if(token.localName.search(/^(mtd)$/) !== -1) selected = insertMrowAsSelected([token.parentNode.parentNode]);
			else selected = insertMrowAsSelected([token]);
			if(token.localName.search(/^(mtd)$/) !== -1) parentForMtable.insertBefore(selected, nextSiblingForMtable);
			else parent.insertBefore(selected, nextSibling);
			self.token = selected;
		}
		return;
	};

	var checkChildOfRegularExpression = function(n)
	{
		if(!$(n).hasClass('integration-node')) return false;
		if(!$(n).closest('.style-enclosing-regular-expression-content')[0]) return false;
		if($(n.parentNode.parentNode).hasClass('style-enclosing-regular-expression-content')) return true;
		if($(n.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode).hasClass('style-enclosing-regular-expression')) return true;
	};


	var svgOffset = $(svg).offset();

	var tokenBoxes = [];
	self.setMathMLIncludedSvg = function(svg)
	{
		tokenBoxes = [];
		//
		var getSingleTokenBox = function(n)
		{
			if($(n).hasClass('character-node') || $(n).hasClass('structure-node') || $(n).hasClass('regular-expression'))
			{
				var clientRect = n.getBoundingClientRect();
				var offset = $(n).offset();
				tokenBoxes.push({
					token  : n,
					left   : offset.left - svgOffset.left,
					top    : offset.top - svgOffset.top,
					width  : clientRect.width,
					height : clientRect.height,
				});
			}
			for(var i=0; i<n.children.length; i++)
			{
				getSingleTokenBox(n.children[i]);
			}
			return;
		};
		//
		getSingleTokenBox($(svg).find('math')[0]);
		//
		return;
	};

	var checkRectangleInclusion = function(includer, includee)
	{
		if(includer.left <= includee.left &&
			includer.top  <= includee.top  &&
			includer.left + includer.width  >= includee.left + includee.width &&
			includer.top  + includer.height >= includee.top  + includee.height)
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	self.setRectangleSelectedTokens = function(svg, rectBox)
	{
		var selectedTokens = []; // initialization
		removeMrowAsSelected($('.selected')[0]);
		//
		for(var i=0; i<tokenBoxes.length; i++)
		{
			//矩形の左上が領域の左上にあって，右下が領域の右下にあったら，選択されたと判定．
			if(checkRectangleInclusion(rectBox, tokenBoxes[i]))
			{
				selectedTokens.push(tokenBoxes[i].token);
			}
		}
		// remove nested relation
		for(var i=0; i<selectedTokens.length; i++)
		{
			for(var j=0; j<selectedTokens.length; j++)
			{
				if(($(selectedTokens[i].parentNode).closest(selectedTokens[j])).length > 0) // tokensBoxes[i] is a descendant of already-existing selected token
				{
					selectedTokens.splice(i, 1);
					i--;
					break; // j need not to be adjusted because of this break.
				}
			}
		}
		// remove different hierarchies
		for(var i=1; i<selectedTokens.length; i++)
		{
			if(selectedTokens[i-1].nextSibling !== selectedTokens[i])
			{
				selectedTokens = selectedTokens.slice(0, i); // this is 'slice', not 'splice', i.e., remove all following elements in the array.
				break;
			}
		}
		//
		//
		if(selectedTokens.length > 0)
		{
			var parent = selectedTokens[selectedTokens.length-1].parentNode;
			var nextSibling = selectedTokens[selectedTokens.length-1].nextSibling;
			var selected = insertMrowAsSelected(selectedTokens);
			parent.insertBefore(selected, nextSibling);
			self.token = selected;
		}
		//
		return;
	};




	//
	self.createEnclosingRect = function()
	{
		var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(mrow).addClass('regular-expression');
		$(mrow).addClass('enclosing-regular-expression');
		var menclose = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'menclose');
		menclose.setAttribute('notation', 'verticalstrike');
		var mpaddedForStyle = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		$(mpaddedForStyle).addClass('style-enclosing-regular-expression');
		//
		mrow.appendChild(menclose);
		menclose.appendChild(mpaddedForStyle);
		return mrow;
	};

	var checkAndRemoveEnclosingRect = function(mrowAsRect)
	{
		if(!($(mrowAsRect).hasClass('zero-or-one') || $(mrowAsRect).hasClass('more') || $(mrowAsRect).hasClass('boolean-or') || $(mrowAsRect).hasClass('capturing')))
		{
			var parent = mrowAsRect.parentNode;
			var sibling = mrowAsRect.nextSibling;
			var integration = $(mrowAsRect).find('.integration-node')[0];
			var next;
			if(!$(integration.children[0]).hasClass('null-rect'))
			{
				next = integration.children[integration.children.length-1];
				while(integration.children.length > 0)
				{
					parent.insertBefore(integration.children[0], sibling);
				}
			}
			else
			{
				self.token = mrowAsRect; // todo::
				self.moveToPreviousToken();
				self.moveToPreviousToken();
				self.moveToPreviousToken();
				next = self.token;
			}
			parent.removeChild(mrowAsRect);
			return next;
		}
		else
		{
			return $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		}
	};

	self.addContentToEnclosingRect= function(content, mrowAsRect)
	{
		//
		var style = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(style).addClass('style-enclosing-regular-expression-content');
		var mpadded = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		mpadded.setAttribute('lspace', '0.09375em');
		mpadded.setAttribute('width', '+0.1875em');
		mpadded.setAttribute('height', '+0.09375em');
		mpadded.setAttribute('depth', '+0.09375em');
		var integration = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(integration).addClass('integration-node');
		//
		$(mrowAsRect).find('.style-enclosing-regular-expression')[0].appendChild(style);
		style.appendChild(mpadded);
		mpadded.appendChild(integration);
		if(content === null)
		{
			setNullRect(integration);
		}
		else
		{
			integration.appendChild(content);
		}		
		return style;
	};


	self.labelZeroOrOne = function(mrowAsRect)
	{
		$(mrowAsRect).addClass('zero-or-one');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-zero-or-one');
		return;
	};
	self.labelMore = function(mrowAsRect)
	{
		$(mrowAsRect).addClass('more');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-more');
		//
		var mpaddedForLines = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		mpaddedForLines.setAttribute('width', '+0.375em');
		$(mpaddedForLines).addClass('style-more-right-lines');//##
		//
		var stylesParent = style.parentNode;
		stylesParent.appendChild(mpaddedForLines);
		mpaddedForLines.appendChild(style);
		//
		return;
	}
	self.labelBooleanOr = function(mrowAsRect)
	{
		$(mrowAsRect).addClass('boolean-or');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-boolean-or');
		//
		self.addContentToEnclosingRect(null, mrowAsRect);
		//
		var observer = new MutationObserver(function(mutationRecords, mutationObserver) {
			adjustBooleanOr(mrowAsRect);
		});
		observer.observe(mrowAsRect, {childList: true, subtree: true});
		//
		return;
	}

	var backreferenceNumberManager = BackreferenceNumberManager();

	var rectAndObserver = [];

	self.labelCapturing = function(mrowAsRect)
	{
		$(mrowAsRect).addClass('capturing');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).addClass('style-capturing');
		//
		var mrow              = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(mrow).addClass('capturing-number');
		var mpaddedOuter      = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		mpaddedOuter.setAttribute('width', '-0.0625em');
		var mrowForStyleOuter = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(mrowForStyleOuter).addClass('style-capturing-number-outer');		
		var menclose          = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'menclose');
		menclose.setAttribute('notation', 'verticalstrike');
		var mrowForStyleInner = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
		$(mrowForStyleInner).addClass('style-capturing-number-inner');
		var mpaddedInner      = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mpadded');
		mpaddedInner.setAttribute('lspace', '0.09375em');
		mpaddedInner.setAttribute('width', '+0.1875em');
		mpaddedInner.setAttribute('voffset', '+0.09375em');
		var mi           = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
		$(mi).addClass('mi-capturing-number');
		mi.setAttribute('mathsize', '0.5em');
		var text         =  document.createTextNode(backreferenceNumberManager.allocate());
		//
		mrow.appendChild(mpaddedOuter);
		mpaddedOuter.appendChild(mrowForStyleOuter);
		mrowForStyleOuter.appendChild(menclose);
		menclose.appendChild(mrowForStyleInner);
		mrowForStyleInner.appendChild(mpaddedInner);
		mpaddedInner.appendChild(mi);
		mi.appendChild(text);
		//
		var integration = $(mrowAsRect).find('.integration-node')[0];
		var integrationParent = integration.parentNode;
		integrationParent.parentNode.insertBefore(mrow, integrationParent);
		//
		adjustCapturingNumber(mrowAsRect);
		//
		var observer = new MutationObserver(function(mutationRecords, mutationObserver) {
			adjustCapturingNumber(mrowAsRect);
		});
		observer.observe(mrowAsRect, {childList: true, subtree: true});
		//
		rectAndObserver.push([mrowAsRect, observer]);
		//
		return;
	}


	self.peelZeroOrOne = function(mrowAsRect)
	{
		$(mrowAsRect).removeClass('zero-or-one');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).removeClass('style-zero-or-one');
		self.token = checkAndRemoveEnclosingRect(mrowAsRect);
		return;
	};
	self.peelMore = function(mrowAsRect)
	{
		$(mrowAsRect).removeClass('more');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).removeClass('style-more');
		//
		var lines = style.parentNode;
		var linesParent = lines.parentNode;
		linesParent.appendChild(lines.children[0]);
		linesParent.removeChild(lines);
		//
		self.token = checkAndRemoveEnclosingRect(mrowAsRect);
		//
		return;		
	};
	self.peelCapturing = function(mrowAsRect)
	{
		$(mrowAsRect).removeClass('capturing');
		var style = $(mrowAsRect).find('.style-enclosing-regular-expression')[0];
		$(style).removeClass('style-capturing');
		//
		var number = parseInt($(mrowAsRect).find('.mi-capturing-number')[0].firstChild.nodeValue);
		backreferenceNumberManager.free(number);
		//
		var capNum = $(mrowAsRect).find('.capturing-number')[0];
		capNum.parentNode.removeChild(capNum);
		//
		for(var i=0; i<rectAndObserver.length; i++)
		{
			if(mrowAsRect === rectAndObserver[i][0])
			{
				rectAndObserver[i][1].disconnect();
				rectAndObserver.splice(i, 1);
				break;
			}
		}
		//
		self.token = checkAndRemoveEnclosingRect(mrowAsRect);
		//
		return;
	};




	self.createRectWithLabeling = function(labelingFunction)
	{
		var n = self.token;
		var parent = n.parentNode;
		var nextSibling = n.nextSibling;
		//
		var mrow = self.createEnclosingRect();
		if($(n).hasClass('selected'))
		{
			self.addContentToEnclosingRect(n, mrow);
			removeMrowAsSelected(n);
			parent.insertBefore(mrow, nextSibling); //
		}
		else
		{
			self.addContentToEnclosingRect(null, mrow);
			self.insertToken(mrow);
		}
		labelingFunction(mrow);
		// //
		// parent.insertBefore(mrow, nextSibling);
		self.token = $(mrow).find('.style-enclosing-regular-expression')[0];
		return;
	}



	return self;
};


var adjustBooleanOr = function(booleanOr)
{
	var booleanOr_style = $(booleanOr).find('.style-enclosing-regular-expression')[0];
	// get all alternatives
	var alternatives = [];
	for(var i=0; i<booleanOr_style.children.length; i++)
	{
		alternatives.push(booleanOr_style.children[i]);
	}
	// get max height in alternatives
	var minTop = 1000000000;
	var maxBottom = -1;
	for(var i=0; i<alternatives.length; i++)
	{
		var integration = $(alternatives[i]).find('.integration-node')[0];
		if(integration)
		{
			var top = $(integration).offset().top;
			var bottom = top + integration.getBoundingClientRect().height;
			if(minTop > top)
			{
				minTop = top; 
			}
			if(maxBottom < bottom)
			{
				maxBottom = bottom;
			}
		}
	}
	// set All mpadded as maxHeight
	for(var i=0; i<alternatives.length; i++)
	{
		var mpadded = $(alternatives[i]).find('mpadded')[0];		
		var integration = $(alternatives[i]).find('.integration-node')[0];
		if(integration)
		{
			var top = $(integration).offset().top;
			var bottom = top + integration.getBoundingClientRect().height;
			mpadded.setAttribute('height', '+' + (top - minTop + 1.5)       + 'px');
			mpadded.setAttribute('depth',  '+' + (maxBottom - bottom + 1.5) + 'px');
		}
	}
	return;
};

var adjustCapturingNumber = function(capturing)
{
	//
	var capturing_style         = $(capturing).find('.style-capturing')[0].parentNode;
	var capturingNumber_mpadded = $(capturing).find('.capturing-number').find('mpadded')[0];
	//
	capturingNumber_mpadded.setAttribute('height', '+0em');
	//
	var capTop    = $(capturing_style).offset().top;
	var capNumTop = $(capturingNumber_mpadded).offset().top; 
	
	capturingNumber_mpadded.setAttribute('height', '+' + (capNumTop - capTop) + 'px');
	capturingNumber_mpadded.setAttribute('voffset', '+' + (capNumTop - capTop) + 'px');
	//
	return;
};




/*
selected
*/
var insertMrowAsSelected = function(selectedElements)
{
	var selected = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
	var integration = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
	$(selected).addClass('selected');
	$(integration).addClass('integration-node');
	selected.appendChild(integration);
	for(var i=0; i<selectedElements.length; i++)
	{
		integration.appendChild(selectedElements[i]);
	}
	return selected;
};

var removeMrowAsSelected = function(mrow)
{
	if(!$(mrow).hasClass('selected')) return;
	//
	return removeMrow(mrow);
};

var removeMrow = function(mrow)
{
	var parent = mrow.parentNode;
	var sibling = mrow.nextSibling;
	var integration = mrow.children[0];
	while(integration.children.length > 0)
	{
		parent.insertBefore(integration.children[0], sibling);
	}
	parent.removeChild(mrow);
	return parent;
};


var createInitialStructure = function(localName)
{
	var structure = document.createElementNS('http://www.w3.org/1998/Math/MathML', localName);
	$(structure).addClass('structure-node');
	var nOfMrow = 0;
	if(localName.search(/^(msqrt)$/) !== -1) nOfMrow = 1;
	else if(localName.search(/^(msub|msup|munder|mover|mfrac|mroot)$/) !== -1) nOfMrow = 2;
	else if(localName.search(/^(msubsup|munderover)$/) !== -1) nOfMrow = 3;

	if(localName.search(/^(mtable)$/) !== -1) //行列の処理
	{
		var rows = document.fm.rows.value;
		var columns = document.fm.columns.value;
		for(var i=0; i<rows; i++){
			var mtr = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mtr');
			$(mtr).addClass('structure-node');
			structure.appendChild(mtr);
			for(var j=0; j<columns; j++){
				var mtd = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mtd');
				$(mtd).addClass('structure-node');
				var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
				mtr.appendChild(mtd);
				mtd.appendChild(mrow);
				$(mrow).addClass('integration-node');
				setNullRect(mrow);
			}
		}
	}else{
		for(var i=0; i<nOfMrow; i++)
		{
			var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
			structure.appendChild(mrow);
			if(!(localName.search(/^(msub|msup|msubsup)$/) !== -1 && i === 0))
			{
				$(mrow).addClass('integration-node');
				setNullRect(mrow);
			}
		}	
	}


	return structure;
};

var createInitialStructure2 = function(num)//2*2,3*3行列
{
	var structure = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mtable');
	$(structure).addClass('structure-node');
	var rows = num;
	var columns = num;
	for(var i=0; i<rows; i++){
		var mtr = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mtr');
		$(mtr).addClass('structure-node');
		structure.appendChild(mtr);
		for(var j=0; j<columns; j++){
			var mtd = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mtd');
			$(mtd).addClass('structure-node');
			var mrow = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
			mtr.appendChild(mtd);
			mtd.appendChild(mrow);
			$(mrow).addClass('integration-node');
			setNullRect(mrow);
		}
	}
	return structure;
};

//
var setNullRect = function(nullMrow)
{
	var mstyle = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mstyle');
	var mphantom = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mphantom');
	var mspace = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mspace');
	mstyle.appendChild(mphantom);
	mphantom.appendChild(mspace);

	mspace.setAttribute('height', '1.8ex');
	mspace.setAttribute('width', '1.2ex');
	$(mstyle).addClass('null-rect');

	nullMrow.appendChild(mstyle);	
	return;
};