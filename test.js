const { JSDOM } = require('jsdom');
const { createMathTreeString } = require('./createMathTreeString');

// 複雑なテストケース一覧
const testCases = [
  {
    name: '分数と根号の入れ子',
    mml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mfrac>
        <msqrt>
          <mrow>
            <mi>a</mi>
            <mo>+</mo>
            <mi>b</mi>
          </mrow>
        </msqrt>
        <mn>2</mn>
      </mfrac>
    </math>`,
    expected: '/frac{/sqrt{a+b/}/}{2/}'
  },
  {
    name: '上下付き添字と演算子',
    mml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <msubsup>
        <mi>x</mi>
        <mi>i</mi>
        <mi>j</mi>
      </msubsup>
      <mo>=</mo>
      <mn>0</mn>
    </math>`,
    expected: '/msubsup{i/}{j/}=0'
  },
  {
    name: 'テーブル（行列）',
    mml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mtable>
        <mtr>
          <mtd><mi>a</mi></mtd>
          <mtd><mi>b</mi></mtd>
        </mtr>
        <mtr>
          <mtd><mi>c</mi></mtd>
          <mtd><mi>d</mi></mtd>
        </mtr>
      </mtable>
    </math>`,
    expected: '/table{/tr{/td{a/}/}{/td{b/}/}/}{/tr{/td{c/}/}{/td{d/}/}/}'
  },
  {
    name: '特殊文字と複数演算子',
    mml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>x</mi>
      <mo>+</mo>
      <mi>y</mi>
      <mo>{</mo>
      <mi>z</mi>
      <mo>}</mo>
      <mo>\\</mo>
      <mo>:</mo>
    </math>`,
    expected: 'x+y\\{z\\}\\:\\\\'
  },
  {
    name: '多重入れ子',
    mml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <msup>
        <mfrac>
          <mi>a</mi>
          <mi>b</mi>
        </mfrac>
        <mn>2</mn>
      </msup>
    </math>`,
    expected: '/sup{/frac{a/}{b/}/}{2/}'
  }
];

// テスト実行
testCases.forEach(({ name, mml, expected }) => {
  const dom = new JSDOM(mml, { contentType: "text/xml" });
  global.window = dom.window;
  global.document = dom.window.document;
  const math = document.querySelector('math');
  const result = createMathTreeString(math);
  console.log(`【${name}】`);
  console.log('出力:', result);
  console.log('期待値:', expected);
  if (result.replace(/\s/g, '') === expected.replace(/\s/g, '')) {
    console.log('テスト成功\n');
  } else {
    console.log('テスト失敗\n');
  }
});