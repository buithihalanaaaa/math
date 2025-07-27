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

function drawOptionZukei(doc) {

/** 
 * 参考url: http://www.hp-stylelink.com/news/2014/08/20140826.php
 * 公式のタイトル等の情報が詰まったcsvファイルを読み込んで、配列にぶち込む動作
**/

// 学習項目抽出結果にハイライトする用
	//csvArray_zukei = new Array();


	/*var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var responcet = xhr.responseText;
	    //console.log(xhr.responseText);
	    var tempArray = responcet.split("\n");
	    //csvArray = new Array();
	    for(var i = 0; i<tempArray.length;i++){
	    csvArray_zukei[i] = tempArray[i].split(",");
	    }
	    console.log(csvArray_zukei);
	    console.log(csvArray_zukei[1]);
	    console.log(csvArray_zukei.length);
	}

	xhr.open("get", "menu_zukei_data.csv", true);
	xhr.send(null);

    doc.writeln('<option value = "chokusen">直線</option>');
    doc.writeln('<option value = "taLogakansu">対数関数</option>');
    doc.writeln('<option value = "enkei">円形</option>');
    doc.writeln('<option value = "houbutsusen">放物線</option>');
    doc.writeln('<option value = "sanjikansu">三次関数</option>');*/




	const select = document.getElementsByName("selectZukei1")[0];
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const lines = xhr.responseText.trim().split("\n");
        const categories = new Set();
        for (let i = 0; i < lines.length; i++) {
            const cols = lines[i].split(",");
            categories.add(cols[3]);  // ← 第4列：カテゴリ名
        }
        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.text = cat;
            select.appendChild(opt);
        });

        // ✅ 最初のカテゴリに対する公式リストを初期表示
        searchMenuChangeZukei();
    };
    xhr.open("GET", "menu_zukei_data.csv", true);
    xhr.send();
	  doc.writeln('<option value = "chokusen">直線</option>');
    doc.writeln('<option value = "taLogakansu">対数関数</option>');
    doc.writeln('<option value = "enkei">円形</option>');
    doc.writeln('<option value = "houbutsusen">放物線</option>');
    doc.writeln('<option value = "sanjikansu">三次関数</option>');

}


    // 参考: http://www.ksknet.net/javascript/post_54.html
function searchMenuChangeZukei() {
	var select1 = document.forms.formZukei.selectZukei1; //変数select1を宣言
	var select2 = document.forms.formZukei.selectZukei2; //変数select2を宣言

	select2.options.length = 0; // 選択肢の数がそれぞれに異なる場合、これが重要
	let count = 0;
	if (select1.options[select1.selectedIndex].value == "chokusen") {
        //現在合計 5 + 0 個
        select2.options[0] = new Option("直線一般形");
        select2.options[1] = new Option("直線傾き切片形");
        select2.options[2] = new Option("直線の傾き切逆型");
        select2.options[3] = new Option("直線のy傾き切型");
        select2.options[4] = new Option("直線のx傾き切型");
	} else if (select1.options[select1.selectedIndex].value == "taLogakansu") {
        //現在合計 4 + 0 個
        select2.options[0] = new Option("自然対数関数");    
        select2.options[1] = new Option("常用対数関数");
        select2.options[2] = new Option("減少対数関数");
        select2.options[3] = new Option("増加対数関数");
	
	} else if (select1.options[select1.selectedIndex].value == "enkei") {
        //現在合計 2 + 0 個
        select2.options[0] = new Option("円形の標準形式");
        select2.options[1] = new Option("円形の一般形式");
    }else if (select1.options[select1.selectedIndex].value == "houbutsusen") {
        //現在合計 8 + 0 個
        select2.options[0] = new Option("放物線の標準型:y = (x ± a)(x ± b)");
        select2.options[1] = new Option("放物線の頂点形式y = ax² + q");
        select2.options[2] = new Option("放物線の切片形式y = a(x ± p)²");
        select2.options[3] = new Option("放物線の切片形式y = a(x ± p)² + q");
        select2.options[4] = new Option("放物線の標準式y² = ax");
        select2.options[5] = new Option("放物線の標準式y = ax² + bx + c");
        select2.options[6] = new Option("放物線の標準式ay = x²");
        select2.options[7] = new Option("放物線の頂点形式y = ax²");
    } else if (select1.options[select1.selectedIndex].value == "sanjikansu") {
        //現在合計 1 + 0 個
        select2.options[0] = new Option("三次関数");
    }

}