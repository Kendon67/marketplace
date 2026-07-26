<?php 
require_once '../db/database.php';

class cart{
    private mysqli $database;
    private int $statuscode = 500;
    private array $data = []; 


    public function __construct(){
        $instance = Database::getDbInstance();
        $this->database = $instance->getConn();
    }

    public function __destruct(){
        $this->database->close();
    }

    public function addToCart(){

        $userId = $_SESSION['logged_in']['id'];
        $data = json_decode(file_get_contents("php://input"), true);
        $productId = $data['product_id'];

        $sql = "INSERT INTO cart (user_id, product_id)
                VALUES (?, ?)";
    
        $stmt = $this->prepareStmt($sql);
    
        $stmt->bind_param(
            "ii",
            $userId,
            $productId
        );
    
        if($stmt->execute()){
            $this->statuscode = 201;
        }
    }
    

}


?>