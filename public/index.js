
const sample = document.getElementById("sample");
const text = document.getElementById("output-message2")
const text2 = document.getElementById("output-message4")

//ダイアログでファイルが選択された時
sample.addEventListener("change", function (event) {

  const file = event.target.files;

  //FileReaderの作成
  const reader = new FileReader();
  //テキスト形式で読み込む
  reader.readAsText(file[0]);

  //読込終了後の処理
  reader.onload = function () {
    //テキストエリアに表示する
    //text.value = reader.result;
    document.querySelector('#output-message3').innerHTML = reader.result;

  }
});