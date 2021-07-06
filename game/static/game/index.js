document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#welcome').style.display = 'block'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none';  
    document.querySelector('#main-button-console').addEventListener('click', gameboard); 
}); 


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

    document.querySelector('#guess-form').onsubmit = function() {
        char = document.querySelector('#guess-char').value;
        position = document.querySelector('#position').value; 
        game_id = document.querySelector('#game-id').innerHTML; 
        
        fetch(`/game/${game_id}`)
        .then(response => response.json())
        .then(game => {
            const word = game.word
            
        }); 
    }; 


}


