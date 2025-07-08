<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'CodeGenerator.php';
require_once 'ShapeRecognizer.php';
require_once 'FlowchartAnalyzer.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Debug logging
    error_log("Request method: " . $method);
    error_log("Request path: " . $path);
    
    switch ($path) {
        case '/generate-code':
            if ($method === 'POST') {
                handleGenerateCode();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case '/recognize-shapes':
            if ($method === 'POST') {
                handleRecognizeShapes();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case '/analyze-flowchart':
            if ($method === 'POST') {
                handleAnalyzeFlowchart();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found', 'path' => $path, 'method' => $method]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGenerateCode() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        error_log("Generate code input: " . json_encode($input));
        
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
        error_log("Code generation error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'timestamp' => date('c')
        ]);
    }
}

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
?>