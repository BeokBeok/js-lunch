export function createButtonContainer({
  negative: {
    text: negativeText = "취소하기",
    type: negativeType = "button",
  } = {},
  positive: { text: positiveText = "확인하기", type: positiveType = "button" },
}) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const negativeButton = document.createElement("button");
  negativeButton.type = negativeType;
  negativeButton.className = "button";
  negativeButton.classList.add("button--secondary");
  negativeButton.textContent = negativeText;

  const positiveButton = document.createElement("button");
  positiveButton.type = positiveType;
  positiveButton.className = "button";
  positiveButton.classList.add("button--primary");
  positiveButton.textContent = positiveText;

  buttonContainer.append(negativeButton, positiveButton);
  return { buttonContainer, negativeButton, positiveButton };
}
