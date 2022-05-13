<?php
ob_start();
session_start();
include("db-config.php");
ini_set('display_errors', 1);

$_SESSION['last_page'] = "create_publication.php";

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIOWiki</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/fontawesome-free/css/all.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Tempusdominus Bootstrap 4 -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
    <!-- iCheck -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- DataTables -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/datatables-responsive/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/datatables-buttons/css/buttons.bootstrap4.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/dist/css/adminlte.min.css">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
    <!-- summernote -->
    <link rel="stylesheet" href="./AdminLTE-3.1.0/plugins/summernote/summernote-bs4.min.css">
</head>
<body class="hold-transition sidebar-mini layout-fixed">
</div>
<!-- wrapper -->
<div class="wrapper">
    <!-- Preloader -->
    <div class="preloader flex-column justify-content-center align-items-center">
        <img class="animation__shake" src="./AdminLTE-3.1.0/dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60">
    </div>

    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
        </ul>
        <?php
                if ($_SESSION["username"] == null) {
            ?>
                    <ul class="navbar-nav ml-auto">
                    <li class="nav-item" id="login">
                            <a class="nav-link" data-widget="control-sidebar" data-slide="true" onclick="document.location.href='http://localhost:9874/?page=SioWiki'" role="button">
                                Autenticar UAP
                            </a>
                        </li>
                        <li class="nav-item" id="login">
                            <a class="nav-link" data-widget="control-sidebar" data-slide="true" onclick="document.location.href='regist.php'" role="button">
                                Registo
                            </a>
                        </li>
                    </ul>
            <?php
                }
                else {
            ?>
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item" id="login">
                            <a class="nav-link" data-widget="control-sidebar" data-slide="true" onclick="document.location.href='logout.php'" role="button">
                                Logout
                            </a>
                        </li>
                    </ul>
            <?php
                }
            ?>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="main.php" class="brand-link">
            <img src="./AdminLTE-3.1.0/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
            <span class="brand-text font-weight-light">SIOWiki</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar">

            <?php
                if ($_SESSION["username"]) {
                    echo "<div class='user-panel mt-3 d-flex'>

                                <div class='info'>
                                    <p style='color: white'> Bem vindo, <b>". $_SESSION["username"] ."</b></p>
                                </div>
                            </div>";
                }
            ?>

            <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <!-- Add icons to the links using the .nav-icon class
                        with font-awesome or any other icon font library -->
                    <!--<li class="nav-item menu-open">
                        <a href="#" class="nav-link active">
                            <i class="nav-icon fas fa-tachometer-alt"></i>
                            <p>
                                Dashboard
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="./index.html" class="nav-link active">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Dashboard v1</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="./index2.html" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Dashboard v2</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="./index3.html" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Dashboard v3</p>
                                </a>
                            </li>
                        </ul>
                    </li>-->
                    <li class="nav-item menu-open">
                        <a href="#" class="nav-link active">
                            <i class="far fa-circle nav-icon"></i>
                            <p>
                                Publicações
                            </p>
                        </a>
                    </li>
                    <li class="nav-item menu-open">
                        <a href="#" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>
                                As minhas publicações 
                                <span class="badge badge-info right">6</span>
                            </p>
                        </a>
                    </li>
                    <li class="nav-item menu-open">
                        <a href="#" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>
                                A minha conta
                            </p>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
            <form method="post" enctype="multipart/form-data">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <input class="m-0" placeholder="Título" name="title1">
                    </div>
                </div>
            </div>
            <?php 
                $titulo = $_POST['title1'];
            ?>
            <!-- /.container-fluid -->
        </div>
        <!-- /.content-header -->

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row card-body">
                                        <div class="col-12">
                                            <textarea id="summernote" name="text"></textarea>
                                                <div class="form-group">
                                                    <div class="custom-file">
                                                        <input name="fileToUpload" type="file" class="custom-file-input" id="customFile" accept="image/png, image/jpeg, image/jpg, application/pdf, .csv">
                                                        <label class="custom-file-label" for="customFile">Choose file</label>
                                                    </div>
                                                </div>
                                            
                                        </div>
                                    </div>
                                    <div class="ml-auto" style="right: 0">
                                        <input type="submit" name="submit" class="btn btn-primary btn-sm ml-auto"  id="btn_submit" value="Publicar" />
                                    </div>

                                    <?php 
                                                    if (empty($_SESSION['id'])){
                                                        $url = urlencode("http://localhost:5000/send_hello");
                                                        echo "<script>document.location.href = 'http://localhost:9874/?page=SioWiki&url=".$url."';</script>";
                                                    }
                                                    
                                                    if(isset($_POST["submit"])) {
                                                        if (!empty($_POST['text']) && !empty($_POST['title1'])) {
                                                            $content = $_POST['text'];
                                                            
                                                
                                                            $q = "INSERT into Publications (title, content, created_by, created_on) VALUES ('$titulo', '$content', ".$_SESSION['id'].", NOW() )";
                                                            $result = mysqli_query($con, $q);
                                                            if ($result) {
                                                                echo "<script>alert('Publicação enviada com sucesso!');</script>";
                                                                $_POST['text'] = "";
                                                                $_POST['title1'] = "";


                                                                $target_dir = "./Files/";
                                                                $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
                                                                $uploadOk = 1;

                                                                $fileextensions = ["pdf", "jpeg", "png", "jpg", "csv"];
                                                                $arr = explode(".", basename($_FILES["fileToUpload"]["name"]));
                                                                $ext = strtolower(end($arr));

                                                                if(!in_array($ext, $fileextensions))
                                                                {
                                                                    echo "You can only upload files in format pdf, jpeg, png, jpg and csv.";
                                                                    $uploadOk = 0;
                                                                }
                                                                
                                                                if (file_exists($target_file)) {
                                                                    echo "Sorry, file already exists.";
                                                                    $uploadOk = 0;
                                                                }
                                                                
                                                                if ($uploadOk == 1) {
                                                                    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                                                                        echo "The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["name"])). " has been uploaded.";
                                                                        
                                                                        // Mover ficheiro para a db
                                                                        $query = "SELECT LAST_INSERT_ID()";
                                                                        $result = mysqli_query($con, $query);
                                                                        if ($result) {
                                                                            $id = mysqli_fetch_row($result);

                                                                            $q = "INSERT into Files VALUES (".$id[0].", '".$_FILES["fileToUpload"]["name"]."', ".$_SESSION['id'].", NOW() )";
                                                                            $result = mysqli_query($con, $q);
                                                                        }
                                                                        

                                                                        header("Location: main.php");
                                                                    } else {
                                                                      echo "Sorry, there was an error uploading your file.";
                                                                    }
                                                                  }
                                                                
                                                            } else {
                                                                echo "<script>alert('Erro ao enviar publicação!');</script>";
                                                            }
                                                            $_POST['text'] = "";
                                                            $_POST['title1'] = "";
                                                        }
                                                        else{
                                                            echo "<script>alert('Campos vazios!');</script>";
                                                        }

                                                    }
                                                    
                                                ?>

                                </div>
                            </div>
                        </div>
            </form>
                    </div>
                </div>
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->

        <footer class="main-footer">
            <strong>equipa_14 | SIO</strong>
            trabalho prático 2
            <div class="float-right d-none d-sm-inline-block">
                3.º ano | 1.º semestre
            </div>
        </footer>

    </div>
    <!-- ./wrapper -->
