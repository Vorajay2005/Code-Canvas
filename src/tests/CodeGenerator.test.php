<?php
/**
 * Simple tests for CodeGenerator
 * Run with: php src/tests/CodeGenerator.test.php
 */

require_once __DIR__ . '/../backend/CodeGenerator.php';

class SimpleCodeGeneratorTest {
    private $generator;
    
    public function __construct() {
        $this->generator = new CodeGenerator();
    }
    
    public function testBasicFunctionality() {
        echo "🧪 Testing CodeGenerator Basic Functionality\n";
        echo "==========================================\n\n";
        
        // Test 1: Empty JavaScript
        echo "✅ Test 1: Empty JavaScript Generation\n";
        $result = $this->generator->generateCode([], [], 'javascript');
        $this->assert(strpos($result, 'function main()') !== false, "Should contain 'function main()'");
        echo "   - Contains function main(): PASS\n\n";
        
        // Test 2: Empty Python  
        echo "✅ Test 2: Empty Python Generation\n";
        $result = $this->generator->generateCode([], [], 'python');
        $this->assert(strpos($result, 'def main()') !== false, "Should contain 'def main()'");
        echo "   - Contains def main(): PASS\n\n";
        
        // Test 3: Process shape
        echo "✅ Test 3: Process Shape Generation\n";
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'process',
                'text' => 'Calculate sum',
                'x' => 100,
                'y' => 100
            ]
        ];
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assert(strpos($result, 'Calculate sum') !== false, "Should contain 'Calculate sum'");
        echo "   - Contains process text: PASS\n\n";
        
        // Test 4: Decision shape
        echo "✅ Test 4: Decision Shape Generation\n";
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'decision',
                'text' => 'x > 0',
                'x' => 100,
                'y' => 100
            ]
        ];
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assert(strpos($result, 'if') !== false, "Should contain 'if' statement");
        echo "   - Contains if statement: PASS\n\n";
        
        // Test 5: Multiple languages
        echo "✅ Test 5: Multiple Languages Support\n";
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'process',
                'text' => 'test',
                'x' => 100,
                'y' => 100
            ]
        ];
        
        $languages = ['javascript', 'python', 'java', 'php'];
        foreach ($languages as $lang) {
            $result = $this->generator->generateCode($shapes, [], $lang);
            $this->assert(!empty($result), "Should generate code for $lang");
            echo "   - $lang: PASS\n";
        }
        
        echo "\n🎉 All tests passed successfully!\n";
    }
    
    private function assert($condition, $message) {
        if (!$condition) {
            throw new Exception("Test failed: $message");
        }
    }
}

// Run the test
if (basename($_SERVER['PHP_SELF']) === 'CodeGenerator.test.php') {
    $test = new SimpleCodeGeneratorTest();
    $test->testBasicFunctionality();
}