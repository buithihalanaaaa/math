
/*
 *
 */
const { alias, specialCharacters } = require('./constants');

/*
 *
 */
var queryParse = function()//即時実行される
{
  /* ****
   * トークン処理のためのプライベートメンバ
   * ****/
  var tokens           = []; //パースするトークン列
  var idx              = 0;  //着目しているトークンのインデクス
  /*
   *
   */
  var fArbC = false;
  var fArbM = false;
  var fArb = false;
  var arbCPhrase = function()
  {
    if(fArbC) {              return '\\g<arbc>';}
    else      {fArbC = true; return '(?<arbc>[^{}:/\\\\]|/(?![{}:])|\\\\{|\\\\}|\\\\:|\\\\\\\\)';}
  };
  var arbMPhrase = function()
  {
    if (fArbM){              return '\\g<arbm>';}
    else      {fArbM = true; return '(?<arbm>/:+(/{('+arbCPhrase()+'|\\g<arbm>)*/})+)';}
  };
  var arbPhrase = function()
  {
    if (fArb) {              return '\\g<arb>';}
    else      {fArb  = true; return '(?<arb>'+arbCPhrase()+'|'+arbMPhrase()+')';}
  };
  /*
   *
   */
  var parN = 0;




  /*********
   * これがメインの部分．この関数が帰るので，実質，これが呼び出されることになる．
   *********/
  var main = function(argTokens)
  {
    initialize(argTokens);
    var q;
    if( (q = query()) )
    {
      return {query:q, n:parN};
    }
  };


  /* ********
   * 汎用メソッド
   * ********/
  /*
   * パーサを初期化する．
   */
  var initialize = function(argTokens)
  {
    tokens         = argTokens;
    idx            = 0;
    queryForTreeString = '';

    fArb = false;
    fArbC = false;
    fArbM = false;
    parN=0;

  };
  /*
   * トークンを1つパースする．
   * トークンであるべきものそのものの文字列でもいいし，トークンたるものの正規表現でもいい．
   */
  var parseToken = function(matchedToken)
  {
    if(idx > tokens.length-1) return false; //取るべきトークンがなかったら，不一致を返す．
    /*
     * 着目しているトークンと渡されたトークンが一致していたら，成功を返して，着目トークンを1つ進める．
     */
    if(tokens[idx] === matchedToken)
    {
            idx++;
      return true;
    }
    else
    {
      return false;
    }
  };
  /*
   * トークン1つを正規表現でパースする．
   * parseTokenに統合してもいいけど，parseTokenは呼ばれまくるから，条件判定を少なくしたい．だから別メソッドを作る．
   */
  var parseTokenByRegExp = function(regExp)
  {
    //idx<token.length-1のチェックは，別にしておかなくてもいい．idxがオーバーしてたら，単にnullが帰るだけ．
    if( ((tokens[idx].match(regExp))||[])[0] )
    {
      return parseToken(tokens[idx]);//確実に成功する．インデクスを進めるためにparseTokenを呼ぶ．
    }
    else
    {
      return false;
    }
  };
  /*
   * 1つの非終端記号(ブロック)を処理するメソッド**を作るための**メソッド．
   * 非終端記号を処理するためのメソッドを受け取って，前処理と後処理を追加したメソッドを返す．
   * 前処理，後処理の内容:
   *   その非終端記号を処理できれば，生成規則を返して，トークン列のインデクスを進める．
   *                            処理できなければ，処理の過程で進めたトークン列のインデクスを戻す．
   */
  var bulidBlockParser = function(parsedBlock)
  {
    return function()
    {
      var currentIdx = idx;
      var retVal;
      if( (retVal = parsedBlock()) )
      {
        return retVal;
      }
      else
      {
        idx = currentIdx;//インデクスを戻す
        return false;
      }
    };
  };


  /* ********
   * ブロックをパースするためのメソッド群．
   * ********/
  /*
   * 問い合わせをパースするための文法．
   * Query   -> HeadPos EOF
   * HeadPos -> '^'? Union //「行頭にマッチ」する特殊記号を処理するためのもの．
   * Union   -> Concat ('|' Concat)*
   * Concat  -> Closure Closure*
   * Closure -> Element ('*' | '+')* //a+*+みたいな正規表現に対応するために，こうしとく．+のために新しい非終端記号を作ると，巡回で右再帰する．
   * Element -> CHAR | '(' Union ')' | '[' CharClass ']' |'\' Func | '.' | AbbSup | AbbSub | AbbFrac
   *
   * CharClass ->
   *
   * ********
   * Func       -> MathSymbol | Escape | ArbitraryMathSymbol | ArbitraryChar | BackReference
   *
   * MathSymbol -> MathKeyword1 MathArg |
   *               MathKeyword2 MathArg MathArg|
   *               MathKeyword3 MathArg MathArg MathArg
   * MathKeyword1 -> 'sub' | 'sup' | 'sqrt'
   * MathKeyword2 -> 'subsup' | 'over' | 'under' | 'root' | 'frac'
   * MathKeyword3 -> 'underover'
   * MathArg      -> '{' Union '}'
   *
   * Escape -> '+' | '*' | ...
   *
   * ArbitraryIdentifier -> 'i' //undone::
   * ArbitraryChar       -> 'c'
   * ArbitraryMathSymbol -> 'm'
   *
   * BackReference -> [0-9]*
   * ********
   *
   */
  var query = bulidBlockParser(function()
  {
    var q;
    if( (q = headPos()) )
    {
      if(eof())
      {
        /*
         * 全体を囲む．
         */
        return '(?<c0>' + q + ')';
      }
      else return false;
    }
    else return false;
  });

  var headPos = bulidBlockParser(function()
  {
    var q;
    var headF = false;
    if(parseToken('^')) headF = true;
    if( (q = union()) )
    {
      if(headF)
      {
        return '^' + q;
      }
      else
      {
        return q;
      }
    }
    return;
  });

  var union = bulidBlockParser(function()
  {
    var q = '';
    var q0;
    var qi;
    if( (q0 = concat()) )
    {
      q += q0+'|';
      while(parseToken('|'))
      {
        if( (qi = concat()) ) q += qi+'|';
        else                  q += ''+'|';
      }
      return q.substring(0,q.length-1);
    }
    else return false;
  });

  var concat = bulidBlockParser(function()
  {
    var q = '';
    var q0;
    var qi;
    if( (q0 = closure()) )
    {
      q += q0;
      while( (qi = closure()) )//closureが連続している限り，どんどんconcatでつないでく．
      {
        q += qi;
      }
      return q;
    }
    else return false;
  });

  var closure = bulidBlockParser(function()
  {
    var q;
    if( (q = element()) )
    {
      while(tokens[idx] === '*' || tokens[idx] === '+' || tokens[idx] === '?')
      {
        if(parseToken('*'))
        {
          q = '(' + q + ')' + '*';
        }
        else if(parseToken('+'))
        {
          q = '(' + q + ')' + '+';
        }
        else if(parseToken('?'))
        {
          q = '(' + q + ')' + '?';
        }
      }
      return q;
    }
    else return false;
  });


  var element = bulidBlockParser(function()
  {
    var q;

    if(parseToken('.'))
    {
      return arbPhrase();
    }
    else if( (q = character()) )
    {
      return q;
    }
    else if( (q = characterEntityReference()) )
    {
      return q;
    }
    else if( (q = charClass()) )
    {
      return q;
    }
    else if(parseToken('('))
    {
      parN++;
      var brIdx = parN;
      if( (q = union()) )
      {
        if (parseToken(')'))
        {
          return '(?<c' + brIdx + '>' + q + ')';
        }
        else return false;
      }
      else return false;
    }
    else if(parseToken('\\'))
    {
      if( (q = func()) )
      {
        return q;
      }
      else return false;
    }
    else return false;
  });


  /*
   * エスケープされるべき文字以外，で，擬似的に1文字を表現．
   */
  var character = function()
  {
    //エスケープされるべき文字でないことを確認
    //undone::微妙に冗長だから気が向いたら整理する．
    for(i=0; i<specialCharacters.length; i++)
    {
      if(parseToken(specialCharacters[i]))
      {
        idx--;//インデクスを戻す．
        return false;
      }
    }

    //トークン列の終端に到達しているかどうかのチェック．
    var thisCharacter = tokens[idx];
    if(parseToken(thisCharacter))
    {
      if     (thisCharacter === ':') thisCharacter = '\\\\:';  //;は数式文字名のaliasに使うので，エスケープする．
      else if(thisCharacter === '/') thisCharacter = '/(?![{}:])'   //'/'はセパレータなので，後読みで特別に処理．
      return thisCharacter;
    }
    else//この分岐に入るのは，トークンを食いつぶした時．
    {
      return false;
    }
  };

  /*
   *
   */
  var characterEntityReference = bulidBlockParser(function()
  {
    var q = '';
    var name = '';
    if(parseToken('&'))
    {
      while(tokens[idx] !== ';')
      {
        name += tokens[idx];
        idx++;
        if(!tokens[idx])//トークンを食いつぶした時(閉じ括弧がない時)
        {
          return false;
        }
      }
      /*
       * ここで実体名を変換．
       */
      if(parseToken(';'))
      {
        q += '\&#x' + cer[name] + '\;';
        return q;
      }
      else//たぶんここには入らない．
      {
        return false;
      }
    }
    else
    {
      return false
    }
  });


  /*
   * 文字クラスの内部はそのまま使う．
   */
  var charClass = bulidBlockParser(function()
  {
    var q = '';
    if(parseToken('['))
    {
      q += '(?<![^:\{\}]\/)(?<!^\/)(?<!\/}\/)';

      for(var q1 = 1; q1 <= 13; q1++){
        q += '(?<!\/';
        for(var q2 = 0; q2 < q1; q2++){
          q += ':';
        }
        q += ')';
      }
      for(var q1 = 1; q1 < 13 +1; q1++){
        q += '(?<!\/';
        for(var q2 = 0; q2 < q1; q2++){
          q += ':';
        }
        q += '\/)';
      }

      q += '[';
      console.log(q);
      while(tokens[idx] !== ']')
      {
        if(parseToken('\\'))
        {
          q += '\\';
          if(parseToken(']'))
          {
            q += ']';
          }
        }
        else
        {
          q += tokens[idx];
          idx++;
          if(!tokens[idx])//トークンを食いつぶした時(閉じ括弧がない時)
          {
            return false;
          }
        }
      }
      if(parseToken(']'))
      {
        //q += ']';
        q += '](?!:+\/)(?!}\/{)(?!}[^:\{\}])(?!{[^:\{\}])(?!}$)';
        return q;
      }
      else//たぶんここには入らない．
      {
        return false;
      }
    }
    else
    {
      return false
    }
  });


  var func = bulidBlockParser(function()
  {
    var q;
    if( (q = mathSymbol()) )
    {
      return q;
    }
    else if( (q = backReference()) )
    {
      return q;
    }
    else if( (q = escape()) )
    {
      return q;
    }
    else if( (q = arbitraryIdentifier()) )
    {
      return q;
    }
    else if( (q = arbitraryChar()) )
    {
      return q;
    }
    else if( (q = arbitraryMathSymbol()) )
    {
      return q;
    }
    /* 新しいバックスラッシュ機能を追加したかったら，ここに書く．  */
    else return false;
  });

  //BR::
  var mathSymbol = bulidBlockParser(function()
  {
    var m;
    var a0;
    var a1;
    var a2;
    var an = new Array();

    if( (m = mathKeyword1()) )
    {
      if( (a0 = mathArg()) )
      {
        return '/'+m + '/{' + a0 + '/}';
      }
      else return false;
    }
    else if( (m = mathKeyword2()) )
    {
      if( (a0 = mathArg()) )
      {
        if( (a1 = mathArg()) )
        {
          return '/'+m + '/{' + a0 + '/}' + '/{' + a1 + '/}';
        }
        else return false;
      }
      else return false;
    }
    else if( (m = mathKeyword3()) )
    {
      if( (a0 = mathArg()) )
      {
        if( (a1 = mathArg()) )
        {
          if( (a2 = mathArg()) )
          {
            return '/'+m + '/{' + a0 + '/}' + '/{' + a1 + '/}' + '/{' + a2 + '/}';
          }
          else return false;
        }
        else return false;
      }
      else return false;
    }else if( (m = mathKeywordTable()) )
    {
      var result = '/' + m;
      var i=0;
      while((an[i] = mathArg())){
          result += '/{' + an[i] + '/}';
      }
      return result;
    }else if( (m = mathKeywordTr()) )
    {
      var result = '/' + m;
      var i=0;
        while( (an[i] = mathArg()) )
        {
          result += '/{' + an[i] + '/}';
        }
      return result;
    }
    else return false;
  });


  var mathArg = bulidBlockParser(function()
  {
    var q;
    if(parseToken('{'))
    {
      if( (q = union()) )
      {
        if(parseToken('}'))
        {
          return q;
        }
        else return false;
      }
      else return false;
    }
    else return false;
  });


  /*
   * 後方参照のパース．
   */
  var backReference = bulidBlockParser(function()
  {
    var r;
    if(parseTokenByRegExp(/[1-9][0-9]*/))
    {
      var brNum = parseInt(tokens[idx-1]);
      r = '\\k<c' + brNum + '>';
      return r;
    }
    else
    {
      return false;
    }
  });


  /* ********
   * 少し特殊なブロックをパースするためのメソッド
   * ********/
  /*
   * クエリ文字列長を使って，擬似的にeofを判定
   * インデクスがトークン列の終端まで進んでいたら真と判定．
   */
  //undone: これ，別に必要ないかも．あるいは，他の終了条件をここに統合すれば良いかも．
  var eof = function()
  {
    if (idx === tokens.length) return true;
    else return false;
  };
  /*
   * エスケープされた1文字をパース
   */
  var escape = bulidBlockParser(function()
  {
    //エスケープされるべき文字であることを確認
    for(i=0; i<specialCharacters.length; i++)
    {
      var thisCharacter = tokens[idx];
      if(parseToken(specialCharacters[i]))
      {
        if(thisCharacter === '{' || thisCharacter === '}')
        {
          return '\\\\' + thisCharacter;
        }
        else if(thisCharacter === '&' || thisCharacter === ';')
        {
          return thisCharacter;//&, ;は正規表現におけるメタ文字ではないので，普通の形にする．
        }
        else
        {
          return '\\' + thisCharacter;
        }
      }
    }
    return false;
  });




  /*
   * 「任意の1字」．
   */
  var arbitraryChar = function()
  {
    var r;
    if(parseToken('c'))
    {
      return arbCPhrase();
    }
    else return false;
  };
  /*
   * 「任意の1識別子」．
   */
  var arbitraryIdentifier = function()
  {
    var r;
    if(parseToken('i'))
    {
      return '[a-zA-Z]';
    }
    else return false;
  };
  /*
   * 「任意の1数式記号(構造)」．
   */
  var arbitraryMathSymbol = function()
  {
    var r;
    if(parseToken('m'))
    {
      return arbMPhrase();
    }
    else return false;
  };






  /*
   * 数式記号のためのキーワードのパース．
   */
  var mathKeyword1 = bulidBlockParser(function()
  {
    var currentToken = tokens[idx];
    if(parseToken('sub') || parseToken('sup') || parseToken('sqrt') || parseToken('td'))
    {
      return alias['m'+currentToken];
    }
    else false;
  });
  var mathKeyword2 = bulidBlockParser(function()
  {
    var currentToken = tokens[idx];
    if(parseToken('subsup') || parseToken('over') || parseToken('under') || parseToken('root') || parseToken('frac'))
    {
      return alias['m'+currentToken];
    }
    else false;
  });
  var mathKeyword3 = bulidBlockParser(function()
  {
    var currentToken = tokens[idx];
    if(parseToken('underover'))
    {
      return alias['m'+currentToken];
    }
    else false;
  });
  var mathKeywordTable = bulidBlockParser(function()
  {
    var currentToken = tokens[idx];
    if(parseToken('table'))
    {
      return alias['m'+currentToken];
    }
    else false;
  });
  var mathKeywordTr = bulidBlockParser(function()
  {
    var currentToken = tokens[idx];
    if(parseToken('tr'))
    {
      return alias['m'+currentToken];
    }
    else false;
  });





  /*
   * パーサの本体を返す．
   */
  return main;

}();

module.exports = { queryParse };