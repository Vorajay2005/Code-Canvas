import React from 'react'
import { Group, Line, Circle } from 'react-konva'

const Connection = ({ connection, fromShape, toShape }) => {
  console.log('Connection rendering:', { connection, fromShape: fromShape?.id, toShape: toShape?.id })
  
  if (!fromShape || !toShape) {
    console.log('Connection skipped - missing shapes:', { fromShape: !!fromShape, toShape: !!toShape })
    return null
  }

  // Calculate connection points
  const getConnectionPoints = () => {
    const fromCenterX = fromShape.x + fromShape.width / 2
    const fromCenterY = fromShape.y + fromShape.height / 2
    const toCenterX = toShape.x + toShape.width / 2
    const toCenterY = toShape.y + toShape.height / 2

    // Calculate edge points for better visual connections
    const fromPoint = getEdgePoint(fromShape, toCenterX, toCenterY)
    const toPoint = getEdgePoint(toShape, fromCenterX, fromCenterY)

    return { fromPoint, toPoint }
  }

  const getEdgePoint = (shape, targetX, targetY) => {
    const centerX = shape.x + shape.width / 2
    const centerY = shape.y + shape.height / 2
    
    const dx = targetX - centerX
    const dy = targetY - centerY
    
    // Calculate intersection with shape boundary
    const angle = Math.atan2(dy, dx)
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    // Use shape dimensions to find edge point
    const radiusX = shape.width / 2
    const radiusY = shape.height / 2
    
    // Calculate intersection point based on shape type
    let edgeX, edgeY
    
    if (shape.type === 'start' || shape.type === 'end' || shape.type === 'connector') {
      // For elliptical shapes
      const t = Math.min(radiusX / Math.abs(cos), radiusY / Math.abs(sin))
      edgeX = centerX + t * cos
      edgeY = centerY + t * sin
    } else if (shape.type === 'decision') {
      // For diamond shapes
      const t = Math.min(radiusX / Math.abs(cos), radiusY / Math.abs(sin))
      edgeX = centerX + t * cos
      edgeY = centerY + t * sin
    } else {
      // For rectangular shapes
      const t = Math.min(radiusX / Math.abs(cos), radiusY / Math.abs(sin))
      edgeX = centerX + t * cos
      edgeY = centerY + t * sin
    }
    
    return { x: edgeX, y: edgeY }
  }

  const { fromPoint, toPoint } = getConnectionPoints()

  // Calculate arrow head
  const getArrowHead = () => {
    const dx = toPoint.x - fromPoint.x
    const dy = toPoint.y - fromPoint.y
    const angle = Math.atan2(dy, dx)
    
    const arrowLength = 15
    const arrowWidth = 8
    
    const x1 = toPoint.x - arrowLength * Math.cos(angle - Math.PI / 6)
    const y1 = toPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
    const x2 = toPoint.x - arrowLength * Math.cos(angle + Math.PI / 6)
    const y2 = toPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
    
    return [toPoint.x, toPoint.y, x1, y1, toPoint.x, toPoint.y, x2, y2]
  }

  // Create curved line for better visual appeal
  const getControlPoints = () => {
    const midX = (fromPoint.x + toPoint.x) / 2
    const midY = (fromPoint.y + toPoint.y) / 2
    
    const dx = toPoint.x - fromPoint.x
    const dy = toPoint.y - fromPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Add curve based on distance
    const curvature = Math.min(distance * 0.2, 50)
    
    // Perpendicular offset for curve
    const offsetX = -dy / distance * curvature
    const offsetY = dx / distance * curvature
    
    return {
      controlX: midX + offsetX,
      controlY: midY + offsetY
    }
  }

  const { controlX, controlY } = getControlPoints()

  return (
    <Group>
      {/* Main connection line */}
      <Line
        points={[
          fromPoint.x, fromPoint.y,
          controlX, controlY,
          toPoint.x, toPoint.y
        ]}
        stroke="#666666"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        bezier={true}
      />
      
      {/* Arrow head */}
      <Line
        points={getArrowHead()}
        stroke="#666666"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        fill="#666666"
        closed={false}
      />
      
      {/* Connection points (optional, for debugging) */}
      {/* 
      <Circle
        x={fromPoint.x}
        y={fromPoint.y}
        radius={3}
        fill="red"
      />
      <Circle
        x={toPoint.x}
        y={toPoint.y}
        radius={3}
        fill="blue"
      />
      */}
    </Group>
  )
}

export default Connection