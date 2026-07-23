<?php
class Database{
    private mysqli $database;
    private static ?Database $instance = null;

    private function __construct(){
        $this->database = new mysqli("localhost", "cm2252_user", ".qwertyuio", "cm2252_marketDB");
        if ($this->database->connect_errno > 0) {
            http_response_code(500);
            exit();
        } 
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

