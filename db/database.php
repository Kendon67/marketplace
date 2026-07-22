<?php
class Database{
    private $database;
    private $statuscode = 500;

    public function __construct($host, $username, $password, $dbName) {
        $this->database = new mysqli($host, $username, $password, $dbName);
        if ($this->database->connect_error) {
            die("Connection failed: " . $this->database->connect_error);
        }
    }
}
?>