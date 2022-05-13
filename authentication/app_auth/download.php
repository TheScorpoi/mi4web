<?php
ob_start();
session_start();
include("db-config.php");
ini_set('display_errors', 1);

$url = $_SERVER['REQUEST_URI'];
$url_components = parse_url($url);
parse_str($url_components['query'], $params);
$filename = "./Files/" .$params['filename'];
$query = "SELECT * FROM Files WHERE publication_id = '".$_SESSION['last_id']."' AND nome = '".$params['filename']."'";
$result = mysqli_query($con, $query);

while($row = mysqli_fetch_assoc($result)) {  
    if (file_exists($filename)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filename));
        readfile($filename);
        exit;
    }
    
}
?>