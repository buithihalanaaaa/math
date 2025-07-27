(function(){
    ADP = {};
    //Json形式のデータを送る
    function postJson(url,param,proc) {
        var xmlHttp = xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.onreadystatechange = function (){
            if(this.readyState == 4){
                proc(JSON.parse(xmlHttp.response));
            }
        }
        var p = JSON.stringify(param);
        xmlHttp.send(p);
    }
    
    ADP.createAdapter = function(scriptUrl,sessionHash){
        var adapter = {"url":scriptUrl,"sessionHash":sessionHash};
        adapter.exec = function(){
            if(arguments.length == 0)
                return;
            var _this = this;
            var functions = [];
            if(arguments[0] instanceof Array)
                for(var i=0;i<arguments.length;i++)
                    functions.push({"function":arguments[i][0],"params":Array.prototype.slice.call(arguments[i], 1)});
            else
                functions.push({"function":arguments[0],"params":Array.prototype.slice.call(arguments, 1)});
    
            var values = {"command":"exec","sessionHash":adapter.sessionHash,"functions":functions};
            postJson(this.url,values,function(r){
                if(_this.on){
                    if(r === null || r.result==0)
                        _this.on(null);
                    else
                        _this.on(functions.length==1?r.values[0]:r.values);
                }
    
            });
            return this;
        }
        adapter.setSession = function(sessionHash){this.sessionHash=sessionHash;}
        adapter.getSession = function(){return this.sessionHash};
        return adapter;
    }
})();