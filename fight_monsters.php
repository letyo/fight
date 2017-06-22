<?php
	include_once "db_connect.php";

	$stmt = $conn->prepare("SELECT COUNT(*) FROM fight__monsters");
	$stmt->execute();
	$stmt->bind_result($i);

	while ($stmt->fetch()) {
		printf("%s", $i);
	}

	$stmt->close();
	
	$i = rand(1, $i);


	$stmt = $conn->prepare("SELECT * FROM fight__monsters WHERE id=$i");
	$stmt->execute();
	$stmt->bind_result($id, $name, $maxHP, $AP, $dmg, $DP);
	
	while ($stmt->fetch()) {
        printf("%s, %s, %s, %s, %s, %s", $id, $name, $maxHP, $AP, $dmg, $DP);
    }

	$stmt->close();

	mysqli_close($conn);
?>