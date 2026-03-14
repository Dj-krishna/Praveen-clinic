<?php

require_once __DIR__."/../models/Blog.php";
require_once __DIR__."/../utils/helpers.php";

class BlogController {

    private $blog;

    public function __construct($db){
        $this->blog = new Blog($db);
    }


    public function getBlogs(){

        $filters = $_GET ?? [];

        // Support ?id=1 as alias for ?blogID=1
        if (isset($filters['id']) && !isset($filters['blogID'])) {
            $filters['blogID'] = $filters['id'];
        }

        $data = $this->blog->getBlogs($filters);

        return [
            "status" => 200,
            "success" => true,
            "count" => count($data),
            "data" => $data
        ];
    }


    public function createBlog(){

        $data = $_POST;

        if(empty($data['title'])){
            return [
                "status" => 400,
                "success" => false,
                "message" => "title required"
            ];
        }

        if(isset($_FILES['postThumbnail'])){
            $data['postThumbnail'] = uploadFile($_FILES['postThumbnail'],'thumbnails');
        }

        if(isset($_FILES['postBanner'])){
            $data['postBanner'] = uploadFile($_FILES['postBanner'],'banners');
        }

        $data['tags'] = normalizeTags($data['tags'] ?? null);

        $data['dateOfPost'] = date("Y-m-d H:i:s");

        $created = $this->blog->createBlog($data);

        if(!$created){
            return [
                "status" => 500,
                "success" => false,
                "message" => "Blog creation failed"
            ];
        }

        return [
            "status" => 201,
            "success" => true,
            "message" => "Blog created successfully",
            "data" => $created
        ];
    }


    public function updateBlog(){

        // Support both ?blogID=1 and ?id=1
        $blogID = $_GET['blogID'] ?? ($_GET['id'] ?? null);

        if(!$blogID){
            return [
                "status" => 400,
                "success" => false,
                "message" => "blogID required"
            ];
        }

        $data = [];

        // If using POST + _method=PUT, PHP will populate $_POST/$_FILES normally.
        if (!empty($_POST)) {
            $data = $_POST;
            unset($data['_method']);
        } else {
            $raw = file_get_contents("php://input");
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

            // PHP won't parse multipart/form-data for PUT/PATCH, so $_POST/$_FILES stay empty.
            // In that case the correct client approach is POST + _method=PUT (method override).
            if (stripos($contentType, 'multipart/form-data') !== false) {
                return [
                    "status" => 400,
                    "success" => false,
                    "message" => "multipart/form-data is not supported for PUT. Use POST with form-data and include _method=PUT, or send PUT with raw JSON.",
                    "examplePostman" => [
                        "method" => "POST",
                        "url" => "/php-api/api/blogs?blogID=".(string)$blogID,
                        "formData" => [
                            "_method" => "PUT",
                            "title" => "Updated title",
                            "category" => "Health",
                            "tags" => "tag1,tag2",
                            "postThumbnail" => "(file optional)",
                            "postBanner" => "(file optional)"
                        ]
                    ]
                ];
            }

            if (stripos($contentType, 'application/json') !== false) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $data = $decoded;
                }
            } else {
                parse_str($raw, $data);
            }
        }

        if(isset($_FILES['postThumbnail'])){
            $data['postThumbnail'] = uploadFile($_FILES['postThumbnail'],'thumbnails');
        }

        if(isset($_FILES['postBanner'])){
            $data['postBanner'] = uploadFile($_FILES['postBanner'],'banners');
        }

        if(isset($data['tags'])){
            $data['tags'] = normalizeTags($data['tags']);
        }

        // Remove any empty/unknown control fields that can come from forms
        unset($data['_method']);

        $updated = $this->blog->updateBlog($blogID,$data);

        if(!$updated){
            return [
                "status" => 400,
                "success" => false,
                "message" => "Update failed or no fields provided",
                "receivedKeys" => array_values(array_keys($data)),
                "allowedKeys" => [
                    "title",
                    "url",
                    "category",
                    "blogContent",
                    "postThumbnail",
                    "postBanner",
                    "metaKeywords",
                    "metaDescription",
                    "tags",
                    "authorName",
                    "dateOfPost"
                ]
            ];
        }

        return [
            "status" => 200,
            "success" => true,
            "message" => "Blog updated successfully",
            "data" => $updated
        ];
    }


    public function deleteBlogs(){

        // Support:
        // - ?ids=1,2,3
        // - ?id=1
        // - ?blogID=1
        $rawIds = $_GET['ids'] ?? ($_GET['id'] ?? ($_GET['blogID'] ?? null));

        if(!$rawIds){
            return [
                "status" => 400,
                "success" => false,
            "message" => "ids parameter required"
            ];
        }

        // Normalise to array of IDs
        $idsArray = is_array($rawIds) ? $rawIds : explode(',', (string)$rawIds);

        $deleted = $this->blog->deleteBlogs($idsArray);

        if(!$deleted){
            return [
                "status" => 500,
                "success" => false,
                "message" => "Delete failed"
            ];
        }

        return [
            "status" => 200,
            "success" => true,
            "message" => "Blog(s) deleted successfully"
        ];
    }
}