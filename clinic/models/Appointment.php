<?php

class Appointment {

    private $conn;
    private $table = "appointments";

    public function __construct($db){
        $this->conn = $db;
    }

    // ✅ Get appointments with FULL patient details
    public function getAppointments($filters = []){

        $sql = "SELECT 
                    a.*, 
                    p.fullName, 
                    p.mobile, 
                    p.email, 
                    p.gender, 
                    p.age, 
                    p.dateOfBirth, 
                    p.countryCode
                FROM appointments a
                LEFT JOIN patients p ON a.patientID = p.patientID
                ORDER BY a.appointmentID ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function getById($id){

        $sql = "SELECT 
                    a.*, 
                    p.fullName, 
                    p.mobile, 
                    p.email, 
                    p.gender, 
                    p.age, 
                    p.dateOfBirth, 
                    p.countryCode
                FROM appointments a
                LEFT JOIN patients p ON a.patientID = p.patientID
                WHERE a.appointmentID = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id",$id,PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch();
    }

    // ✅ CREATE: Insert patient → then appointment
    public function create($data){

        // Required fields from UI
        $required = ['fullName','mobile','doctorID','appointmentDate'];

        foreach($required as $field){
            if(empty($data[$field])){
                return false;
            }
        }

        try {
            // 🔥 Start transaction
            $this->conn->beginTransaction();

            // 1️⃣ Insert into patients table
            $patientSql = "INSERT INTO patients 
                (fullName, mobile, email, gender, age, dateOfBirth, countryCode)
                VALUES 
                (:fullName, :mobile, :email, :gender, :age, :dateOfBirth, :countryCode)";

            $stmt = $this->conn->prepare($patientSql);

            $stmt->execute([
                ":fullName" => $data['fullName'],
                ":mobile" => $data['mobile'],
                ":email" => $data['email'] ?? null,
                ":gender" => $data['gender'] ?? null,
                ":age" => $data['age'] ?? null,
                ":dateOfBirth" => $data['dateOfBirth'] ?? null,
                ":countryCode" => $data['countryCode'] ?? '+91'
            ]);

            $patientID = $this->conn->lastInsertId();

            // 2️⃣ Insert into appointments table
            $appointmentSql = "INSERT INTO appointments
                (patientID, doctorID, appointmentDate, appointmentStatus)
                VALUES
                (:patientID, :doctorID, :appointmentDate, :appointmentStatus)";

            $stmt = $this->conn->prepare($appointmentSql);

            $stmt->execute([
                ":patientID" => $patientID,
                ":doctorID" => $data['doctorID'],
                ":appointmentDate" => $data['appointmentDate'],
                ":appointmentStatus" => $data['appointmentStatus'] ?? 'Scheduled'
            ]);

            $appointmentID = $this->conn->lastInsertId();

            // ✅ Commit transaction
            $this->conn->commit();

            return $this->getById($appointmentID);

        } catch (Exception $e) {
            // ❌ Rollback on error
            $this->conn->rollBack();
            return false;
        }
    }

    public function delete($id){

        $sql = "DELETE FROM {$this->table} WHERE appointmentID = :id";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":id"=>$id
        ]);
    }
}