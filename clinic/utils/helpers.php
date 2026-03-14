<?php

function uploadFile($file,$folder){

    if(empty($file['name'])){
        return null;
    }

    $allowed = ['image/jpeg','image/png','image/webp'];

    if(!in_array($file['type'],$allowed)){
        throw new Exception("Unsupported file type");
    }

    if($file['size'] > 10 * 1024 * 1024){
        throw new Exception("File too large");
    }

    $uploadDir = "uploads/".$folder."/";

    if(!is_dir($uploadDir)){
        mkdir($uploadDir,0755,true);
    }

    $extension = pathinfo($file['name'],PATHINFO_EXTENSION);

    $safeName = uniqid().".".$extension;

    $path = $uploadDir.$safeName;

    if(!move_uploaded_file($file['tmp_name'],$path)){
        throw new Exception("File upload failed");
    }

    return $path;
}


function normalizeTags($tags){

    if(!$tags){
        return null;
    }

    if(is_array($tags)){
        $tags = array_map('trim',$tags);
        $tags = array_filter($tags);
        return json_encode(array_values($tags));
    }

    if(is_string($tags)){

        $arr = explode(',',$tags);

        $arr = array_map('trim',$arr);

        $arr = array_filter($arr);

        return json_encode(array_values($arr));
    }

    return null;
}