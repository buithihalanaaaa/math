/*
 * 問い合わせの文字列を受け取って，トークン化したものの配列を返す．
 */

var queryTokenize = function(query)
{
  var tokens = []//トークン列が格納される．
  for(var i=0; i < query.length; i++)
  {
    var qChar = query.charAt(i);
    switch(qChar)
    {
      case '\\':
        tokens.push(qChar);
        i++;
        //数式構造キーワードが来たら，1つのトークンとして格納しとく．
        //「'{'が来るまで」という条件でキーワードを取ることはできない．バックスラッシュのメタ記号は数式構造指定以外にも利用するため．
        //キーワード長が長い方から処理．「sub」で取ってしまうと，「subsup」をうまく処理できなくなる．
        /*
         * 3字 1引数 sub sup
         * 4字 1引数 sqrt 2引数 over root frac
         * 5字 2引数 under
         * 6字 3引数 subsup
         * 9字 3引数 underover
         */
        var keyword9 = query.substr(i,9);
        if(keyword9 === 'underover' )
        {
          tokens.push(keyword9);
          i += 9;
        }
        var keyword6 = query.substr(i,6);
        if(keyword6 === 'subsup' )
        {
          tokens.push(keyword6);
          i += 6;
        }
        var keyword5 = query.substr(i,5);
        if(keyword5 === 'under' ||
           keyword5 === 'table')
        {
          tokens.push(keyword5);
          i += 5;
        }
        var keyword4 = query.substr(i,4);
        if(keyword4 === 'sqrt' ||
           keyword4 === 'over' ||
           keyword4 === 'root' ||
           keyword4 === 'frac' )
        {
          tokens.push(keyword4);
          i += 4;
        }
        var keyword3 = query.substr(i,3);
        if(keyword3 === 'sub' ||
           keyword3 === 'sup' )
        {
          tokens.push(keyword3);
          i += 3;
        }
        var keyword2 = query.substr(i,2);
        if(keyword2 === 'tr' ||
           keyword2 === 'td' )
        {
          tokens.push(keyword2);
          i += 2;
        }
        /*
         * バックスラッシュの後に数字が連続してきたら，後方参照なので，1つのトークンとして保存．
         */
        var numString = '';
        while( ((query.charAt(i).match(/[0-9]/))||[])[0] )
        {
          numString += query.charAt(i);
          i++;
        }
        if(numString) tokens.push(numString);
        //forのループでiがインクリメントされるので，バックスラッシュのトークン化でインクリメントした分1つ引いとく．
        i--;
        break;
      default://キーワード以外は1文字1トークンとして食ってく．(, ), {, }, *, | も，単に1文字．
        tokens.push(qChar);
        break;
    }
  }
  return tokens;
};


