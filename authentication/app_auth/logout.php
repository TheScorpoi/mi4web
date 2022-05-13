<?php
include("db-config.php");
session_start();
session_destroy();

$q = sprintf("Update Users SET token=NULL WHERE username='%s'", mysqli_real_escape_string($con, $_SESSION['username']));
$result = mysqli_query($con,$q);

unset($_SESSION['username']);
header('Location:main.php');
?>