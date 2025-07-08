<?php

class CodeGenerator {
    
    public function generateCode($shapes, $connections, $language) {
        if (empty($shapes)) {
            return $this->getEmptyTemplate($language);
        }
        
        // Sort shapes by position to create logical flow
        $sortedShapes = $this->sortShapesByFlow($shapes, $connections);
        
        $code = $this->getLanguageHeader($language);
        $code .= $this->generateShapesCode($sortedShapes, $language);
        $code .= $this->getLanguageFooter($language);
        
        return $code;
    }
    
    private function sortShapesByFlow($shapes, $connections) {
        // Create a flow map
        $flowMap = [];
        foreach ($connections as $connection) {
            $flowMap[$connection['fromId']][] = $connection['toId'];
        }
        
        // Find start node
        $startNode = null;
        foreach ($shapes as $shape) {
            if ($shape['type'] === 'start') {
                $startNode = $shape;
                break;
            }
        }
        
        if (!$startNode) {
            // If no start node, sort by position
            usort($shapes, function($a, $b) {
                if (abs($a['y'] - $b['y']) > 50) {
                    return $a['y'] - $b['y'];
                }
                return $a['x'] - $b['x'];
            });
            return $shapes;
        }
        
        // Perform topological sort starting from start node
        $visited = [];
        $result = [];
        $this->dfsSort($startNode, $shapes, $flowMap, $visited, $result);
        
        // Add any remaining unvisited shapes
        foreach ($shapes as $shape) {
            if (!in_array($shape['id'], $visited)) {
                $result[] = $shape;
            }
        }
        
        return $result;
    }
    
    private function dfsSort($currentShape, $shapes, $flowMap, &$visited, &$result) {
        $visited[] = $currentShape['id'];
        $result[] = $currentShape;
        
        if (isset($flowMap[$currentShape['id']])) {
            foreach ($flowMap[$currentShape['id']] as $nextId) {
                if (!in_array($nextId, $visited)) {
                    $nextShape = $this->findShapeById($shapes, $nextId);
                    if ($nextShape) {
                        $this->dfsSort($nextShape, $shapes, $flowMap, $visited, $result);
                    }
                }
            }
        }
    }
    
    private function findShapeById($shapes, $id) {
        foreach ($shapes as $shape) {
            if ($shape['id'] === $id) {
                return $shape;
            }
        }
        return null;
    }
    
    private function generateShapesCode($shapes, $language) {
        $code = '';
        $indent = $this->getIndent($language);
        
        foreach ($shapes as $shape) {
            $code .= $this->generateShapeCode($shape, $language, $indent);
        }
        
        return $code;
    }
    
    private function generateShapeCode($shape, $language, $indent) {
        $comment = $this->getComment($language);
        $text = $shape['text'] ?? '';
        $type = $shape['type'];
        
        $code = "\n{$indent}{$comment} {$type}";
        if ($text) {
            $code .= " - {$text}";
        }
        $code .= "\n";
        
        switch ($type) {
            case 'start':
                $code .= $this->generateStartCode($text, $language, $indent);
                break;
            case 'end':
                $code .= $this->generateEndCode($text, $language, $indent);
                break;
            case 'process':
                $code .= $this->generateProcessCode($text, $language, $indent);
                break;
            case 'decision':
                $code .= $this->generateDecisionCode($text, $language, $indent);
                break;
            case 'input':
                $code .= $this->generateInputCode($text, $language, $indent);
                break;
            case 'output':
                $code .= $this->generateOutputCode($text, $language, $indent);
                break;
            case 'loop':
                $code .= $this->generateLoopCode($text, $language, $indent);
                break;
            case 'connector':
                $code .= $this->generateConnectorCode($text, $language, $indent);
                break;
            default:
                $code .= "{$indent}{$comment} {$type}: {$text}\n";
        }
        
        return $code;
    }
    
    private function generateStartCode($text, $language, $indent) {
        return "{$indent}{$this->getComment($language)} Program start\n";
    }
    
    private function generateEndCode($text, $language, $indent) {
        return "{$indent}{$this->getComment($language)} Program end\n";
    }
    
    private function generateProcessCode($text, $language, $indent) {
        $cleanText = $this->cleanVariableName($text);
        
        switch ($language) {
            case 'javascript':
                return "{$indent}// Process: {$text}\n{$indent}let result = process{$cleanText}();\n";
            case 'python':
                return "{$indent}# Process: {$text}\n{$indent}result = process_{$cleanText}()\n";
            case 'java':
                return "{$indent}// Process: {$text}\n{$indent}Object result = process{$cleanText}();\n";
            case 'php':
                return "{$indent}// Process: {$text}\n{$indent}\$result = process{$cleanText}();\n";
            default:
                return "{$indent}// Process: {$text}\n";
        }
    }
    
    private function generateDecisionCode($text, $language, $indent) {
        $condition = $text ?: 'condition';
        
        switch ($language) {
            case 'javascript':
                return "{$indent}if ({$condition}) {\n{$indent}    // True branch\n{$indent}} else {\n{$indent}    // False branch\n{$indent}}\n";
            case 'python':
                return "{$indent}if {$condition}:\n{$indent}    # True branch\n{$indent}    pass\n{$indent}else:\n{$indent}    # False branch\n{$indent}    pass\n";
            case 'java':
                return "{$indent}if ({$condition}) {\n{$indent}    // True branch\n{$indent}} else {\n{$indent}    // False branch\n{$indent}}\n";
            case 'php':
                return "{$indent}if ({$condition}) {\n{$indent}    // True branch\n{$indent}} else {\n{$indent}    // False branch\n{$indent}}\n";
            default:
                return "{$indent}if ({$condition}) { /* branches */ }\n";
        }
    }
    
