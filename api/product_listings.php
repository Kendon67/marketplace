<?php
class ProductListings {
    header('Content-Type: application/json');
    require_once '../db/database.php';

    private $database;

    public function__construct(){
        $instance = Database::getDbInstance();
        $this->$database = $instnace->getConn();
    }

    public function getListings(){
        $query = "SELECT * FROM product_listings";
        $result = $this->$database->query($query);

        $sql = "SELECT name,description,price,category,image,dateCreated FROM product_listings";
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



    public function prepareStmt($stmt){}

    public function executeStmt($stmt){}
}

/** TODO: 
 * implement prepareStmt function
 * implement executeStmt functiin 
 * Add error handling to database conn and queries
 * Create a way for the relevant data to be used
 *  */
?>

