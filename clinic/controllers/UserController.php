<?php

require_once __DIR__."/../models/User.php";

class UserController {

    private $userModel;

    public function __construct($db){
        $this->userModel = new User($db);
    }

    public function login(){
        // Get payload data
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!is_array($data) || empty($data)) {
            $data = $_POST ?? [];
        }

        $identifier = $data['identifier'] ?? null; // Mobile or email
        $password = $data['password'] ?? null;

        if (empty($identifier) || empty($password)) {
            return [
                "status" => 400,
                "message" => "Please provide an email or mobile, along with the password"
            ];
        }

        $user = $this->userModel->login($identifier, $password);

        if (!$user) {
            return [
                "status" => 401,
                "message" => "Invalid credentials"
            ];
        }

        return [
            "status" => 200,
            "message" => "Login successful",
            "data" => $user
        ];
    }
}
