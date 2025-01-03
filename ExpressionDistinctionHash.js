var expressionDistinction = function(n) {
  target = document.getElementById("output");
  var text;
  var str = n;

  // Define a hash map to store regular expressions and their corresponding descriptions
  const regexMap = {
    "<mi>∫<\/mi>|<mi>∬<\/mi>|<mi>∭<\/mi>": "積分 ",
    "<msqrt>|<mroot>": "累乗根 ",
    "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>[㏑㏒]<\/mi>": "対数 ",
    "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>": "常用対数 ",
    "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>(?!<msub>|<msubsup>)|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><\/msub>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>㏒<\/mi>(?!<msub>|<msubsup>)|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>㏑<\/mi>": "自然対数 ",
    "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>": "正弦 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>": "余弦 ",
    "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>": "正接 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>": "余接 ",
    "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>": "正割 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>": "余割 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正弦 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余弦 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正接 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余接 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正割 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余割 ",
    "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>": "双曲線正弦 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>": "双曲線余弦 ",
    "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>": "双曲線正接 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi><mi>h<\/mi>": "双曲線余接 ",
    "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>": "双曲線正割 ",
    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi><mi>h<\/mi>": "双曲線余割 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正弦 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余弦 ",
    "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi>|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正接 ",
    "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余接 ",
    "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正割 ",
    "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余割 ",
    "<mi>!<\/mi>": "階乗 ",
    "<mi>l<\/mi><mi>i<\/mi><mi>m<\/mi>": "極限 ",
    "<\/msub><mi>P<\/mi><msub>": "順列 ",
    "<\/msub><mi>C<\/mi><msub>": "組合せ ",
    "<mi>∧<\/mi>": "論理積 ",
    "<mi>∨<\/mi>": "論理和 ",
    "<mi>a<\/mi><mi>r<\/mi><mi>g<\/mi>": "複素数の偏角 ",
    "<mfrac><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>d<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>d<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><mi>.*?<\/mi><\/mrow><mrow><mi>d<\/mi><mi>.*?<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><\/mrow><\/mfrac>|<mfrac><mrow><mi>∂<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><mi>.*?<\/mi><\/mrow><mrow><mi>∂<\/mi><mi>.*?<\/mi><msup><mrow><\/mrow><mrow><mi>.*?<\/mi><\/mrow><\/msup><\/mrow><\/mfrac>": "微分 ",
    "<mi>.<\/mi><mi>′<\/mi><mi>\\(<\/mi>.*?<mi>\\)<\/mi>": "微分aaa ",
    "<mi>≥<\/mi>|<mi>≤<\/mi>|<mi>&gt;<\/mi>|<mi>&lt;<\/mi>": "不等式 ",
    "<msup><mrow><\/mrow><mrow><mi>2<\/mi><\/mrow><\/msup>": "二次式 ",
    "<mi>\\❘<\/mi>.*?<mi>\\❘<\/mi>": "絶対値 ",
    "<mi>\\❘<\/mi><mover>.*?<\/mover><mi>\\❘<\/mi>": "ベクトルの大きさ ",
    "<mover><mrow>.*?<\/mrow><mrow><mi>\→<\/mi><\/mrow><\/mover>": "ベクトル ",
    "<mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi><msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆行列 ",
    "<mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi><msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup>|<msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup><mi>[\\(\\[]<\/mi><mtable>.*?<\/mtable><mi>[\\)\\]]<\/mi>": "転置行列 "
  };

  // Initialize the output string
  let outputStr = "";

  // Iterate through the hash map and apply each regex to the input string
  for (const [regexStr, description] of Object.entries(regexMap)) {
    const regex = new RegExp(regexStr);
    if (str.search(regex) !== -1) {
      outputStr += description;
    }
  }

  // Continue with the remaining lines of the original code
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
  // Utility function to handle closing tags
function handleCloseTag(tag, length) {
  treeDepth--;
  i += length;
}

// Utility function to handle opening tags
function handleOpenTag(tag, length) {
  treeStack[treeDepth] = tag;
  treeDepth++;
  i += length;
}

// Main loop to analyze the string
while (i < str.length) {
  let substr = str.substr(i);
  if (substr.startsWith("<mi>(</mi><mtable>") || substr.startsWith("<mi>[</mi><mtable>")) {
    mtableStack[mtableDepth] = i;
    mtableDepth++;
    i += 18;
  } else if (substr.startsWith("</mtable><mi>)</mi>") || substr.startsWith("</mtable><mi>]</mi>")) {
    mtableDepth--;
    matrics[matricsNum] = str.substring(mtableStack[mtableDepth], i + 19);
    if (mtableDepth == 0) outerMatrics[outerMatricsNum++] = matrics[matricsNum];
    matricsNum++;
    i += 19;
  } else if (substr.startsWith("<mi>")) {
    handleOpenTag("<mi>", 4);
  } else if (substr.startsWith("<mtr>") || substr.startsWith("<mtd>")) {
    handleOpenTag(substr.substr(0, 5), 5);
  } else if (substr.startsWith("<mrow>") || substr.startsWith("<math>") || substr.startsWith("<msub>") || substr.startsWith("<msup>")) {
    handleOpenTag(substr.substr(0, 6), 6);
  } else if (substr.startsWith("<mfrac>") || substr.startsWith("<mover>") || substr.startsWith("<mroot>") || substr.startsWith("<msqrt>")) {
    handleOpenTag(substr.substr(0, 7), 7);
  } else if (substr.startsWith("<munder>") || substr.startsWith("<mtable>")) {
    handleOpenTag(substr.substr(0, 8), 8);
  } else if (substr.startsWith("<msubsup>")) {
    handleOpenTag("<msubsup>", 9);
  } else if (substr.startsWith("<munderover>")) {
    handleOpenTag("<munderover>", 12);
  } else if (substr.startsWith("</mi>")) {
    handleCloseTag("</mi>", 5);
  } else if (substr.startsWith("</mtr>") || substr.startsWith("</mtd>")) {
    handleCloseTag(substr.substr(0, 6), 6);
  } else if (substr.startsWith("</mrow>") || substr.startsWith("</math>") || substr.startsWith("</msub>") || substr.startsWith("</msup>")) {
    handleCloseTag(substr.substr(0, 7), 7);
  } else if (substr.startsWith("</mfrac>") || substr.startsWith("</mover>") || substr.startsWith("</mroot>") || substr.startsWith("</msqrt>")) {
    handleCloseTag(substr.substr(0, 8), 8);
    if (treeStack[treeDepth] == "<mover>") munderoverCount -= 2;
  } else if (substr.startsWith("</munder>") || substr.startsWith("</mtable>")) {
    handleCloseTag(substr.substr(0, 9), 9);
    if (treeStack[treeDepth] == "<munder>") munderoverCount -= 2;
  } else if (substr.startsWith("</msubsup>")) {
    handleCloseTag("</msubsup>", 10);
  } else if (substr.startsWith("</munderover>")) {
    handleCloseTag("</munderover>", 13);
    munderoverCount -= 3;
  } else if (substr.startsWith("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">")) {
    handleOpenTag("<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">", 65);
  } else if (substr.charAt(0) == "=") {
    if (treeStack[treeDepth - 3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") {
      equationFlag = 1;
    } else if (treeStack[treeDepth - 5] == "<math>" && 
               (treeStack[treeDepth - 3] == "<munder>" || treeStack[treeDepth - 3] == "<mover>" || treeStack[treeDepth - 3] == "<munderover>") && 
               munderoverCount == 1) {
      equationFlag = 1;
    }
    i++;
  } else if (substr.charAt(0) == "≥" || substr.charAt(0) == "≤" || substr.startsWith("&gt;") || substr.startsWith("&lt;")) {
    if (treeStack[treeDepth - 3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") {
      futougouFlag = 1;
    } else if (treeStack[treeDepth - 5] == "<math>" && 
               (treeStack[treeDepth - 3] == "<munder>" || treeStack[treeDepth - 3] == "<mover>" || treeStack[treeDepth - 3] == "<munderover>") && 
               munderoverCount == 1) {
      futougouFlag = 1;
    }
    i++;
  } else {
    i++;
  }
}
if (equationFlag === 1) {
  equalCheckStr = "方程式 ";
  if (str.search(bibunCheck) !== -1) {
    bibunCheckStr = "微分 方程式 微分方程式 ";
    equalCheckStr = "";
  }
  if (msupFlag === 1) {
    nijiCheckStr = "二次式 方程式 二次方程式 ";
    equalCheckStr = "";
    if (str.search(bibunCheck) !== -1) {
      nijiCheckStr = "";
      equalCheckStr = "";
      bibunCheckStr = "微分 方程式 微分方程式 二次式 二次方程式 ";
    }
  }
}

// Handle inequality flag
if (futougouFlag === 1) {
  if (str.search(bibunCheck) !== -1) {
    bibunCheckStr = "微分 不等式 微分不等式 ";
    futougouCheckStr = "";
  }
  if (msupFlag === 1) {
    nijiCheckStr = "二次式 不等式 二次不等式 ";
    futougouCheckStr = "";
  }
}

// Handle matrix-related flags and descriptions
if (matricsNum > 0) {
  matrixStr = "行列 ";
  if (equationFlag === 1) {
    matrixEquationStr = "方程式 行列方程式 ";
    equalCheckStr = "";
  }
  if (futougouFlag === 1) {
    matrixFutougouStr = "不等式 行列不等式 ";
    futougouCheckStr = "";
  }
  j = 0;
  while (matrics[j]) {
    mtrs = matrics[j].match(mtrGet);
    rows = mtrs.length;
    for (i = 0; i < rows; i++) {
      mtds[i] = mtrs[i].match(mtdGet);
    }
    columns = mtds[0].length;

    if (mtds !== null) {
      diagonalFlag = 1;
      scalarFlag = 1;
      identityFlag = 1;
      zeroFlag = 1;
      symmetricFlag = 1;
      upperTriangularFlag = 1;
      lowerTriangularFlag = 1;
      if (rows === columns) squareMatrixStr = "正方行列 ";

      for (i = 0; i < rows; i++) {
        for (k = 0; k < columns; k++) {
          if (mtds[i][k] !== "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") zeroFlag = 0;
          if (i === k) {
            if (mtds[i][k] !== "<mtd><mrow><mi>1<\/mi><\/mrow><\/mtd>") identityFlag = 0;
            if (i !== 0 && mtds[i][k] !== regStr) scalarFlag = 0;
            regStr = mtds[i][k];
          } else {
            if (mtds[i][k] !== "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") {
              diagonalFlag = 0;
              scalarFlag = 0;
              identityFlag = 0;
            }
          }
          if (rows === columns) {
            if (mtds[i][k] !== mtds[k][i]) symmetricFlag = 0;
          }
          if (i < k && mtds[i][k] !== "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") lowerTriangularFlag = 0;
          if (i > k && mtds[i][k] !== "<mtd><mrow><mi>0<\/mi><\/mrow><\/mtd>") upperTriangularFlag = 0;
        }
      }

      if (diagonalFlag === 1 && rows === columns) diagonalMatrixStr = "対角行列 ";
      if (scalarFlag === 1 && rows === columns) scalarMatrixStr = "スカラー行列 ";
      if (identityFlag === 1 && rows === columns) identityMatrixStr = "単位行列 ";
      if (zeroFlag === 1) zeroMatrixStr = "零行列 ";
      if (symmetricFlag === 1 && rows === columns) symmetricMatrixStr = "対称行列 ";
      if (upperTriangularFlag === 1 && rows === columns) upperTriangularMatrixStr = "上三角行列 ";
      if (lowerTriangularFlag === 1 && rows === columns) lowerTriangularMatrixStr = "下三角行列 ";
      if ((upperTriangularFlag === 1 || lowerTriangularFlag === 1) && rows === columns) triangularMatrixStr = "三角行列 ";
    }
    j++;
  }
}

// Additional checks for special matrices
if (matrics.length === 2 && matrics[0] === matrics[1]) {
  regStr = "<math><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[0] + "<mi>=<\/mi><mi>-<\/mi>" + matrics[1] + "<\/mrow><\/math>";
  if (str === regStr) alternativeMatrixStr = "交代行列 ";
  regStr = "<math><mrow>" + matrics[0] + "<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><mi>=<\/mi><mi>-<\/mi>" + matrics[1] + "<\/mrow><\/math>";
  if (str === regStr) alternativeMatrixStr = "交代行列 ";
}

if (matrics.length === 2 && matrics[0] === matrics[1]) {
  regStr = "<math><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[0] + "<mi>=<\/mi>" + matrics[1] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><\/math>";
  if (str === regStr) orthogonalMatrixStr = "直交行列 ";
  regStr = "<math><mrow>" + matrics[0] + "<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><mi>=<\/mi>" + matrics[1] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><\/math>";
  if (str === regStr) orthogonalMatrixStr = "直交行列 ";
  regStr = "<math>" + matrics[0] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><mi>=<\/mi><mrow><msup><mrow><\/mrow><mrow><mi>t<\/mi><\/mrow><\/msup>" + matrics[1] + "<\/math>";
  if (str === regStr) orthogonalMatrixStr = "直交行列 ";
  regStr = "<math>" + matrics[0] + "<msup><mrow><\/mrow><mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup><\/mrow><mi>=<\/mi><mrow>" + matrics[1] + "<msup><mrow><\/mrow><mrow><mi>T<\/mi><\/mrow><\/msup><\/math>";
  if (str === regStr) orthogonalMatrixStr = "直交行列 ";
}

// Final result compilation
outputStr = [
  integralStr, rootStr, logarithmStr, commonLogStr, naturalLogStr,
  sinStr, cosStr, tanStr, cotStr, secStr, cosecStr,
  arcsinStr, arccosStr, arctanStr, arccotStr, arcsecStr, arccosecStr,
  sinhStr, coshStr, tanhStr, cothStr, sechStr, cosechStr,
  arsinhStr, arcoshStr, artanhStr, arcothStr, arsechStr, arcosechStr,
  factorialStr, limitStr, permutationStr, combinationStr,
  matrixStr, squareMatrixStr, diagonalMatrixStr, scalarMatrixStr,
  identityMatrixStr, rowVectorStr, columnVectorStr, zeroMatrixStr,
  inverseMatrixStr, transposedMatrixStr, symmetricMatrixStr,
  triangularMatrixStr, upperTriangularMatrixStr, lowerTriangularMatrixStr,
  matrixEquationStr, matrixFutougouStr, orthogonalMatrixStr,
  bibunCheckStr, futougouCheckStr, nijiCheckStr, equalCheckStr, zettaichiCheckStr
].join(' ');

text = "抽出した学習項目：" + [
  bibunCheckStr_a, vectorSizeCheckStr, vectorCheckStr,
  logicalAndCheckStr, logicalOrCheckStr, argCheckStr, outputStr
].join(' ');

return text;
