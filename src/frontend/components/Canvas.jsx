import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Stage, Layer, Rect, Circle, Line, Text, Group, Transformer } from 'react-konva'
import { useShapes } from '../contexts/ShapeContext'
import { useCode } from '../contexts/CodeContext'
import FlowchartShape from './FlowchartShape'
import Connection from './Connection'

const Canvas = forwardRef(({ mode, selectedShape, language }, ref) => {
  const stageRef = useRef(null)
  const layerRef = useRef(null)
  const transformerRef = useRef(null)
  
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight - 120 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const [connectionStart, setConnectionStart] = useState(null)
  const [previewConnection, setPreviewConnection] = useState(null)
  
  const { 
    shapes, 
    selectedShapeIds, 
    connections,
    addShape, 
    updateShape, 
    deleteShape,
    selectShape,
    selectMultipleShapes,
    clearSelection,
    addConnection,
    clearAll
  } = useShapes()
  
  const { generateCode } = useCode()

  // Debug: Log connections when they change
  React.useEffect(() => {
    console.log('Connections state updated:', connections)
  }, [connections])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      clearAll()
    },
    generateCode: () => {
      generateCode(shapes, connections, language)
    }
  }), [clearAll, generateCode, shapes, connections, language])

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setStageSize({ 
        width: window.innerWidth, 
        height: window.innerHeight - 120 
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update transformer when selection changes
  React.useEffect(() => {
    if (transformerRef.current) {
      const selectedNodes = selectedShapeIds.map(id => 
        layerRef.current.findOne(`#${id}`)
      ).filter(Boolean)
      
      transformerRef.current.nodes(selectedNodes)
      transformerRef.current.getLayer().batchDraw()
    }
  }, [selectedShapeIds])

  const handleStageClick = useCallback((e) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    
    if (clickedOnEmpty) {
      if (mode === 'draw' && selectedShape) {
        // Place a new shape
        const stage = e.target.getStage()
        const pointerPosition = stage.getPointerPosition()
        const newShapeId = addShape({
          type: selectedShape,
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: getDefaultWidth(selectedShape),
          height: getDefaultHeight(selectedShape),
          text: getDefaultText(selectedShape),
          fill: getDefaultFill(selectedShape),
          stroke: getDefaultStroke(selectedShape)
        })
        
        // Select the new shape
        selectShape(newShapeId)
      } else if (mode === 'connect' && connectionStart) {
        // Cancel connection if clicking on empty space
        setConnectionStart(null)
        setPreviewConnection(null)
      } else {
        // Clear selection
        clearSelection()
      }
    }
  }, [mode, selectedShape, addShape, selectShape, clearSelection, connectionStart])

  const handleStageMouseMove = useCallback((e) => {
    if (mode === 'connect' && connectionStart && previewConnection) {
      const pointerPosition = e.target.getStage().getPointerPosition()
      setPreviewConnection(prev => ({
        ...prev,
        to: { x: pointerPosition.x, y: pointerPosition.y }
      }))
    }
  }, [mode, connectionStart, previewConnection])

  const handleShapeClick = useCallback((shapeId, e) => {
    e.cancelBubble = true
    
    if (mode === 'select') {
      if (e.evt.ctrlKey || e.evt.metaKey) {
        // Multi-select with Ctrl/Cmd
        const newSelection = selectedShapeIds.includes(shapeId)
          ? selectedShapeIds.filter(id => id !== shapeId)
          : [...selectedShapeIds, shapeId]
        selectMultipleShapes(newSelection)
      } else {
        // Single select
        selectShape(shapeId)
      }
    } else if (mode === 'connect') {
      handleConnectionClick(shapeId)
    }
  }, [mode, selectedShapeIds, selectShape, selectMultipleShapes])

  const handleConnectionClick = useCallback((shapeId) => {
    console.log('Connection click:', { shapeId, connectionStart, mode })
    
    if (!connectionStart) {
      // Start connection
      console.log('Starting connection from shape:', shapeId)
      setConnectionStart(shapeId)
      const shape = shapes.find(s => s.id === shapeId)
      if (shape) {
        setPreviewConnection({
          from: { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 },
          to: { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 }
        })
      }
    } else if (connectionStart !== shapeId) {
      // Complete connection
      console.log('Completing connection:', connectionStart, '->', shapeId)
      console.log('Current connections:', connections)
      
      // Check if connection already exists
      const existingConnection = connections.find(c => 
        c.fromId === connectionStart && c.toId === shapeId
      )
      
      if (!existingConnection) {
        console.log('Adding new connection from', connectionStart, 'to', shapeId)
        const newConnectionId = addConnection(connectionStart, shapeId)
        console.log('Connection added with ID:', newConnectionId)
      } else {
        console.log('Connection already exists:', existingConnection)
      }
      
      // Reset connection state
      console.log('Resetting connection state')
      setConnectionStart(null)
      setPreviewConnection(null)
    } else {
      // Cancel connection (clicked same shape)
      console.log('Canceling connection')
      setConnectionStart(null)
      setPreviewConnection(null)
    }
  }, [connectionStart, shapes, connections, addConnection, mode])

  const handleShapeDragEnd = useCallback((shapeId, e) => {
    updateShape(shapeId, {
      x: e.target.x(),
      y: e.target.y()
    })
  }, [updateShape])

  const handleShapeTransform = useCallback((shapeId, node) => {
    updateShape(shapeId, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    })
  }, [updateShape])

  const handleShapeDoubleClick = useCallback((shapeId) => {
    // TODO: Implement text editing
    const newText = prompt('Enter text:', shapes.find(s => s.id === shapeId)?.text || '')
    if (newText !== null) {
      updateShape(shapeId, { text: newText })
    }
  }, [shapes, updateShape])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selectedShapeIds.forEach(id => deleteShape(id))
      clearSelection()
    } else if (e.key === 'Escape') {
      if (connectionStart) {
        // Cancel connection
        setConnectionStart(null)
        setPreviewConnection(null)
      } else {
        clearSelection()
      }
    }
  }, [selectedShapeIds, deleteShape, clearSelection, connectionStart])

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getDefaultWidth = (shapeType) => {
    switch (shapeType) {
      case 'start':
      case 'end':
        return 120
      case 'process':
        return 140
      case 'decision':
        return 100
      case 'input':
      case 'output':
        return 130
      case 'loop':
        return 150
      case 'connector':
        return 60
      case 'comment':
        return 120
      default:
        return 100
    }
  }

  const getDefaultHeight = (shapeType) => {
    switch (shapeType) {
      case 'start':
      case 'end':
        return 60
      case 'process':
        return 80
      case 'decision':
        return 100
      case 'input':
      case 'output':
        return 60
      case 'loop':
        return 100
      case 'connector':
        return 60
      case 'comment':
        return 60
      default:
        return 60
    }
  }

  const getDefaultText = (shapeType) => {
    switch (shapeType) {
      case 'start':
        return 'Start'
      case 'end':
        return 'End'
      case 'process':
        return 'Process'
      case 'decision':
        return 'Decision?'
      case 'input':
        return 'Input'
      case 'output':
        return 'Output'
      case 'loop':
        return 'Loop'
      case 'connector':
        return ''
      case 'comment':
        return 'Comment'
      default:
        return 'Shape'
    }
  }

  const getDefaultFill = (shapeType) => {
    switch (shapeType) {
      case 'start':
        return '#4CAF50'
      case 'end':
        return '#F44336'
      case 'process':
        return '#2196F3'
      case 'decision':
        return '#FF9800'
      case 'input':
        return '#9C27B0'
      case 'output':
        return '#E91E63'
      case 'loop':
        return '#795548'
      case 'connector':
        return '#607D8B'
      case 'comment':
        return '#FFC107'
      default:
        return '#757575'
    }
  }

  const getDefaultStroke = (shapeType) => {
    return '#000000'
  }

  return (
    <div className="canvas-container">
      {mode === 'connect' && (
        <div className="connection-hint">
          {connectionStart ? 
            'Click on another shape to connect, or click empty space to cancel' : 
            'Click on a shape to start connecting'
          }
        </div>
      )}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleStageClick}
        onMouseMove={handleStageMouseMove}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`canvas-stage ${mode === 'draw' ? 'drawing' : ''} ${mode === 'connect' ? 'connecting' : ''}`}
      >
        <Layer ref={layerRef}>
          {/* Render connections first (behind shapes) */}
          {connections.map(connection => {
            console.log('Rendering connection:', connection.id, 'from', connection.fromId, 'to', connection.toId)
            return (
              <Connection
                key={connection.id}
                connection={connection}
                fromShape={shapes.find(s => s.id === connection.fromId)}
                toShape={shapes.find(s => s.id === connection.toId)}
              />
            )
          })}
          
          {/* Render preview connection */}
          {previewConnection && (
            <Line
              points={[
                previewConnection.from.x,
                previewConnection.from.y,
                previewConnection.to.x,
                previewConnection.to.y
              ]}
              stroke="#007acc"
              strokeWidth={2}
              dash={[5, 5]}
              opacity={0.7}
            />
          )}
          
          {/* Render shapes */}
          {shapes.map(shape => (
            <FlowchartShape
              key={shape.id}
              shape={shape}
              isSelected={selectedShapeIds.includes(shape.id)}
              isConnecting={mode === 'connect'}
              isConnectionStart={connectionStart === shape.id}
              onClick={(e) => handleShapeClick(shape.id, e)}
              onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
              onTransform={(node) => handleShapeTransform(shape.id, node)}
              onDoubleClick={() => handleShapeDoubleClick(shape.id)}
            />
          ))}
          
          {/* Transformer for selected shapes */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 50 || newBox.height < 30) {
                return oldBox
              }
              return newBox
            }}
          />
        </Layer>
      </Stage>
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas