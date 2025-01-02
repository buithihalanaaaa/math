var tokenizeParsedString = function(str)
{
  var tokens = []//トークン列が格納される．
  for(var i=0; i < str.length; i++)
  {
    switch(str.charAt(i))
    {
      case '/':
        i++;
        if(str.charAt(i) === ':')
        {
            var alias = '';
            while( str.charAt(i) === ':' )
            {
              alias += str.charAt(i);
              i++;
            }
            tokens.push('/' + alias);
        }
        else if(str.charAt(i) === '{' || str.charAt(i) === '}')
        {
            tokens.push('/' + str.charAt(i));
            i++;
        }
        else
        {
            tokens.push('/');
        }
        i--; //forのループでiがインクリメントされるので，バックスラッシュのトークン化でインクリメントした分1つ引いとく．        
        break;
      case '\\':
        i++;
        switch(str.charAt(i))
        {
          case '{':
          case '}':
          case ':':
          case '\\':
            tokens.push('\\' + str.charAt(i));
            break;
          default:
            tokens.push('\\' + str.charAt(i));//todo::
            break;
        }
        break;
      default://キーワード以外は1文字1トークンとして食ってく．
        tokens.push(str.charAt(i));
        break;
    }
  }
  return tokens;

};





var parseReplacement = function(replacementString, idx)
{
    var parsedReplacement = '';
    var tokens = queryTokenize(replacementString);
    for(var i=idx; i<tokens.length; i++)
    {   
        if(tokens[i] === '}')
        {
            //再帰で呼ばれた時の終了条件
            return {parsedReplacement:parsedReplacement, idx:i};
        }
        else if(tokens[i] === '\\')
        {
            i++;
            if(tokens[i] === 'sub' ||
               tokens[i] === 'sup' ||
               tokens[i] === 'sqrt' ||
               tokens[i] === 'td')
            {
                var result1 = parseReplacement(replacementString, i+2);//キーワードの後の中カッコの次から再帰で走査
                parsedReplacement += '/'+alias['m'+tokens[i]]+'/{'+result1['parsedReplacement']+'/}';
                i = result1['idx'];
            }
            else if(tokens[i] === 'over' ||
                    tokens[i] === 'under'||
                    tokens[i] === 'root' ||
                    tokens[i] === 'frac' ||
                    tokens[i] === 'subsup')
            {
                var result1 = parseReplacement(replacementString, i+2);              //キーワードの後の中カッコの次から再帰で走査
                var result2 = parseReplacement(replacementString, result1['idx']+2); //result1['idx']は}．+1が{．なので，その次から．
                parsedReplacement += '/'+alias['m'+tokens[i]]+'/{'+result1['parsedReplacement']+'/}'+'/{'+result2['parsedReplacement']+'/}';
                i = result2['idx'];
            }
            else if(tokens[i] === 'underover')
            {
                var result1 = parseReplacement(replacementString, i+2);              //キーワードの後の中カッコの次から再帰で走査
                var result2 = parseReplacement(replacementString, result1['idx']+2); //result1['idx']は}．+1が{．なので，その次から．
                var result3 = parseReplacement(replacementString, result2['idx']+2); 
                parsedReplacement += '/'+alias['m'+tokens[i]]+'/{'+result1['parsedReplacement']+'/}'+'/{'+result2['parsedReplacement']+'/}'+'/{'+result3['parsedReplacement']+'/}';
                i = result3['idx'];
            }
            else if(tokens[i] === 'table')
            {
                var resultX = parseReplacement(replacementString, i+1);
                //parsedReplacement += '/'+alias['m'+tokens[i]]+resultX['parsedReplacement'];
                parsedReplacement += '/'+alias['m'+tokens[i]]+'/{'+resultX['parsedReplacement']+'/}';
                while(tokens[resultX['idx']+1] === 'tr'){
                  resultX = parseReplacement(replacementString, resultX['idx']+1); //mtableの子はmtr
                  //parsedReplacement += resultX['parsedReplacement'];
                  parsedReplacement += '/{'+resultX['parsedReplacement']+'/}';
                }
                i = resultX['idx'];
            }
            else if(tokens[i] === 'tr')
            {
                var resultX = parseReplacement(replacementString, i+1);
                //parsedReplacement += '/'+alias['m'+tokens[i]]+resultX['parsedReplacement'];
                parsedReplacement += '/'+alias['m'+tokens[i]]+'/{'+resultX['parsedReplacement']+'/}';
                while(tokens[resultX['idx']+1] === 'td'){
                  resultX = parseReplacement(replacementString, resultX['idx']+1); //mtrの子はmtd
                  //parsedReplacement += resultX['parsedReplacement'];
                  parsedReplacement += '/{'+resultX['parsedReplacement']+'/}';

                }
                i = resultX['idx'];
            }
            /*
              後方参照
            */
            else if(  ((tokens[i].match(/^[0-9]+$/))||[])[0]  )
            {
                parsedReplacement += '\\k<c' + tokens[i] + '>';
            }
            /*
              文字としてのカッコ．エスケープされている．
            */
            else if(tokens[i] === '{' || tokens[i] === '}')
            {
                parsedReplacement += '\\\\' + tokens[i];
            }
            /*
              無意味なエスケープ
              todo::オリジナルの正規表現の仕様から考えると不要かも．
            */
            else
            {
                parsedReplacement += '\\' + tokens[i];
            }
        }
        else
        {
            if     (tokens[i] === ':') parsedReplacement += '\\\\:';  //;は数式文字名のaliasに使うので，エスケープする．
            //else if(tokens[i] === '/') parsedReplacement += '/(?![{}:])'   //'/'はセパレータなので，後読みで特別に処理．            
            else                       parsedReplacement += tokens[i];
        }
    }
    return parsedReplacement;//ここに行き着いたら，再帰コールではないので，stringだけ返す．
};


