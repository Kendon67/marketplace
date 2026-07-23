<?php
header('Content-Type: application/json');
require_once '../db/database.php';


class ProductListings {
    private $database;
    $this->data = []; 
    private int $statuscode = 500;

    public function __construct(){
        $instance = Database::getDbInstance();
        $this->database = $instance->getConn();
    }

    public function handle_request($method){
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
        }

        http_response_code($this->statuscode);
        if (!empty($this->data)) {
            echo json_encode($this->data);
        }
    }

    public function getListings(){
        $this->statuscode = 200;
        $sql = "SELECT id, name, description, price, category, image, dateCreated FROM product_listings";
        $stmt = $this->prepareStmt($sql);

        if ($this->executeStatement($stmt)) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()){
                    $this->data[] = $row;
                }
            } else {
                $this->statuscode = 204;
            }
        }
    }

    public function getListingId(){
        $sql = "SELECT id FROM product_listings WHERE name = ?";
    }

    // constructs and executes listing sql statement
    public function addListing(){
        $sql = 'INSERT INTO product_listings (name, description, price, category, image, dateCreated) 
        VALUES (?,?,?,?,?,?)';
        prepareStmt($sql);
        executeStmt($stmt){}
    }


    public function deleteListing(){
        $sql = 'DELETE FROM product_listings WHERE id = ?';
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
?>

