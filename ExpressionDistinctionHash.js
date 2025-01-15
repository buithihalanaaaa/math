var expressionDistinctionHash = function(n) {
  var target = document.getElementById("output");
  var text;
  var str = n;

  // Define a hash map to store regular expressions and their corresponding descriptions
  const regexMap = {
    //直線
    linearEquations:{
      generalForm:{
        pattern: "<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>\s*<mo>\s*[+\-]\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>y<\/mi>\s*<mo>\s*[+\-]\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi><mo>\s*=\s*<\/mo>\s*<mn>0</mn>",
// Description: This file contains the code to distinguish between different types of mathematical expressions.
        description:"直線(一般形 ax + by + c= 0)"
      },
      slopeInterceptForm:{
        pattern: "<mi>y<\/mi>\s*<mo>\s*=\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>\s*<mo>\s*[+\-]\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>|<mi>y<\/mi>\s*<mo>\s*=\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>",
        description:"直線(傾き切片形式 y = mx + c|y=mx )"
      },
      underslopeInterceptForm:{
        pattern: "<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>\s*<mo>\s*=\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>y<\/mi>",
        description:"直線(傾き切逆型cx = my)"
      },
      y_slopeInterceptForm:{
        pattern: "<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>\s*<mo>\s*=\s*<\/mo>\s*<mi>y<\/mi>",
        description:"直線(y傾き切型cx = y)"

      },
      x_slopeInterceptForm:{
        pattern: "<mi>x<\/mi>\s*<mo>\s*=\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>y<\/mi>\s*<mo>",
        description:"直線(x傾き切型x = cy)"
      },
    },
     //円
    circle:{
      //    "<mrow>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>|<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>[+-]<\/mo>\s*<mn>2<\/mn>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mn>2<\/mn>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mi>y<\/mi>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\-<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<mn>0<\/mn>|<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>\-<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>y<\/mi>\s*<mo>\-<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>": "円形 ",
      standardForm: {
        pattern: "<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>",
        description: "円形の標準形式: x² + y² = r²"
      },
      generalForm: {
        pattern: "<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>[+-]<\/mo>\s*<mn>2<\/mn>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mn>2<\/mn>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mi>y<\/mi>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\-<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<mn>0<\/mn>",
        description: "円形の一般形式: x² + y² + 2gx + 2fy + c = 0"
      },
      centerRadiusForm: {
        pattern: "<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>\-<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\+<\/mo>\s*<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>y<\/mi>\s*<mo>\-<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>=<\/mo>\s*<msup>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mn>2<\/mn>\s*<\/msup>",
        description: "円形の中心半径形式: (x - h)² + (y - k)² = r²"
      },
    },
    //放物線
    parabola:{
      //標準型放物線
      standardForm: {
        pattern: "<mrow>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<\/mrow>",
        description: "標準形式: y = (x ± a)(x ± b)の放物線"
      },
      //頂点形式放物線
      vertexForm: {
        pattern: "<mrow>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mrow>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>[+-]<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<\/mrow>",
        description: "頂点形式: y = ax² + qの放物線"
      },
      //切片形式:y = a(x ± p)²| y = a(x ± p)² + q
      vertexForm2: {
        pattern: "<mrow>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>|<mrow>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mrow>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>[+]\s*<\/mo>\s*<mrow>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<mi>x<\/mi>\s*<\/mrow>\s*<mo>[+]\s*<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<\/mrow>\s*<mo>[+-]<\/mo>\s*<mi>([a-zA-Z]|\d+(\.\d+)?)<\/mi>\s*<\?row>",
        description: "切片形式:y = a(x ± p)²| y = a(x ± p)² + qの放物線"
      },
      //標準形式: y² = ax| y=x² - bx + c | ay = x²
      standardForm2: {
        pattern: "<mrow><msup><mi>y</mi><mn>2</mn><mo>=</mo><mrow><mi>([a-zA-Z]|\d+(\.\d+)?)</mi><mi>x</mi></mrow>|<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mo>\s*[+\-]\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>\s*<mi>x<\/mi>\s*<mo>\s*[+\-]\s*<\/mo>\s*<mi>\s*([a-zA-Z]|\d+(\.\d+)?)\s*<\/mi>|<mrow><mi>([a-zA-Z]|\d+(\.\d+)?)</mi><mi>y</mi><mo>=</mo<msup></msup><mi>x</mi><mn>2</mn></mrow>",
        description: "標準形式: y² = ax| y=x² + bx + c | ay = x²の放物線"
      },
      //頂点形式: y = ax²
      vertexForm3: {
        pattern: "<mrow><mi>y</mi><mo>=</mo><mrow><mi>([a-zA-Z]|\d+(\.\d+)?)</mi><msup><mi>x</mi><mn>2</mn></msup></mrow></mrow>",
        description: "頂点形式: y = ax²の放物線"
      },
    },
    //対数方程式
    logarithmicEquations:{
      //自然対数関数
      naturalLogarithm:{
        //"<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>(?!<msub>|<msubsup>)|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><\/msub>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>㏒<\/mi>(?!<msub>|<msubsup>)|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>㏑<\/mi>"
        pattern: "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>(?!<msub>|<msubsup>)|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><\/msub>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>[e℮ℯ]<\/mrow><mrow>|<mi>㏒<\/mi>(?!<msub>|<msubsup>)|<mi>[lL]<\/mi><mi>n<\/mi>|<mi>㏑<\/mi>",
        description: "自然対数関数"
      },
      //常用対数関数
      commonLogarithm:{
        //    "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>": "常用対数 ",
        pattern: "<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>[lL]<\/mi><mi>o<\/mi><mi>g<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>|<mi>㏒<\/mi><msub><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><\/msub>|<mi>㏒<\/mi><msubsup><mrow><\/mrow><mrow><mi>1<\/mi><mi>0<\/mi><\/mrow><mrow>",
        description: "常用対数関数"
      },
      //減少対数関数
      otherLogarithm1:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>log<\/mi>\s*<msub><mrow><\/mrow><mrow><mi>a<\/mi><\/mrow><\/msub>\s*<mi>x<\/mi>,\s*条件:\s*<mi>a<\/mi>\s*<mo>≠<\/mo>\s*<mn>1<\/mn>,\s*<mi>x<\/mi>\s*<mo>><\/mo>\s*<mn>0<\/mn>,\s*<mn>0<\/mn>\s*<mo><<\/mo>\s*<mi>a<\/mi>\s*<mo><<\/mo>\s*<mn>1<\/mn></mn>",
        description: "減少対数関数"
      },
      //増加対数方程式 a≠1, x>0, a>1
      otherLogarithm2:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>log<\/mi>\s*<msub><mrow><\/mrow><mrow><mi>a<\/mi><\/mrow><\/msub>\s*<mi>x<\/mi>,\s*条件:\s*<mi>a<\/mi>\s*<mo>≠<\/mo>\s*<mn>1<\/mn>,\s*<mi>x<\/mi>\s*<mo>><\/mo>\s*<mn>0<\/mn>,\s*<mi>a<\/mi>\s*<mo>><<\/mo>\s*<mn>1<\/mn>",
        description: "増加対数関数"
      },
    },

    //指数関数  
    exponentialFunction:{
      //自然指数関数
      naturalExponential:{
        pattern: "<mi>[e℮ℯ]<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi><mi>x<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi><mi>x<\/mi><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>",
        description: "自然指数関数"
      },
      //aを底とする指数関数でa≠1, 1>a>0
      otherExponential1:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<msup><mi>a<\/mi>\s*<mi>x<\/mi>\s*<\/msup>,\s*条件:\s*<mi>a<\/mi>\s*<mo>≠<\/mo>\s*<mn>1<\/mn>,\s*<mn>1<\/mn>\s*<mo>></mo>\s*<mi>a<\/mi>\s*<mo>></mo>\s*<mn>0<\/mn>",
        description: "aを底とする指数関数でa≠1, 1>a>0"
      },
      //aを底とする指数関数でa≠1, a>1
      otherExponential2:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<msup><mi>a<\/mi>\s*<mi>x<\/mi>\s*<\/msup>,\s*条件:\s*<mi>a<\/mi>\s*<mo>≠<\/mo>\s*<mn>1<\/mn>,\s*<mi>a<\/mi>\s*<mo>></mo>\s*<mn>1<\/mn>",
        description: "aを底とする指数関数でa≠1, a>1"
      },
      //pattern: "<mi>[e℮ℯ]<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi><mi>x<\/mi>|<mi>[e℮ℯ]<\/mi><msup><mrow><\/mrow><mrow><mi>x<\/mi><\/mrow><\/msup><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi><mi>x<\/mi><mo>[+-]<\/mo><mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>",
      //description: "指数関数"
    },
     //楕円
     ellipse:{
      //標準形式 x^2/a^2 + y^2/b^2 = 1(b>a>0)
      pattern: "<mfrac>\s*<mrow>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>\+<\/mo>\s*<mfrac>\s*<mrow>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>=<\/mo>\s*<mn>1<\/mn>",
      description: "楕円"
    },
    //双曲線
    hyperbola:{
      //x軸方向双曲線: x²/a² - y²/b² = 1(a>0, b>0)
      standardForm1:{
        pattern: "<mfrac>\s*<mrow>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>\-<\/mo>\s*<mfrac>\s*<mrow>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>=<\/mo>\s*<mn>1<\/mn>",
        description: "x軸方向双曲線: x²/a² - y²/b² = 1(a>0, b>0)"
      },
      //y軸方向双曲線: x^2/a^2 - y^2/b^2 = -1(a>0, b>0)
      standardForm2:{
        pattern: "<mfrac>\s*<mrow>\s*<msup>\s*<mi>x<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>\-<\/mo>\s*<mfrac>\s*<mrow>\s*<msup>\s*<mi>y<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>=<\/mo>\s*<mo>-<\/mo>\s*<mn>1<\/mn>",
        description: "y軸方向双曲線: x^2/a^2 - y^2/b^2 = -1(a>0, b>0)"
      },
      //変数はxとyではないも双曲線 K^2/a^2 - M^2/b^2 = 1(a>0, b>0)
     /* standardForm3:{
        pattern: "<mfrac>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mn>\d+(\.\d+)?<\/mn>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>\-<\/mo>\s*<mfrac>\s*<mrow>\s*<msup>\s*<mi>[a-zA-Z]<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mn>\d+(\.\d+)?<\/mn>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>=<\/mo>\s*<mn>1<\/mn>",
        description: "標準形式: y²/a² - x²/b² = 1(a>0, b>0)"
      },*/
      //標準形式 (x-h)^2/a^2 - (y-k)^2/b^2 = 1(a>0, b>0)
      standardForm4:{
        pattern: "<mfrac>\s*<mrow>\s*<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>-<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mn>\d+(\.\d+)?<\/mn>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>\-<\/mo>\s*<mfrac>\s*<mrow>\s*<msup>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>y<\/mi>\s*<mo>-<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<mrow>\s*<msup>\s*<mn>\d+(\.\d+)?<\/mn>\s*<mn>2<\/mn>\s*<\/msup>\s*<\/mrow>\s*<\/mfrac>\s*<mo>=<\/mo>\s*<mn>1<\/mn>",
        description: "標準形式双曲線: (x-h)²/a² - (y-k)²/b² = 1(a>0, b>0)"
      },
    },
    //分子関数
    rationalFunction:{
      //分子関数 k/x
      rationalFunction1:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mfrac>\s*<mrow>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mrow>\s*<mrow>\s*<mi>x<\/mi>\s*<\/mrow>\s*<\/mfrac>",
        description: "分子関数 y= k/x"
      },
      //分子関数 k/(x+-p)
      rationalFunction2:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mfrac>\s*<mrow>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mrow>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<\/mfrac>",
        description: "分子関数 y=  k/(x-p)"
      },
      //分子関数 k/(x+-p) +-p 
      rationalFunction3:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mfrac>\s*<mrow>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mrow>\s*<mrow>\s*<mo>\(<\/mo>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\)<\/mo>\s*<\/mrow>\s*<\/mfrac>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>",
        description: "分子関数 k/(x+-p) +-p"
      },
      //分子関数 (ax+b)/(cx+d) |()はグループmrowと表示
      rationalFunction4:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mfrac>\s*<mrow>\s*<mi>[a-zA-Z]<\/mi>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]<\/mi>\s*<\/mrow>\s*<mrow>\s*<mi>[a-zA-Z]<\/mi>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]<\/mi>\s*<\/mrow>\s*<\/mfrac",
        description: "分子関数 (ax+b)/(cx+d)"
      },
    },

    //無理関数
    irrationalFunction:{
      //平方根関数 y = √ax
      squareRoot:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<msqrt>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<\/msqrt>",
        description: "無理関数の平方根関数 y = √ax"
      },
      //平方根関数  y = √ax+b
      squareRoot2:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<msqrt>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mo>[+-]<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/msqrt>",
        description: "無理関数の平方根関数 y = √ax+b"
      },
      //立方根関数 y = ∛ax
      cubeRoot:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mroot>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mn>3<\/mn>\s*<\/mroot>",
        description: "無理関数の立方根関数 y = ∛ax"
      },
      //乗根関数 y = -√ax
      nthRoot:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mo>-<\/mo>\s*<msqrt>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<\/msqrt>",
        description: "無理関数の乗根関数 y = -√ax"
      },
    },
    //連立関数
    simultaneousFunction:{
       pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mtd>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
      description: "連立1次関数"
      //連立1次方程式
      /*simultaneousEquations1:{
        pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mtd>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
        description: "連立1次方程式"
      },
      //連立2次方程式
      simultaneousEquations2:{
        pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<msup>\s*<mi>a<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>b<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>c<\/mi>\s*<\/mtd>\s*<mtd>\s*<msup>\s*<mi>d<\/mi>\s*<mn>2<\/mn>\s*<\/msup>\s*<mi>x<\/mi>\s*<mo>+</mo>\s*<mi>e<\/mi>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>f<\/mi>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
        description: "連立2次方程式"
      },*/
    },
    //三角関数
    trigonometricFunction:{
      //正弦関数
      sine:{
         //    "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>": "正弦 ",
        pattern: "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>",
        description: "正弦の三角関数"
      },
      //余弦関数    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>": "余弦 ",
      cosine:{
        //
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>",
        description: "余弦の三角関数"
      },
      //正接関数  "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>": "正接 ",
      tangent:{
        pattern: "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>",
        description: "正接の三角関数"
      },
      //余接関数  "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>": "余接 ",
      cotangent:{
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>",
        description: "余接の三角関数"
      },
      //正割関数  "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>": "正割 ",
      secant:{
        pattern: "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>",
        description: "正割の三角関数"
      },
      //         "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>": "余割 ",
      cosecant:{
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>",
        description: "余割の三角関数"
      },
      //逆正弦関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正弦 ",
      arcsine:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆正弦の三角関数"
      },
      //逆余弦関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余弦 ",

      arccosine:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆余弦の三角関数"
      },
      //逆正接関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正接 ",
      arctangent:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆正接の三角関数"
      },
      //逆余接関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余接 ",
      arccotangent:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆余接の三角関数"
      },
      //逆正割関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆正割 ",
      arcsecant:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆正割の三角関数"
      },
      //逆余割関数 "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆余割 ",

      arccosecant:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "逆余割の三角関数"
      },
      //双曲線正弦 "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>": "双曲線正弦 ",
      hyperbolicSine:{
        pattern: "<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>",
        description: "双曲線正弦の三角関数"
      },
      //双曲線余弦関数 "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>": "双曲線余弦 ",
      hyperbolicCosine:{
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>",
        description: "双曲線余弦の三角関数"
      },
      //双曲線正接関数  "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>": "双曲線正接 ",
      hyperbolicTangent:{
        pattern: "<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>",
        description: "双曲線正接の三角関数"
      },
      //双曲線余接関数     "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi><mi>h<\/mi>": "双曲線余接 ",
      hyperbolicCotangent:{
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi><mi>h<\/mi>",
        description: "双曲線余接の三角関数"
      },
      //双曲線正割関数     "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>": "双曲線正割 ",
      hyperbolicSecant:{
        pattern: "<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>",
        description: "双曲線正割の三角関数"
      },
      //双曲線余割関数    "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi><mi>h<\/mi>": "双曲線余割 ",
      hyperbolicCosecant:{
        pattern: "<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi><mi>h<\/mi>",
        description: "双曲線余割の三角関数"
      },
      //双曲線逆正弦関数     "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正弦 ",
      hyperbolicArcsine:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆正弦の三角関数"
      },
      //双曲線逆余弦関数     "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余弦 ",
      hyperbolicArccosine:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi>|<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆余弦の三角関数"
      },
      //双曲線逆正接関数     "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi>|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正接 ",

      hyperbolicArctangent:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi>|(<mi>t<\/mi><mi>a<\/mi><mi>n<\/mi>|<mi>t<\/mi><mi>g<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆正接の三角関数"
      },
      //双曲線逆余接関数     "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余接 ",
      hyperbolicArccotangent:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>t<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>g<\/mi>|<mi>c<\/mi><mi>t<\/mi><mi>n<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆余接の三角関数"
      },
      //双曲線逆正割関数     "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線正割 ",
      hyperbolicArcsecant:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi>|<mi>s<\/mi><mi>e<\/mi><mi>c<\/mi><mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆正割の三角関数"
      },
      //双曲線逆余割関数     "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>": "逆双曲線余割 ",
      hyperbolicArccosecant:{
        pattern: "<mi>[aA]<\/mi><mi>r<\/mi>(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi>|(<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi><mi>e<\/mi><mi>c<\/mi>|<mi>c<\/mi><mi>s<\/mi><mi>c<\/mi>)<mi>h<\/mi><msup>(<mrow><\/mrow>|<mrow\/>)<mrow><mi>-<\/mi><mi>1<\/mi><\/mrow><\/msup>",
        description: "双曲線逆余割の三角関数"
      },
    },
    //特別曲線
    specialCurve:{
      //リサージュ曲線
      lissajousCurve:{
        pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>\s*<mo>\(<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<mtd>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>\s*<mo>\(<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
        description: "リサージュ曲線"
      },
      //アステロイド曲線方程式
      astroidCurve:{
        pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<mi>x<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>\s*<msup>\s*<mrow><\/mrow>\s*<mn>3<\/mn>\s*<\/msup>\s*<mo>\(<\/mo>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<mtd>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>\s*<msup>\s*<mrow><\/mrow>\s*<mn>3<\/mn>\s*<\/msup>\s*<mo>\(<\/mo>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
        description: "アステロイド曲線"
      },
      //サイクロイド
      cycloid:{
        pattern: "<mtable>\s*<mtr>\s*<mtd>\s*<mi>x<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\(</mo>\s*<mi>&phi;<\/mi>\s*<mo>-<\/mo>\s*<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<mtd>\s*<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\(</mo>\s*<mn>1<\/mn>\s*<mo>-<\/mo>\s*<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>\s*<\/mtd>\s*<\/mtr>\s*<\/mtable>",
        description: "サイクロイド"
      },
      //アルキメデスの渦巻線
      archimedesSpiral:{
        pattern: "<mi>r<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>&phi;<\/mi>",
        description: "アルキメデスの渦巻線"
      },
      //正葉曲線
      lemniscate:{
        pattern: "<mi>r<\/mi>\s*<mo>=<\/mo>\s*<mi>s<\/mi><mi>i<\/mi><mi>n<\/mi>\s*<mo>\(</mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>",
        description: "正葉曲線"
      },
      //カージオイド
      cardioid:{
        pattern: "<mi>y<\/mi>\s*<mo>=<\/mo>\s*<mi>[a-zA-Z]|\d+(\.\d+)?<\/mi>\s*<mo>\(</mo>\s*<mn>1<\/mn>\s*<mo>\+<\/mo>\s*<mi>c<\/mi><mi>o<\/mi><mi>s<\/mi>\s*<mi>&phi;<\/mi>\s*<mo>\)<\/mo>",
        description: "カージオイド"
      },
    },
  };

  var mathChange = new RegExp("<math xmlns=\"http://www.w3.org/1998/Math/MathML\">");
  var mrowChange = new RegExp("<mrow xmlns=\"http://www.w3.org/1998/Math/MathML\">");

  // Continue with the remaining lines of the original code
  var treeDepth = 0;
  var mtableDepth = 0;
  var treeStack = new Array();
  var mtableStack = new Array();
  var matricsNum = 0;
  var outerMatricsNum = 0;
  var munderoverCount = 0;
  var equationFlag = 0;
  var outputStr;

  var futougouFlag = 0;

  var regStr;
  var matrics = new Array();
  var outerMatrics = new Array();
  var mtds = new Array();
  var mtrs;
  var rows, columns;
  var i = 0, j, k = 0;
  var diagonalFlag = 0;
  var scalarFlag = 0;
  var identityFlag = 0;
  var zeroFlag = 0;
  var symmetricFlag = 0;
  var upperTriangularFlag = 0;
  var lowerTriangularFlag = 0;

  str = str.replace(mathChange, "<math>");
  str = str.replace(mrowChange, "<mrow>");

  var equalCheckStr = "";
  var nijiCheckStr = "";
  var futougouCheckStr = "";

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

  //hashmapのキーと値を取得関数
  function distinguishExpression(input) {
    let outputStr = "";

    for (const category in regexMap) {
      for (const type in regexMap[category]) {
        const pattern = new RegExp(regexMap[category][type].pattern);
        if (pattern.test(input)) {
          outputStr += regexMap[category][type].description + " ";
        }
      }
    }

    return outputStr.trim();
  }
//ハッシュマプでのキーと値の取得
const tagOperations = {
  "<mi>": { open: 4, close: 5 },
  "<mtr>": { open: 5, close: 6 },
  "<mtd>": { open: 5, close: 6 },
  "<mrow>": { open: 6, close: 7 },
  "<math>": { open: 6, close: 7 },
  "<msub>": { open: 6, close: 7 },
  "<msup>": { open: 6, close: 7 },
  "<mfrac>": { open: 7, close: 8 },
  "<mover>": { open: 7, close: 8 },
  "<mroot>": { open: 7, close: 8 },
  "<msqrt>": { open: 7, close: 8 },
  "<munder>": { open: 8, close: 9 },
  "<mtable>": { open: 8, close: 9 },
  "<msubsup>": { open: 9, close: 10 },
  "<munderover>": { open: 12, close: 13 },
  "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">": { open: 65, close: 7 }
};

// Main loop to analyze the string
/*while (i < str.length) {
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
*/
while (i < str.length) {
  let substr = str.substr(i);
  let matched = false;
  for (const [tag, ops] of Object.entries(tagOperations)) {
    if (substr.startsWith(tag)) {
      //例として、"mi"の場合
      handleOpenTag(tag, ops.open);
      matched = true;
      break;
    } else if (substr.startsWith(tag.replace("<", "<\/"))) {
      //例として、<mi>の"<"を"</"に置き換え、</mi>になる場合
      handleCloseTag(tag, ops.close);
      matched = true;
      break;
    }
  }
  if (!matched) {
    if (substr.charAt(0) == "=") {
      if (treeStack[treeDepth - 3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") {
        equationFlag = 1;
      } else if (treeStack[treeDepth - 5] == "<math>" &&
        (treeStack[treeDepth - 3] == "<munder>" || treeStack[treeDepth - 3] == "<mover>" || treeStack[treeDepth - 3] == "<munderover>") &&
        munderoverCount == 1) {
        equationFlag = 1;
      }
      i++;
      
    } else if (substr.startsWith("<mi>[<\/mi><mtable>") || substr.startsWith("<mi>(<\/mi><mtable>")) {
      mtableStack[mtableDepth] = i;
      mtableDepth++;
      i += 18;
    } else if (substr.startsWith("<\/mtable><mi>]<\/mi>") || substr.startsWith("<\/mtable><mi>)<\/mi>")) {
      mtableDepth--;
      matrics[matricsNum] = str.substring(mtableStack[mtableDepth], i + 19);
      if (mtableDepth == 0) outerMatrics[outerMatricsNum++] = matrics[matricsNum];
      matricsNum++;
      i += 19;
    } else {
      i++;
    }
  }
}


// 使用例
let outputStr = "";
if (equationFlag == 1) {
  outputStr = distinguishExpression(str);
  equalCheckStr = "方程式";
  outputStr = outputStr + equalCheckStr;
}

text = "抽出した学習項目：" + outputStr;

return text;
}
