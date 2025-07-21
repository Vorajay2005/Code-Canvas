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
require_once '../src/backend/FlowchartAnalyzer.php';

function handleAnalyzeFlowchart() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['shapes'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input. Expected shapes.']);
        return;
    }
    
    $shapes = $input['shapes'];
    $connections = $input['connections'] ?? [];
    
    $analyzer = new FlowchartAnalyzer();
    $analysis = $analyzer->analyzeFlowchart($shapes, $connections);
    
    echo json_encode([
        'analysis' => $analysis,
        'timestamp' => date('c')
    ]);
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handleAnalyzeFlowchart();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>