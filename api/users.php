<?php
session_start();
require_once '../db/database.php';

class users{
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
                $this->getListings();
                break;
                
            case 'POST':
                if($_GET['action'] === 'addUser') {
                    $this->addUser();
                } elseif($_GET['action'] === 'checkUser') {
                    $this->checkUser();
                } elseif($_GET['action'] === 'logout'){
                    $this->logout();
                }
                else {
                    $this->statuscode = 400;
                }
                break;
            case 'DELETE':
                if($_GET['action'] === 'deleteListing') {
                    $this->deleteListing();
                } elseif($_GET['action'] === 'deleteUser') {
                    $this->deleteUser();
                } else{
                    $this->$statuscode = 400;
                }
                break;
            default:
                $this->statuscode = 405;
        }
        http_response_code($this->statuscode);

        if (!empty($this->data)) {
            echo json_encode($this->data);
        }
    }

    public function addUser(){
        if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password'])) {
            $this->statuscode = 400;
            return;
        }

        $username = htmlspecialchars(strip_tags(trim($_POST['username'])));
        $email = htmlspecialchars(strip_tags(trim($_POST['email'])));
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO `users` (username, email, password) VALUES (?, ?, ?);";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        $stmt->bind_param("sss", $username, $email, $password);
        if ($this->executeStmt($stmt)) {
            $this->statuscode = 201;
        }
    }

    public function checkUser(){
        if (!isset($_POST['email']) || !isset($_POST['password'])) {
            $this->statuscode = 400;
            return;
        }
    
        $email = $_POST['email'];
        $password = $_POST['password'];
    
        $sql = "SELECT userId, password FROM `users` WHERE email = ?;";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }
    
        $stmt->bind_param("s", $email);
        if (!$stmt->execute()) {
            $this->statuscode = 500;
            return;
        }
    
        $result = $stmt->get_result();
    
        if ($result->num_rows === 0) {
            $this->statuscode = 404;
            return;
        }
    
        $row = $result->fetch_assoc();
        $hashedPassword = $row['password'];
        
        if (password_verify($password, $hashedPassword)) {
            $_SESSION = []; 
            session_regenerate_id(true);
            $this->statuscode = 200;
            $this->saveLogin($row['userId']);
        } else {
            $this->statuscode = 401;
        }
    }

    public function deleteUser(){
        if (!isset($_SESSION['logged_in']['id'])) {
            $this->statuscode = 401;
            return false;
        }

        $userId = $_SESSION['logged_in']['id'];

        $sql = "DELETE FROM `users` WHERE userId = ?";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }
        $stmt->bind_param("i", $userId);

        if ($this->executeStmt($stmt)){
            session_unset();
            session_destroy();
            $this->statuscode = 200;
            return true;
        }     
        return false;
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
    private function executeStmt(mysqli_stmt $stmt): bool{
        if (!$stmt->execute()) {
            $this->statuscode = 500;
            return false;
        }
        return true;
    }

    // save user login session
    public function saveLogin(int $user_id){
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION['logged_in'] = ["id" => $user_id];
    }

    public function logged_in(): int|false {

        if (!isset ($_SESSION['logged_in'])) {
            return false;
        }

        return $_SESSION['logged_in']['id'];
    }

    public function logout(){
        session_unset();
        session_destroy();
        $this->statuscode = 200;
    }
}

$api = new users();
$api->handle_request($_SERVER['REQUEST_METHOD']);

?>