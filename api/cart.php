<?php 
require_once '../db/database.php';
session_start();

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

    public function handle_request($method){
        header('Content-Type: application/json');
        switch($method){
            case 'GET':
                $this->getCart();
                break;
                
            case 'POST':
                $this->addToCart();
                break;
        }
        http_response_code($this->statuscode);

        if (!empty($this->data)) {
            echo json_encode($this->data);
        }
    }

    // add selected product to cart
    public function addToCart() {
        if (!isset($_SESSION['logged_in']['id'])) {
            $this->statuscode = 401;
            return;
        }
    
        $userId = $_SESSION['logged_in']['id'];
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!isset($data['listing_id'])) {
            $this->statuscode = 400;
            return;
        }
    
        $listingId = $data['listing_id'];
    
        // insert into cart table
        $sql = "INSERT INTO cart (userId, listingId) VALUES (?, ?)";
        $stmt = $this->prepareStmt($sql);
    
        if (!$stmt) {
            $this->statuscode = 500;
            return;
        }
    
        $stmt->bind_param("ii", $userId, $listingId);
    
        if ($stmt->execute()) {
            $this->statuscode = 201;
        } else {
            $this->statuscode = 500;
        }
    }

   public function getCart(){

    $userId = $_SESSION['logged_in']['id'];

    $sql = "SELECT p.listingId, p.name, p.price, p.image
            FROM cart c
            JOIN product_listings p ON c.listingId = p.listingId
            WHERE c.userId = ?";

    $stmt = $this->prepareStmt($sql);
    $stmt->bind_param("i", $userId);

        if($stmt->execute()){
            $result = $stmt->get_result();
            $this->data = $result->fetch_all(MYSQLI_ASSOC);
            $this->statuscode = 200;
        }
    }
    
    private function prepareStmt(string $sql): mysqli_stmt|false{
        $stmt = $this->database->prepare($sql);
        if (!$stmt) {
            $this->statuscode = 500;
            return false;
        }
        return $stmt;
    }

    private function executeStmt(mysqli_stmt $stmt): bool{
        if (!$stmt->execute()) {
            $this->statuscode = 500;
            return false;
        }
        return true;
    }
}

$api = new cart();
$api->handle_request($_SERVER['REQUEST_METHOD']);
?>