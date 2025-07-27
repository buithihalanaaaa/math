<?php
define("DECORATION","JS_");         //呼び出しファンクションに付ける修飾文字列

//クラスが見つからなかったら、requireを行う
spl_autoload_register(function ($className) {
    try{
        require_once(dirname(__FILE__).$className.".php");
    }finally{}
});

//クライアントとのデータのやりとりを管理
class MG{
    static $mCommand;   //コマンドキャッシュ
    static $mParams;    //パラメータキャッシュ
    //パラメータ処理用
    public static function getParam($name){
        //GETやPOSTに関わらず、統合してパラメータを受信
        if(Self::$mParams === null){
            if(isset($_GET["command"])){
                Self::$mCommand = $_GET["command"];
                Self::$mParams = array();
            }else{
                $json_string = file_get_contents('php://input');
                Self::$mParams = json_decode($json_string,true);
                Self::$mCommand = isset(Self::$mParams["command"])?Self::$mParams["command"]:"";
            }
        }
        if(isset(Self::$mParams[$name])){
            return Self::$mParams[$name];
        }
        if(isset($_GET[$name]))
            return $_GET[$name];
        return null;
    }
    //コマンド取得
    public static function getCommand(){
        if(Self::$mCommand !== null)
            return Self::$mCommand;
        return Self::getParam("command");
    }
    //命令実行処理
    public static function init(){
        //実行コマンドが送られてきているか？
        if(MG::getCommand() == "exec"){
            $values = [];   //戻り値格納用
            $funcs = MG::getParam("functions");
            foreach($funcs as $func_info){
                if(!isset($func_info["function"]))
                    break;
                //クラス名とファンクションを分ける
                $name = explode(".",$func_info["function"],2);
                if(count($name) != 2)
                    break;
                $class = $name[0];
                $func = DECORATION.$name[1];
                //実行可能か判断
                if(!property_exists($class,"JS_ENABLE") || !method_exists($class,$func))
                    break;
                $count = (new ReflectionClass($class))->getMethod($func)->getNumberOfRequiredParameters();
                if(count($func_info["params"]) < $count)
                    break;
                //命令の実行
                $values[] = $class::$func(...$func_info["params"]);
            }
            //全ての命令が実行できたか？
            if(count($values) != count($funcs))
                return ["result"=>0,"message"=>"execの実行失敗"];
            //データを返す
            return ["result"=>1,"message"=>"execの実行","values"=>$values];
        }
        return null;
    }
}

$result = MG::init();

if($result !== null){
    ob_start("ob_gzhandler");
    header("Access-Control-Allow-Origin: *");
    echo json_encode($result);
}
?>
