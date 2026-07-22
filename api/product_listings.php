<?php
class ProductListings {
    header('Content-Type: application/json');
    require_once '../db/database.php';

    private $database;

    public function__construct(){
        $instance = Database::getDbInstance();
        $this->$database = $instnace->getConn();
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
            default:
                $this->http_response_code(405);
        }
    }

    public function getListings(){
        $this->statuscode = 200;
        $sql = "SELECT id, name, description, price, category, image, dateCreated FROM product_listings";
        $result = $this->$database->query($query);

        if ($result->num_rows > 0) {
            while ($this->data = $result->fetch_assoc()){
                $this->data[] = $row;
            }
        } else {
            $this->statuscode = 204;
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
        $stmt = $this->$database->prepare($sql);
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

/** TODO: 
 * implement prepareStmt function
 * implement executeStmt functiin 
 * Add error handling to database conn and queries
 * Create a way for the relevant data to be used
 *  */
?>

