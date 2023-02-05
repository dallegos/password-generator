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
    length: 48,
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
    let characterList = [];
    let required = [];

    for (const key in flags) {
        if (key === "length") continue;
        const flag = flags[key];

        if (key === "lowercase" && flag) {
            characterList.push(config.characters);
            required.push(
                config.characters[randomNumber(config.characters.length)]
            );
        } else if (key === "uppercase" && flag) {
            characterList.push(config.characters.toLocaleUpperCase());
            required.push(
                config.characters[
                    randomNumber(config.characters.length)
                ].toLocaleUpperCase()
            );
        } else if ((key === "numbers" || key === "symbols") && flag) {
            characterList.push(config[key]);
            required.push(config[key][randomNumber(config[key].length)]);
        }
    }

    characterList = characterList.join("");
    required = required.join("");

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

function init() {
    elements.rangeSlider.max = flags.length;
    elements.rangeSlider.value = flags.length / 2;
    elements.charactersLengthText.textContent = flags.length / 2;

    updateInput();
}

init();
