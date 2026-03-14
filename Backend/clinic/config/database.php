<?php

class Database {

    private static $instance = null;
    private $conn;

    private $host = "localhost";
    private $db   = "ClinicDB";
    private $user = "root";
    private $pass = "";

    private function __construct() {

        try {

            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db};charset=utf8mb4",
                $this->user,
                $this->pass
            );

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        } catch (PDOException $e) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "error" => "Database connection failed"
            ]);

            exit;
        }
    }

    public static function getConnection() {

        if (self::$instance === null) {
            self::$instance = new Database();
        }

        return self::$instance->conn;
    }
}