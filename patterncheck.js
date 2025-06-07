const fs = require("fs");
const { JSDOM } = require("jsdom");
const { createQueryString } = require("./createQueryString");
const { queryTokenize } = require("./queryTokenize");
const queryParse = require("./queryParse");
const { normalizePmmlTree } = require("./normalize");

function getQueryPatternFromMathML(filePath) {
  const mmlSource = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(mmlSource);
  const doc = dom.window.document;
  const mathElem = doc.querySelector("math");

  if (!mathElem) throw new Error("❌ MathML内に<math>タグが見つかりません");

  const normalized = normalizePmmlTree(mathElem);
  const rawQuery = createQueryString(`<math>${normalized.innerHTML}</math>`);
  return rawQuery;
}

function matchPattern(queryPath, targetPath) {
  let queryString, tokens, parsed, targetString;

  // Step 1: クエリ式を正規化＆変換
  try {
    console.log("🧩 Step 1: クエリ式のMathMLを読み込み＆正規化...");
    queryString = getQueryPatternFromMathML(queryPath);
    console.log("✅ createQueryString 出力:\n", queryString);
  } catch (err) {
    console.error("🚨 Step 1 失敗:", err.message);
    return;
  }

  // Step 2: トークン化
  try {
    console.log("🧩 Step 2: トークン化...");
    tokens = queryTokenize(queryString);
    console.log("✅ トークン数:", tokens.length);
  } catch (err) {
    console.error("🚨 Step 2 失敗:", err.message);
    return;
  }

  // Step 3: パースして正規表現生成
  try {
    console.log("🧩 Step 3: 正規表現構文解析...");
    parsed = queryParse(tokens);
    if (!parsed || !parsed.query) throw new Error("正規表現の構文解析に失敗しました");
    console.log("✅ Onigmo 正規表現:\n", parsed.query);
  } catch (err) {
    console.error("🚨 Step 3 失敗:", err.message);
    return;
  }

  // Step 4: 対象式の読み込み
  try {
    console.log("🧩 Step 4: 対象MathMLの読み込み...");
    targetString = getQueryPatternFromMathML(targetPath);
    console.log("✅ 対象式の正規表現文字列:\n", targetString);
  } catch (err) {
    console.error("🚨 Step 4 失敗:", err.message);
    return;
  }

  // Step 5: マッチング判定
  try {
    console.log("🧩 Step 5: マッチング判定...");
    const regex = new RegExp(parsed.query);
    const result = regex.test(targetString);
    console.log("🔍 マッチ結果:", result ? "✅ マッチしました" : "❌ マッチしませんでした");
  } catch (err) {
    console.error("🚨 Step 5 失敗:", err.message);
  }
}

// 実行
matchPattern(__dirname + "/test.mml", __dirname + "/test_target.html");
