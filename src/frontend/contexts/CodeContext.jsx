import React, { createContext, useContext, useState, useCallback } from 'react'

const CodeContext = createContext()

export const useCode = () => {
  const context = useContext(CodeContext)
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider')
  }
  return context
}

export const CodeProvider = ({ children }) => {
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [lastGenerated, setLastGenerated] = useState(null)

  const generateCode = useCallback(async (shapes, connections, language = 'javascript') => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8000/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shapes,
          connections,
          language
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Handle both old and new response formats
      const code = data.code || data.generatedCode
      if (!code) {
        throw new Error('No code received from server')
      }

      setGeneratedCode(code)
      setLastGenerated(new Date())
      
      return code
    } catch (err) {
      setError(`Error generating code: ${err.message}`)
      console.error('Code generation error:', err)
      
      // Fallback to client-side generation if server fails
      const fallbackCode = generateFallbackCode(shapes, connections, language)
      setGeneratedCode(fallbackCode)
      setLastGenerated(new Date())
      
      return fallbackCode
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const generateFallbackCode = useCallback((shapes, connections, language) => {
    if (!shapes || shapes.length === 0) {
      return getEmptyTemplate(language)
    }

    // Simple client-side code generation
    let code = getLanguageHeader(language)
    
    // Sort shapes by position to create logical flow
    const sortedShapes = [...shapes].sort((a, b) => {
      if (Math.abs(a.y - b.y) > 50) {
        return a.y - b.y // Sort by Y position first
      }
      return a.x - b.x // Then by X position
    })

    sortedShapes.forEach((shape, index) => {
      code += generateShapeCode(shape, language, index)
    })

    code += getLanguageFooter(language)
    
    return code
  }, [])

  const getEmptyTemplate = (language) => {
    switch (language) {
      case 'javascript':
        return '// Generated code will appear here\n// Draw shapes on the canvas to create code\n\nfunction main() {\n  // Your flowchart logic here\n}\n\nmain();'
      case 'python':
        return '# Generated code will appear here\n# Draw shapes on the canvas to create code\n\ndef main():\n    # Your flowchart logic here\n    pass\n\nif __name__ == "__main__":\n    main()'
      case 'java':
        return '// Generated code will appear here\n// Draw shapes on the canvas to create code\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your flowchart logic here\n    }\n}'
      case 'php':
        return '<?php\n// Generated code will appear here\n// Draw shapes on the canvas to create code\n\nfunction main() {\n    // Your flowchart logic here\n}\n\nmain();\n?>'
      default:
        return '// Generated code will appear here\n// Draw shapes on the canvas to create code'
    }
  }

  const getLanguageHeader = (language) => {
    switch (language) {
      case 'javascript':
        return '// Auto-generated from CodeCanvas flowchart\n\nfunction main() {\n'
      case 'python':
        return '# Auto-generated from CodeCanvas flowchart\n\ndef main():\n'
      case 'java':
        return '// Auto-generated from CodeCanvas flowchart\n\npublic class Main {\n    public static void main(String[] args) {\n'
      case 'php':
        return '<?php\n// Auto-generated from CodeCanvas flowchart\n\nfunction main() {\n'
      default:
        return '// Auto-generated from CodeCanvas flowchart\n\n'
    }
  }

  const getLanguageFooter = (language) => {
    switch (language) {
      case 'javascript':
        return '}\n\nmain();'
      case 'python':
        return '\nif __name__ == "__main__":\n    main()'
      case 'java':
        return '    }\n}'
      case 'php':
        return '}\n\nmain();\n?>'
      default:
        return ''
    }
  }

  const generateShapeCode = (shape, language, index) => {
    const indent = getIndent(language)
    const comment = getComment(language)
    
    let code = `${indent}${comment} ${shape.type} - ${shape.text || 'Step ' + (index + 1)}\n`
    
    switch (shape.type) {
      case 'start':
        code += `${indent}${comment} Program start\n`
        break
      case 'end':
        code += `${indent}${comment} Program end\n`
        break
      case 'process':
        code += `${indent}${getProcessCode(shape.text || 'process', language)}\n`
        break
      case 'decision':
        code += `${indent}${getDecisionCode(shape.text || 'condition', language)}\n`
        break
      case 'input':
        code += `${indent}${getInputCode(shape.text || 'input', language)}\n`
        break
      case 'output':
        code += `${indent}${getOutputCode(shape.text || 'output', language)}\n`
        break
      case 'loop':
        code += `${indent}${getLoopCode(shape.text || 'loop', language)}\n`
        break
      default:
        code += `${indent}${comment} ${shape.type}\n`
    }
    
    return code + '\n'
  }

  const getIndent = (language) => {
    switch (language) {
      case 'python':
        return '    '
      case 'javascript':
      case 'java':
      case 'php':
        return '    '
      default:
        return '  '
    }
  }

  const getComment = (language) => {
    switch (language) {
      case 'python':
        return '#'
      case 'javascript':
      case 'java':
      case 'php':
        return '//'
      default:
        return '//'
    }
  }

  const getProcessCode = (text, language) => {
    switch (language) {
      case 'javascript':
        return `// Process: ${text}`
      case 'python':
        return `# Process: ${text}`
      case 'java':
        return `// Process: ${text}`
      case 'php':
        return `// Process: ${text}`
      default:
        return `// Process: ${text}`
    }
  }

  const getDecisionCode = (text, language) => {
    switch (language) {
      case 'javascript':
        return `if (${text}) {\n    // True branch\n} else {\n    // False branch\n}`
      case 'python':
        return `if ${text}:\n    # True branch\n    pass\nelse:\n    # False branch\n    pass`
      case 'java':
        return `if (${text}) {\n    // True branch\n} else {\n    // False branch\n}`
      case 'php':
        return `if (${text}) {\n    // True branch\n} else {\n    // False branch\n}`
      default:
        return `if (${text}) { /* True branch */ } else { /* False branch */ }`
    }
  }

  const getInputCode = (text, language) => {
    switch (language) {
      case 'javascript':
        return `const ${text} = prompt("Enter ${text}:");`
      case 'python':
        return `${text} = input("Enter ${text}: ")`
      case 'java':
        return `Scanner scanner = new Scanner(System.in);\nString ${text} = scanner.nextLine();`
      case 'php':
        return `$${text} = readline("Enter ${text}: ");`
      default:
        return `// Input: ${text}`
    }
  }

  const getOutputCode = (text, language) => {
    switch (language) {
      case 'javascript':
        return `console.log(${text});`
      case 'python':
        return `print(${text})`
      case 'java':
        return `System.out.println(${text});`
      case 'php':
        return `echo ${text};`
      default:
        return `// Output: ${text}`
    }
  }

  const getLoopCode = (text, language) => {
    switch (language) {
      case 'javascript':
        return `for (let i = 0; i < 10; i++) {\n    // Loop body: ${text}\n}`
      case 'python':
        return `for i in range(10):\n    # Loop body: ${text}\n    pass`
      case 'java':
        return `for (int i = 0; i < 10; i++) {\n    // Loop body: ${text}\n}`
      case 'php':
        return `for ($i = 0; $i < 10; $i++) {\n    // Loop body: ${text}\n}`
      default:
        return `// Loop: ${text}`
    }
  }

  const updateCode = useCallback((code) => {
    setGeneratedCode(code)
  }, [])

  const clearCode = useCallback(() => {
    setGeneratedCode('')
    setError(null)
    setLastGenerated(null)
  }, [])

  const value = {
    generatedCode,
    isGenerating,
    error,
    lastGenerated,
    generateCode,
    updateCode,
    clearCode
  }

  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  )
}