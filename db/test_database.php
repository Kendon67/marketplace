<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// filepath: /Users/connormccarthy/marketplace/db/test_database.php

require_once 'database.php'; // Include the database.php file

try {
    // Get the database instance
    $dbInstance = Database::getDbInstance();

    // Get the connection object
    $connection = $dbInstance->getConn();

    // Check if the connection is successful
    if ($connection->ping()) {
        echo "Database connection is successful!";
    } else {
        echo "Database connection failed.";
    }
} catch (Exception $e) {
    // Catch any exceptions and display the error message
    echo "Error: " . $e->getMessage();
}