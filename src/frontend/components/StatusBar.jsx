import React from 'react'
import { useShapes } from '../contexts/ShapeContext'
import { useCode } from '../contexts/CodeContext'

const StatusBar = () => {
  const { shapes, selectedShapeIds, connections } = useShapes()
  const { lastGenerated, isGenerating } = useCode()

  const getSelectionText = () => {
    if (selectedShapeIds.length === 0) return 'No selection'
    if (selectedShapeIds.length === 1) return '1 shape selected'
    return `${selectedShapeIds.length} shapes selected`
  }

  return (
    <div className="status-bar">
      <div className="status-item">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {shapes.length} shapes
      </div>
      
      <div className="status-item">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {connections.length} connections
      </div>
      
      <div className="status-item">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <polygon points="2,2 14,2 14,14 2,14" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
        </svg>
        {getSelectionText()}
      </div>
      
      <div style={{ flex: 1 }}></div>
      
      {isGenerating && (
        <div className="status-item">
          <div style={{ 
            width: '12px', 
            height: '12px', 
            border: '2px solid var(--border-color)',
            borderTopColor: 'var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Generating code...
        </div>
      )}
      
      {lastGenerated && !isGenerating && (
        <div className="status-item">
          <svg width="12" height="12" viewBox="0 0 16 16">
            <path d="M8 2v10M5 9l3 3 3-3" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          Last generated: {lastGenerated.toLocaleTimeString()}
        </div>
      )}
      
      <div className="status-item">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Ready
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default StatusBar