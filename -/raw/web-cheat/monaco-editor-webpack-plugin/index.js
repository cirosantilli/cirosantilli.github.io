import * as monaco from 'monaco-editor'
// or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// if shipping only a subset of the features & languages is desired

monaco.editor.create(document.getElementById('container'), {
  value: `function x() {
  console.log("Hello world!");
}`,
  language: 'javascript',
  theme: 'vs-dark',
});
