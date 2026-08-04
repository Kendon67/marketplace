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

    // handle requests made to the user API
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
                } elseif($_GET['action'] === 'logout') {
                    $this->logout();
                }elseif($_GET['action'] === 'changeUsername') {
                    $this->changeUsername();
                }elseif($_GET['action'] === 'changeEmail') {
                    $this->changeEmail();
                }elseif($_GET['action'] === 'changePassword') {
                    $this->changePassword();
                }
                else {
                    $this->statuscode = 400;
                }
                break;
            case 'DELETE':
                $this->deleteUser();
                break;
            default:
                $this->statuscode = 405;
        }
        http_response_code($this->statuscode);

        if (!empty($this->data)) {
            echo json_encode($this->data);
        }
    }

    // add the user into database
    public function addUser(){
        if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password'])) {
            $this->statuscode = 400;
            return;
        }

        $username = htmlspecialchars(strip_tags(trim($_POST['username'])));
        $email = htmlspecialchars(strip_tags(trim($_POST['email'])));
        $password = $_POST['password'];

        if (!$this->validatePassword($password)) {
            return;
        }
    
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO `users` (username, email, password) VALUES (?, ?, ?);";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        $stmt->bind_param("sss", $username, $email, $hashedPassword);
        if ($this->executeStmt($stmt)) {
            $this->statuscode = 201;
            
        }
    }

    // check the user exists in the database
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

    // delete the user from the database
    public function deleteUser(){
        $userId = $this->getUserId();
        $sql = "DELETE FROM `users` WHERE userId = ?";
        $stmt = $this->prepareStmt($sql);

        if (!$stmt) {
            $this->statuscode = 500;
            return false;
        }
        $stmt->bind_param("i", $userId);

        if ($this->executeStmt($stmt)) {
            $this->statuscode = 200;
            if ($stmt->affected_rows > 0) {
                session_unset();
                session_destroy();
    
                $this->statuscode = 200;
            }
        } else {
            $this->statuscode = 404;
        }
    }

    // change users username
    public function changeUsername(){
        if (!isset($_POST['username'])){
            $this->statuscode = 400;
            return;
        }

        $userId = $this->getUserId();
        $username = htmlspecialchars(strip_tags(trim($_POST['username'])));

        $sql = "UPDATE `users` SET username = ? WHERE userId = ?";
        $stmt = $this->prepareStmt($sql);

        if (!$stmt) {
            return;
        }

        $stmt->bind_param("si", $username, $userId);
        if ($this->executeStmt($stmt)) {
            if ($stmt->affected_rows > 0) {
                $this->statuscode = 200;
            } else {
                $this->statuscode = 404;
            }
        }
    }   

    // change the users email
    public function changeEmail(){
        if (!isset($_POST['email'])){
            $this->statuscode = 400;
            return;
        }

        $userId = $this->getUserId();
        $email= htmlspecialchars(strip_tags(trim($_POST['email'])), FILTER_SANITIZE_EMAIL, FILTER_VALIDATE_EMAIL);

        $sql = "UPDATE `users` SET email = ? WHERE userId = ?";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        $stmt->bind_param("si", $email, $userId);
        if ($this->executeStmt($stmt)) {
            if ($stmt->affected_rows > 0) {
                $this->statuscode = 200;
            } else {
                $this->statuscode = 404;
            }
        }
    }

    // change the users password
    public function changePassword(){
        if (!isset($_POST['password'])){
            $this->statuscode = 400;
            return;
        }

        $userId = $this->getUserId();
        $password = $_POST['password'];
        
        if (!$this->validatePassword($password)) {
            return; 
        }

        $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $sql = "UPDATE `users` SET password = ? WHERE userId = ?";
        $stmt = $this->prepareStmt($sql);

        if (!$stmt) {
            return;
        }

        $stmt->bind_param("si", $hashedPassword, $userId);
        if ($this->executeStmt($stmt)) {
            $this->statuscode = 200;
        } else {
            $this->statuscode = 404;
        }
    }

    // validate password input
    private function validatePassword(string $password){
        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
            $this->statuscode = 400;
            return false;
        }
        return true;
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

    public function getUserId(){
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