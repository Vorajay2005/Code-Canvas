// Demo data for showcasing CodeCanvas features

export const demoFlowcharts = {
  simpleCalculator: {
    name: "Simple Calculator",
    description: "Basic arithmetic calculator flowchart",
    shapes: [
      {
        id: "start-1",
        type: "start",
        text: "Start",
        x: 250,
        y: 50,
        width: 120,
        height: 60,
        fill: "#4CAF50",
        stroke: "#000000"
      },
      {
        id: "input-1",
        type: "input",
        text: "Enter first number",
        x: 200,
        y: 150,
        width: 220,
        height: 60,
        fill: "#9C27B0",
        stroke: "#000000"
      },
      {
        id: "input-2",
        type: "input",
        text: "Enter second number",
        x: 200,
        y: 250,
        width: 220,
        height: 60,
        fill: "#9C27B0",
        stroke: "#000000"
      },
      {
        id: "input-3",
        type: "input",
        text: "Enter operation (+, -, *, /)",
        x: 180,
        y: 350,
        width: 260,
        height: 60,
        fill: "#9C27B0",
        stroke: "#000000"
      },
      {
        id: "decision-1",
        type: "decision",
        text: "operation == '+'?",
        x: 250,
        y: 450,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "process-1",
        type: "process",
        text: "result = num1 + num2",
        x: 100,
        y: 600,
        width: 180,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "decision-2",
        type: "decision",
        text: "operation == '-'?",
        x: 400,
        y: 600,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "process-2",
        type: "process",
        text: "result = num1 - num2",
        x: 320,
        y: 750,
        width: 180,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "output-1",
        type: "output",
        text: "Display result",
        x: 220,
        y: 850,
        width: 160,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "end-1",
        type: "end",
        text: "End",
        x: 250,
        y: 950,
        width: 120,
        height: 60,
        fill: "#F44336",
        stroke: "#000000"
      }
    ],
    connections: [
      { id: "conn-1", fromId: "start-1", toId: "input-1" },
      { id: "conn-2", fromId: "input-1", toId: "input-2" },
      { id: "conn-3", fromId: "input-2", toId: "input-3" },
      { id: "conn-4", fromId: "input-3", toId: "decision-1" },
      { id: "conn-5", fromId: "decision-1", toId: "process-1" },
      { id: "conn-6", fromId: "decision-1", toId: "decision-2" },
      { id: "conn-7", fromId: "decision-2", toId: "process-2" },
      { id: "conn-8", fromId: "process-1", toId: "output-1" },
      { id: "conn-9", fromId: "process-2", toId: "output-1" },
      { id: "conn-10", fromId: "output-1", toId: "end-1" }
    ]
  },

  numberGuessingGame: {
    name: "Number Guessing Game",
    description: "Interactive number guessing game logic",
    shapes: [
      {
        id: "start-2",
        type: "start",
        text: "Start Game",
        x: 300,
        y: 50,
        width: 120,
        height: 60,
        fill: "#4CAF50",
        stroke: "#000000"
      },
      {
        id: "process-3",
        type: "process",
        text: "Generate random number (1-100)",
        x: 220,
        y: 150,
        width: 280,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "process-4",
        type: "process",
        text: "Set attempts = 0",
        x: 270,
        y: 250,
        width: 180,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "input-4",
        type: "input",
        text: "Enter your guess",
        x: 260,
        y: 350,
        width: 200,
        height: 60,
        fill: "#9C27B0",
        stroke: "#000000"
      },
      {
        id: "process-5",
        type: "process",
        text: "attempts = attempts + 1",
        x: 240,
        y: 450,
        width: 240,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "decision-3",
        type: "decision",
        text: "guess == number?",
        x: 300,
        y: 550,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "output-2",
        type: "output",
        text: "Congratulations! You won!",
        x: 480,
        y: 600,
        width: 240,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "decision-4",
        type: "decision",
        text: "guess < number?",
        x: 150,
        y: 700,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "output-3",
        type: "output",
        text: "Too low! Try higher",
        x: 50,
        y: 850,
        width: 180,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "output-4",
        type: "output",
        text: "Too high! Try lower",
        x: 270,
        y: 850,
        width: 180,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "decision-5",
        type: "decision",
        text: "attempts < 10?",
        x: 200,
        y: 950,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "output-5",
        type: "output",
        text: "Game Over! Number was: " + "{number}",
        x: 400,
        y: 1000,
        width: 220,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "end-2",
        type: "end",
        text: "End Game",
        x: 300,
        y: 1150,
        width: 120,
        height: 60,
        fill: "#F44336",
        stroke: "#000000"
      }
    ],
    connections: [
      { id: "conn-11", fromId: "start-2", toId: "process-3" },
      { id: "conn-12", fromId: "process-3", toId: "process-4" },
      { id: "conn-13", fromId: "process-4", toId: "input-4" },
      { id: "conn-14", fromId: "input-4", toId: "process-5" },
      { id: "conn-15", fromId: "process-5", toId: "decision-3" },
      { id: "conn-16", fromId: "decision-3", toId: "output-2" },
      { id: "conn-17", fromId: "decision-3", toId: "decision-4" },
      { id: "conn-18", fromId: "decision-4", toId: "output-3" },
      { id: "conn-19", fromId: "decision-4", toId: "output-4" },
      { id: "conn-20", fromId: "output-3", toId: "decision-5" },
      { id: "conn-21", fromId: "output-4", toId: "decision-5" },
      { id: "conn-22", fromId: "decision-5", toId: "input-4" },
      { id: "conn-23", fromId: "decision-5", toId: "output-5" },
      { id: "conn-24", fromId: "output-2", toId: "end-2" },
      { id: "conn-25", fromId: "output-5", toId: "end-2" }
    ]
  },

  bubbleSort: {
    name: "Bubble Sort Algorithm",
    description: "Classic bubble sort algorithm visualization",
    shapes: [
      {
        id: "start-3",
        type: "start",
        text: "Start",
        x: 300,
        y: 50,
        width: 120,
        height: 60,
        fill: "#4CAF50",
        stroke: "#000000"
      },
      {
        id: "input-5",
        type: "input",
        text: "Input array",
        x: 280,
        y: 150,
        width: 160,
        height: 60,
        fill: "#9C27B0",
        stroke: "#000000"
      },
      {
        id: "process-6",
        type: "process",
        text: "i = 0",
        x: 320,
        y: 250,
        width: 80,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "decision-6",
        type: "decision",
        text: "i < length - 1?",
        x: 280,
        y: 350,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "process-7",
        type: "process",
        text: "j = 0",
        x: 120,
        y: 500,
        width: 80,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "decision-7",
        type: "decision",
        text: "j < length - i - 1?",
        x: 80,
        y: 600,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "decision-8",
        type: "decision",
        text: "arr[j] > arr[j+1]?",
        x: 80,
        y: 750,
        width: 120,
        height: 120,
        fill: "#FF9800",
        stroke: "#000000"
      },
      {
        id: "process-8",
        type: "process",
        text: "Swap arr[j] and arr[j+1]",
        x: 260,
        y: 800,
        width: 200,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "process-9",
        type: "process",
        text: "j = j + 1",
        x: 320,
        y: 950,
        width: 100,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "process-10",
        type: "process",
        text: "i = i + 1",
        x: 500,
        y: 400,
        width: 100,
        height: 60,
        fill: "#2196F3",
        stroke: "#000000"
      },
      {
        id: "output-6",
        type: "output",
        text: "Display sorted array",
        x: 460,
        y: 200,
        width: 180,
        height: 60,
        fill: "#E91E63",
        stroke: "#000000"
      },
      {
        id: "end-3",
        type: "end",
        text: "End",
        x: 500,
        y: 50,
        width: 120,
        height: 60,
        fill: "#F44336",
        stroke: "#000000"
      }
    ],
    connections: [
      { id: "conn-26", fromId: "start-3", toId: "input-5" },
      { id: "conn-27", fromId: "input-5", toId: "process-6" },
      { id: "conn-28", fromId: "process-6", toId: "decision-6" },
      { id: "conn-29", fromId: "decision-6", toId: "process-7" },
      { id: "conn-30", fromId: "process-7", toId: "decision-7" },
      { id: "conn-31", fromId: "decision-7", toId: "decision-8" },
      { id: "conn-32", fromId: "decision-8", toId: "process-8" },
      { id: "conn-33", fromId: "process-8", toId: "process-9" },
      { id: "conn-34", fromId: "decision-8", toId: "process-9" },
      { id: "conn-35", fromId: "process-9", toId: "decision-7" },
      { id: "conn-36", fromId: "decision-7", toId: "process-10" },
      { id: "conn-37", fromId: "process-10", toId: "decision-6" },
      { id: "conn-38", fromId: "decision-6", toId: "output-6" },
      { id: "conn-39", fromId: "output-6", toId: "end-3" }
    ]
  }
}

export const getRandomDemo = () => {
  const demos = Object.values(demoFlowcharts)
  return demos[Math.floor(Math.random() * demos.length)]
}

export const loadDemoFlowchart = (demoName) => {
  return demoFlowcharts[demoName] || null
}

export const getAllDemoNames = () => {
  return Object.keys(demoFlowcharts)
}

export const getDemoMetadata = () => {
  return Object.entries(demoFlowcharts).map(([key, demo]) => ({
    key,
    name: demo.name,
    description: demo.description,
    shapeCount: demo.shapes.length,
    connectionCount: demo.connections.length
  }))
}