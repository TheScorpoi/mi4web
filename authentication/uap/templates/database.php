<?php
// Create connection
$DBUSER = 'root';
$DBPASS = 'password';

$con=mysqli_connect('db',$DBUSER,$DBPASS,'mi4web');

$q = "SELECT * FROM not_accepted";

$result = $con->query($q);

echo "AAAAAAHHHHHHHHHHAAAAAAAAAHHHHHHHHH"
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
    echo "<br> id: ". $row. "<br>";
     }
} else {
    echo "0 results";
}

// Check connection
if (mysqli_connect_errno($con))
  {
  echo "<font style=\"color:#FF0000\">Could not connect:". mysqli_connect_error()."</font\>";
  }
?>