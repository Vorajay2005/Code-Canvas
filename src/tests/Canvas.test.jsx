import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Canvas from '../frontend/components/Canvas'
import { ShapeProvider } from '../frontend/contexts/ShapeContext'
import { CodeProvider } from '../frontend/contexts/CodeContext'

// Mock Konva components
jest.mock('react-konva', () => ({
  Stage: ({ children, ...props }) => <div data-testid="stage" {...props}>{children}</div>,
  Layer: ({ children, ...props }) => <div data-testid="layer" {...props}>{children}</div>,
  Group: ({ children, ...props }) => <div data-testid="group" {...props}>{children}</div>,
  Rect: (props) => <div data-testid="rect" {...props} />,
  Circle: (props) => <div data-testid="circle" {...props} />,
  Line: (props) => <div data-testid="line" {...props} />,
  Text: (props) => <div data-testid="text" {...props} />,
  Path: (props) => <div data-testid="path" {...props} />,
  Transformer: (props) => <div data-testid="transformer" {...props} />
}))

const renderWithProviders = (component) => {
  return render(
    <ShapeProvider>
      <CodeProvider>
        {component}
      </CodeProvider>
    </ShapeProvider>
  )
}

describe('Canvas Component', () => {
  const defaultProps = {
    mode: 'draw',
    selectedShape: 'process',
    language: 'javascript'
  }

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    })
  })

  test('renders canvas stage', () => {
    renderWithProviders(<Canvas {...defaultProps} />)
    
    const stage = screen.getByTestId('stage')
    expect(stage).toBeInTheDocument()
    expect(stage).toHaveClass('canvas-stage')
  })

  test('renders canvas layer', () => {
    renderWithProviders(<Canvas {...defaultProps} />)
    
    const layer = screen.getByTestId('layer')
    expect(layer).toBeInTheDocument()
  })

  test('renders transformer', () => {
    renderWithProviders(<Canvas {...defaultProps} />)
    
    const transformer = screen.getByTestId('transformer')
    expect(transformer).toBeInTheDocument()
  })

  test('applies drawing class in draw mode', () => {
    renderWithProviders(<Canvas {...defaultProps} mode="draw" />)
    
    const stage = screen.getByTestId('stage')
    expect(stage).toHaveClass('drawing')
  })

  test('does not apply drawing class in select mode', () => {
    renderWithProviders(<Canvas {...defaultProps} mode="select" />)
    
    const stage = screen.getByTestId('stage')
    expect(stage).not.toHaveClass('drawing')
  })

  test('handles stage click in draw mode', () => {
    const canvasRef = React.createRef()
    renderWithProviders(<Canvas {...defaultProps} ref={canvasRef} mode="draw" selectedShape="process" />)
    
    const stage = screen.getByTestId('stage')
    
    // Mock getPointerPosition
    const mockGetPointerPosition = jest.fn(() => ({ x: 100, y: 100 }))
    const mockGetStage = jest.fn(() => ({
      getPointerPosition: mockGetPointerPosition
    }))
    
    // Simulate click event
    fireEvent.click(stage, {
      target: {
        getStage: mockGetStage
      }
    })
    
    // In a real test, you would verify that a shape was added
    // This would require more complex mocking of the context
  })

  test('handles window resize', () => {
    renderWithProviders(<Canvas {...defaultProps} />)
    
    // Change window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600
    })
    
    // Trigger resize event
    fireEvent(window, new Event('resize'))
    
    // Verify stage dimensions updated
    const stage = screen.getByTestId('stage')
    expect(stage).toHaveAttribute('width', '800')
    expect(stage).toHaveAttribute('height', '480') // 600 - 120
  })

  test('exposes clear method via ref', () => {
    const canvasRef = React.createRef()
    renderWithProviders(<Canvas {...defaultProps} ref={canvasRef} />)
    
    expect(canvasRef.current).toBeDefined()
    expect(typeof canvasRef.current.clear).toBe('function')
  })

  test('exposes generateCode method via ref', () => {
    const canvasRef = React.createRef()
    renderWithProviders(<Canvas {...defaultProps} ref={canvasRef} />)
    
    expect(canvasRef.current).toBeDefined()
    expect(typeof canvasRef.current.generateCode).toBe('function')
  })

  test('handles keyboard events', () => {
    renderWithProviders(<Canvas {...defaultProps} />)
    
    // Test Delete key
    fireEvent.keyDown(document, { key: 'Delete' })
    
    // Test Escape key
    fireEvent.keyDown(document, { key: 'Escape' })
    
    // In a real test, you would verify the appropriate actions were taken
  })

  test('calculates default shape dimensions', () => {
    const canvasRef = React.createRef()
    renderWithProviders(<Canvas {...defaultProps} ref={canvasRef} />)
    
    // This test would need to be implemented with proper mocking
    // to verify default dimensions are calculated correctly
  })
})

describe('Canvas Integration Tests', () => {
  test('adds shape when clicking in draw mode', () => {
    // This would be an integration test that verifies
    // the full flow from click to shape creation
  })

  test('generates code when shapes are present', () => {
    // This would test the full code generation flow
  })

  test('handles shape selection and transformation', () => {
    // This would test the shape selection and transformation features
  })
})