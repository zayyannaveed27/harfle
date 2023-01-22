import {VALID_GUESSES_5} from './fiveletterwords.js'
import {VALID_GUESSES_4} from './fourletterwords.js'

mixpanel.track('Sign Up', {
  'source': "Pat's affiliate site",
  'Opted out of email': true,
});

function getRandomNumber(min, max) {
    let range = max - min + 1;
    let number = Math.random() * range;
    let result = Math.floor(number) + min;
    
    return result;
}


const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

const alertBox = document.getElementById('alert-box');
const alertMsg = document.getElementById('alert-msg');
const alertBtn = document.getElementById('alert-btn');

function openAlert(msg) {
    alertMsg.innerHTML = msg;
    alertBox.classList.remove('hide');
    overlay.classList.add('pause');
}

function closeAlert() {
    alertBox.classList.add('hide');
    overlay.classList.remove('pause');
}

alertBtn.addEventListener('click', ()=> {
    closeAlert()
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
    closeAlert();
})


//implement dark mode toggle functionality

const container = document.getElementById('container')
const settingsIcon = document.getElementsByClassName('button-icon')
const darkModeToggle = document.getElementById("dark-mode");
const headerTitle = document.getElementById('header-title');
const finalModal = document.getElementById('end-modal');

darkModeToggle.onclick = function(){

    darkModeToggle.classList.toggle('active');
    container.classList.toggle('active');
    headerTitle.classList.toggle('active');
    finalModal.classList.toggle('light');

    for (let i = 0; i < settingsIcon.length; i++) { 
        settingsIcon[i].classList.toggle('active');
      }

    openModalButtons.forEach(button => {
        const modal = document.querySelector(button.dataset.modalTarget);
        modal.classList.toggle('light');
    })

    const squares = document.getElementById("board").children;

    for (let i = 0; i < squares.length; i++) { 
        squares[i].classList.toggle('light');
      }
    
}


const rejectBtn = document.getElementById("reject");

rejectBtn.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})


document.addEventListener("DOMContentLoaded", () => {

    let VALID_GUESSES = VALID_GUESSES_4
    let rows = 7;
    let columns = 4;
    
    createSquares(rows,columns);
    

    var guessedWords = [[]];
    var guessedWordCount = 0;

    let currentLetter = 1;
    
    let word = VALID_GUESSES[getRandomNumber(0, VALID_GUESSES.length)]

    const keys = document.querySelectorAll('.keyboard-row button');
    const buttons = document.querySelectorAll('.keyboard-row button');

    
    function resetBoard() {
        guessedWords = [[]];
        guessedWordCount = 0;
        currentLetter = 1;
        word = VALID_GUESSES[getRandomNumber(0, VALID_GUESSES.length)]
        deleteSquares();
        createSquares(rows,columns);

        const letterKeys = document.getElementsByClassName('letter');
        for (let i= 0; i < letterKeys.length; i++) {
            letterKeys[i].style.backgroundColor = "rgb(129,131,132)";   
        }
    }

    const reloadButton  = document.getElementById('reload-button')
    
    reloadButton.addEventListener('click', () => {
        resetBoard();

    })

    const confirmBtn = document.getElementById("confirm");

    confirmBtn.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
            closeModal(modal)
        })    
        resetBoard();
    })

    const difficultyToggle = document.getElementById("difficulty-mode");


    //change board grid dimensions for 4 or 5 letter word
    difficultyToggle.onclick = function() {

        difficultyToggle.classList.toggle('active');
        if (columns == 5) {
            VALID_GUESSES = VALID_GUESSES_4
            rows = 7;
            columns = 4;
        }
        else {
            VALID_GUESSES = VALID_GUESSES_5
            rows = 6;
            columns = 5;
        }
        resetBoard();
        
    }

    //activate the final message modal
    function endGame(msg) {
        const endModal = document.getElementById('end-modal');
        const endMsg = document.getElementById('end-msg');
        endMsg.innerHTML = msg;
        endModal.classList.add('active');
        overlay.classList.add('active');
    }
    

    //get the array for the current word being entered
    function getCurrentWordArr() {
        return guessedWords[guessedWordCount];
    };

    //add new letter to the current word array
    function updateGuessedWords(letter) {

        const currentWordArr = getCurrentWordArr();
        const wordLength = currentWordArr.length;

        if ( wordLength < columns) {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(guessedWordCount * columns + currentLetter));
            availableSpaceEl.textContent = letter;
            currentLetter += 1;
            // console.log(currentWordArr);
        }
    };

    //get the tile color for the letter based on its index in array
    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        //return grey if incorrect
        if(!isCorrectLetter) {  
            return "rgb(58, 58, 60)";
        }

        const letterinPosition = word.charAt(index);
        const isCorrectPosition = letter === letterinPosition;

        //return green if correct position and letter
        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        //return yellow if wrong position and correct letter
        return "rgb(181, 159, 59)";
    }

    //convert the input word into an array and compare with the actual word
    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr.length !== columns) {
            openAlert(`لفظ مکمل نہیں ہے`);
            return;
        }

        const currentWord = currentWordArr.join("");

        if (!(VALID_GUESSES.includes(currentWord))) {
            openAlert('لفظ فہرست میں نہیں ہے')
            return;
        }  

        const firstLetterId = guessedWordCount * columns + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);
                
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor};color:gainsboro;`;
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].getAttribute('id') === letter) {
                        buttons[i].style = `background-color:${tileColor}`;
                        buttons.splice(i,1);
                    }
                    
                }
            }, interval * index)
        });

        guessedWordCount += 1;
        currentLetter = 1;

        setTimeout(() => {
            if(currentWord == word){
                endGame(`کمال کر دیا، لفظ تھا؛ ${word}`);
            }
    
            if (guessedWordCount === rows) {
                endGame(`اچھی کوشش لیکن لفظ تھا؛ ${word}`);
            }
        }, interval * (columns + 1))
        

        guessedWords.push([]);
    }

    //remove the letter from the current word array if applicable
    function handleDeleteLetter() {
        if (currentLetter === 1) {
            return;
        }

        currentLetter = currentLetter - 1;
        let currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();
        

        guessedWords[guessedWordCount] = currentWordArr;
        // console.log(`popped out ${removedLetter} and this is the new ${guessedWords[guessedWordCount]}`);
        const lastLetterEl = document.getElementById(String(guessedWordCount * columns + currentLetter));

        lastLetterEl.textContent = "";
        
    }

    //create a board grid with x rows and y columns 
    function createSquares(x,y) {
        const gameBoard = document.getElementById("board");
        const lightmode = (container.classList.contains('active'))
        for (let i = 0; i < x; i++) {
            for (let j = y; j > 0; j--) {
                let square = document.createElement("div");
                square.classList.add("square");
                square.classList.add("animate__animated");
                if (lightmode){
                    square.classList.add("light");
                }
                square.setAttribute("id", i*y+j);
                gameBoard.appendChild(square);  
            }   
        };
        // update the grid style based on the columns
        gameBoard.style = `grid-template-columns: repeat(${y}, 1fr)`;
    }

    function deleteSquares() {
        const gameBoard = document.getElementById("board");
        gameBoard.innerHTML = "";
        }

    //iterate over the dynamic key inputs from the user
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            
            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if (letter === 'delete') {
                handleDeleteLetter();
                return;
            }
                
            updateGuessedWords(letter);
        };  
    };
});