<!-- jQuery -->
<script src="./AdminLTE-3.1.0/plugins/jquery/jquery.min.js"></script>
<!-- jQuery UI 1.11.4 -->
<script src="./AdminLTE-3.1.0/plugins/jquery-ui/jquery-ui.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
  $.widget.bridge('uibutton', $.ui.button)
</script>
<!-- Bootstrap 4 -->
<script src="./AdminLTE-3.1.0/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="./AdminLTE-3.1.0/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
<!-- DataTables  & Plugins -->
<script src="./AdminLTE-3.1.0/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/jszip/jszip.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/pdfmake/pdfmake.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/pdfmake/vfs_fonts.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-buttons/js/buttons.html5.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-buttons/js/buttons.print.min.js"></script>
<script src="./AdminLTE-3.1.0/plugins/datatables-buttons/js/buttons.colVis.min.js"></script>
<!-- AdminLTE App -->
<script src="./AdminLTE-3.1.0/plugins/bs-custom-file-input/bs-custom-file-input.min.js"></script>

<script src="./AdminLTE-3.1.0/dist/js/adminlte.js"></script>
<!-- Summernote -->
<script src="./AdminLTE-3.1.0/plugins/summernote/summernote-bs4.min.js"></script>
<script>
    $(function () {
        // Summernote
        $('#summernote').summernote({
            height: 250,
        });
        bsCustomFileInput.init();

    })
</script>
</body>
</html>