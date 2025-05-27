const fs = require("fs");
const { JSDOM } = require("jsdom");
const { createQueryString } = require("./createQueryString");

try {
  // --- test.mml 読み込み & 変換 ---
  const mmlSource = fs.readFileSync("./test.mml", "utf-8");
  const mmlDom = new JSDOM(mmlSource);
  const mmlDocument = mmlDom.window.document;
  const mmlElem = mmlDocument.querySelector("math");
  if (!mmlElem) throw new Error("❌ test.mml に <math> 要素が見つかりません");
  const mmlQuery = createQueryString(`<math>${mmlElem.innerHTML}</math>`);

  // --- test_target.html 読み込み & 変換 ---
  const htmlSource = fs.readFileSync("./test_target.html", "utf-8");
  const htmlDom = new JSDOM(htmlSource);
  const htmlDocument = htmlDom.window.document;
  const targetElem = htmlDocument.querySelector("math");
  if (!targetElem) throw new Error("❌ test_target.html に <math> 要素が見つかりません");
  const targetQuery = createQueryString(`<math>${targetElem.innerHTML}</math>`);

  // --- 出力 ---
  console.log("🎯 test.mml パターン:");
  console.log(mmlQuery);
  console.log("\n📘 test_target.html 構文:");
  console.log(targetQuery);

  // --- 比較結果（whitespaceを除外して判定） ---
  const simplifiedA = mmlQuery.replace(/\s+/g, '');
  const simplifiedB = targetQuery.replace(/\s+/g, '');
  const match = simplifiedA === simplifiedB;

  console.log("\n🔍 一致判定:", match ? "✅ 完全一致！" : "❌ 不一致");

} catch (e) {
  console.error("🚨 エラー:", e.message);
}
