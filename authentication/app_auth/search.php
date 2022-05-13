<?php
ob_start();
session_start();
$_SESSION['last_page'] = "main.php";
include("db-config.php");
ini_set('display_errors', 1);

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
</head>
<body class="hold-transition sidebar-mini layout-fixed">
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

            <div class="input-group input-group-sm">
                <input class="form-control form-control-navbar" id="search_bar" type="search" placeholder="Search" aria-label="Search">
                <div class="input-group-append">
                    <button class="btn btn-navbar" onclick="search()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

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
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Pesquisa</h1>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <!-- /.card-header -->
                                <div class="card-header">
                                    <?php
                                        $url = $_SERVER['REQUEST_URI'];
                                        $url_components = parse_url($url);
                                        parse_str($url_components['query'], $params);
                                        $search = $params['search'];
                                        echo "<p>".htmlspecialchars($search)."</p>";
                                    ?>
                                </div>
                                <div class="card-body">
                                    <table id="publications" class="table table-bordered table-hover">
                                        <thead style="display: none;">
                                            <tr>
                                                <th>
                                                    Resultados
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                                $sql = "SELECT * FROM Publications WHERE title LIKE '%" . mysqli_real_escape_string($con, $search) . "%'";
                                                // $sql = "SELECT * FROM Publications WHERE title LIKE '%' UNION SELECT id, username as title, null, null, null, null, null FROM Users";
                                                $result = $con->query($sql);
                                                if ($result->num_rows > 0) {
                                                    while($row = $result->fetch_assoc()) {
                                                        echo "<tr onclick='see_publication(".$row["id"].")' style='cursor: pointer'>
                                                                <td>
                                                                    <h5 class='card-title'>". $row["title"] ."</h5>
                                                                </td>
                                                            </tr>";
                                                    }
                                                }
                                                ?>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- /.card-body -->
                            </div>
                        </div>
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
<script src="./AdminLTE-3.1.0/dist/js/adminlte.js"></script>

<!-- Page specific script -->
<script>
    $(function () {
        $('#publications').DataTable({
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "pageLength": 10,
        });
    });
    
    function see_publication(id) {
        document.location.href = "publication.php?publication=" + id
    }

    function search() {
        document.location.href = "search.php?search=" + document.getElementById("search_bar").value;
    }
</script>

</body>
</html>