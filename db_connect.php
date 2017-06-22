<?php

	if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
		define('DB_NAME', 'games');
		define('DB_USER', 'root');
		define('DB_PASSWORD', '');
	} else {
	    define('DB_NAME', '******');
	    define('DB_USER', '******');
	    define('DB_PASSWORD', '******');
	}

	$conn = mysqli_connect("localhost", DB_USER, DB_PASSWORD, DB_NAME) or die("Error connecting to the database!");

	//átállítja az adatbázis karakterkészletét (nem elég a meta tag-ben beállítani, ez vonatkozik az adatbázisra, nem a meta tag charset)
	$conn->set_charset("utf8");

?>