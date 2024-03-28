function formatStringFromInputs(node, format) {
  if (!node || !node.inputs) {
    console.error("Node or inputs array not found.");
    return null;
  }

  // Extract input values from the node
  let inputValues = node.inputs.map((input, i) => node.getInputData(i));
  console.log(inputValues)
  // Replace placeholders with input values
  return format.replace(/{(\d+)}/g, (match, index) => {
    let inputValue = inputValues[index];
    return typeof inputValue !== 'undefined' ? inputValue : match;
  });
}

