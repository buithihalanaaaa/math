const fs = require("fs");
const { JSDOM } = require("jsdom");
const { createQueryString } = require("./createQueryString");

// MathML ファイルを読み込んで正規表現パターンに変換
function getPatternFromFile(path) {
  const mmlSource = fs.readFileSync(path, "utf-8");
  const mmlDom = new JSDOM(mmlSource);
  const mmlDocument = mmlDom.window.document;
  const mmlElem = mmlDocument.querySelector("math");
  if (!mmlElem) throw new Error(`❌ ${path} に <math> 要素が見つかりません`);
  return createQueryString(`<math>${mmlElem.innerHTML}</math>`);
}

// HTML ファイルからターゲット構文取得
function getTargetString(path) {
  const htmlSource = fs.readFileSync(path, "utf-8");
  const htmlDom = new JSDOM(htmlSource);
  const htmlDocument = htmlDom.window.document;
  const targetElem = htmlDocument.querySelector("math");
  if (!targetElem) throw new Error(`❌ ${path} に <math> 要素が見つかりません`);
  return createQueryString(`<math>${targetElem.innerHTML}</math>`);
}

try {
  const pattern = getPatternFromFile("test.mml");
  const target = getTargetString("test_target.html");

  console.log("🎯 パターン:\n", pattern);
  console.log("\n📘 構文:\n", target);

  // ✅ 正規化はしない！
  const normalizedTarget = target;

  const regex = new RegExp(pattern); // ← escapeせずそのまま使う

  const match = regex.test(normalizedTarget);
  console.log('\n🔍 一致判定:', match ? '✅ 正規表現にマッチ！' : '❌ マッチせず');
} catch (e) {
  console.error("🚨 エラー:", e.message);
}
