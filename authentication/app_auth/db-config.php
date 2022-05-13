<?php
// Create connection
$DBUSER = 'root';
$DBPASS = 'root';

$con=mysqli_connect('db',$DBUSER,$DBPASS,'SIO_P1');

$q = "SELECT * FROM Users";

$result = $con->query($q);

if ($result->num_rows > 0) {
    // output data of each row
    // while($row = $result->fetch_assoc()) {
    //     echo "<br> id: ". $row["id"]. " - Name: ". $row["username"]. " - Pass " . $row["pass"] . "<br>";
    // }
} else {
    echo "0 results";
}

// Check connection
if (mysqli_connect_errno($con))
  {
  echo "<font style=\"color:#FF0000\">Could not connect:". mysqli_connect_error()."</font\>";
  }
?>