// ハッシュテーブルに学習項目を格納
const learningItems = {
  integral: {
    regex: /<mi>∫</mi>|<mi>∬</mi>|<mi>∭</mi>/,
    label: "積分"
  },
  root: {
    regex: /<msqrt>|<mroot>/,
    label: "平方根"
  },
  logarithm: {
    regex: /<mi>[lL]</mi><mi>o</mi><mi>g</mi>|<mi>[lL]</mi><mi>n</mi>|<mi>[㏑㏒]</mi>/,
    label: "対数"
  },
  commonLog: {
    regex: /<mi>[lL]</mi><mi>o</mi><mi>g</mi><msub><mrow></mrow><mrow><mi>1</mi><mi>0</mi></mrow></msub>|<mi>㏒</mi><msub><mrow></mrow><mrow><mi>1</mi><mi>0</mi></mrow></msub>/,
    label: "常用対数"
  },
  naturalLog: {
    regex: /<mi>[lL]</mi><mi>o</mi><mi>g</mi><msub><mrow></mrow><mrow><mi>[e℮ℯ]</mi></mrow></msub>|<mi>[lL]</mi><mi>n</mi>|<mi>㏑</mi>/,
    label: "自然対数"
  },
  sin: {
    regex: /<mi>s</mi><mi>i</mi><mi>n</mi>/,
    label: "正弦関数"
  },
  cos: {
    regex: /<mi>c</mi><mi>o</mi><mi>s</mi>/,
    label: "余弦関数"
  },
  tan: {
    regex: /<mi>t</mi><mi>a</mi><mi>n</mi>|<mi>t</mi><mi>g</mi>/,
    label: "正接関数"
  },
  cot: {
    regex: /<mi>c</mi><mi>o</mi><mi>t</mi>|<mi>c</mi><mi>t</mi><mi>g</mi>/,
    label: "余接関数"
  },
  sec: {
    regex: /<mi>s</mi><mi>e</mi><mi>c</mi>/,
    label: "正割関数"
  },
  cosec: {
    regex: /<mi>c</mi><mi>o</mi><mi>s</mi><mi>e</mi><mi>c</mi>|<mi>c</mi><mi>s</mi><mi>c</mi>/,
    label: "余割関数"
  },
  arcsin: {
    regex: /<mi>[aA]</mi><mi>r</mi><mi>c</mi><mi>s</mi><mi>i</mi><mi>n</mi>|<mi>s</mi><mi>i</mi><mi>n</mi><msup><mrow></mrow><mrow><mi>-</mi><mi>1</mi></mrow></msup>/,
    label: "逆正弦関数"
  },
  arccos: {
    regex: /<mi>[aA]</mi><mi>r</mi><mi>c</mi><mi>c</mi><mi>o</mi><mi>s</mi>|<mi>c</mi><mi>o</mi><mi>s</mi><msup><mrow></mrow><mrow><mi>-</mi><mi>1</mi></mrow></msup>/,
    label: "逆余弦関数"
  },
  arctan: {
    regex: /<mi>[aA]</mi><mi>r</mi><mi>c</mi><mi>t</mi><mi>a</mi><mi>n</mi>|<mi>t</mi><mi>a</mi><mi>n</mi><msup><mrow></mrow><mrow><mi>-</mi><mi>1</mi></mrow></msup>/,
    label: "逆正接関数"
  },
  sinh: {
    regex: /<mi>s</mi><mi>i</mi><mi>n</mi><mi>h</mi>/,
    label: "双曲線正弦関数"
  },
  cosh: {
    regex: /<mi>c</mi><mi>o</mi><mi>s</mi><mi>h</mi>/,
    label: "双曲線余弦関数"
  },
  tanh: {
    regex: /<mi>t</mi><mi>a</mi><mi>n</mi><mi>h</mi>|<mi>t</mi><mi>g</mi><mi>h</mi>/,
    label: "双曲線正接関数"
  },
  coth: {
    regex: /<mi>c</mi><mi>o</mi><mi>t</mi><mi>h</mi>|<mi>c</mi><mi>t</mi><mi>g</mi><mi>h</mi>/,
    label: "双曲線余接関数"
  },
  factorial: {
    regex: /<mi>!</mi>/,
    label: "階乗"
  },
  limit: {
    regex: /<mi>l</mi><mi>i</mi><mi>m</mi>/,
    label: "極限"
  },
  permutation: {
    regex: /</msub><mi>P</mi><msub>/,
    label: "順列"
  },
  combination: {
    regex: /</msub><mi>C</mi><msub>/,
    label: "組み合わせ"
  },
  matrixInverse: {
    regex: /<msup><mrow></mrow><mrow><mi>-</mi><mi>1</mi></mrow></msup>/,
    label: "逆行列"
  },
  matrixTranspose: {
    regex: /<msup><mrow></mrow><mrow><mi>T</mi></mrow></msup>/,
    label: "転置行列"
  },
  vectorNorm: {
    regex: /<mo>\|</mo>.*?<mo>\|</mo>/,
    label: "ベクトルノルム"
  },
  definiteIntegral: {
    regex: /<msub><mi>∫</mi><mrow>.*?</mrow></msub>/,
    label: "定積分"
  },
  summation: {
    regex: /<mo>∑</mo>/,
    label: "総和"
  },
  productNotation: {
    regex: /<mo>∏</mo>/,
    label: "積記号"
  },
  probabilityDensity: {
    regex: /<mi>f</mi><mrow><mo>\(</mo>.*?<mo>\)</mo></mrow>/,
    label: "確率密度関数"
  },
  gradient: {
    regex: /<mo>∇</mo>/,
    label: "勾配"
  },
  divergence: {
    regex: /<mo>∇</mo><mo>⋅</mo>/,
    label: "発散"
  },
  curl: {
    regex: /<mo>∇</mo><mo>×</mo>/,
    label: "カール"
  }
};

// ハッシュテーブルに検出ロジックを格納
const detectionLogic = {
  checkFeature: function (expression, feature) {
    const item = learningItems[feature];
    if (item && item.regex.test(expression)) {
      return item.label;
    }
    return null;
  },
  detectAll: function (expression) {
    let detectedLabels = [];
    for (const feature in learningItems) {
      const label = this.checkFeature(expression, feature);
      if (label) detectedLabels.push(label);
    }
    return detectedLabels;
  }
};

// 学習項目を抽出する関数
function extractLearningItems(expression) {
  const detected = detectionLogic.detectAll(expression);
  if (detected.length > 0) {
    return `抽出された学習項目: ${detected.join(", ")}`;
  } else {
    return "学習項目は検出されませんでした。";
  }
}

// テスト用のMathML文字列
const testExpression = `
<math>
  <mi>l</mi><mi>i</mi><mi>m</mi>
  <mi>s</mi><mi>i</mi><mi>n</mi>
  <mi>!</mi>
  <msup><mrow></mrow><mrow><mi>-</mi><mi>1</mi></mrow></msup>
  <mo>∇</mo><mo>⋅</mo>
</math>
`;

// 学習項目を抽出して表示
console.log(extractLearningItems(testExpression));
