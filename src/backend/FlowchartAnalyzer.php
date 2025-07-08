<?php

class FlowchartAnalyzer {
    
    public function analyzeFlowchart($shapes, $connections) {
        $analysis = [
            'isValid' => true,
            'errors' => [],
            'warnings' => [],
            'suggestions' => [],
            'metrics' => [
                'totalShapes' => count($shapes),
                'totalConnections' => count($connections),
                'complexity' => 0,
                'depth' => 0
            ],
            'flowStructure' => []
        ];
        
        $analysis = $this->validateFlowchart($shapes, $connections, $analysis);
        $analysis = $this->analyzeStructure($shapes, $connections, $analysis);
        $analysis = $this->calculateMetrics($shapes, $connections, $analysis);
        
        return $analysis;
    }
    
    private function validateFlowchart($shapes, $connections, $analysis) {
        // Check for start node
        $startNodes = array_filter($shapes, function($shape) {
            return $shape['type'] === 'start';
        });
        
        if (empty($startNodes)) {
            $analysis['errors'][] = 'No start node found';
            $analysis['isValid'] = false;
        } else if (count($startNodes) > 1) {
            $analysis['warnings'][] = 'Multiple start nodes found';
        }
        
        // Check for end node
        $endNodes = array_filter($shapes, function($shape) {
            return $shape['type'] === 'end';
        });
        
        if (empty($endNodes)) {
            $analysis['warnings'][] = 'No end node found';
        }
        
        // Check for orphaned nodes
        $connectedNodes = [];
        foreach ($connections as $conn) {
            $connectedNodes[] = $conn['fromId'];
            $connectedNodes[] = $conn['toId'];
        }
        $connectedNodes = array_unique($connectedNodes);
        
        $orphanedNodes = [];
        foreach ($shapes as $shape) {
            if (!in_array($shape['id'], $connectedNodes) && $shape['type'] !== 'start') {
                $orphanedNodes[] = $shape['id'];
            }
        }
        
        if (!empty($orphanedNodes)) {
            $analysis['warnings'][] = 'Found ' . count($orphanedNodes) . ' orphaned nodes';
        }
        
        // Check for unreachable nodes
        $reachableNodes = $this->findReachableNodes($shapes, $connections);
        $unreachableNodes = array_filter($shapes, function($shape) use ($reachableNodes) {
            return !in_array($shape['id'], $reachableNodes);
        });
        
        if (!empty($unreachableNodes)) {
            $analysis['warnings'][] = 'Found ' . count($unreachableNodes) . ' unreachable nodes';
        }
        
        // Check for cycles
        $cycles = $this->detectCycles($shapes, $connections);
        if (!empty($cycles)) {
            $analysis['warnings'][] = 'Found ' . count($cycles) . ' cycles in flowchart';
        }
        
        return $analysis;
    }
    
    private function analyzeStructure($shapes, $connections, $analysis) {
        $structure = [
            'entry_points' => [],
            'exit_points' => [],
            'decision_points' => [],
            'process_blocks' => [],
            'loops' => []
        ];
        
        foreach ($shapes as $shape) {
            switch ($shape['type']) {
                case 'start':
                    $structure['entry_points'][] = $shape['id'];
                    break;
                case 'end':
                    $structure['exit_points'][] = $shape['id'];
                    break;
                case 'decision':
                    $structure['decision_points'][] = $shape['id'];
                    break;
                case 'process':
                    $structure['process_blocks'][] = $shape['id'];
                    break;
                case 'loop':
                    $structure['loops'][] = $shape['id'];
                    break;
            }
        }
        
        $analysis['flowStructure'] = $structure;
        
        return $analysis;
    }
    
    private function calculateMetrics($shapes, $connections, $analysis) {
        // Calculate cyclomatic complexity
        $nodes = count($shapes);
        $edges = count($connections);
        $components = $this->countComponents($shapes, $connections);
        
        // Cyclomatic complexity = E - N + 2P
        $analysis['metrics']['complexity'] = $edges - $nodes + 2 * $components;
        
        // Calculate maximum depth
        $analysis['metrics']['depth'] = $this->calculateMaxDepth($shapes, $connections);
        
        // Calculate branching factor
        $decisionNodes = array_filter($shapes, function($shape) {
            return $shape['type'] === 'decision';
        });
        $analysis['metrics']['branchingFactor'] = count($decisionNodes);
        
        // Calculate average node degree
        $totalDegree = 0;
        foreach ($shapes as $shape) {
            $degree = $this->calculateNodeDegree($shape['id'], $connections);
            $totalDegree += $degree;
        }
        $analysis['metrics']['averageNodeDegree'] = $nodes > 0 ? $totalDegree / $nodes : 0;
        
        return $analysis;
    }
    
