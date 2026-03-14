<?php

class Appointment {

    private $conn;
    private $table = "appointments";

    public function __construct($db){
        $this->conn = $db;
    }

    public function getAppointments($filters = []){

        $allowed = [
            'patientID' => PDO::PARAM_INT,
            'doctorID' => PDO::PARAM_INT,
            'appointmentStatus' => PDO::PARAM_STR,
            'appointmentDate' => PDO::PARAM_STR,
        ];

        $where = [];
        $params = [];

        if (!is_array($filters)) {
            $filters = [];
        }

        foreach ($allowed as $key => $pdoType) {
            if (!array_key_exists($key, $filters)) {
                continue;
            }

            $value = $filters[$key];
            if ($value === null || $value === '') {
                continue;
            }

            $paramName = ':' . $key;
            $where[] = "{$key} = {$paramName}";
            $params[] = [$paramName, $value, $pdoType];
        }

        $sql = "SELECT * FROM {$this->table}";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        // Return results in ascending order by primary key
        $sql .= " ORDER BY appointmentID ASC";

        $stmt = $this->conn->prepare($sql);
        foreach ($params as [$name, $value, $type]) {
            $stmt->bindValue($name, $value, $type);
        }
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function getAll(){

        // Return all appointments ordered by primary key ascending
        $sql = "SELECT * FROM {$this->table} ORDER BY appointmentID ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }


    public function getById($id){

        $sql = "SELECT * FROM {$this->table} WHERE appointmentID = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id",$id,PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch();
    }


    public function create($data){

        $required = ['patientID','doctorID','appointmentDate','appointmentStatus'];

        foreach($required as $field){
            if(empty($data[$field])){
                return false;
            }
        }

        $sql = "INSERT INTO {$this->table}
                (patientID, doctorID, appointmentDate, appointmentStatus)
                VALUES
                (:patientID, :doctorID, :appointmentDate, :appointmentStatus)";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            ":patientID"=>$data['patientID'],
            ":doctorID"=>$data['doctorID'],
            ":appointmentDate"=>$data['appointmentDate'],
            ":appointmentStatus"=>$data['appointmentStatus']
        ]);

        $id = $this->conn->lastInsertId();

        return $this->getById($id);
    }


    public function update($id,$data){

        $fields = [];
        $params = [];

        if(isset($data['patientID'])){
            $fields[] = "patientID = :patientID";
            $params[':patientID'] = $data['patientID'];
        }

        if(isset($data['doctorID'])){
            $fields[] = "doctorID = :doctorID";
            $params[':doctorID'] = $data['doctorID'];
        }

        if(isset($data['appointmentDate'])){
            $fields[] = "appointmentDate = :appointmentDate";
            $params[':appointmentDate'] = $data['appointmentDate'];
        }

        if(isset($data['appointmentStatus'])){
            $fields[] = "appointmentStatus = :appointmentStatus";
            $params[':appointmentStatus'] = $data['appointmentStatus'];
        }

        if(empty($fields)){
            return false;
        }

        $params[':id'] = $id;

        $sql = "UPDATE {$this->table}
                SET ".implode(", ",$fields)."
                WHERE appointmentID = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $this->getById($id);
    }


    public function delete($id){

        $sql = "DELETE FROM {$this->table} WHERE appointmentID = :id";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":id"=>$id
        ]);
    }

}