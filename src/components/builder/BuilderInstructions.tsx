export function BuilderInstructions() {
  return (
    <div id="instructions">
      <ol>
        <li>Use default CSV, edit, or provide your own (must conform to same structure)</li>
        <li>
          Select some celestials for your KSA System
          <ul>
            <li><u>PROTIP</u>: This is designed as a "working set" of selection that you can build up</li>
            <li>Use the filter box and <b>Add Filtered</b> / <b>Remove Filtered</b> buttons for bulk operations on the data matching the current filter</li>
          </ul>
        </li>
        <li>Pick what Crafts and Kittenauts to include</li>
        <li>Change other various settings</li>
        <li>Get your <code>&lt;System /&gt;</code> XML!</li>
      </ol>
    </div>
  )
}