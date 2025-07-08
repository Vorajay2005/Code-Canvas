import React, { createContext, useContext, useState, useCallback } from 'react'

const ShapeContext = createContext()

export const useShapes = () => {
  const context = useContext(ShapeContext)
  if (!context) {
    throw new Error('useShapes must be used within a ShapeProvider')
  }
  return context
}

export const ShapeProvider = ({ children }) => {
  const [shapes, setShapes] = useState([])
  const [selectedShapeIds, setSelectedShapeIds] = useState([])
  const [connections, setConnections] = useState([])

  const addShape = useCallback((shape) => {
    const newShape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...shape,
      createdAt: new Date().toISOString()
    }
    setShapes(prev => [...prev, newShape])
    return newShape.id
  }, [])

  const updateShape = useCallback((id, updates) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ))
  }, [])

  const deleteShape = useCallback((id) => {
    setShapes(prev => prev.filter(shape => shape.id !== id))
    setConnections(prev => prev.filter(conn => 
      conn.fromId !== id && conn.toId !== id
    ))
    setSelectedShapeIds(prev => prev.filter(selectedId => selectedId !== id))
  }, [])

  const deleteSelectedShapes = useCallback(() => {
    selectedShapeIds.forEach(id => deleteShape(id))
    setSelectedShapeIds([])
  }, [selectedShapeIds, deleteShape])

  const selectShape = useCallback((id) => {
    setSelectedShapeIds([id])
  }, [])

  const selectMultipleShapes = useCallback((ids) => {
    setSelectedShapeIds(ids)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedShapeIds([])
  }, [])

  const addConnection = useCallback((fromId, toId) => {
    const newConnection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromId,
      toId,
      createdAt: new Date().toISOString()
    }
    setConnections(prev => [...prev, newConnection])
    return newConnection.id
  }, [])

  const clearAll = useCallback(() => {
    setShapes([])
    setConnections([])
    setSelectedShapeIds([])
  }, [])

  const getShapeById = useCallback((id) => {
    return shapes.find(shape => shape.id === id)
  }, [shapes])

  const getConnectedShapes = useCallback((shapeId) => {
    const outgoing = connections
      .filter(conn => conn.fromId === shapeId)
      .map(conn => shapes.find(shape => shape.id === conn.toId))
      .filter(Boolean)
    
    const incoming = connections
      .filter(conn => conn.toId === shapeId)
      .map(conn => shapes.find(shape => shape.id === conn.fromId))
      .filter(Boolean)
    
    return { outgoing, incoming }
  }, [connections, shapes])

  const value = {
    shapes,
    selectedShapeIds,
    connections,
    addShape,
    updateShape,
    deleteShape,
    deleteSelectedShapes,
    selectShape,
    selectMultipleShapes,
    clearSelection,
    addConnection,
    clearAll,
    getShapeById,
    getConnectedShapes
  }

  return (
    <ShapeContext.Provider value={value}>
      {children}
    </ShapeContext.Provider>
  )
}