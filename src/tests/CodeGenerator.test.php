<?php
require_once __DIR__ . '/../backend/CodeGenerator.php';

use PHPUnit\Framework\TestCase;

class CodeGeneratorTest extends TestCase {
    
    private $generator;
    
    protected function setUp(): void {
        $this->generator = new CodeGenerator();
    }
    
    public function testGenerateEmptyCodeJavaScript() {
        $result = $this->generator->generateCode([], [], 'javascript');
        $this->assertStringContainsString('function main()', $result);
        $this->assertStringContainsString('main()', $result);
    }
    
    public function testGenerateEmptyCodePython() {
        $result = $this->generator->generateCode([], [], 'python');
        $this->assertStringContainsString('def main():', $result);
        $this->assertStringContainsString('if __name__ == "__main__":', $result);
    }
    
    public function testGenerateSimpleProcess() {
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
        $this->assertStringContainsString('Process: Calculate sum', $result);
        $this->assertStringContainsString('processCalculateSum', $result);
    }
    
    public function testGenerateDecision() {
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
        $this->assertStringContainsString('if (x > 0)', $result);
        $this->assertStringContainsString('} else {', $result);
    }
    
    public function testGenerateInput() {
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'input',
                'text' => 'username',
                'x' => 100,
                'y' => 100
            ]
        ];
        
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assertStringContainsString('prompt("Enter username:', $result);
    }
    
    public function testGenerateOutput() {
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'output',
                'text' => 'result',
                'x' => 100,
                'y' => 100
            ]
        ];
        
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assertStringContainsString('console.log(result)', $result);
    }
    
    public function testGenerateLoop() {
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'loop',
                'text' => 'iterate items',
                'x' => 100,
                'y' => 100
            ]
        ];
        
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assertStringContainsString('for (let i = 0; i < 10; i++)', $result);
        $this->assertStringContainsString('iterate items', $result);
    }
    
    public function testGenerateWithConnections() {
        $shapes = [
            [
                'id' => 'start',
                'type' => 'start',
                'text' => 'Start',
                'x' => 100,
                'y' => 100
            ],
            [
                'id' => 'process1',
                'type' => 'process',
                'text' => 'Initialize',
                'x' => 100,
                'y' => 200
            ],
            [
                'id' => 'end',
                'type' => 'end',
                'text' => 'End',
                'x' => 100,
                'y' => 300
            ]
        ];
        
        $connections = [
            [
                'id' => 'conn1',
                'fromId' => 'start',
                'toId' => 'process1'
            ],
            [
                'id' => 'conn2',
                'fromId' => 'process1',
                'toId' => 'end'
            ]
        ];
        
        $result = $this->generator->generateCode($shapes, $connections, 'javascript');
        
        // Check that shapes are in logical order
        $startPos = strpos($result, 'Program start');
        $processPos = strpos($result, 'Process: Initialize');
        $endPos = strpos($result, 'Program end');
        
        $this->assertLessThan($processPos, $startPos);
        $this->assertLessThan($endPos, $processPos);
    }
    
    public function testGenerateAllLanguages() {
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
        
        foreach ($languages as $language) {
            $result = $this->generator->generateCode($shapes, [], $language);
            $this->assertNotEmpty($result);
            $this->assertStringContainsString('Auto-generated from CodeCanvas', $result);
        }
    }
    
    public function testCleanVariableName() {
        $shapes = [
            [
                'id' => 'shape1',
                'type' => 'input',
                'text' => 'user name with spaces!',
                'x' => 100,
                'y' => 100
            ]
        ];
        
        $result = $this->generator->generateCode($shapes, [], 'javascript');
        $this->assertStringContainsString('usernamewithspaces', $result);
        $this->assertStringNotContainsString('user name with spaces!', $result);
    }
}