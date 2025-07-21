<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include the backend classes
require_once '../src/backend/ShapeRecognizer.php';

function handleRecognizeShapes() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['svgData'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input. Expected SVG data.']);
        return;
    }
    
    $svgData = $input['svgData'];
    
    $recognizer = new ShapeRecognizer();
    $shapes = $recognizer->recognizeShapes($svgData);
    
    echo json_encode([
        'shapes' => $shapes,
        'timestamp' => date('c')
    ]);
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handleRecognizeShapes();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>