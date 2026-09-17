import { useRef, useMemo } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({
  value = '',
  onChange,
  language = 'java',
  placeholder = 'Write your solution here...',
  className = '',
  readOnly = false,
  height = '100%',
}) {
  const editorRef = useRef(null);

  const monacoLanguage = useMemo(() => {
    const lang = (language || 'java').toLowerCase();
    if (lang === 'cpp' || lang === 'c++') return 'cpp';
    if (lang === 'python' || lang === 'py') return 'python';
    return 'java';
  }, [language]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const options = useMemo(() => ({
    readOnly,
    fontSize: 13,
    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    lineHeight: 22,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'off',
    folding: true,
    bracketPairColorization: { enabled: true },
    matchBrackets: 'always',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    renderLineHighlight: 'all',
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    padding: { top: 12, bottom: 12 },
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
  }), [readOnly]);

  return (
    <div className={`relative flex flex-col h-full w-full rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-inner ${className}`}>
      {/* Monaco Container */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <Editor
          height={height}
          language={monacoLanguage}
          value={value}
          theme="vs-dark"
          onChange={(newVal) => onChange?.(newVal ?? '')}
          onMount={handleEditorDidMount}
          options={options}
          loading={
            <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e] text-slate-500 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <span>Initializing Code Editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#161616] px-4 py-1.5 text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Spaces: 4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase font-medium tracking-wider text-slate-300">
            {monacoLanguage === 'cpp' ? 'C++' : monacoLanguage === 'python' ? 'Python 3' : 'Java (OpenJDK)'}
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
}
