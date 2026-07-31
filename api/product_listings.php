<?php
require_once '../db/database.php';
session_start();

class ProductListings {
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

    // handle requests made to the product_listings API
    public function handle_request($method){
        header('Content-Type: application/json');
        switch($method){
            case 'GET':
                if (isset($_GET['action']) && $_GET['action'] === "userListings") {
                    $this->getUserListings();
                } else {
                    $this->getListings();
                }
                break;
            case 'POST':
                $this->addListing();
                break;
            case 'DELETE':
                $this->deleteListing();
                break;
            default:
                $this->statuscode = 405;
        }

        // encode and echo response for use in javascript
        http_response_code($this->statuscode);
        if (!empty($this->data)) {
            echo json_encode($this->data);
        }
    }

    // retrieves all listings in db 
    public function getListings(){
        $this->statuscode = 400;

        $sql = "SELECT listingId, name, description, price, category, image, dateCreated FROM `product_listings`;";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        if ($this->executeStatement($stmt)) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $this->statuscode = 200;
                $this->data = ["results" => $result->fetch_all(MYSQLI_ASSOC)];
            } else {
                $this->statuscode = 204;
            }
        }
    }

    // retrieves all listings in db 
    public function getUserListings(){
        $userId = $this->getUserId();

        $sql = "SELECT listingId, name, description, price, category, image, dateCreated 
        FROM `product_listings`
        WHERE userId = ?";

        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }
        $stmt->bind_param("i", $userId);

        if ($this->executeStatement($stmt)) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $this->statuscode = 200;
                $this->data = ["results" => $result->fetch_all(MYSQLI_ASSOC)];
            } else {
                $this->statuscode = 204;
            }
        }
    }

    // gets the id of a listing
    public function getListingId(){
        $sql = "SELECT id FROM product_listings WHERE name = ?";
    }

    // add a listing to the database
    public function addListing(){
        $userId = $this->getUserId();

        if (!isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['price']) 
        || !isset($_POST['category']) || !isset($_POST['image'])) {
    
            $this->statuscode = 400;
            return;
        }
    
        $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
        $description = htmlspecialchars(strip_tags(trim($_POST['description'])));
        $price = (float)$_POST['price'];
        $category = htmlspecialchars(strip_tags(trim($_POST['category'])));
        $image = htmlspecialchars(strip_tags(trim($_POST['image'])));
    
        $sql = "INSERT INTO `product_listings` 
                (userId, name, description, price, category, image) 
                VALUES (?, ?, ?, ?, ?, ?);";
    
        $stmt = $this->prepareStmt($sql);
    
        if (!$stmt) {
            return;
        }
    
        $stmt->bind_param("issdss", $userId, $name, $description, $price, $category, $image);
    
        if ($this->executeStatement($stmt)) {
            $this->statuscode = 201;
        }
    }
    
    // delete a listing from the database
    public function deleteListing() {
        if (!isset($_SESSION['logged_in'])) {
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
    
        $sql = "DELETE FROM product_listings 
                WHERE listingId = ? AND userId = ?";
    
        $stmt = $this->prepareStmt($sql);
    
        if (!$stmt) {
            return;
        }
    
        $stmt->bind_param("ii", $listingId, $userId);
    
        if ($this->executeStatement($stmt)) {
            $this->statuscode = 200;
        }
    }
    
    // prepare statement for execution
    private function prepareStmt(string $sql): mysqli_stmt|false{
        $stmt = $this->database->prepare($sql);
        if (!$stmt) {
            $this->statuscode = 500;
            return false;
        }
        return $stmt;
        
    }

    // execute statement
    private function executeStatement(mysqli_stmt $stmt){
        if ($stmt->execute()) {
            return true;
        } else {
            $this->statuscode = 500;
            return false;
        }
    }

    // retrieve id of currently logged in user
    public function getUserId(){
        if (!isset($_SESSION['logged_in'])) {
            $this->statuscode = 401;
            return;
        }
    
        return $_SESSION['logged_in']['id'];
    }
}

$api = new ProductListings();
$api->handle_request($_SERVER['REQUEST_METHOD']);
/* TODO: 
 * Add error handling to database conn and queries */
?>



