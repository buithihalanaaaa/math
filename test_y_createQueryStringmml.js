const fs = require("fs");
const { JSDOM } = require("jsdom");
const { createQueryString } = require("./createQueryString");

// MathMLから正規表現パターンを生成
function getQueryPattern(path) {
  const mmlSource = fs.readFileSync(path, "utf-8");
  const mmlDom = new JSDOM(mmlSource);
  const mmlDocument = mmlDom.window.document;
  const mmlElem = mmlDocument.querySelector("math");
  if (!mmlElem) throw new Error(`❌ ${path} に <math> 要素が見つかりません`);
  return createQueryString(`<math>${mmlElem.innerHTML}</math>`);
}

// メイン関数
function hikaku_partel(mmlPath, targetPath) {
  try {
    console.log(`📂 読み込み: ${mmlPath}`);
    const pattern = getQueryPattern(mmlPath);
    console.log(`📄 正規表現パターン:\n${pattern}\n`);

    console.log(`📂 読み込み: ${targetPath}`);
    const target = getQueryPattern(targetPath);
    console.log(`📄 ターゲット文字列（正規化後）:\n${target}\n`);

    console.log("🔍 正規表現でマッチング実行中...");
    const regex = new RegExp(pattern);
    const result = regex.test(target);

    if (result) {
      console.log("✅ マッチしました！");
    } else {
      console.log("❌ マッチしませんでした。");
    }

  } catch (err) {
    console.error("❌ エラー:", err.message);
  }
}

// 実行
hikaku_partel(__dirname + "/test.mml", __dirname + "/test_target.html");
