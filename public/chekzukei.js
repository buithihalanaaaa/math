function checkZukeiSelects() {
    // カテゴリ
    const select1 = document.getElementById('selectZukei1');
    if (select1) {
        console.log('selectZukei1:', Array.from(select1.options).map(o => o.text));
    } else {
        console.log('selectZukei1が見つかりません');
    }
    // 種類
    const select2 = document.getElementsByName('selectZukei2')[0];
    if (select2) {
        console.log('selectZukei2:', Array.from(select2.options).map(o => o.text));
    } else {
        console.log('selectZukei2が見つかりません');
    }
}
