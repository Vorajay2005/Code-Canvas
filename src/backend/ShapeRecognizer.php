<?php

class ShapeRecognizer {
    
    public function recognizeShapes($svgData) {
        $shapes = [];
        
        // Parse SVG data and extract shapes
        $doc = new DOMDocument();
        @$doc->loadXML($svgData);
        
        $xpath = new DOMXPath($doc);
        
        // Recognize rectangles
        $rectangles = $xpath->query('//rect');
        foreach ($rectangles as $rect) {
            $shapes[] = $this->recognizeRectangle($rect);
        }
        
        // Recognize circles
        $circles = $xpath->query('//circle');
        foreach ($circles as $circle) {
            $shapes[] = $this->recognizeCircle($circle);
        }
        
        // Recognize ellipses
        $ellipses = $xpath->query('//ellipse');
        foreach ($ellipses as $ellipse) {
            $shapes[] = $this->recognizeEllipse($ellipse);
        }
        
        // Recognize paths (for complex shapes)
        $paths = $xpath->query('//path');
        foreach ($paths as $path) {
            $shapes[] = $this->recognizePath($path);
        }
        
        // Recognize polygons
        $polygons = $xpath->query('//polygon');
        foreach ($polygons as $polygon) {
            $shapes[] = $this->recognizePolygon($polygon);
        }
        
        return array_filter($shapes);
    }
    
    private function recognizeRectangle($rect) {
        $x = floatval($rect->getAttribute('x'));
        $y = floatval($rect->getAttribute('y'));
        $width = floatval($rect->getAttribute('width'));
        $height = floatval($rect->getAttribute('height'));
        $rx = floatval($rect->getAttribute('rx'));
        
        // Determine shape type based on dimensions and properties
        $aspectRatio = $width / $height;
        
        if ($rx > 0) {
            return [
                'type' => 'process',
                'x' => $x,
                'y' => $y,
                'width' => $width,
                'height' => $height,
                'confidence' => 0.9
            ];
        } else if ($aspectRatio > 1.5) {
            return [
                'type' => 'process',
                'x' => $x,
                'y' => $y,
                'width' => $width,
                'height' => $height,
                'confidence' => 0.8
            ];
        } else if (abs($aspectRatio - 1) < 0.2) {
            return [
                'type' => 'decision',
                'x' => $x,
                'y' => $y,
                'width' => $width,
                'height' => $height,
                'confidence' => 0.7
            ];
        }
        
        return [
            'type' => 'process',
            'x' => $x,
            'y' => $y,
            'width' => $width,
            'height' => $height,
            'confidence' => 0.6
        ];
    }
    
    private function recognizeCircle($circle) {
        $cx = floatval($circle->getAttribute('cx'));
        $cy = floatval($circle->getAttribute('cy'));
        $r = floatval($circle->getAttribute('r'));
        
        return [
            'type' => 'connector',
            'x' => $cx - $r,
            'y' => $cy - $r,
            'width' => $r * 2,
            'height' => $r * 2,
            'confidence' => 0.95
        ];
    }
    
    private function recognizeEllipse($ellipse) {
        $cx = floatval($ellipse->getAttribute('cx'));
        $cy = floatval($ellipse->getAttribute('cy'));
        $rx = floatval($ellipse->getAttribute('rx'));
        $ry = floatval($ellipse->getAttribute('ry'));
        
        $aspectRatio = $rx / $ry;
        
        if (abs($aspectRatio - 1) < 0.2) {
            // Nearly circular
            return [
                'type' => 'connector',
                'x' => $cx - $rx,
                'y' => $cy - $ry,
                'width' => $rx * 2,
                'height' => $ry * 2,
                'confidence' => 0.9
            ];
        } else {
            // Oval - likely start/end
            return [
                'type' => 'start',
                'x' => $cx - $rx,
                'y' => $cy - $ry,
                'width' => $rx * 2,
                'height' => $ry * 2,
                'confidence' => 0.85
            ];
        }
    }
    
