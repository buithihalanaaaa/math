const {queryParse}  = require('./queryParse');
const { queryTokenize } = require('./queryTokenize');

// 2次関数のテスト例を追加
const queries = [
  'ax^2+bx+c=0',
  'y=a(x-h)^2+k',
  'f(x)=x^2+2x+1',
  '\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',
  'y=x^2',
  'y=-x^2+3x-2'
];

for (const query of queries) {
  const tokens = queryTokenize(query);
  console.log(`トークン化: ${tokens.join(', ')}`);
  const result = queryParse(tokens);
  console.log(`query: ${query}`);
  if (result) {
    console.log('正規表現:', result.query);
  } else {
    console.log('正規表現: パース失敗');
  }
  console.log('---');
}