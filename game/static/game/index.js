document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#welcome').style.display = 'block'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none';  
    document.querySelector('#main-button-console').addEventListener('click', gameboard); 
}); 

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
        return "five"
    }
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
            const word = game.word 
            console.log(word)
            if(word.includes(char)){
                const num = word.indexOf(char)
                const position = convert_to_words(num); 
                document.querySelector(`#char-${position}`).innerHTML = char; 
            }
            //need the else here where the user does not guess correctly and we add to our hangman 
            // else {}
            document.querySelector('#guess-char').value = ''; 
        });
        
    }); 
}


