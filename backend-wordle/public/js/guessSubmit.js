let guessCount = 1; 
const maxGuesses = 6; 
const container = document.getElementById("boardContainer");
document.getElementById('submitGuess').addEventListener('click', async function (event) {
    submitGuess();
})
document.addEventListener('DOMContentLoaded', function () {
    const guessInputs = document.querySelectorAll("input[type='text']");
    guessInputs[0].focus();
    guessInputs.forEach(input => {
        input.addEventListener('keydown', handleKeyPress);  // Call handleKeyPress on keydown
    });
});
function handleKeyPress(event) {

    if (event.key === 'Enter') {
        submitGuess();
    }
}


async function submitGuess() {
    
    const guessContainer = document.querySelector("#boardRowContainer" + guessCount);
    // Select all input elements within the current guess row (5 tiles)
    const guessInputs = guessContainer.querySelectorAll("input[type='text']");

    // Collect the values from all input fields (tiles) into a single string
    let guessValue = '';
    guessInputs.forEach(input => {
        guessValue += input.value.toLowerCase();  // Concatenate each value, making sure it's uppercase
    });
    console.log(guessValue);
    if (!guessValidate(guessValue)) {
        showModal('Not a valid word');
        return;
    }
    try {
        const response = await fetch('/api/word/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guess: guessValue }) 
        });

        const data = await response.json();
        console.log(data);
        if (data.error) {
            showModal(data.error);
            guessInputs[4].focus();

        } else {
            colorGuess(guessInputs, data.result);
            if (data.result === "ggggg") {
                return; // Stop further execution
            }

            // If guess is incorrect
            guessCount += 1;

            if (guessCount > 6) {

                showModal(" Game Over! You've used all your attempts.");
                return; // Stop further execution
            }

            // Enable the next guess input
            const newGuessContainer = document.querySelector("#boardRowContainer" + guessCount);
            if (newGuessContainer) {
                const newGuessInputs = newGuessContainer.querySelectorAll("input[type='text']");
                if (newGuessInputs) {
                    unlockInputs(newGuessInputs);
                    newGuessInputs[0].focus(); // Optional: Set focus to the new input
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong.");
    }
 };
function guessValidate(guess) {
    const regex = /^[a-zA-Z]{5}$/;
    return regex.test(guess);
}
function unlockInputs(inputs) {
    inputs.forEach(input => {
        input.disabled = false;
    }
    )
}

function colorGuess(inputs, result) {
    const ColorEnum = {
        'g': 'green',   // Correct letter
        'b': 'gray',    // Incorrect letter
        'y': 'yellow'   // Partially correct
    };

    inputs.forEach((input, index) => {
        const letter = input.value.toUpperCase();
        const resultCode = result.charAt(index);
        const tile = input.closest('.tile');
        const tileInner = tile.querySelector('.tile-inner');
        const back = tile.querySelector('.tile-back');

        input.disabled = true;

        // Set letter and color on the back
        back.textContent = letter;
        back.classList.remove('green', 'yellow', 'gray');
        back.classList.add(ColorEnum[resultCode]);

        // Delay flip animation per tile (Wordle style)
        setTimeout(() => {
            tile.classList.add('flip');
        }, index * 300); // 300ms stagger
    });
}
document.querySelectorAll('.tile-front input').forEach((input, index, inputs) => {
    input.addEventListener('input', function () {
        // Auto move to next tile
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        // Auto uppercase input
        input.value = input.value.toUpperCase();
    });
});

document.querySelectorAll('.inputBoxContainer input').forEach((input, index, inputs) => {
    input.addEventListener('keydown', function (event) {
        if (event.key === "Backspace" && input.value === "") {
            // Focus on the previous input field if Backspace is pressed and the field is empty
            if (index > 0) {
                inputs[index - 1].focus();
            }
        }
    });
});
