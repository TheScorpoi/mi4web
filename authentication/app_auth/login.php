<?php
ob_start();
session_start();
include("db-config.php");
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIOWiki | Login</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/fontawesome-free/css/all.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/dist/css/adminlte.min.css">
</head>
<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-logo">
            <a href="main.php"><b>SIO</b>Wiki</a>
        </div>
        <!-- /.login-logo -->
        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Inicie a sua sessão</p>
            
                <form method="post">
                    <div class="input-group mb-3">
                        <input class="form-control" placeholder="username" name="uid">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="Password" name="password">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <button type="submit" value="submit" class="btn btn-primary btn-block">Log In</button>
                    </div>
                </form>

                <div class="text-center mt-3">
                    <a style="cursor: pointer" onclick="document.location.href='regist.php'" >Criar uma conta</a>
                </div>
            </div>
        </div>
    </div>
    <!-- /.login-box -->
    
    <?php
    //echo md5("pa55w0rd");

    if (!empty($_REQUEST['uid'])) {
        $username = ($_REQUEST['uid']);
        $pass = $_REQUEST['password'];

        $q = sprintf("SELECT * FROM Users WHERE username='%s' AND pass='%s'", mysqli_real_escape_string($con, $username),mysqli_real_escape_string($con, hash('sha3-512', $pass)));
        #hash('ripemd160', 'The quick brown fox jumped over the lazy dog.');
        $result = mysqli_query($con,$q);

        // if (!$result) {
        //     printf("%s\n", mysqli_error($con));
        //     echo "error";
        // }

        if (mysqli_warning_count($con)) { 
            $e = mysqli_get_warnings($con); 
            if ($e){
                do { 
                    echo "Warning: $e->errno: $e->message\n"; 
                } while ($e->next()); }
        } 

        echo "<br /><br />";
        $row = mysqli_fetch_array($result);
        
        if ($row){
            $_SESSION["id"] = $row[0];
            $_SESSION["username"] = $row[1];
            $_SESSION["pass"] = $row[2]; //! depois ver isto e tentar fazer uma vulnerabilidade tipo a aparecer o nome do user e a pass dele
            //ob_clean();
            echo 'Login Success';
            
            if ($_SESSION["last_page"] == "publication.php"){
                header("Location: publication.php?publication=".$_SESSION['last_id']);
            } 
            elseif($_SESSION["last_page"] == "create_publication.php"){
                header("Location: create_publication.php");
            }else {
                header("Location: main.php");
            }
        } else{
            echo "<font style=\"color:#FF0000\">Invalid password!</font\>";
        }
            
    }
?>



<!-- jQuery -->
<script src="./AdminLTE-3.1.0/plugins/jquery/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="./AdminLTE-3.1.0/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="./AdminLTE-3.1.0/dist/js/adminlte.min.js"></script>
</body>
</html>