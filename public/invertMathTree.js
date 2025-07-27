var buildMathMLFromParsedString = function(mathTokens, idx)
{
    var mrow = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
    var mtr = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mtr");
    var mtd = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mtd");
    
    for(var i=idx; i<mathTokens.length; i++)
    {   
        if(mathTokens[i] === '/}')
        {
            //再帰で呼ばれた時の終了条件
            return {mrow:mrow, idx:i, mtr:mtr, mtd:mtd};
        }
        else if(mathTokens[i].charAt(0) === '/')
        {
            if(mathTokens[i].slice(1) === alias['msub'] ||
               mathTokens[i].slice(1) === alias['msup'])
            {
                var structureElement;
                if     (mathTokens[i].slice(1) === alias['msub']) structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'msub');
                else if(mathTokens[i].slice(1) === alias['msup']) structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'msup');
                var emptyMrow  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mrow');
                structureElement.appendChild(emptyMrow);
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコ(/{の2文字がひとまとまりになったトークン)の次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                i = result1['idx'];
            }
            else if(mathTokens[i].slice(1) === alias['msqrt'])
            {
                var structureElement;
                if(mathTokens[i].slice(1) === alias['msqrt']) structureElement = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'msqrt');
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                i = result1['idx'];
            }
            else if(mathTokens[i].slice(1) === alias['mtd'])
            {
                var structureElement;
                if(mathTokens[i].slice(1) === alias['mtd']) structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mtd');
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                i = result1['idx'];
                mtd = structureElement;
                //console.log(mathTokens[i].slice(1));
            }
            else if(mathTokens[i].slice(1) === alias['mtable'])
            {
                var structureElement;
                structureElement = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mtable');
                mrow.appendChild(structureElement);
                var resultX = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの次から再帰で走査．
                structureElement.appendChild(resultX['mtr']);
                //console.log(mathTokens[i].slice(1));
                i = resultX['idx'];
                //console.log(mathTokens[i].slice(1));
                while(i+2 < mathTokens.length && mathTokens[i+2].slice(1) === alias['mtr']){
                  resultX = buildMathMLFromParsedString(mathTokens, resultX['idx']+2); //
                  structureElement.appendChild(resultX['mtr']);
                  i = resultX['idx'];
                }
                i = resultX['idx'];
            }

            else if(mathTokens[i].slice(1) === alias['mtr'])
            {
                var structureElement;
                structureElement = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mtr');
                var resultX = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの次から再帰で走査．
                structureElement.appendChild(resultX['mtd']);
                //console.log(mathTokens[i].slice(1));
                i = resultX['idx'];
                //console.log(mathTokens[i].slice(1));
                while(mathTokens[i+2].slice(1) === alias['mtd']){
                  resultX = buildMathMLFromParsedString(mathTokens, resultX['idx']+2); //
                  structureElement.appendChild(resultX['mtd']);
                  i = resultX['idx'];
                  //console.log(mathTokens[i].slice(1));
                }
                mtr = structureElement;
                i = resultX['idx'];
            }

            


            else if(mathTokens[i].slice(1) === alias['mover'] ||
                    mathTokens[i].slice(1) === alias['munder']||
                    mathTokens[i].slice(1) === alias['mroot'] ||
                    mathTokens[i].slice(1) === alias['mfrac'])
            {
                var structureElement;
                if     (mathTokens[i].slice(1) === alias['mover'])  structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mover');
                else if(mathTokens[i].slice(1) === alias['munder']) structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'munder');
                else if(mathTokens[i].slice(1) === alias['mroot'])  structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mroot');
                else if(mathTokens[i].slice(1) === alias['mfrac'])  structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mfrac');
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                var result2 = buildMathMLFromParsedString(mathTokens, result1['idx']+2);//result1['idx']は}．+1が{．なので，その次から．
                structureElement.appendChild(result2['mrow']);
                i = result2['idx'];
            }
            else if(mathTokens[i].slice(1) === alias['msubsup'])
            {
                var structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'msubsup');
                var emptyMrow  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'mrow');
                structureElement.appendChild(emptyMrow);
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                var result2 = buildMathMLFromParsedString(mathTokens, result1['idx']+2);//result1['idx']は}．+1が{．なので，その次から．
                structureElement.appendChild(result2['mrow']);
                i = result2['idx'];
            }
            else if(mathTokens[i].slice(1) === alias['munderover'])
            {
                var structureElement  = document.createElementNS("http://www.w3.org/1998/Math/MathML", 'munderover');
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                var result2 = buildMathMLFromParsedString(mathTokens, result1['idx']+2);//result1['idx']は}．+1が{．なので，その次から．
                structureElement.appendChild(result2['mrow']);
                var result3 = buildMathMLFromParsedString(mathTokens, result2['idx']+2);//result2['idx']は}．+1が{．なので，その次から．
                structureElement.appendChild(result3['mrow']);
                i = result3['idx'];
            }
            else if(mathTokens[i].slice(1) === alias['mstyle'])
            {
                var structureElement = document.createElementNS('http://www.w3.org/1998/Math/MathML','mstyle');
                structureElement.setAttribute('mathbackground', 'yellow');
                mrow.appendChild(structureElement);
                var result1 = buildMathMLFromParsedString(mathTokens, i+2);//キーワードの後の中カッコの次から再帰で走査．
                structureElement.appendChild(result1['mrow']);
                i = result1['idx'];
            }
            else
            {
                for(var j=0; j<mathTokens[i].length; j++)
                {
                    var mi  = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
                    mrow.appendChild(mi);
                    var txt = document.createTextNode(mathTokens[i].charAt(j));
                    mi.appendChild(txt);
                }
            }
        }
        else if(mathTokens[i].charAt(0) === '\\')
        {
            var mi  = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
            mrow.appendChild(mi);
            var txt = document.createTextNode(mathTokens[i].charAt(1));
            mi.appendChild(txt);            
        }
        else
        {
            var mi  = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
            mrow.appendChild(mi);
            var txt = document.createTextNode(mathTokens[i]);
            mi.appendChild(txt);
        }
    }
    //ここに行き着いたら，再帰コールではないので，mrowだけ返す．
    var math = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math");
    math.appendChild(mrow);
    return math;
}

















