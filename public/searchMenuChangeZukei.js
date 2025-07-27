let csvArray_zukei = [];

// CSVを読み込んで配列に格納し、カテゴリのドロップダウンを初期化
function loadZukeiCSV() {
  console.log("🚀 loadZukeiCSV開始");

  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    //console.log("✅ CSV読み込み成功：", xhr.responseText);
    const lines = xhr.responseText.trim().split("\n");
    //console.log("📦 行数:", lines.length);
    csvArray_zukei = []; // 何度も呼ばれた場合のため初期化
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      //console.log(`🟩 row[${i}]:`, row);
      csvArray_zukei.push(row);
    }
    drawOptionZukei();
  };

  xhr.onerror = function () {
    console.error("❌ CSV読み込みエラー！");
  };

  xhr.open("GET", "menu_zukei_data.csv", true);
  xhr.send();
}

// カテゴリのドロップダウンを生成
function drawOptionZukei() {
  console.log("🔍 drawOptionZukei開始");
  if (csvArray_zukei.length === 0) {
    console.error("❗️ csvArray_zukeiが空です。loadZukeiCSVを先に実行してください。");
    return;
  }
  const select = document.getElementById("selectZukei1");
  select.options.length = 0;
  const seen = new Set();
  for (let i = 0; i < csvArray_zukei.length; i++) {
    const value = csvArray_zukei[i][1]; // カテゴリコード
    const label = csvArray_zukei[i][2]; // 表示名
    if (!seen.has(value)) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.text = label;
      select.appendChild(opt);
      seen.add(value);
    }
  }
  // 最初のカテゴリを選択
  if (select.options.length > 0) {
    select.value = select.options[0].value;
  }
  // 公式一覧を更新
  searchMenuChangeZukei();
  // onchangeイベントを設定
  select.onchange = searchMenuChangeZukei;
  console.log("🟢 drawOptionZukei終了");
}

// カテゴリに応じて公式一覧を生成
function searchMenuChangeZukei() {
  const select1 = document.getElementById("selectZukei1");
  const selectedValue = select1.value;
  const select2 = document.getElementById("selectZukei2");
  select2.options.length = 0;

  let count = 0;
  for (let i = 0; i < csvArray_zukei.length; i++) {
    if (csvArray_zukei[i][1] === selectedValue) {
      const formula = csvArray_zukei[i][3]; // 公式名
      select2.options[count++] = new Option(formula, formula);
    }
  }

  if (count === 0) {
    select2.options[0] = new Option("（公式が見つかりません）");
  }
}

// ページロード時にCSVを読み込む
window.addEventListener('DOMContentLoaded', loadZukeiCSV);