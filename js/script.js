const elements = Object.seal({
  input: document.getElementById("secure-password"),
  copyButton: document.getElementById("copy"),
  regenerateButton: document.getElementById("regenerate"),
  copiedText: document.getElementById("copied-text"),
  charactersLengthText: document.getElementById("characters-length"),
});

const config = Object.seal({
  characters: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
});

const flags = Object.create({
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
});

let timeOut = null;

function generatePassword() {
  const characterList = [
    ...(flags.lowercase ? config.characters : []),
    ...(flags.uppercase ? config.characters.toUpperCase() : []),
    ...(flags.numbers ? config.numbers : []),
    ...(flags.symbols ? config.symbols : []),
  ].join("");

  return Array.from({ length: flags.length }, () =>
    Math.floor(Math.random() * characterList.length)
  )
    .map((number) => characterList[number])
    .join("");
}

function updateInput() {
  elements.input.value = generatePassword();
}

function showCopiedText() {
  elements.copiedText.classList.add("active");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    elements.copiedText.classList.remove("active");
  }, 3000);
}

document.getElementById("length").addEventListener("input", (event) => {
  flags.length = elements.charactersLengthText.textContent = event.target.value;
  updateInput();
});

Array.from(document.getElementsByClassName("listen")).forEach((element) => {
  element.addEventListener("change", (event) => {
    flags[event.target.id] = event.target.checked;
    updateInput();
  });
});

elements.copyButton.addEventListener("click", () => {
  if (!navigator.clipboard) {
    elements.input.select();
    document.execCommand("copy");
    elements.input.blur();
    showCopiedText();
  } else {
    navigator.clipboard
      .writeText(elements.input.value)
      .then(showCopiedText)
      .catch((e) => console.log(e));
  }
});

elements.regenerateButton.addEventListener("click", updateInput);
window.addEventListener("load", () => {
  updateInput();
});
