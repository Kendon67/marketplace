<?php
class Database{
    private mysqli $database;
    private static ?Database $instance = null;

    private function __construct() {
        $this->database = new mysqli('localhost', 
       'cm2252_user', 
        '.qwertyuiop', 
        'cm2252_marketDB');

        if ($this->database->connect_error) {
            die("Connection failed: " . $this->database->connect_error);
        }
        echo "Connected successfully";
    }

    public static function getDbInstance(): ?Database{
        if (self::$instance === null){
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConn(){
        return $this->database;
    }
}
?>

