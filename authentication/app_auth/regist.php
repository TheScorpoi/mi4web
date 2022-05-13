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
    <title>SIOWiki | Registo</title>

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
        
        <?php
            function show_error($msg) {
                echo "<div class='alert alert-danger alert-dismissible' style='margin-top: 10'>
                    <button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>
                    <h5><i class='icon fas fa-ban'></i>".$msg."</h5>
                </div>";
            }
        ?>

        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Crie a sua conta</p>
            
                <form method="post">
                    <div class="input-group mb-3">
                        <input class="form-control" placeholder="Username" name="uid">
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
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="Confirme a password" name="conf_password">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <button type="submit" value="submit" class="btn btn-primary btn-block">Registar</button>
                    </div>
                </form>

                <div class="text-center mt-3">
                    <a style="cursor: pointer" onclick="document.location.href='login.php'" >Já tem uma conta?</a>
                </div>
            </div>
        </div>
    </div>
    <!-- /.login-box -->
    
    <?php

if (!empty($_REQUEST['uid'])) {
    if (empty($_REQUEST["password"])){
        show_error("A password não pode estar vazia");
    }
    else {
        if (!empty($_REQUEST['uid'])) {
            $username = ($_REQUEST['uid']);
            $pass = $_REQUEST['password'];
            $conf_pass = $_REQUEST['conf_password'];


            $q_user = "SELECT username FROM Users where username = '".$username."'";
            $r_user = mysqli_query($con, $q_user);
            $row_user = $r_user -> fetch_assoc();

            if (strcmp($pass, $conf_pass) == 0 && empty($row_user["username"])) {
                $q = sprintf("INSERT INTO Users (username, pass) VALUES ('%s', '%s')", 
                    mysqli_real_escape_string($con, $username), mysqli_real_escape_string($con, hash('sha3-512', $pass)));

                $result = mysqli_query($con, $q);

                if ($result) {
                    // conta criada com sucesso
                    echo "<p>Conta registada com sucesso</p>";

                    // registar dados da sessão (basta username) e avançar
                    $_SESSION["username"] = $username;
                }
            }
            elseif(!empty($row_user["username"])){
                show_error("Este utilizador já existe");
            }
            else {
                show_error("As passwords são diferentes");
            }
        }
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