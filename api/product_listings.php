<?php
class ProductListings {
    header('Content-Type: application/json');
    require_once '../db/database.php';

    private $database;

    public function__construct(){
        $instance = Database::getDbInstance();
        $database = $instnace->getConn();
    }

    public function getListings(){
        
        $query = "SELECT * FROM product_listings";
        $result = $database->query($query);

        $sql = "SELECT name,description,price,category,image,dateCreated FROM listings";
    }

    public function addListing(){}

    public function deleteListing(){}


    public function prepareStmt($stmt){}

    public function executeStmt($stmt){}
}
?>