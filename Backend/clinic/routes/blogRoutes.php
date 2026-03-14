<?php

require_once __DIR__."/../config/database.php";
require_once __DIR__."/../controllers/BlogController.php";

header("Content-Type: application/json");

$db = Database::getConnection();
$controller = new BlogController($db);

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

switch($method){

    case 'GET':
        $response = $controller->getBlogs();
        break;

    case 'POST':
        $response = $controller->createBlog();
        break;

    case 'PUT':
        $response = $controller->updateBlog();
        break;

    case 'DELETE':
        $response = $controller->deleteBlogs();
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