<?php>

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
                $this->addListing();
                break;
            case 'DELETE':
                $this->deleteListing();
                break;
            default:
                $this->statuscode = 405;
        }
    }

    public function addUser(){
        if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password'])) {
            $this->statuscode = 400;
            return;
        }

        $username = htmlspecialchars(strip_tags(trim($_POST['username'];)))
        $email = htmlspecialchars(strip_tags(trim($_POST['email'])));
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO `users` (username, email, password) VALUES (?, ?, ?);";
        $stmt = $this->prepareStmt($sql);
        if (!$stmt) {
            return;
        }

        $stmt->bind_param("sss", $username, $email, $password);


    }
}