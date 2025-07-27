	// 参考: https://oshiete.goo.ne.jp/qa/225151.html
	// </option>がなかったので付け加えた。

	/* 元々htmlに入れてたのは
		<select name = "selectName1" onChange="searchMenuChange()">
		<option value = "Houtei">方程式・不等式</option>
		<option value = "Zukei">図形</option>
		<option value = "Kongou">多重根号</option>
		<option value = "Sankaku">三角関数</option>
		<option value = "log">対数</option>
		<option value = "Gyoretsu">行列</option>
		<option value = "Bibun">微分</option>
		</select>
	*/

function drawOption(doc) {

/** 
 * 参考url: http://www.hp-stylelink.com/news/2014/08/20140826.php
 * 公式のタイトル等の情報が詰まったcsvファイルを読み込んで、配列にぶち込む動作
**/

// 学習項目抽出結果にハイライトする用
	csvArray = new Array();


	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
	    var responcet = xhr.responseText;
	    //console.log(xhr.responseText);
	    var tempArray = responcet.split("\n");
	    //csvArray = new Array();
	    for(var i = 0; i<tempArray.length;i++){
	    csvArray[i] = tempArray[i].split(",");
	    }
	    console.log(csvArray);
	    console.log(csvArray[1]);
	    console.log(csvArray.length);
	}
	xhr.open("get", "menu_data.csv", true);
	xhr.send(null);
	
	doc.writeln('<option value = "Houtei">方程式・不等式</option>');
	doc.writeln('<option value = "Zukei">図形</option>');
	//doc.writeln('<option value = "Kongou">多重根号</option>');
	doc.writeln('<option value = "Sankaku">三角関数</option>');
	doc.writeln('<option value = "log">対数</option>');
	doc.writeln('<option value = "Bibun">微分</option>');
	doc.writeln('<option value = "Gyoretsu">行列</option>');

/*
	// csvは読み込めるのに、なぜかcsvを読み込むより先にこっちの処理をしてしまい、ぬるぽで死ぬ
	console.log(csvArray[1]);
	console.log(csvArray[1][1]);
	var i;
	i = 1;
	while(i < csvArray.length-1) {
		if(csvArray[i][1] != csvArray[i+1][1]) {
			//console.log(csvArray[i][1]);
			doc.writeln('<option value = \"' + csvArray[i][1] + '\">' + csvArray[i][2] + '</option>');
		}
		console.log('あほ');
		i++;
	}
*/

	//doc.writeln('<option value = \"' + csvArray[i][1] + '\">' + csvArray[i][2] + '</option>');

	


}


    // 参考: http://www.ksknet.net/javascript/post_54.html
function searchMenuChange() {
	var select1 = document.forms.formName.selectName1; //変数select1を宣言
	var select2 = document.forms.formName.selectName2; //変数select2を宣言

	select2.options.length = 0; // 選択肢の数がそれぞれに異なる場合、これが重要

	if (select1.options[select1.selectedIndex].value == "Houtei") {
		//現在合計 4 + 2 個
		select2.options[0] = new Option("相加相乗平均");
		select2.options[1] = new Option("多重根号を外す");
		select2.options[2] = new Option("コーシー＝シュワルツの不等式(二次)");
		select2.options[3] = new Option("コーシー＝シュワルツの不等式(三次)");
		select2.options[4] = new Option("二次方程式");
		select2.options[5] = new Option("二次不等式");
		select2.options[6] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Zukei") {
		//現在合計 2 + 0 個
		select2.options[0] = new Option("ピタゴラスの定理");
		select2.options[1] = new Option("ヘロンの公式");
		select2.options[2] = new Option("などなど、実装予定");
	} /*else if (select1.options[select1.selectedIndex].value == "Kongou") {
		//現在合計 1 + 0 個
		
		select2.options[1] = new Option("などなど、実装予定");
	} */else if (select1.options[select1.selectedIndex].value == "Sankaku") {
		//現在合計 19 + 0 個
		select2.options[0] = new Option("sinの加法定理");
		select2.options[1] = new Option("sinの倍角の公式");
		select2.options[2] = new Option("sinの半角の公式");
		select2.options[3] = new Option("sinの三倍角の公式");
		select2.options[4] = new Option("cosの加法定理");
		select2.options[5] = new Option("cosの倍角の公式");
		select2.options[6] = new Option("cosの半角の公式");
		select2.options[7] = new Option("cosの三倍角の公式");
		select2.options[8] = new Option("tanの加法定理");
		select2.options[9] = new Option("tanの倍角の公式");
		select2.options[10] = new Option("tanの半角の公式");
		select2.options[11] = new Option("ド・モアブルの定理");
		select2.options[12] = new Option("オイラーの公式");
		select2.options[13] = new Option("sin×sinの積和公式");
		select2.options[14] = new Option("sin×cosの積和公式");
		select2.options[15] = new Option("cos×cosの積和公式");
		select2.options[16] = new Option("sin＋sinの和積公式");
		select2.options[17] = new Option("sin－sinの和積公式");
		select2.options[18] = new Option("cos＋cosの和積公式");
		select2.options[19] = new Option("cos－cosの和積公式");
		select2.options[20] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "log") {
		//現在合計 1 + 0 個
		select2.options[0] = new Option("底の変換公式");
		select2.options[1] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Gyoretsu") {
		//現在合計 7 + 2 個
		select2.options[0] = new Option("単位行列");
		select2.options[1] = new Option("零行列");
		select2.options[2] = new Option("対称行列");
		select2.options[3] = new Option("三角行列");
		select2.options[4] = new Option("上三角行列");
		select2.options[5] = new Option("下三角行列");
		select2.options[6] = new Option("スカラー行列");
		select2.options[7] = new Option("行列方程式");
		select2.options[8] = new Option("行列不等式");
		select2.options[9] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Bibun") {
		//現在合計 1 + 2 個
		select2.options[0] = new Option("微分方程式");
		select2.options[1] = new Option("微分不等式");
		select2.options[2] = new Option("導関数");
		select2.options[3] = new Option("などなど、実装予定");
	}
}