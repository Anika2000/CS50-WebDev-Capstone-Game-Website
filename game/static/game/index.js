document.addEventListener('DOMContentLoaded', function(){
     welcome_page()
    document.querySelector('#main-button-console').addEventListener('click', gameboard); 
}); 

function welcome_page() {
    document.querySelector('#welcome').style.display = 'block'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none'; 
}

function convert_to_words(num) {
    if (num === 0){
        return "one"; 
    } else if (num === 1){
        return "two"; 
    } else if (num === 2){
        return "three"; 
    } else if (num === 3) {
        return "four"; 
    } else {
        return "five"; 
    }
}

String.prototype.replaceAt = function(index, replacement) {
    if(index >= this.length){
        return this.valueOf()
    }
    return this.substring(0, index) + replacement + this.substring(index + replacement.length); 
}

function hangman(game){
    console.log('hangman drawing')
}

function gameboard(){

    document.querySelector('#welcome').style.display = 'none'; 
    document.querySelector('#profile').style.display = 'none'; 
    document.querySelector('#gameboard').style.display = 'block'; 
    document.querySelector('#player-input').style.display = 'block'; 
    
    document.querySelector('#game-start-button').addEventListener('click', function() {
        fetch('/game-start', {
            method:'POST'
        })
        .then(response => response.json())
        .then(game => {
            console.log(game)
            document.querySelector('#game-id').innerHTML = game.success;
        }); 
        return false; 
    }); 

    document.querySelector('#word-submit').addEventListener('click', function() {
        char = document.querySelector('#guess-char').value;
        game_id = document.querySelector('#game-id').innerHTML; 
        console.log(char)

        fetch(`/game/${game_id}`)
        .then(response => response.json())
        .then(game => {
            console.log(game)
            const word = game.word
            console.log(word)
            const word_state = game.word_state
            if(word.includes(char)){
                const num = word.indexOf(char)
                console.log(num)

                if(Number(String(word_state).charAt(num)) === 2){

                    if(game.wrong_gusses === 6){
                        alert('You lost :( TRY AGAIN')
                        welcome_page()
                    } else {
                        wrong_guess_count = game.wrong_guesses + 1
                        fetch(`/game/${game_id}`, {
                            method: 'PUT', 
                            body : JSON.stringify({
                                wrong_gusses: wrong_guess_count
                            })
                        })
                        hangman(game)
                    }
                    
                } else {
                    const position = convert_to_words(num); 
                    document.querySelector(`#char-${position}`).innerHTML = char; 
                    word_state_char = word_state.toString()
                    word_state_char = word_state_char.replaceAt(num, '2')
                    word_state_number = parseInt(word_state_char, 10)   

                    fetch(`/game/${game_id}`, {
                        method: 'PUT', 
                        body : JSON.stringify({
                            word_state: word_state_number
                        })
                    })
                    if (word_state_number === 22222){
                        alert('You won the game!!!')
                        fetch(`/game/${game_id}`, {
                            method: 'PUT', 
                            body : JSON.stringify({
                                win: true
                            })
                        })
                    }
                }
            } else {
            
                if(game.wrong_guesses === 6){
                    alert('You lost :( TRY AGAIN')
                    welcome_page(); 
                } else {
                    
                    wrong_guess_count = game.wrong_guesses + 1
                    console.log(`wrong-guess: ${wrong_guess_count}`)
                    fetch(`/game/${game_id}`, {
                        method: 'PUT', 
                        body : JSON.stringify({
                            wrong_guesses: wrong_guess_count
                        })
                    })
                    hangman(game)
                }
            }

            document.querySelector('#guess-char').value = ''; 
        });
        
    }); 
}


