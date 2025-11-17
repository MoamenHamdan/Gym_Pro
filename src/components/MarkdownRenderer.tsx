'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split content into lines for processing
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentTable: string[] = []
  let inTable = false
  let tableHeaders: string[] = []
  let tableRows: string[][] = []

  const parseTable = (tableLines: string[]) => {
    if (tableLines.length < 2) return null
    
    // First line is headers
    const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h && !h.match(/^-+$/))
    
    // Second line is separator, skip it
    // Rest are rows
    const rows = tableLines.slice(2).map(line => 
      line.split('|').map(cell => cell.trim()).filter((cell, i) => i > 0 && i < line.split('|').length - 1)
    ).filter(row => row.length > 0)
    
    return { headers, rows }
  }

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Handle bold **text**
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    const boldRegex = /\*\*(.+?)\*\*/g
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>)
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }
    
    return parts.length > 0 ? <>{parts}</> : text
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check if this is a table line
    if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
      if (!inTable) {
        inTable = true
        currentTable = [trimmedLine]
      } else {
        currentTable.push(trimmedLine)
      }
      continue
    } else {
      // Process any pending table
      if (inTable && currentTable.length > 0) {
        const tableData = parseTable(currentTable)
        if (tableData) {
          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-white/20 rounded-lg">
                <thead>
                  <tr className="bg-white/5">
                    {tableData.headers.map((header, idx) => (
                      <th key={idx} className="border border-white/20 px-4 py-2 text-left text-sm font-semibold text-neon-purple">
                        {renderInlineMarkdown(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border border-white/10 px-4 py-2 text-sm text-gray-300">
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        currentTable = []
        inTable = false
      }

      // Handle headers
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
            {renderInlineMarkdown(trimmedLine.substring(4))}
          </h3>
        )
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">
            {renderInlineMarkdown(trimmedLine.substring(3))}
          </h2>
        )
      } else if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">
            {renderInlineMarkdown(trimmedLine.substring(2))}
          </h1>
        )
      } else if (trimmedLine.startsWith('- ')) {
        elements.push(
          <li key={i} className="ml-4 text-gray-300 mb-1">
            {renderInlineMarkdown(trimmedLine.substring(2))}
          </li>
        )
      } else if (trimmedLine.startsWith('---')) {
        elements.push(
          <hr key={i} className="my-4 border-t border-white/20" />
        )
      } else if (trimmedLine.length > 0) {
        elements.push(
          <p key={i} className="mb-2 text-gray-300 leading-relaxed">
            {renderInlineMarkdown(trimmedLine)}
          </p>
        )
      } else {
        elements.push(<br key={i} />)
      }
    }
  }

  // Handle any remaining table
  if (inTable && currentTable.length > 0) {
    const tableData = parseTable(currentTable)
    if (tableData) {
      elements.push(
        <div key="table-final" className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-white/20 rounded-lg">
            <thead>
              <tr className="bg-white/5">
                {tableData.headers.map((header, idx) => (
                  <th key={idx} className="border border-white/20 px-4 py-2 text-left text-sm font-semibold text-neon-purple">
                    {renderInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="border border-white/10 px-4 py-2 text-sm text-gray-300">
                      {renderInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }

  return (
    <div className="markdown-content">
      {elements}
    </div>
  )
}

