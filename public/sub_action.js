    var sub_action = function(row2) {
        var elements1 = document.getElementsByName("q1");
        var elements2 = document.getElementsByName("q2");
//        var row2 = location.search;
        var sub_result = new Array();
        console.log("row2: " + row2);
        document.getElementById("OK").onclick = function() {

            for (var val1 = "", i = elements1.length; i--;) {
                if (elements1[i].checked) {
                    var val1 = elements1[i].value;
                    break;
                }
            }
            console.log("val1: " + val1);
            for (var val2 = "", i = elements2.length; i--;) {
                if (elements2[i].checked) {
                    var val2 = elements2[i].value;
                    break;
                }
            }
            console.log("val2: " + val2);
            //window.close();
            sub_result.push(val1);
            sub_result.push(val1);
            console.log(sub_result);
        };
        document.getElementById("toji").onclick = function() {
            window.close();
        };
        return sub_result;
    }
