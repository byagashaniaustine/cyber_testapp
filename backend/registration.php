<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// DIRECT VULNERABILITY: No extension checking, no MIME validation.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    
    // Create directory if not exists
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir);

    // VULNERABLE: Uses the original filename directly from the user
    $filename = $_FILES['profile_pic']['name'];
    $destination = $uploadDir . $filename;

    // VULNERABLE: Allows any file type to be saved to the web-accessible folder
    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $destination)) {
        echo json_encode([
            "status" => "success", 
            "message" => "File uploaded to: " . $destination
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Upload failed"]);
    }
}
?>