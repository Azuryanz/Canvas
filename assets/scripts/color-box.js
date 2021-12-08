let colorSelector = document.querySelector("#color-selector");
let colorSelectorWrapper = document.querySelector(".color-selector-wrapper");

colorSelector.onchange = () => colorSelectorWrapper.style.backgroundColor = colorSelector.value;
colorSelectorWrapper.style.backgroundColor = colorSelector.value;