    private function recognizePath($path) {
        $pathData = $path->getAttribute('d');
        
        // Analyze path data to determine shape type
        $pathAnalysis = $this->analyzePath($pathData);
        
        return [
            'type' => $pathAnalysis['type'],
            'x' => $pathAnalysis['x'],
            'y' => $pathAnalysis['y'],
            'width' => $pathAnalysis['width'],
            'height' => $pathAnalysis['height'],
            'confidence' => $pathAnalysis['confidence']
        ];
    }
    
    private function recognizePolygon($polygon) {
        $points = $polygon->getAttribute('points');
        $pointArray = $this->parsePoints($points);
        
        $shapeType = $this->classifyPolygon($pointArray);
        $bounds = $this->calculateBounds($pointArray);
        
        return [
            'type' => $shapeType,
            'x' => $bounds['x'],
            'y' => $bounds['y'],
            'width' => $bounds['width'],
            'height' => $bounds['height'],
            'confidence' => 0.8
        ];
    }
    
    private function analyzePath($pathData) {
        // Simple path analysis - can be extended for more complex recognition
        $commands = $this->parsePathCommands($pathData);
        
        // Count different types of commands
        $commandCounts = array_count_values(array_column($commands, 'command'));
        
        // Determine shape type based on command patterns
        if (isset($commandCounts['A']) && $commandCounts['A'] > 0) {
            // Contains arcs - likely ellipse/circle
            return [
                'type' => 'start',
                'x' => 0,
                'y' => 0,
                'width' => 100,
                'height' => 60,
                'confidence' => 0.7
            ];
        } else if (isset($commandCounts['L']) && $commandCounts['L'] >= 4) {
            // Multiple lines - likely polygon
            if ($commandCounts['L'] == 4) {
                return [
                    'type' => 'decision',
                    'x' => 0,
                    'y' => 0,
                    'width' => 100,
                    'height' => 100,
                    'confidence' => 0.8
                ];
            } else {
                return [
                    'type' => 'process',
                    'x' => 0,
                    'y' => 0,
                    'width' => 120,
                    'height' => 80,
                    'confidence' => 0.6
                ];
            }
        }
        
        return [
            'type' => 'process',
            'x' => 0,
            'y' => 0,
            'width' => 100,
            'height' => 60,
            'confidence' => 0.5
        ];
    }
    
    private function parsePoints($pointsString) {
        $points = [];
        $coords = preg_split('/[\s,]+/', trim($pointsString));
        
        for ($i = 0; $i < count($coords); $i += 2) {
            if (isset($coords[$i + 1])) {
                $points[] = [
                    'x' => floatval($coords[$i]),
                    'y' => floatval($coords[$i + 1])
                ];
            }
        }
        
        return $points;
    }
    
    private function classifyPolygon($points) {
        $numPoints = count($points);
        
        if ($numPoints == 3) {
            return 'decision';
        } else if ($numPoints == 4) {
            // Check if it's a diamond (rhombus)
            if ($this->isDiamond($points)) {
                return 'decision';
            } else {
                return 'process';
            }
        } else if ($numPoints > 4) {
            return 'input';
        }
        
        return 'process';
    }
    
    private function isDiamond($points) {
        if (count($points) != 4) return false;
        
        // Check if opposite vertices are on same horizontal/vertical lines
        $centerX = array_sum(array_column($points, 'x')) / 4;
        $centerY = array_sum(array_column($points, 'y')) / 4;
        
        // Simple check - can be improved
        return true;
    }
    
    private function calculateBounds($points) {
        $minX = min(array_column($points, 'x'));
        $maxX = max(array_column($points, 'x'));
        $minY = min(array_column($points, 'y'));
        $maxY = max(array_column($points, 'y'));
        
        return [
            'x' => $minX,
            'y' => $minY,
            'width' => $maxX - $minX,
            'height' => $maxY - $minY
        ];
    }
    
    private function parsePathCommands($pathData) {
        $commands = [];
        
        // Simple regex to extract path commands
        preg_match_all('/([MLHVCSQTAZ])[^MLHVCSQTAZ]*/', $pathData, $matches);
        
        foreach ($matches[1] as $command) {
            $commands[] = ['command' => $command];
        }
        
        return $commands;
    }
}