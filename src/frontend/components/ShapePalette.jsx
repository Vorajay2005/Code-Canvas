import React from 'react'

const SHAPE_TYPES = [
  {
    type: 'start',
    name: 'Start',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">Start</text>
      </svg>
    )
  },
  {
    type: 'end',
    name: 'End',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">End</text>
      </svg>
    )
  },
  {
    type: 'process',
    name: 'Process',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <rect x="4" y="8" width="16" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fill="currentColor">Process</text>
      </svg>
    )
  },
  {
    type: 'decision',
    name: 'Decision',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <polygon points="12,4 20,12 12,20 4,12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fill="currentColor">?</text>
      </svg>
    )
  },
  {
    type: 'input',
    name: 'Input',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <polygon points="6,8 18,8 20,16 4,16" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fill="currentColor">Input</text>
      </svg>
    )
  },
  {
    type: 'output',
    name: 'Output',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <polygon points="4,8 16,8 20,12 16,16 4,16" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="13" textAnchor="middle" fontSize="7" fill="currentColor">Output</text>
      </svg>
    )
  },
  {
    type: 'loop',
    name: 'Loop',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 10h16" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor">Loop</text>
      </svg>
    )
  },
  {
    type: 'connector',
    name: 'Connector',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="12" y="13" textAnchor="middle" fontSize="8" fill="currentColor">•</text>
      </svg>
    )
  },
  {
    type: 'comment',
    name: 'Comment',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M4 8h12l4 4-4 4H4z" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="10" y="13" textAnchor="middle" fontSize="6" fill="currentColor">Comment</text>
      </svg>
    )
  }
]

const ShapePalette = ({ selectedShape, onShapeSelect }) => {
  return (
    <div className="shape-palette fade-in">
      <div className="shape-palette-header">
        Flowchart Elements
      </div>
      
      <div className="shape-grid">
        {SHAPE_TYPES.map(shape => (
          <div
            key={shape.type}
            className={`shape-item ${selectedShape === shape.type ? 'selected' : ''}`}
            onClick={() => onShapeSelect(shape.type)}
            title={shape.name}
          >
            {shape.icon}
            <div className="shape-label">{shape.name}</div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '8px', 
        background: 'var(--background-medium)', 
        borderRadius: '4px',
        fontSize: '11px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>Instructions:</strong>
        </div>
        <div>1. Select a shape above</div>
        <div>2. Click on canvas to place</div>
        <div>3. Double-click to edit text</div>
        <div>4. Use Connect tool to link shapes</div>
      </div>
    </div>
  )
}

export default ShapePalette