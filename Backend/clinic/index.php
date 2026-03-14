<?php

header("Content-Type: application/json");

$uri = $_SERVER['REQUEST_URI'];

if (strpos($uri, '/api/appointments') !== false) {

    require "routes/appointmentRoutes.php";

} elseif (strpos($uri, '/api/blogs') !== false) {

    require "routes/blogRoutes.php";

} else {

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Route not found"
    ]);
}