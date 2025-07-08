import React from 'react'
import { Group, Rect, Circle, Line, Text, Path } from 'react-konva'

const FlowchartShape = ({ 
  shape, 
  isSelected, 
  isConnecting,
  isConnectionStart,
  onClick, 
  onDragEnd, 
  onTransform, 
  onDoubleClick 
}) => {
  const { id, type, x, y, width, height, text, fill, stroke, scaleX = 1, scaleY = 1, rotation = 0 } = shape

  const renderShape = () => {
    const getStrokeColor = () => {
      if (isConnectionStart) return '#ff6b6b'
      if (isConnecting) return '#007acc'
      if (isSelected) return '#000000'
      return stroke || '#000000'
    }

    const getStrokeWidth = () => {
      if (isConnectionStart) return 4
      if (isConnecting) return 3
      if (isSelected) return 3
      return 2
    }

    const commonProps = {
      x: 0,
      y: 0,
      fill: fill || '#2196F3',
      stroke: getStrokeColor(),
      strokeWidth: getStrokeWidth(),
      strokeScaleEnabled: false
    }

    switch (type) {
      case 'start':
      case 'end':
        return (
          <Group>
            {/* Ellipse using Path */}
            <Path
              {...commonProps}
              data={`M ${width/2} 0 
                     A ${width/2} ${height/2} 0 0 1 ${width/2} ${height}
                     A ${width/2} ${height/2} 0 0 1 ${width/2} 0 Z`}
            />
            <Text
              x={0}
              y={height/2 - 10}
              width={width}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'process':
        return (
          <Group>
            <Rect
              {...commonProps}
              width={width}
              height={height}
              cornerRadius={4}
            />
            <Text
              x={8}
              y={height/2 - 10}
              width={width - 16}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'decision':
        return (
          <Group>
            <Path
              {...commonProps}
              data={`M ${width/2} 0 
                     L ${width} ${height/2} 
                     L ${width/2} ${height} 
                     L 0 ${height/2} Z`}
            />
            <Text
              x={0}
              y={height/2 - 10}
              width={width}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'input':
        return (
          <Group>
            <Path
              {...commonProps}
              data={`M 20 0 
                     L ${width} 0 
                     L ${width - 20} ${height} 
                     L 0 ${height} Z`}
            />
            <Text
              x={10}
              y={height/2 - 10}
              width={width - 20}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'output':
        return (
          <Group>
            <Path
              {...commonProps}
              data={`M 0 0 
                     L ${width - 20} 0 
                     L ${width} ${height/2} 
                     L ${width - 20} ${height} 
                     L 0 ${height} Z`}
            />
            <Text
              x={8}
              y={height/2 - 10}
              width={width - 28}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'loop':
        return (
          <Group>
            <Rect
              {...commonProps}
              width={width}
              height={height}
              cornerRadius={4}
            />
            <Line
              points={[0, 25, width, 25]}
              stroke={stroke || '#000000'}
              strokeWidth={2}
            />
            <Text
              x={8}
              y={5}
              width={width - 16}
              height={15}
              text="Loop"
              fontSize={12}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
            <Text
              x={8}
              y={30}
              width={width - 16}
              height={height - 35}
              text={text}
              fontSize={12}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'connector':
        return (
          <Group>
            <Circle
              {...commonProps}
              radius={Math.min(width, height) / 2}
              x={width/2}
              y={height/2}
            />
            <Text
              x={0}
              y={height/2 - 10}
              width={width}
              height={20}
              text={text}
              fontSize={12}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      case 'comment':
        return (
          <Group>
            <Path
              {...commonProps}
              data={`M 0 0 
                     L ${width - 20} 0 
                     L ${width} ${height/2} 
                     L ${width - 20} ${height} 
                     L 0 ${height} Z`}
            />
            <Text
              x={8}
              y={height/2 - 10}
              width={width - 28}
              height={20}
              text={text}
              fontSize={12}
              fontFamily="Arial"
              fill="#000000"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )

      default:
        return (
          <Group>
            <Rect
              {...commonProps}
              width={width}
              height={height}
              cornerRadius={4}
            />
            <Text
              x={8}
              y={height/2 - 10}
              width={width - 16}
              height={20}
              text={text}
              fontSize={14}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        )
    }
  }

  return (
    <Group
      id={id}
      x={x}
      y={y}
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={rotation}
      draggable={true}
      onClick={onClick}
      onDragEnd={onDragEnd}
      onTransform={onTransform}
      onDblClick={onDoubleClick}
    >
      {renderShape()}
      
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          x={-5}
          y={-5}
          width={width + 10}
          height={height + 10}
          stroke="#007acc"
          strokeWidth={2}
          fill="transparent"
          dash={[5, 5]}
          listening={false}
        />
      )}
    </Group>
  )
}

export default FlowchartShape