const { JSDOM } = require('jsdom');
const { createMathTreeString } = require('./createMathTreeString');
const testMml = `
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow>
    <msup>
      <mi>x</mi>
      <mn>2</mn>
    </msup>
    <mo>+</mo>
    <msup>
      <mi>y</mi>
      <mn>2</mn>
    </msup>
    <mo>=</mo>
    <mn>1</mn>
  </mrow>
</math>
`;

// JSDOM生成
const dom = new JSDOM(testMml, { contentType: "text/xml" });

// window/documentをグローバルに
global.window = dom.window;
global.document = dom.window.document;

// 必要ならjQueryもグローバルに
const $ = require('jquery')(window);
global.$ = $;

// prototype拡張
require('./prototypeMethods')(dom.window);

// normalizePmmlTreeを取得
const { normalizePmmlTree } = require('./normalize');

// テスト実行
const math = document.querySelector('math');
console.log("normalizePmmlTree呼び出し前");
const normalized = normalizePmmlTree(math, document);
console.log("normalizePmmlTree呼び出し後");
const serializer = new window.XMLSerializer();
console.log('正規化後のMathML:');
console.log(serializer.serializeToString(normalized));
const treeString = createMathTreeString(normalized);
console.log('ツリー文字列:');
console.log(treeString);
/*// createQueryStringを呼び出して出力
const { createQueryString } = require('./createQueryString');
const queryString = createQueryString(normalized);
console.log('クエリ文字列:');
console.log(queryString);*/
