// 学習項目を追加したい時
// 1. 130行ちょい後のところに、まず追加したい学習項目の名前の変数を定義
// 2. ～～Checkなどで予め学習項目のMathMLを定義しておき、正規化された後の数式が完全に一致している場合に、先ほど定義した変数に「学習項目の名前」を代入。
// 3. 一番最後のoutputStrの末尾に、追加したい学習項目の格納されている変数を+で追加。

// check用の文字列に括弧や縦棒"|"を使いたい場合は <mi>\\(<\mi> のように、2回エスケープする必要がある

var expressionDistinction = function(n) {
  var text;
  var str = n;

  // 属性・空白・改行の除去
  str = str.replace(/<math[^>]*?>/g, "<math>");
  str = str.replace(/<mrow[^>]*?>/g, "<mrow>");
  str = str.replace(/\s+/g, "");

  var integralCheck = new RegExp("<mi>∫<\/mi>|<mi>∬<\/mi>|<mi>∭<\/mi>");
  var rootCheck = new RegExp("<msqrt>|<mroot>");

  var logarithmCheck = new RegExp("<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>[㏑㏒]<\/mi>");
  var commonLogCheck = new RegExp("<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>");
  var naturalLogCheck = new RegExp("<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><mrow>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>(?!<msub>|<msubsup>)|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><\/msub>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><mrow>|<mi>㏒<\/mi>(?!<msub>|<msubsup>)|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>㏑<\/mi>");

  var sinCheck = new RegExp("<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>");
  var cosCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>");
  var tanCheck = new RegExp("<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>");
  var cotCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>");
  var secCheck = new RegExp("<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>");
  var cosecCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>");

  var arcsinCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arccosCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arctanCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arccotCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arcsecCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arccosecCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");

  var sinhCheck = new RegExp("<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>");
  var coshCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>");
  var tanhCheck = new RegExp("<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>");
  var cothCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi><mi>h<\/mi>");
  var sechCheck = new RegExp("<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>");
  var cosechCheck = new RegExp("<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi><mi>h<\/mi>");

  var arsinhCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arcoshCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var artanhCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi>|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arcothCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arsechCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");
  var arcosechCheck = new RegExp("<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>");

  var factorialCheck = new RegExp("<mi>!<\/mi>");
  var limitCheck = new RegExp("<mi>l<\/mi><mi>i<\/mi><mi>m<\/mi>");
  var permutationCheck = new RegExp("<\/msub><mi>P<\/mi><msub>");
  var combinationCheck = new RegExp("<\/msub><mi>C<\/mi><msub>");

  //171207追加
  var logicalAndCheck = new RegExp("<mi>∧<\/mi>");
  var logicalOrCheck = new RegExp("<mi>∨<\/mi>");
  var argCheck = new RegExp("<mi>a<\/mi><mi>r<\/mi><mi>g<\/mi>");

  var mtrCheck = new RegExp("<mtr>","g");
  var mtdCheck = new RegExp("<mtd>","g");
  var mtdGet = new RegExp("<mtd>.*?<\/mtd>","g");
  var mtrGet = new RegExp("<mtr>.*?<\/mtr>","g");

  var inverseMatrixCheck = new RegExp("<mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi><msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>","g");
  var transposedMatrixCheck = new RegExp("<mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi><msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup>|<msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup><mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi>","g");

  //var doubleRootCheck = new RegExp("<msqrt><mrow><mi>.*?<\/mi><msqrt><mrow><mi>.*?<\/mi><\/mrow><\/msqrt><\/mrow><\/msqrt>|<msqrt><mrow><msqrt><mrow><mi>.*?<\/mi><\/mrow><\/msqrt><mi>.*?<\/mi><\/mrow><\/msqrt>","g");
  //var doubleRootCheck_test = new RegExp("<msqrt><mrow>.*?<msqrt><mrow>.*?<\/mrow><\/msqrt><\/mrow><\/msqrt>|<msqrt><mrow><msqrt><mrow>.*?<\/mrow><\/msqrt>.*?<\/mrow><\/msqrt>","g");

  //\\sqrt{((.)+)\\+((.)+)\\+2\\sqrt{\\1([×⋅])?\\3}}=\\sqrt{\\1}\+\\sqrt{\\3}
  
  var bibunCheck = new RegExp("<mfrac><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>d<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>d<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><mi>.*?<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><mi>.*?<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><\/mrow><\/mfrac>","g");
  // dy/dx関連 d2y/dx2などにも対応

  var bibunCheck_a = new RegExp("<mi>.<\/mi><mi>′<\/mi><mi>\\(<\/mi>.*?<mi>\\)<\/mi>","g");
  // なにか ' 色々続く物 に引っかかるので、なにか ' ' (いわゆる二回微分)にも対応
 

  var futougouCheck = new RegExp("<mi>≥<\/mi>|<mi>≤<\/mi>|<mi>&gt;<\/mi>|<mi>&lt;<\/mi>","g");
  // &gt; は "<", &lt; は ">" 。イコールなしの不等号も正しく検索できた。
  
  var nijiCheck = new RegExp("<msup><mrow><\/mrow><mrow><mi>2<\/mi><\/mrow><\/msup>","g"); /* これだと、分母に2乗がある場合などを、まだ見抜けない */

  var zettaichiCheck = new RegExp("<mi>\\❘<\/mi>.*?<mi>\\❘<\/mi>","g"); /* 絶対値記号である縦棒は、二重エスケープで上手くいった */
  var vectorSizeCheck = new RegExp("<mi>\\❘<\/mi><mover>.*?<\/mover><mi>\\❘<\/mi>","g"); /* 絶対値記号である縦棒は、二重エスケープで上手くいった */
  var vectorCheck = new RegExp("<mover><mrow>.*?<\/mrow><mrow><mi>\→<\/mi><\/mrow><\/mover>","g");

  // 先輩が上で設定している通り、miタグのl, i, mだけでいいのかもしれない
  // var limitCheck = new RegExp("<munder><mrow><mi>l<\/mi><mi>i<\/mi><mi>m<\/mi><\/mrow><mrow>.*?<\/mrow><\/munder>", "g");


  var mathChange = new RegExp("<math xmlns=\"http://www.w3.org/1998/Math/MathML\">"); /* ここ弄ると、抽出結果画面が死ぬ */
  var mrowChange = new RegExp("<mrow xmlns=\"http://www.w3.org/1998/Math/MathML\">");

  var treeDepth = 0;
  var mtableDepth = 0;
  var treeStack = new Array();
  var mtableStack = new Array();
  var matricsNum = 0;
  var outerMatricsNum = 0;
  var munderoverCount = 0;
  var equationFlag=0;

  var futougouFlag=0;
  



  var regStr;
  var outputStr;

  var matrics = new Array();
  var outerMatrics = new Array();
  var mtds = new Array();
  var mtrs;
  var rows,columns;
  var i,j,k= 0;
  var diagonalFlag=0;
  var scalarFlag=0;
  var identityFlag=0;
  var zeroFlag=0;
  var symmetricFlag=0;
  var upperTriangularFlag=0;
  var lowerTriangularFlag=0;

  var integralStr = "";
  var rootStr = "";
  var logarithmStr = "";
  var commonLogStr = "";
  var naturalLogStr = "";
  var sinStr = "";
  var cosStr = "";
  var tanStr = "";
  var cotStr = "";
  var secStr = "";
  var cosecStr = "";
  var arcsinStr = "";
  var arccosStr = "";
  var arctanStr = "";
  var arccotStr = "";
  var arcsecStr = "";
  var arccosecStr = "";
  var sinhStr = "";
  var coshStr = "";
  var tanhStr = "";
  var cothStr = "";
  var sechStr = "";
  var cosechStr = "";
  var arsinhStr = "";
  var arcoshStr = "";
  var artanhStr = "";
  var arcothStr = "";
  var arsechStr = "";
  var arcosechStr = "";
  var factorialStr = "";
  var limitStr = "";
  var permutationStr = "";
  var combinationStr = "";

  var matrixStr = "";
  var squareMatrixStr = "";
  var diagonalMatrixStr = "";
  var scalarMatrixStr = "";
  var identityMatrixStr = "";
  var rowVectorStr = "";
  var columnVectorStr = "";
  var zeroMatrixStr = "";
  var inverseMatrixStr = "";
  var transposedMatrixStr = "";
  var symmetricMatrixStr = "";
  var triangularMatrixStr = "";
  var upperTriangularMatrixStr = "";
  var lowerTriangularMatrixStr = "";
  var alternativeMatrixStr = "";
  var orthogonalMatrixStr = "";

  var matrixEquationStr = "";
  var matrixFutougouStr = "";

  var bibunCheckStr = "";
  var bibunCheckStr_a = "";
  var equalCheckStr = "";

  var nijiCheckStr = "";
  var futougouCheckStr = "";

  var zettaichiCheckStr = "";
  var vectorSizeCheckStr = "";
  var vectorCheckStr = "";

  //171207追加
  var logicalAndCheckStr = "";
  var logicalOrCheckStr = "";
  var argCheckStr = "";

  //var doubleRootStr = "";
  //var doubleRootStr_test = "";

  str = str.replace(mathChange,"<math>");
  str = str.replace(mrowChange,"<mrow>");



  //if(str.search(integralCheck) != -1) integralStr = "積分 ";
  if(str.search(rootCheck) != -1) rootStr = "累乗根 ";
  if(str.search(logarithmCheck) != -1) logarithmStr = "対数 ";
  if(str.search(commonLogCheck) != -1) commonLogStr = "常用対数 ";
  if(str.search(naturalLogCheck) != -1) naturalLogStr = "自然対数 ";
  
  regStr = str; //三角関数、双曲線関数はとりあえず全部出す
  if(str.search(sinhCheck) != -1) sinhStr = "双曲線正弦 ";
  if(str.search(arsinhCheck) != -1) arcsinhStr = "逆双曲線正弦 ";
  if(str.search(cosechCheck) != -1) cosechStr = "双曲線余割 ";
  if(str.search(arcosechCheck) != -1) arcosechStr = "逆双曲線余割 ";
//  regStr = str.replace(arcosechCheck,"");
//  regStr = regStr.replace(cosechCheck,"");
//  regStr = regStr.replace(arsinhCheck,"");
//  regStr = regStr.replace(sinhCheck,"");
  if(regStr.search(coshCheck) != -1) coshStr = "双曲線余弦 ";
  if(regStr.search(arcoshCheck) != -1) arcoshStr = "逆双曲線余弦 ";
  if(regStr.search(sechCheck) != -1) sechStr = "双曲線正割 ";
  if(regStr.search(arsechCheck) != -1) arsechStr = "逆双曲線正割 ";
  if(str.search(cothCheck) != -1) cothStr = "双曲線余接 ";
  if(str.search(arcothCheck) != -1) arcothStr = "逆双曲線余接 ";
//  regStr = regStr.replace(arcoshCheck,"");
//  regStr = regStr.replace(coshCheck,"");
//  regStr = regStr.replace(arsechCheck,"");
//  regStr = regStr.replace(sechCheck,"");
//  regStr = regStr.replace(arcothCheck,"");
//  regStr = regStr.replace(cothCheck,"");
  if(regStr.search(tanhCheck) != -1) tanhStr = "双曲線正接 ";
  if(regStr.search(artanhCheck) != -1) artanhStr = "逆双曲線正接 ";
//  regStr = regStr.replace(artanhCheck,"");
//  regStr = regStr.replace(tanhCheck,"");

  if(regStr.search(sinCheck) != -1) sinStr = "正弦 ";
  if(regStr.search(arcsinCheck) != -1) arcsinStr = "逆正弦 ";
  if(regStr.search(cosecCheck) != -1) cosecStr = "余割 ";
  if(regStr.search(arccosecCheck) != -1) arccosecStr = "逆余割 ";
//  regStr = regStr.replace(arccosecCheck,"");
//  regStr = regStr.replace(cosecCheck,"");
  if(regStr.search(cosCheck) != -1) cosStr = "余弦 ";
  if(regStr.search(arccosCheck) != -1) arccosStr = "逆余弦 ";
  if(regStr.search(secCheck) != -1) secStr = "正割 ";
  if(regStr.search(arcsecCheck) != -1) arcsecStr = "逆正割 ";
  if(regStr.search(cotCheck) != -1) cotStr = "余接 ";
  if(regStr.search(arccotCheck) != -1) arccotStr = "逆余接 ";
//  regStr = regStr.replace(arccotCheck,"");
//  regStr = regStr.replace(cotCheck,"");
  if(regStr.search(tanCheck) != -1) tanStr = "正接 ";
  if(regStr.search(arctanCheck) != -1) arctanStr = "逆正接 ";
  
  //if(str.search(factorialCheck) != -1) factorialStr = "階乗 ";
  if(str.search(limitCheck) != -1) limitStr = "極限 ";
  //if(str.search(permutationCheck) != -1) permutationStr = "順列 ";
  //if(str.search(combinationCheck) != -1) combinationStr = "組合せ ";

  if(str.search(inverseMatrixCheck) != -1) inverseMatrixStr = "逆行列 ";
  if(str.search(transposedMatrixCheck) != -1) transposedMatrixStr = "転置行列 ";

  //if(str.search(doubleRootCheck) != -1) doubleRootStr = "多重根号 ";
  //if(str.search(doubleRootStr_test) != -1) doubleRootStr_test = "たじゅうこんごう ";

  if(str.search(zettaichiCheck) != -1) {
    zettaichiCheckStr = "絶対値 ";
    if(str.search(vectorSizeCheck) != -1) {
      zettaichiCheckStr = "";
      vectorSizeCheckStr = "ベクトルの大きさ ";
    }
  }
  if(str.search(vectorCheck) != -1) {
    vectorCheckStr = "ベクトル ";
  }
 

  if(str.search(bibunCheck) != -1)  { 
    //console.log("びぶんあった"); 
    bibunCheckStr = "微分 ";
  }

  if(str.search(bibunCheck_a) != -1)  { 
    //console.log("びぶんあった"); 
    bibunCheckStr_a = "微分aaa ";
  }



  if(str.search(futougouCheck) != -1) {
    futougouCheckStr = "不等式 ";
  }
  //171207追加
  if(str.search(logicalAndCheck) != -1) logicalAndCheckStr = "論理積 ";
  if(str.search(logicalOrCheck) != -1) logicalOrCheckStr = "論理積 ";
  //if(str.search(argCheck) != -1) argCheckStr = "複素数の偏角 ";


  i = 0;

  // substr(開始位置, 長さ) => 抜き取った文字列
  // 配列を使って、現在どのタグの中にいるかを、インデックスナンバーを使って把握できる。
  // 配列が空っぽになってたら、数式は正しく</math>で閉じられてる、みたいな
  // 
  while(i<str.length){
    //console.log(str.length);
    //console.log(str.substr(i,65));
  	if(str.substr(i,18) == "<mi>(<\/mi><mtable>" || str.substr(i,18) == "<mi>[<\/mi><mtable>"){
  			mtableStack[mtableDepth] = i;
  			mtableDepth++;
        //console.log(mtableStack);
  	}else if(str.substr(i,19) == "<\/mtable><mi>)<\/mi>" || str.substr(i,19) == "<\/mtable><mi>]<\/mi>"){
  			mtableDepth--;
  			//mtable要素を中身ごと配列へ格納する操作を追加予定
  			matrics[matricsNum] = str.substring(mtableStack[mtableDepth],i+19)
  			if(mtableDepth==0) outerMatrics[outerMatricsNum++] = matrics[matricsNum]
  			matricsNum++;
  	}
  	if(str.substr(i,4) == "<mi>"){
  		treeStack[treeDepth] = str.substr(i,4);
  		treeDepth++;
  		i=i+4;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,5) == "<mtr>" || str.substr(i,5) == "<mtd>"){
  		treeStack[treeDepth] = str.substr(i,5);
  		treeDepth++;
  		i=i+5;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,6) == "<mrow>" || str.substr(i,6) == "<math>" || str.substr(i,6) == "<msub>" || str.substr(i,6) == "<msup>"){
      treeStack[treeDepth] = str.substr(i,6);
      
  		if(treeStack[treeDepth] == "<mrow>" && (treeStack[treeDepth-1] == "<munder>" || treeStack[treeDepth-1] == "<mover>" || treeStack[treeDepth-1] == "<munderover>")) munderoverCount++;
      if(str.substr(i, 49) == "<msup><mrow><\/mrow><mrow><mi>2<\/mi><\/mrow><\/msup>" && treeStack[treeDepth-1] == "<mrow>" && treeStack[treeDepth-2] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") {
        //console.log("二乗が来て、かつこれはmfrac要素の中やmunder要素の中に入っていません。");
        var msupFlag = 1;
        nijiCheckStr = "二次式 ";
      }
  		treeDepth++;
  		i=i+6;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,7) == "<mfrac>" || str.substr(i,7) == "<mover>" || str.substr(i,7) == "<mroot>" || str.substr(i,7) == "<msqrt>"){
  		treeStack[treeDepth] = str.substr(i,7);
  		treeDepth++;
  		i=i+7;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,8) == "<munder>" || str.substr(i,8) == "<mtable>"){
  		treeStack[treeDepth] = str.substr(i,8);
  		treeDepth++;
  		i=i+8;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,9) == "<msubsup>"){
  		treeStack[treeDepth] = str.substr(i,9);
  		treeDepth++;
  		i=i+9;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,12) == "<munderover>"){
  		treeStack[treeDepth] = str.substr(i,12);
  		treeDepth++;
  		i=i+12;
      //console.log(treeStack[treeDepth]);
  	}else if(str.substr(i,5) == "<\/mi>"){
  		treeDepth--;
  		i=i+5;
  	}else if(str.substr(i,6) == "<\/mtr>" || str.substr(i,6) == "<\/mtd>"){
  		treeDepth--;
  		i=i+6;
  	}else if(str.substr(i,7) == "<\/mrow>" || str.substr(i,7) == "<\/math>" || str.substr(i,7) == "<\/msub>" || str.substr(i,7) == "<\/msup>"){
  		treeDepth--;
  		i=i+7;
  	}else if(str.substr(i,8) == "<\/mfrac>" || str.substr(i,8) == "<\/mover>" || str.substr(i,8) == "<\/mroot>" || str.substr(i,8) == "<\/msqrt>"){
  		treeDepth--;
  		if(treeStack[treeDepth] == "<mover>") munderoverCount = munderoverCount-2;
  		i=i+8;
  	}else if(str.substr(i,9) == "<\/munder>" || str.substr(i,9) == "<\/mtable>"){
  		if(treeStack[treeDepth] == "<munder>") munderoverCount = munderoverCount-2;
  		treeDepth--;
  		i=i+9;
  	}else if(str.substr(i,10) == "<\/msubsup>"){
  		treeDepth--;
  		i=i+10;
  	}else if(str.substr(i,13) == "<\/munderover>"){
  		munderoverCount = munderoverCount-3;
  		treeDepth--;
  		i=i+13;
    }else if(str.substr(i,65) == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">"){
      treeStack[treeDepth] = str.substr(i,65);
      treeDepth++;
      i=i+65;
      //console.log("mathタグきたよ");
  	}else if(str.charAt(i) == "="){
      //console.log(str);
      //console.log(str.charAt(i-1));
      //console.log(str.charAt(i-2));
      //console.log(str.charAt(i-3));

      //console.log(treeDepth);
      
      
      var number = 0;
      while(number < treeDepth) {
        //console.log(treeStack[number]);
        number++;
      }
      
      
  		if(treeStack[treeDepth-3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") { 
        //console.log("equationFlag = 1");
        equationFlag = 1;
  		} else if(treeStack[treeDepth-5] == "<math>" && (treeStack[treeDepth-3] == "<munder>" || treeStack[treeDepth-3] == "<mover>" || treeStack[treeDepth-3] == "<munderover>") && munderoverCount == 1) {
        //console.log("equationFlag=1");
        equationFlag = 1;
      }
  		i++;
    }else if(str.charAt(i) == "≥" || str.charAt(i) == "≤" || str.substr(i,4) == "&gt;" || str.substr(i,4) == "&lt;" ){
      //console.log(str);
      //console.log(str.charAt(i-1));
      //console.log(str.charAt(i-2));
      //console.log(str.charAt(i-3));

      //console.log(treeDepth);
      
      
      var number = 0;
      while(number < treeDepth) {
        //console.log(treeStack[number]);
        number++;
      }
      // var futougouCheck = new RegExp("<mi>≥<\/mi>|<mi>≤<\/mi>|<mi>&gt;<\/mi>|<mi>&lt;<\/mi>","g");
      
      if(treeStack[treeDepth-3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") { 
        //console.log("futougouFlag = 1");
        futougouFlag = 1;
      } else if(treeStack[treeDepth-5] == "<math>" && (treeStack[treeDepth-3] == "<munder>" || treeStack[treeDepth-3] == "<mover>" || treeStack[treeDepth-3] == "<munderover>") && munderoverCount == 1) {
        //console.log("futougouFlag=1");
        futougouFlag = 1;
      }
      i++;
  	}else i++;
  }

  if(equationFlag == 1) {
    equalCheckStr = "方程式 ";
    if(str.search(bibunCheck) != -1) {  
      bibunCheckStr = "微分 方程式 微分方程式 ";
      equalCheckStr = "";
    }
    if(msupFlag == 1) {
      nijiCheckStr = "二次式 方程式 二次方程式 ";
      equalCheckStr = "";
      if(str.search(bibunCheck) != -1) {  
        nijiCheckStr = "";
        equalCheckStr = "";
        bibunCheckStr = "微分 方程式 微分方程式 二次式 二次方程式 ";
      }
    }

  }

  if(futougouFlag == 1) {
    if(str.search(bibunCheck) != -1) {
      bibunCheckStr = "微分 不等式 微分不等式 ";
      futougouCheckStr = "";
    }
    if(msupFlag == 1) {
      nijiCheckStr = "二次式 不等式 二次不等式 ";
      futougouCheckStr = "";
    }
  }

  if(matricsNum > 0){
    matrixStr = "行列 ";
    if(equationFlag == 1) {
      matrixEquationStr = "方程式 行列方程式 ";
      equalCheckStr = "";
    }
    if(futougouFlag == 1) {
      matrixFutougouStr = "不等式 行列不等式 ";
      equalCheckStr = "";
    }
    j=0;
    while(matrics[j]){
      mtrs = matrics[j].match(mtrGet);
      rows = mtrs.length;
      for(i=0; i<rows; i++){
      	mtds[i] = mtrs[i].match(mtdGet);
      }
      columns = mtds[0].length;

      i=0;
      if(mtds != null){
        diagonalFlag=1;
        scalarFlag=1;
        identityFlag=1;
        zeroFlag=1;
        symmetricFlag=1;
        upperTriangularFlag=1;
        lowerTriangularFlag=1;
        if(rows == columns) squareMatrixStr = "正方行列 ";

        for(i=0;i<rows;i++){
        	for(k=0;k<columns;k++){
        		if(mtds[i][k] != "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") zeroFlag = 0;
        		if(i==k){
        			if(mtds[i][k] != "<mtd><mrow><mi>1<\/mi><\/mrow><\/mtd>") identityFlag = 0;
        			if(i!=0 && mtds[i][k] != regStr) scalarFlag = 0;
        			regStr = mtds[i][k];
		        }else{
			        if(mtds[i][k] != "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>"){
				        diagonalFlag = 0;
        				scalarFlag = 0;
        				identityFlag = 0;
			        }
        		}
        		if(rows == columns){
        			if(mtds[i][k] != mtds[k][i]) symmetricFlag = 0;
        		}
        		if(i<k && mtds[i][k] != "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") lowerTriangularFlag = 0;
        		if(i>k && mtds[i][k] != "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") upperTriangularFlag = 0;
        	}
        }

        if(diagonalFlag == 1 && rows == columns) diagonalMatrixStr = "対角行列 ";
        if(scalarFlag == 1 && rows == columns) scalarMatrixStr = "スカラー行列 ";
        if(identityFlag == 1 && rows == columns) identityMatrixStr = "単位行列 ";
        if(zeroFlag == 1) zeroMatrixStr = "零行列 ";
        if(symmetricFlag == 1 && rows == columns) symmetricMatrixStr = "対称行列 ";
        if(upperTriangularFlag == 1 && rows == columns) upperTriangularMatrixStr = "上三角行列 ";
        if(lowerTriangularFlag == 1 && rows == columns) lowerTriangularMatrixStr = "下三角行列 ";
        if((upperTriangularFlag == 1 || lowerTriangularFlag == 1) && rows == columns) triangularMatrixStr = "三角行列 ";
      }
      j++;
    }
  }
  if(matrics.length == 2 && matrics[0] == matrics[1]){
    regStr = "<math><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[0] + "<mi>=<\/mi><mi>-<\/mi>" + matrics[1] + "<\/mrow><\/math>";
    if(str == regStr) alternativeMatrixStr = "交代行列 ";
    regStr = "<math><mrow>"+ matrics[0] +"<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><mi>=<\/mi><mi>-<\/mi>"+ matrics[1] + "<\/mrow><\/math>";
    if(str == regStr) alternativeMatrixStr = "交代行列 ";
  }

  if(matrics.length == 2 && matrics[0] == matrics[1]){
    regStr = "<math><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[0] + "<mi>=<\/mi>" + matrics[1] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><\/math>";
    if(str == regStr) orthogonalMatrixStr = "直交行列 ";
    regStr = "<math><mrow>"+ matrics[0] +"<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><mi>=<\/mi>"+ matrics[1] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><\/math>";
    if(str == regStr) orthogonalMatrixStr = "直交行列 ";
    regStr = "<math>" + matrics[0] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><mi>=<\/mi><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[1] + "<\/math>";
    if(str == regStr) orthogonalMatrixStr = "直交行列 ";
    regStr = "<math>"+ matrics[0] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><mi>=<\/mi><mrow>"+ matrics[1] +"<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><\/math>";
    if(str == regStr) orthogonalMatrixStr = "直交行列 ";
  }

  outputStr = integralStr + rootStr + logarithmStr + commonLogStr + naturalLogStr + sinStr + cosStr + tanStr + cotStr + secStr + cosecStr + arcsinStr + arccosStr + arctanStr + arccotStr + arcsecStr + arccosecStr + sinhStr + coshStr + tanhStr + cothStr + sechStr + cosechStr + arsinhStr + arcoshStr + artanhStr + arcothStr + arsechStr + arcosechStr + factorialStr + limitStr + permutationStr + combinationStr + matrixStr + squareMatrixStr + diagonalMatrixStr + scalarMatrixStr + identityMatrixStr + rowVectorStr + columnVectorStr + zeroMatrixStr + inverseMatrixStr + transposedMatrixStr + symmetricMatrixStr + triangularMatrixStr + upperTriangularMatrixStr + lowerTriangularMatrixStr　+matrixEquationStr + matrixFutougouStr + orthogonalMatrixStr /* + doubleRootStr + doubleRootStr_test */ + bibunCheckStr + futougouCheckStr + nijiCheckStr + equalCheckStr + zettaichiCheckStr;

  text = "抽出した学習項目：" + bibunCheckStr_a + vectorSizeCheckStr + vectorCheckStr + logicalAndCheckStr + logicalOrCheckStr + argCheckStr + outputStr;
  return text;
}

module.exports = { expressionDistinction };
