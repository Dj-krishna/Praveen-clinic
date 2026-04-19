<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__."/../models/Appointment.php";

class AppointmentController {

    private $appointmentModel;

    public function __construct($db){
        $this->appointmentModel = new Appointment($db);
    }

    public function getAppointments($filters = []){

        $appointments = $this->appointmentModel->getAppointments($filters);

        return [
            "status" => 200,
            "data" => $appointments
        ];
    }


    public function getAppointmentById($id){

        $appointment = $this->appointmentModel->getById($id);

        if(!$appointment){
            return [
                "status" => 404,
                "message" => "Appointment not found"
            ];
        }

        return [
            "status" => 200,
            "data" => $appointment
        ];
    }


    public function createAppointment(){

        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data) || empty($data)) {
            $data = $_POST ?? [];
            if (is_array($data)) {
                unset($data['_method']);
            }
        }

        if(!is_array($data) || empty($data)){
            return [
                "status" => 400,
                "message" => "Invalid request body"
            ];
        }

        $result = $this->appointmentModel->create($data);

        if(!$result){
            return [
                "status" => 400,
                "message" => "Missing required fields"
            ];
        }

        return [
            "status" => 201,
            "message" => "Appointment created successfully",
            "data" => $result
        ];
    }


    public function updateAppointment($id){

        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data) || empty($data)) {
            $data = $_POST ?? [];
            if (is_array($data)) {
                unset($data['_method']);
            }
        }

        if(!is_array($data) || empty($data)){
            return [
                "status" => 400,
                "message" => "No data provided for update"
            ];
        }

        $result = $this->appointmentModel->update($id,$data);

        if(!$result){
            return [
                "status" => 400,
                "message" => "Nothing to update"
            ];
        }

        return [
            "status" => 200,
            "message" => "Appointment updated successfully",
            "data" => $result
        ];
    }


    public function deleteAppointment($id){

        $deleted = $this->appointmentModel->delete($id);

        if(!$deleted){
            return [
                "status" => 500,
                "message" => "Delete failed"
            ];
        }

        return [
            "status" => 200,
            "message" => "Appointment deleted successfully"
        ];
    }

}