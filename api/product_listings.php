<?php
require_once '../db/database.php';

class ProductListings {
    private mysqli $database;
    private int $statuscode = 500;
    private array $data = []; 

    public function __construct(){
        $instance = Database::getDbInstance();
        $this->database = $instance->getConn();
    }

    public function handle_request($method){
        header('Content-Type: application/json');
        switch($method){
            case 'GET':
                $this->getListings();
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

        // create statement for db retrieval
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

    public function getListingId(){
        $sql = "SELECT id FROM product_listings WHERE name = ?";
    }



    public function addListing(){
        $this->statuscode = 400;
        if (!isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['price']) 
        || !isset($_POST['category']) || !isset($_POST['image'])) {
            return;
        }
        
        // sql injection prevention
        $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
        $description = htmlspecialchars(strip_tags(trim($_POST['description'])));
        $price = htmlspecialchars(strip_tags(trim($_POST['price'])));
        $category = htmlspecialchars(strip_tags(trim($_POST['category'])));
        $image = htmlspecialchars(strip_tags(trim($_POST['image'])));

        $sql = "INSERT INTO `product_lisings`(name, description, price, category, image) VALUES (?,?,?,?,?);";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        $stmt->bind_param("ssdss", $name, $description, $price, $category, $image);
        if ($this->executeStatement($stmt)) {
            $this->statuscode = 201;
            $this->date = ["listingId" => $stmt->insert_id,
                "name" => $name,
                "description" => $description,
                "price" => $price,
                "category" => $category,
                "image" => $image
            ];
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

    private function executeStatement(mysqli_stmt $stmt){
        if ($stmt->execute()) {
            return true;
        } else {
            $this->statuscode = 500;
            return false;
        }
    }
}

$api = new ProductListings();
$api->handle_request($_SERVER['REQUEST_METHOD']);
/** TODO: 
 * Add error handling to database conn and queries
 * Create a way for the relevant data to be used
 *  */


    public function deleteListing(){
        // $sql = 'DELETE FROM product_listings WHERE id = ?';
    }

?>



