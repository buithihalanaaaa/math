<?php
$key = $_POST['key'];

// データベース接続

$host = 'localhost';
$dbname = 'mymmldb';
$dbuser = 'cs16100';
$dbpass = 'gamxrsj';

try {
$dbh = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $dbuser,$dbpass, array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 var_dump($e->getMessage());
 exit;
}
// データ取得
$sql = "SELECT mml FROM file_mml_db WHERE filename = ?";
$stmt = ($dbh->prepare($sql));
$stmt->execute(array($key));

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$member = $row['mml'];


header('Content-type: text/html');
echo $member;
