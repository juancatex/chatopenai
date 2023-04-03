<?php
 
class DbConnect {  
    function connect() { 
        // define('DB_USERNAME','id19433939_userai');
        // define('DB_PASSWORD','WP#6Q&vZhc[?S6&u');
        // define('DB_HOST','localhost');
        // define('DB_NAME','id19433939_openai');
        define('DB_USERNAME','root');
        define('DB_PASSWORD','');
        define('DB_HOST','localhost');
        define('DB_NAME','ia');
        try {
            $this->conn = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USERNAME, DB_PASSWORD,[
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET lc_time_names='es_ES'" 
               ]);
            $this->conn->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
            $this->conn->exec("set names utf8mb4");
        } catch (PDOException $e) {
            echo "  <p>Error: " . $e->getMessage() . "</p>\n";
            exit();
        } 
        return $this->conn;
    }
	 

} 