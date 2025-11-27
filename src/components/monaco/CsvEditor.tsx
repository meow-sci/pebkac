import "./monaco-setup";

import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';


export interface CsvEditorProps {
  defaultValue?: string;
}

export function CsvEditor(props: CsvEditorProps) {

  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    console.log("handleEditorWillMount", monaco);
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    console.log("handleEditorDidMount", editor);
    console.log("handleEditorDidMount", monaco);

    monacoRef.current = monaco;
  }

  return (
    <Editor
      // height="100%"
      // height="calc(100vh - 2rem)"
      language="csv"
      defaultValue={props.defaultValue ?? ""}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontFamily: "Source Code Pro Variable",
        fontSize: 15,
        fontWeight: "300",
        lineNumbersMinChars: 3,
        // theme: "vs-dark",
        minimap: { enabled: false },
        // automaticLayout: true,
        allowVariableFonts: true,
        scrollBeyondLastLine: false,
      }}
    />
  );


};