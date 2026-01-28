<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 1. DATABASE CONNECTION (VULNERABLE STYLE)
$host = "localhost";
$user = "root@localhost"; // Default XAMPP user
$pass = "";     // Default XAMPP password
$db   = "Estates_app";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB Connection Failed"]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. GET FORM DATA
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? ''; // Demonstration: Storing plain text!
    $location = $_POST['location'] ?? '';
    $phone    = $_POST['phone'] ?? '';
    $dob      = $_POST['DOB'] ?? '';

    // 3. VULNERABLE FILE UPLOAD
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = $_FILES['profile_pic']['name'];
    $destination = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $destination)) {
        
        // 4. VULNERABLE SQL INSERTION (SQL Injection Point)
        // No sanitization, no prepared statements.
        $sql = "INSERT INTO users (username, email, password, location, phone, dob, profile_pic) 
                VALUES ('$username', '$email', '$password', '$location', '$phone', '$dob', '$destination')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                "status" => "success", 
                "message" => "Registration successful! Payload uploaded to: " . $destination
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Upload failed"]);
    }
}
$conn->close();
?>