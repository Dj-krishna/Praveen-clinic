<?php

class Blog {

    private $conn;
    private $table = "blogs";

    public function __construct($db){
        $this->conn = $db;
    }

    public function getBlogs($filters = []){

        // Explicitly select only public fields (exclude any internal columns)
        $baseSql = "SELECT blogID,title,url,category,blogContent,postThumbnail,postBanner,metaKeywords,metaDescription,tags,authorName,dateOfPost FROM {$this->table}";

        // Allow filtering by specific, whitelisted columns
        $allowed = [
            'blogID'      => PDO::PARAM_INT,
            'title'       => PDO::PARAM_STR,
            'url'         => PDO::PARAM_STR,
            'category'    => PDO::PARAM_STR,
            'authorName'  => PDO::PARAM_STR,
        ];

        $likeFields = ['title', 'category', 'authorName'];

        if (!is_array($filters)) {
            $filters = [];
        }

        $where = [];
        $params = [];

        foreach ($allowed as $key => $pdoType) {
            if (!array_key_exists($key, $filters)) {
                continue;
            }

            $value = $filters[$key];
            if ($value === null || $value === '') {
                continue;
            }

            $paramName = ':' . $key;

            if (in_array($key, $likeFields, true)) {
                $where[] = "{$key} LIKE {$paramName}";
                $value = "%{$value}%";
            } else {
                $where[] = "{$key} = {$paramName}";
            }

            $params[] = [$paramName, $value, $pdoType];
        }

        $sql = $baseSql;
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        // Return blogs ordered by primary key ascending
        $sql .= " ORDER BY blogID ASC";

        $stmt = $this->conn->prepare($sql);
        foreach ($params as [$name, $value, $type]) {
            $stmt->bindValue($name, $value, $type);
        }

        $stmt->execute();

        return $stmt->fetchAll();
    }


    public function getBlogById($blogID){

        // Explicitly select only public fields (exclude internal auto-increment id)
        $sql = "SELECT blogID,title,url,category,blogContent,postThumbnail,postBanner,metaKeywords,metaDescription,tags,authorName,dateOfPost FROM {$this->table} WHERE blogID = :blogID";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":blogID",$blogID,PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->fetch();
    }


    public function createBlog($data){

        // blogID is AUTO_INCREMENT in the database, so we do not insert it manually
        $sql = "INSERT INTO {$this->table}
        (title,url,category,blogContent,postThumbnail,postBanner,metaKeywords,metaDescription,tags,authorName,dateOfPost)
        VALUES
        (:title,:url,:category,:blogContent,:postThumbnail,:postBanner,:metaKeywords,:metaDescription,:tags,:authorName,:dateOfPost)";

        // Only pass the parameters that appear in the query (avoid HY093)
        $params = [
            ':title'          => $data['title'] ?? null,
            ':url'            => $data['url'] ?? null,
            ':category'       => $data['category'] ?? null,
            ':blogContent'    => $data['blogContent'] ?? null,
            ':postThumbnail'  => $data['postThumbnail'] ?? null,
            ':postBanner'     => $data['postBanner'] ?? null,
            ':metaKeywords'   => $data['metaKeywords'] ?? null,
            ':metaDescription'=> $data['metaDescription'] ?? null,
            ':tags'           => is_array($data['tags'] ?? null)
                                  ? json_encode($data['tags'])
                                  : ($data['tags'] ?? null),
            ':authorName'     => $data['authorName'] ?? null,
            ':dateOfPost'     => $data['dateOfPost'] ?? date("Y-m-d H:i:s"),
        ];

        $stmt = $this->conn->prepare($sql);

        if(!$stmt->execute($params)){
            return false;
        }

        $newId = $this->conn->lastInsertId();

        return $this->getBlogById($newId);
    }


    public function updateBlog($blogID,$data){

        $fields = [];
        $params = [];

        // Only allow updating known columns (avoid invalid placeholder names)
        $allowed = [
            'title',
            'url',
            'category',
            'blogContent',
            'postThumbnail',
            'postBanner',
            'metaKeywords',
            'metaDescription',
            'tags',
            'authorName',
            'dateOfPost'
        ];

        foreach($data as $key => $value){
            if(!in_array($key, $allowed, true)){
                continue;
            }

            if(is_array($value)){
                $value = json_encode($value);
            }

            $fields[] = "{$key} = :{$key}";
            $params[":{$key}"] = $value;
        }

        if(empty($fields)){
            return false;
        }

        $params[':blogID'] = $blogID;

        $sql = "UPDATE {$this->table}
                SET ".implode(", ",$fields)."
                WHERE blogID = :blogID";

        $stmt = $this->conn->prepare($sql);

        if(!$stmt->execute($params)){
            return false;
        }

        return $this->getBlogById($blogID);
    }


    public function deleteBlogs($ids){

        if(empty($ids)){
            return false;
        }

        $placeholders = implode(',', array_fill(0,count($ids),'?'));

        $sql = "DELETE FROM {$this->table} WHERE blogID IN ($placeholders)";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute($ids);
    }

}