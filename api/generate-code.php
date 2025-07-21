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
require_once '../src/backend/CodeGenerator.php';

function handleGenerateCode() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['shapes']) || !isset($input['language'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input. Expected shapes and language.']);
            return;
        }
        
        $shapes = $input['shapes'];
        $connections = $input['connections'] ?? [];
        $language = $input['language'];
        
        $generator = new CodeGenerator();
        $code = $generator->generateCode($shapes, $connections, $language);
        
        $response = [
            'success' => true,
            'code' => $code,
            'language' => $language,
            'timestamp' => date('c'),
            'shapeCount' => count($shapes),
            'connectionCount' => count($connections)
        ];
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'timestamp' => date('c')
        ]);
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handleGenerateCode();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>