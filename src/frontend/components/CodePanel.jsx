import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useCode } from '../contexts/CodeContext'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' }
]

const CodePanel = ({ language, onLanguageChange }) => {
  const { generatedCode, isGenerating, error, lastGenerated, updateCode } = useCode()
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(generatedCode)
    }
  }, [generatedCode])

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      theme: 'vs-dark',
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      wordWrap: 'on'
    })
  }

  const handleEditorChange = (value) => {
    if (value !== generatedCode) {
      updateCode(value)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedCode], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    
    const extension = getFileExtension(language)
    element.download = `flowchart_code.${extension}`
    
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      // TODO: Add toast notification
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      php: 'php',
      cpp: 'cpp',
      csharp: 'cs'
    }
    return extensions[lang] || 'txt'
  }

  return (
    <div className="code-panel fade-in">
      <div className="code-panel-header">
        <div className="code-panel-title">
          Generated Code
          {lastGenerated && (
            <span style={{ 
              fontSize: '11px', 
              color: 'var(--text-secondary)', 
              marginLeft: '8px' 
            }}>
              {lastGenerated.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            className="language-selector"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          
          <button 
            className="toolbar-button"
            onClick={handleCopy}
            title="Copy to Clipboard"
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 2v14M2 8h12" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </button>
          
          <button 
            className="toolbar-button"
            onClick={handleDownload}
            title="Download Code"
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M8 2v10M5 9l3 3 3-3" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="code-editor">
        {isGenerating ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              border: '2px solid var(--border-color)',
              borderTopColor: 'var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Generating code...
            </div>
          </div>
        ) : error ? (
          <div style={{ 
            padding: '16px',
            color: 'var(--error-color)',
            backgroundColor: 'rgba(218, 54, 51, 0.1)',
            border: '1px solid var(--error-color)',
            borderRadius: '4px',
            margin: '12px'
          }}>
            <strong>Error generating code:</strong><br/>
            {error}
          </div>
        ) : (
          <Editor
            height="100%"
            language={language}
            value={generatedCode}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              renderLineHighlight: 'none'
            }}
          />
        )}
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

export default CodePanel