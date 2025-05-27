const fs = require("fs");
const { JSDOM } = require("jsdom");
const { createQueryString } = require("./createQueryString");

const regexMap = {}; // グローバルパターンマップ

// escape RegExp string utility（必要に応じて）
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPatternFromFile(path) {
  const mmlSource = fs.readFileSync(path, "utf-8");
  const mmlDom = new JSDOM(mmlSource);
  const mmlDocument = mmlDom.window.document;
  const mmlElem = mmlDocument.querySelector("math");
  if (!mmlElem) throw new Error(`❌ ${path} に <math> 要素が見つかりません`);
  return createQueryString(`<math>${mmlElem.innerHTML}</math>`);
}

function getTargetString(path) {
  const htmlSource = fs.readFileSync(path, "utf-8");
  const htmlDom = new JSDOM(htmlSource);
  const htmlDocument = htmlDom.window.document;
  const targetElem = htmlDocument.querySelector("math");
  if (!targetElem) throw new Error(`❌ ${path} に <math> 要素が見つかりません`);
  return createQueryString(`<math>${targetElem.innerHTML}</math>`);
}

function addToRegexMap(pattern, category, type, description) {
  if (!regexMap[category]) regexMap[category] = {};
  regexMap[category][type] = {
    pattern: pattern,
    description: description
  };
}

// 🔍 メイン関数
function hikaku_partel(mmlPath, targetPath) {
  try {
    console.log(`📂 読み込み: ${mmlPath}`);
    const pattern = getPatternFromFile(mmlPath);
    console.log(`📄 test.mml パターン (元):\n${pattern}`);

    const escapedPattern = escapeRegExp(pattern);
    console.log(`🧪 test.mml パターン (JS用エスケープ後):\n${escapedPattern}`);

    addToRegexMap(escapedPattern, 'custom', 'fromTestMml', 'test.mmlからのパターン');

    console.log(`📂 読み込み: ${targetPath}`);
    const target = getTargetString(targetPath);
    console.log(`📄 test_target.html の文字列（正規化後）:\n${target}`);

    let matched = false;
    for (const category in regexMap) {
      for (const type in regexMap[category]) {
        const regexStr = regexMap[category][type].pattern;
        const description = regexMap[category][type].description;

        console.log(`🔍 試行: ${description}`);
        console.log(`   ↳ パターン: ${regexStr}`);
        const regex = new RegExp(regexStr);
        const result = regex.test(target);
        console.log(`   ↳ 結果: ${result ? '✅ マッチ' : '❌ 非マッチ'}`);

        if (result) {
          console.log(`🎯 マッチしました: ${description}`);
          matched = true;
        }
      }
    }

    if (!matched) {
      console.log("❌ どのパターンにもマッチしませんでした。");
    }

  } catch (err) {
    console.error("❌ エラー:", err.message);
  }
}


// 実行例
hikaku_partel(__dirname + '/test.mml', __dirname + '/test_target.html');
