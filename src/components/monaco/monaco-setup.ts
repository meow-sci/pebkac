import { loader } from '@monaco-editor/react';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });

// https://code.visualstudio.com/api/references/theme-color
// https://rodrigoluglio.github.io/vscode-theme-generator/
// https://gitlab.com/-/snippets/1728446
// https://github.com/m
// icrosoft/monaco-editor/blob/main/website/src/website/data/playground-samples/customizing-the-appearence/exposed-colors/sample.js

monaco.editor.setTheme("vs-dark");

monaco.editor.defineTheme('pebkac-xml-dark', {
  base: 'vs-dark',
  inherit: false,
  colors: {
    // 'editor.background': '#222222',
    'editor.background': '#1a1a1a',
    // 'editor.foreground': '#ff0000',

    // 'foreground': '#00FF00',

    // 'editorIndentGuides.background': '#ff0000',
    // 'editorIndentGuide.activeBackground': '#ff0000',
    // 'editor.caret': '#ff0000',
    // 'editor.gutter': '#ff0000',
    // 'editor.invisibles': '#ff0000',
    // 'editor.lineHighlight': '#ff0000',
    // 'editor.selection': '#ff0000',
    // 'editor.inactiveSelection': '#ff0000',
    // 'editor.selectionBorder': '#ff0000',
    // 'editor.guide': '#ff0000',
    // 'editor.activeLinkForeground': '#ff0000',
    // 'editor.selectionHighlight': '#beb1b1ff',
    // 'editor
    // .hoverHighlight': '#ff0000',
    // 'editor.findMatchHighlight': '#ff0000',
    // 'editor.currentFindMatchHighlight': '#ff0000',
    // 'editor.wordHighlight': '#ff0000',
    // 'editor.wordHighlightStrong': '#ff0000',
    // 'editor.referenceHighlight': '#ff0000',
    // 'editor.rangeHighlight': '#ff0000',
    // 'editor.findRangeHighlight': '#ff0000',



  },
  rules: [
    

    { token: 'attribute.name', foreground: '#29CC29' },
    { token: 'attribute.value', foreground: '#ffff00' },


    { token: 'tag.xml', foreground: '#00FF00' },
    { token: 'metatag.xml', foreground: '#39AA39' },
    { token: 'delimiter', foreground: '#39AA39' },

    { token: '', foreground: '#ffff00' },  // default

  ],

});

monaco.editor.defineTheme('pebkac-csv-dark', {
  base: 'vs-dark',
  inherit: false,
  colors: {
    // 'editor.background': '#222222',
    'editor.background': '#1a1a1a',
    // 'editor.foreground': '#ff0000',

    // 'foreground': '#00FF00',

    // 'editorIndentGuides.background': '#ff0000',
    // 'editorIndentGuide.activeBackground': '#ff0000',
    // 'editor.caret': '#ff0000',
    // 'editor.gutter': '#ff0000',
    // 'editor.invisibles': '#ff0000',
    // 'editor.lineHighlight': '#ff0000',
    // 'editor.selection': '#ff0000',
    // 'editor.inactiveSelection': '#ff0000',
    // 'editor.selectionBorder': '#ff0000',
    // 'editor.guide': '#ff0000',
    // 'editor.activeLinkForeground': '#ff0000',
    // 'editor.selectionHighlight': '#beb1b1ff',
    // 'editor
    // .hoverHighlight': '#ff0000',
    // 'editor.findMatchHighlight': '#ff0000',
    // 'editor.currentFindMatchHighlight': '#ff0000',
    // 'editor.wordHighlight': '#ff0000',
    // 'editor.wordHighlightStrong': '#ff0000',
    // 'editor.referenceHighlight': '#ff0000',
    // 'editor.rangeHighlight': '#ff0000',
    // 'editor.findRangeHighlight': '#ff0000',



  },
  rules: [
    

    { token: '', foreground: '#00FF00' },  // default

  ],

});