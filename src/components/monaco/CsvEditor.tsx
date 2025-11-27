import "./monaco-setup";

import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';


export interface CsvEditorProps {
  defaultValue: string;
  onChange: (value: string) => void;
}

export function CsvEditor(props: CsvEditorProps) {

  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(_editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    monacoRef.current = monaco;
  }

  return (
    <Editor
      language="csv"
      defaultValue={props.defaultValue}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme="pebkac-csv-dark"
      onChange={e => props.onChange(e ?? "")}
      options={{
        fontFamily: "Source Code Pro Variable",
        fontSize: 15,
        fontWeight: "300",
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        allowVariableFonts: true,
        scrollBeyondLastLine: false,
      }}
    />
  );

};