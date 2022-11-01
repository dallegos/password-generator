const elements = Object.seal({
    input: document.getElementById("secure-password"),
    copiedText: document.getElementById("copied-text"),
    rangeSlider: document.getElementById("length"),
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

function randomNumber(limit) {
    return Math.floor(Math.random() * limit);
}

function generatePassword() {
    const characterList = [
        ...(flags.lowercase ? config.characters : []),
        ...(flags.uppercase ? config.characters.toLocaleUpperCase() : []),
        ...(flags.numbers ? config.numbers : []),
        ...(flags.symbols ? config.symbols : []),
    ].join("");

    // At least one of each with flag on true
    const required = [
        flags.lowercase
            ? config.characters[randomNumber(config.characters.length)]
            : "",
        flags.uppercase
            ? config.characters[
                  randomNumber(config.characters.length)
              ].toLocaleUpperCase()
            : "",
        flags.numbers
            ? config.numbers[randomNumber(config.numbers.length)]
            : "",
        flags.symbols
            ? config.symbols[randomNumber(config.symbols.length)]
            : "",
    ].join("");

    return Array.from({ length: flags.length - required.length }, () =>
        randomNumber(characterList.length)
    )
        .map((number) => characterList[number])
        .concat(required)
        .sort(() => {
            return 0.5 - Math.random();
        })
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

// Event delegation
document.body.addEventListener("click", (event) => {
    switch (event.target.dataset.ref) {
        case "switch":
            flags[event.target.id] = event.target.checked;
            updateInput();
            break;

        case "copy":
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
            break;

        case "regenerate":
            updateInput();
            break;
    }
});

elements.rangeSlider.addEventListener("input", (event) => {
    flags.length = elements.charactersLengthText.textContent =
        event.target.value;
    updateInput();
});

updateInput();
