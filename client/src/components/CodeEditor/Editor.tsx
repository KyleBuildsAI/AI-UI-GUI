import Editor from '@monaco-editor/react'

interface Props {
  code: string
  language?: string
  onChange?: (value: string | undefined) => void
}

export default function CodeEditor({ code, language = 'typescript', onChange }: Props) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={code}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: !onChange,
        automaticLayout: true,
      }}
    />
  )
}
