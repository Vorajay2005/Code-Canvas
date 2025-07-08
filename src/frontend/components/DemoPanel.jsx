import React, { useState } from 'react'
import { useShapes } from '../contexts/ShapeContext'
import { useCode } from '../contexts/CodeContext'
import { getDemoMetadata, loadDemoFlowchart } from '../utils/DemoData'

const DemoPanel = ({ isOpen, onClose }) => {
  const [selectedDemo, setSelectedDemo] = useState(null)
  const { clearAll, addShape, addConnection } = useShapes()
  const { generateCode } = useCode()
  const demos = getDemoMetadata()

  const handleLoadDemo = async (demoKey) => {
    const demo = loadDemoFlowchart(demoKey)
    if (!demo) return

    // Clear existing shapes
    clearAll()

    // Add shapes
    demo.shapes.forEach(shape => {
      addShape(shape)
    })

    // Add connections
    demo.connections.forEach(connection => {
      addConnection(connection.fromId, connection.toId)
    })

    // Generate code for the demo
    setTimeout(() => {
      generateCode(demo.shapes, demo.connections, 'javascript')
    }, 100)

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="demo-panel-overlay">
      <div className="demo-panel">
        <div className="demo-panel-header">
          <h2>Demo Flowcharts</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16">
              <path d="M2 2l12 12M2 14L14 2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="demo-panel-content">
          <div className="demo-grid">
            {demos.map((demo) => (
              <div 
                key={demo.key} 
                className={`demo-card ${selectedDemo === demo.key ? 'selected' : ''}`}
                onClick={() => setSelectedDemo(demo.key)}
              >
                <div className="demo-card-header">
                  <h3>{demo.name}</h3>
                  <div className="demo-stats">
                    <span className="stat">
                      <svg width="12" height="12" viewBox="0 0 16 16">
                        <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {demo.shapeCount}
                    </span>
                    <span className="stat">
                      <svg width="12" height="12" viewBox="0 0 16 16">
                        <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {demo.connectionCount}
                    </span>
                  </div>
                </div>
                
                <p className="demo-description">{demo.description}</p>
                
                <div className="demo-preview">
                  <div className="preview-shape start"></div>
                  <div className="preview-arrow">→</div>
                  <div className="preview-shape process"></div>
                  <div className="preview-arrow">→</div>
                  <div className="preview-shape decision"></div>
                  <div className="preview-arrow">→</div>
                  <div className="preview-shape end"></div>
                </div>
                
                <button 
                  className="load-demo-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoadDemo(demo.key)
                  }}
                >
                  Load Demo
                </button>
              </div>
            ))}
          </div>
          
          <div className="demo-panel-footer">
            <div className="demo-instructions">
              <h4>How to use demos:</h4>
              <ol>
                <li>Click on a demo card to preview</li>
                <li>Click "Load Demo" to load the flowchart</li>
                <li>The flowchart will appear on the canvas</li>
                <li>Code will be automatically generated</li>
                <li>You can modify the flowchart and regenerate code</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .demo-panel {
          background: var(--background-light);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          width: 90vw;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .demo-panel-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .demo-panel-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
        }

        .close-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .close-button:hover {
          color: var(--text-primary);
        }

        .demo-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .demo-card {
          background: var(--background-medium);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .demo-card:hover {
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }

        .demo-card.selected {
          border-color: var(--primary-color);
          background: var(--background-dark);
        }

        .demo-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .demo-card-header h3 {
          margin: 0;
          font-size: 16px;
          color: var(--text-primary);
        }

        .demo-stats {
          display: flex;
          gap: 12px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .demo-description {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .demo-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          padding: 12px;
          background: var(--background-dark);
          border-radius: 4px;
        }

        .preview-shape {
          width: 16px;
          height: 12px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .preview-shape.start {
          background: #4CAF50;
          border-radius: 50%;
        }

        .preview-shape.process {
          background: #2196F3;
        }

        .preview-shape.decision {
          background: #FF9800;
          transform: rotate(45deg);
        }

        .preview-shape.end {
          background: #F44336;
          border-radius: 50%;
        }

        .preview-arrow {
          color: var(--text-secondary);
          margin: 0 8px;
          font-size: 12px;
        }

        .load-demo-button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s ease;
          width: 100%;
        }

        .load-demo-button:hover {
          background: var(--accent-color);
        }

        .demo-panel-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          background: var(--background-medium);
        }

        .demo-instructions h4 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
          font-size: 14px;
        }

        .demo-instructions ol {
          margin: 0;
          padding-left: 20px;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .demo-instructions li {
          margin-bottom: 4px;
        }

        @media (max-width: 768px) {
          .demo-panel {
            width: 95vw;
            max-height: 95vh;
          }

          .demo-grid {
            grid-template-columns: 1fr;
          }

          .demo-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default DemoPanel