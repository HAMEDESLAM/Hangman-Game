let drawParts = Array.from(document.querySelectorAll(".hangman *:not(.hangman-man)"));
let drawPartsGenerator = drawHangman();
let span = document.querySelector(".header span");
let lettersSection = document.querySelector(".letters");
let wordContainer = document.getElementsByClassName("word-container")[0];

// Add word
let word;


function render(){
    // Add parts
    generateWord()

    // Add letters
    addLetters()
}

function addLetters(){
    for(let i = 0; i < 26; i++){
        let letter = document.createElement("button");
        let char = String.fromCharCode(65 + i);
        letter.classList.add("letter");
        letter.innerHTML = char;
        letter.id = char;
        letter.addEventListener("click", function(){
           let check = checkLetter(this.id);
           if(check.length > 0){
                check.forEach(index => {
                     showLetter(index);
                });
                this.disabled = true;
                this.classList.add("correct");
                (isItAllGuessed()) ? endGame(true) : null;
           }
           else{
                this.classList.add("wrong");
                this.disabled = true;
                (drawPartsGenerator.next().done) ? endGame(false) : null;
           }
        });
        lettersSection.appendChild(letter);
    }
}

async function generateWord(){
    try{
        let words = await fetch("https://raw.githubusercontent.com/HAMEDESLAM/Hangman-Game/main/words.json");
        let data = await words.json();
        let randint = Math.floor(Math.random() * data.length);
        word = data[randint].words[Math.floor(Math.random() * data.length)];
        span.innerHTML = data[randint].category;
        for(let i = 0; i < word.length; i++){
            let letter = document.createElement("div");
            letter.classList.add("letter");
            letter.id = i;
            wordContainer.appendChild(letter);
        }
        return word;
    }
    catch(err){
        console.log(err);
    }
}

// checks letter in our word
function checkLetter(letter){
    let reg = new RegExp(letter, "ig");
    let results = Array.from(word.matchAll(reg));
    return results.map(result => result.index);
}

// show letters
function showLetter(index){
    let letter = document.getElementById(index);
    letter.innerHTML = word[index];
    letter.classList.add("show");
}

// generator to show the drawn parts
function* drawHangman(){
    for(let i = 0; i < drawParts.length; i++){
        drawParts[i].classList.add("wrong");
        console.log(drawParts[i]);
        if(i !== drawParts.length-1){
            yield;
        }else{
            return
        }
    }
}

// is it all guessed
function isItAllGuessed(){
    let letters = Array.from(document.querySelectorAll(".word-container .letter"));
    return letters.every(letter => letter.classList.contains("show"));
}

// End game
function endGame(won){
    let end = document.getElementsByClassName("endgame-container")[0];
    end.classList.add("show");
    document.getElementById("finalMessageRevealWord").innerHTML = `The Word was: \"<span>${word}</span>\"`;
    document.getElementById("playAgainButton").onclick = ()=> document.location.reload();
    
    if(won){
        document.getElementById("finalMessage").innerHTML = "Excellent!";
    }
    else{
        document.getElementById("finalMessage").innerHTML = "Game Over!"; 
    }
}
    


render();