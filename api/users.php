<?php

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
                $this->addUser();
                break;
            case 'DELETE':
                $this->deleteListing();
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
        $email = $_POST['email'];
        $password = $_POST['password'];

        $sql = "SELECT password FROM `users` WHERE email = ?;";
        $stmt = $this->prepareStmt($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $this->statuscode = 404;
            return false;
        }

        $row = $result->fetch_assoc();
        $hashedPassword = $row['password'];

        if (password_verify($password, $hashedPassword)) {
            $this->statuscode = 200;
            return true;
        } else {
            $this->statuscode = 401;
            return false;
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

    private function executeStmt(mysqli_stmt $stmt): bool{
        if (!$stmt->execute()) {
            $this->statuscode = 500;
            return false;
        }
        return true;
    }
}
$api = new Users();
$api->handle_request($_SERVER['REQUEST_METHOD']);

?>