    private function generateInputCode($text, $language, $indent) {
        $varName = $this->cleanVariableName($text ?: 'input');
        
        switch ($language) {
            case 'javascript':
                return "{$indent}const {$varName} = prompt('Enter {$text}:');\n";
            case 'python':
                return "{$indent}{$varName} = input('Enter {$text}: ')\n";
            case 'java':
                return "{$indent}Scanner scanner = new Scanner(System.in);\n{$indent}String {$varName} = scanner.nextLine();\n";
            case 'php':
                return "{$indent}\${$varName} = readline('Enter {$text}: ');\n";
            default:
                return "{$indent}// Input: {$text}\n";
        }
    }
    
    private function generateOutputCode($text, $language, $indent) {
        $output = $text ?: 'result';
        
        switch ($language) {
            case 'javascript':
                return "{$indent}console.log({$output});\n";
            case 'python':
                return "{$indent}print({$output})\n";
            case 'java':
                return "{$indent}System.out.println({$output});\n";
            case 'php':
                return "{$indent}echo {$output};\n";
            default:
                return "{$indent}// Output: {$text}\n";
        }
    }
    
    private function generateLoopCode($text, $language, $indent) {
        switch ($language) {
            case 'javascript':
                return "{$indent}for (let i = 0; i < 10; i++) {\n{$indent}    // Loop: {$text}\n{$indent}}\n";
            case 'python':
                return "{$indent}for i in range(10):\n{$indent}    # Loop: {$text}\n{$indent}    pass\n";
            case 'java':
                return "{$indent}for (int i = 0; i < 10; i++) {\n{$indent}    // Loop: {$text}\n{$indent}}\n";
            case 'php':
                return "{$indent}for (\$i = 0; \$i < 10; \$i++) {\n{$indent}    // Loop: {$text}\n{$indent}}\n";
            default:
                return "{$indent}// Loop: {$text}\n";
        }
    }
    
    private function generateConnectorCode($text, $language, $indent) {
        return "{$indent}{$this->getComment($language)} Connector: {$text}\n";
    }
    
    private function cleanVariableName($name) {
        $cleaned = preg_replace('/[^a-zA-Z0-9_]/', '', $name);
        $cleaned = preg_replace('/^[0-9]/', '_$0', $cleaned);
        return $cleaned ?: 'variable';
    }
    
    private function getEmptyTemplate($language) {
        switch ($language) {
            case 'javascript':
                return "// Generated code will appear here\n// Draw shapes on the canvas to create code\n\nfunction main() {\n    // Your flowchart logic here\n}\n\nmain();";
            case 'python':
                return "# Generated code will appear here\n# Draw shapes on the canvas to create code\n\ndef main():\n    # Your flowchart logic here\n    pass\n\nif __name__ == '__main__':\n    main()";
            case 'java':
                return "// Generated code will appear here\n// Draw shapes on the canvas to create code\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your flowchart logic here\n    }\n}";
            case 'php':
                return "<?php\n// Generated code will appear here\n// Draw shapes on the canvas to create code\n\nfunction main() {\n    // Your flowchart logic here\n}\n\nmain();\n?>";
            default:
                return "// Generated code will appear here\n// Draw shapes on the canvas to create code";
        }
    }
    
    private function getLanguageHeader($language) {
        switch ($language) {
            case 'javascript':
                return "// Auto-generated from CodeCanvas flowchart\n// Generated on " . date('Y-m-d H:i:s') . "\n\nfunction main() {\n";
            case 'python':
                return "# Auto-generated from CodeCanvas flowchart\n# Generated on " . date('Y-m-d H:i:s') . "\n\ndef main():\n";
            case 'java':
                return "// Auto-generated from CodeCanvas flowchart\n// Generated on " . date('Y-m-d H:i:s') . "\n\npublic class Main {\n    public static void main(String[] args) {\n";
            case 'php':
                return "<?php\n// Auto-generated from CodeCanvas flowchart\n// Generated on " . date('Y-m-d H:i:s') . "\n\nfunction main() {\n";
            default:
                return "// Auto-generated from CodeCanvas flowchart\n// Generated on " . date('Y-m-d H:i:s') . "\n\n";
        }
    }
    
    private function getLanguageFooter($language) {
        switch ($language) {
            case 'javascript':
                return "}\n\nmain();";
            case 'python':
                return "\nif __name__ == '__main__':\n    main()";
            case 'java':
                return "    }\n}";
            case 'php':
                return "}\n\nmain();\n?>";
            default:
                return "";
        }
    }
    
    private function getIndent($language) {
        switch ($language) {
            case 'python':
                return '    ';
            case 'javascript':
            case 'java':
            case 'php':
                return '    ';
            default:
                return '  ';
        }
    }
    
    private function getComment($language) {
        switch ($language) {
            case 'python':
                return '#';
            case 'javascript':
            case 'java':
            case 'php':
                return '//';
            default:
                return '//';
        }
    }
}