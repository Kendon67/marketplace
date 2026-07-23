<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'database.php'; // Include the database.php file

echo "Starting database connection test...\n";

try {
    // Get the database instance
    echo "Getting database instance...\n";
    $dbInstance = Database::getDbInstance();

    // Get the connection object
    echo "Getting connection object...\n";
    $connection = $dbInstance->getConn();

    // Check if the connection is successful
    echo "Checking connection...\n";
    if ($connection->ping()) {
        echo "Database connection is successful!\n";
    } else {
        echo "Database connection failed.\n";
    }
} catch (Exception $e) {
    // Catch any exceptions and display the error message
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Test complete.\n";