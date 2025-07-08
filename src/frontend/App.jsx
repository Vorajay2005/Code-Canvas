import React, { useState, useCallback, useRef } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import ShapePalette from './components/ShapePalette'
import CodePanel from './components/CodePanel'
import StatusBar from './components/StatusBar'
import DemoPanel from './components/DemoPanel'
import { ShapeProvider } from './contexts/ShapeContext'
import { CodeProvider } from './contexts/CodeContext'

function App() {
  const [showShapePalette, setShowShapePalette] = useState(true)
  const [showCodePanel, setShowCodePanel] = useState(true)
  const [showDemoPanel, setShowDemoPanel] = useState(false)
  const [selectedTool, setSelectedTool] = useState('select')
  const [selectedShape, setSelectedShape] = useState(null)
  const [language, setLanguage] = useState('javascript')
  const [canvasMode, setCanvasMode] = useState('draw') // 'draw' or 'select'
  const canvasRef = useRef(null)

  const handleToolSelect = useCallback((tool) => {
    console.log('Tool selected:', tool)
    setSelectedTool(tool)
    if (tool === 'shapes') {
      setShowShapePalette(true)
    } else if (tool === 'connect') {
      console.log('Setting canvas mode to connect')
      setCanvasMode('connect')
    } else {
      setCanvasMode(tool === 'select' ? 'select' : 'draw')
    }
  }, [])

  const handleShapeSelect = useCallback((shapeType) => {
    setSelectedShape(shapeType)
    setCanvasMode('draw')
  }, [])

  const handleClearCanvas = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clear()
    }
  }, [])

  const handleGenerateCode = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.generateCode()
    }
  }, [])

  const handleShowDemo = useCallback(() => {
    setShowDemoPanel(true)
  }, [])

  const handleCloseDemoPanel = useCallback(() => {
    setShowDemoPanel(false)
  }, [])

  return (
    <ShapeProvider>
      <CodeProvider>
        <div className="app">
          <Toolbar
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
            onClearCanvas={handleClearCanvas}
            onGenerateCode={handleGenerateCode}
            onShowDemo={handleShowDemo}
            showShapePalette={showShapePalette}
            setShowShapePalette={setShowShapePalette}
            showCodePanel={showCodePanel}
            setShowCodePanel={setShowCodePanel}
          />
          
          <div className="canvas-container">
            <Canvas
              ref={canvasRef}
              mode={canvasMode}
              selectedShape={selectedShape}
              language={language}
            />
            
            <div className="grid-overlay" />
            
            {showShapePalette && (
              <ShapePalette
                selectedShape={selectedShape}
                onShapeSelect={handleShapeSelect}
              />
            )}
            
            {showCodePanel && (
              <CodePanel
                language={language}
                onLanguageChange={setLanguage}
              />
            )}
          </div>
          
          <StatusBar />
          
          {showDemoPanel && (
            <DemoPanel
              isOpen={showDemoPanel}
              onClose={handleCloseDemoPanel}
            />
          )}
        </div>
      </CodeProvider>
    </ShapeProvider>
  )
}

export default App