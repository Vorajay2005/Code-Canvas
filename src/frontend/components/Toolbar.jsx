import React from 'react'

const Toolbar = ({ 
  selectedTool, 
  onToolSelect, 
  onClearCanvas, 
  onGenerateCode,
  showShapePalette,
  setShowShapePalette,
  showCodePanel,
  setShowCodePanel,
  onShowDemo
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button 
          className={`toolbar-button ${selectedTool === 'select' ? 'active' : ''}`}
          onClick={() => onToolSelect('select')}
          title="Select Tool (V)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 2l4 12 2-6 6-2L2 2z" fill="currentColor"/>
          </svg>
          Select
        </button>
        
        <button 
          className={`toolbar-button ${selectedTool === 'shapes' ? 'active' : ''}`}
          onClick={() => onToolSelect('shapes')}
          title="Shapes Tool (S)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="8" r="3" fill="currentColor"/>
          </svg>
          Shapes
        </button>
        
        <button 
          className={`toolbar-button ${selectedTool === 'connect' ? 'active' : ''}`}
          onClick={() => onToolSelect('connect')}
          title="Connect Tool (C)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="2"/>
            <circle cx="2" cy="8" r="2" fill="currentColor"/>
            <circle cx="14" cy="8" r="2" fill="currentColor"/>
          </svg>
          Connect
        </button>
      </div>
      
      <div className="toolbar-section">
        <button 
          className="toolbar-button"
          onClick={onShowDemo}
          title="Load Demo"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 2h12l-2 2H4l-2-2zM2 6h12v8H2V6zM6 8h4v2H6V8z" fill="currentColor"/>
          </svg>
          Demo
        </button>
        
        <button 
          className="toolbar-button"
          onClick={onClearCanvas}
          title="Clear Canvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 2l12 12M2 14L14 2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Clear
        </button>
        
        <button 
          className="toolbar-button"
          onClick={onGenerateCode}
          title="Generate Code"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M4 6l-2 2 2 2M12 6l2 2-2 2M10 2l-4 12" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          Generate
        </button>
      </div>
      
      <div className="toolbar-section">
        <button 
          className={`toolbar-button ${showShapePalette ? 'active' : ''}`}
          onClick={() => setShowShapePalette(!showShapePalette)}
          title="Toggle Shape Palette"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="2" width="4" height="4" fill="currentColor"/>
            <rect x="2" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="10" width="4" height="4" fill="currentColor"/>
          </svg>
          Shapes
        </button>
        
        <button 
          className={`toolbar-button ${showCodePanel ? 'active' : ''}`}
          onClick={() => setShowCodePanel(!showCodePanel)}
          title="Toggle Code Panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 6l-2 2 2 2M10 6l2 2-2 2" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          Code
        </button>
      </div>
      
      <div className="toolbar-section">
        <button 
          className="toolbar-button"
          onClick={() => {/* TODO: Implement zoom in */}}
          title="Zoom In"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <button 
          className="toolbar-button"
          onClick={() => {/* TODO: Implement zoom out */}}
          title="Zoom Out"
        >
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 8h6" stroke="currentColor" strokeWidth="2"/>
        </button>
        
        <button 
          className="toolbar-button"
          onClick={() => {/* TODO: Implement fit to screen */}}
          title="Fit to Screen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 6l-2 2 2 2M10 6l2 2-2 2" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toolbar