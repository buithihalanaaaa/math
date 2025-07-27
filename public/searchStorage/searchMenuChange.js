//searchMenuChange

    // 参考: http://www.ksknet.net/javascript/post_54.html
function searchMenuChange() {
	var select1 = document.forms.formName.selectName1; //変数select1を宣言
	var select2 = document.forms.formName.selectName2; //変数select2を宣言

	select2.options.length = 0; // 選択肢の数がそれぞれに異なる場合、これが重要

	if (select1.options[select1.selectedIndex].value == "Houtei") {
		select2.options[0] = new Option("相加相乗平均");
		select2.options[1] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Zukei") {
		select2.options[0] = new Option("ピタゴラスの定理(未実装)");
		select2.options[1] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Kongou") {
		select2.options[0] = new Option("多重根号を外す");
		select2.options[1] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Sankaku") {
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
		select2.options[11] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "log") {
		select2.options[0] = new Option("底の変換公式");
		select2.options[1] = new Option("などなど、実装予定");
	} else if (select1.options[select1.selectedIndex].value == "Gyoretsu") {
		select2.options[0] = new Option("単位行列");
		select2.options[1] = new Option("零行列");
		select2.options[2] = new Option("対称行列");
		select2.options[3] = new Option("三角行列");
		select2.options[4] = new Option("上三角行列");
		select2.options[5] = new Option("下三角行列");
		select2.options[6] = new Option("スカラー行列");
		select2.options[7] = new Option("などなど、実装予定");
	}
}