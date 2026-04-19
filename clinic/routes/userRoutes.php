<?php

require_once __DIR__."/../config/database.php";
require_once __DIR__."/../controllers/UserController.php";

header("Content-Type: application/json");

$db = Database::getConnection();
$controller = new UserController($db);

$method = $_SERVER['REQUEST_METHOD'];
$override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null;
if ($method === 'POST') {
    $bodyMethod = $_POST['_method'] ?? ($_GET['_method'] ?? null);
    $override = $override ?: $bodyMethod;
}
if ($override) {
    $method = strtoupper($override);
}

$response = null;
$uri = $_SERVER['REQUEST_URI'];

switch($method){

    case 'POST':
        if (strpos($uri, '/api/users/login') !== false) {
            $response = $controller->login();
        } else {
             $response = [
                "status" => 404,
                "message" => "Endpoint not found"
            ];
        }
        break;

    default:
        $response = [
            "status" => 405,
            "success" => false,
            "message" => "Method Not Allowed"
        ];
}

http_response_code($response['status']);
echo json_encode($response);
