import "./monaco-setup";

import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';




export interface XmlEditorProps {
  value: string;
}


export function XmlEditor(props: XmlEditorProps) {

  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(_editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    monacoRef.current = monaco;
  }

  return (
    <Editor
      // height="100%"
      // height="calc(100vh - 2rem)"
      language="xml"
      // defaultValue={props.value}
      value={props.value}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme="pebkac-xml-dark"
      options={{
        readOnly: true,
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