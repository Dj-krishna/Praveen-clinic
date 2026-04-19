<?php

class User {

    private $conn;
    private $table = "users";

    public function __construct($db){
        $this->conn = $db;
    }

    public function login($identifier, $password) {
        // Authenticate based on email or mobile
        $sql = "SELECT * FROM {$this->table} WHERE (email = :identifier OR mobile = :identifier) LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':identifier', $identifier, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // NOTE: Currently checking plain text password as per your seeded dummy data.
            // In a production environment, use password_verify() with hashed passwords.
            if ($password === $user['password']) {
                // Return safe user information (without password)
                unset($user['password']);
                return $user;
            }
        }

        return false;
    }
}