    private function findReachableNodes($shapes, $connections) {
        $startNodes = array_filter($shapes, function($shape) {
            return $shape['type'] === 'start';
        });
        
        if (empty($startNodes)) {
            return [];
        }
        
        $reachable = [];
        $visited = [];
        
        foreach ($startNodes as $startNode) {
            $this->dfsReachable($startNode['id'], $connections, $visited, $reachable);
        }
        
        return $reachable;
    }
    
    private function dfsReachable($nodeId, $connections, &$visited, &$reachable) {
        if (in_array($nodeId, $visited)) {
            return;
        }
        
        $visited[] = $nodeId;
        $reachable[] = $nodeId;
        
        foreach ($connections as $conn) {
            if ($conn['fromId'] === $nodeId) {
                $this->dfsReachable($conn['toId'], $connections, $visited, $reachable);
            }
        }
    }
    
    private function detectCycles($shapes, $connections) {
        $visited = [];
        $recursionStack = [];
        $cycles = [];
        
        foreach ($shapes as $shape) {
            if (!in_array($shape['id'], $visited)) {
                if ($this->dfsCycle($shape['id'], $connections, $visited, $recursionStack, $cycles)) {
                    // Cycle detected
                }
            }
        }
        
        return $cycles;
    }
    
    private function dfsCycle($nodeId, $connections, &$visited, &$recursionStack, &$cycles) {
        $visited[] = $nodeId;
        $recursionStack[] = $nodeId;
        
        foreach ($connections as $conn) {
            if ($conn['fromId'] === $nodeId) {
                $nextNodeId = $conn['toId'];
                
                if (!in_array($nextNodeId, $visited)) {
                    if ($this->dfsCycle($nextNodeId, $connections, $visited, $recursionStack, $cycles)) {
                        return true;
                    }
                } else if (in_array($nextNodeId, $recursionStack)) {
                    $cycles[] = $nextNodeId;
                    return true;
                }
            }
        }
        
        $recursionStack = array_diff($recursionStack, [$nodeId]);
        return false;
    }
    
    private function countComponents($shapes, $connections) {
        $visited = [];
        $components = 0;
        
        foreach ($shapes as $shape) {
            if (!in_array($shape['id'], $visited)) {
                $this->dfsComponent($shape['id'], $connections, $visited);
                $components++;
            }
        }
        
        return $components;
    }
    
    private function dfsComponent($nodeId, $connections, &$visited) {
        $visited[] = $nodeId;
        
        foreach ($connections as $conn) {
            if ($conn['fromId'] === $nodeId && !in_array($conn['toId'], $visited)) {
                $this->dfsComponent($conn['toId'], $connections, $visited);
            }
            if ($conn['toId'] === $nodeId && !in_array($conn['fromId'], $visited)) {
                $this->dfsComponent($conn['fromId'], $connections, $visited);
            }
        }
    }
    
    private function calculateMaxDepth($shapes, $connections) {
        $startNodes = array_filter($shapes, function($shape) {
            return $shape['type'] === 'start';
        });
        
        if (empty($startNodes)) {
            return 0;
        }
        
        $maxDepth = 0;
        foreach ($startNodes as $startNode) {
            $depth = $this->dfsDepth($startNode['id'], $connections, []);
            $maxDepth = max($maxDepth, $depth);
        }
        
        return $maxDepth;
    }
    
    private function dfsDepth($nodeId, $connections, $visited) {
        if (in_array($nodeId, $visited)) {
            return 0; // Avoid infinite recursion
        }
        
        $visited[] = $nodeId;
        $maxChildDepth = 0;
        
        foreach ($connections as $conn) {
            if ($conn['fromId'] === $nodeId) {
                $childDepth = $this->dfsDepth($conn['toId'], $connections, $visited);
                $maxChildDepth = max($maxChildDepth, $childDepth);
            }
        }
        
        return 1 + $maxChildDepth;
    }
    
    private function calculateNodeDegree($nodeId, $connections) {
        $degree = 0;
        
        foreach ($connections as $conn) {
            if ($conn['fromId'] === $nodeId || $conn['toId'] === $nodeId) {
                $degree++;
            }
        }
        
        return $degree;
    }
}