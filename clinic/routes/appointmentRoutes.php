<?php

require_once __DIR__."/../config/database.php";
require_once __DIR__."/../controllers/appointmentController.php";

header("Content-Type: application/json");

$db = Database::getConnection();
$controller = new AppointmentController($db);

$method = $_SERVER['REQUEST_METHOD'];
$bodyMethod = $_POST['_method'] ?? ($_GET['_method'] ?? null);
if ($method === 'POST' && $bodyMethod) {
    $method = strtoupper($bodyMethod);
}

$rawBody = file_get_contents("php://input");
$jsonBody = json_decode($rawBody, true);
if (!is_array($jsonBody)) {
    $jsonBody = [];
}

$appointmentID = $_GET['appointmentID']
    ?? ($_GET['id'] ?? null)
    ?? ($jsonBody['appointmentID'] ?? ($jsonBody['id'] ?? null));

$filters = $_GET ?? [];
unset($filters['id'], $filters['appointmentID']);
unset($filters['_method']); // don't treat method override as a filter

$response = null;

switch ($method) {

    case "GET":

        if ($appointmentID !== null && $appointmentID !== '') {
            $response = $controller->getAppointmentById($appointmentID);
        } else {
            $response = $controller->getAppointments($filters);
        }

        break;


    case "POST":

        $response = $controller->createAppointment();
        break;


    case "PUT":

        if ($appointmentID === null || $appointmentID === '') {
            $response = [
                "status" => 400,
                "message" => "Appointment ID required"
            ];
            break;
        }

        $response = $controller->updateAppointment($appointmentID);
        break;


    case "DELETE":

        if ($appointmentID === null || $appointmentID === '') {
            $response = [
                "status" => 400,
                "message" => "Appointment ID required"
            ];
            break;
        }

        $response = $controller->deleteAppointment($appointmentID);
        break;


    default:

        $response = [
            "status" => 405,
            "message" => "Method Not Allowed"
        ];
}

http_response_code($response['status']);
echo json_encode($response);