document.addEventListener('DOMContentLoaded', function(){
    welcome_page()
    document.querySelector('#main-button-console').addEventListener('click', gameboard); 
    document.querySelector('#main-button-main').addEventListener('click', () => load_view('main')); 
    document.querySelector('#main-button-profile').addEventListener('click', () => load_view('profile')); 
    document.querySelector('#main-button-players').addEventListener('click', () => load_view('chat')); 
    document.querySelector('#main-button-settings').addEventListener('click', () => load_view('settings')); 
});

function load_view(content){

    document.querySelector('#welcome').style.display = 'none'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none'; 
    document.querySelector('#hangman-pic').style.display = 'none';
    document.querySelector('#main').style.display = 'none'; 
    document.querySelector('#chat').style.display = 'none'; 
    document.querySelector('#settings').style.display = 'none'; 

    if(content === 'profile'){
        document.querySelector('#profile').style.display = 'block';
        profilename = document.querySelector('#profile-name').innerHTML; 
        fetch(`game/${profilename}`)
        .then(response => response.json())
        .then(info => {
            console.log(info); 
            const followers = info.followers; 
            const followings = info.followings; 
            const gamesPlayed = info.played_games; 
            const wonGames = info.won_games; 
            document.querySelector('#games-played').innerHTML = `Games Played: ${gamesPlayed}`
            document.querySelector('#games-won').innerHTML =`Games Won: ${wonGames}`
            document.querySelector('#followers').innerHTML = `Followers: ${followers}`
            document.querySelector('#followings').innerHTML = `Following: ${followings}`
        }); 

        fetch(`wongames/${profilename}`)
        .then(response => response.json())
        .then(winnings => {
            console.log(winnings)
            for(let i=0; i<3; i++){
                again_id_name = convert_to_words(i); 
                document.querySelector(`#won-tries-${again_id_name}`).innerHTML = `Tries: ${winnings[i].wrong_guesses}`; 
                document.querySelector(`#won-word-${again_id_name}`).innerHTML = `Word: <b>${winnings[i].word}</b>`; 
            }
        }); 

        fetch(`lostgames/${profilename}`)
        .then(response => response.json())
        .then(losings => {
            console.log(losings)
            for(let i=0; i<3; i++){
                again_again_id_name = convert_to_words(i); 
                document.querySelector(`#lost-tries-${again_again_id_name}`).innerHTML = `Tries: ${losings[i].wrong_guesses}`; 
                document.querySelector(`#lost-word-${again_again_id_name}`).innerHTML = `Word: <b>${losings[i].word}</b>`; 
            }
        });



    } else if(content === 'main'){
        document.querySelector('#main').style.display = 'block'; 

    } else if(content === 'chat'){
        document.querySelector('#chat').style.display = 'block'; 
        document.querySelector('#chat-receiver').value = ''; 
        document.querySelector('#chat-message').value = ''; 
        //FETCH THE THREE RECENT MESSAGE INFO
        fetch('/messages')
        .then(response => response.json())
        .then(texts => {
            console.log(texts)
            for(let i=0; i<3; i++){
                id_name = convert_to_words(i); 
                document.querySelector(`#recent-sender-name-${id_name}`).innerHTML = texts[i].sender_name; 
                document.querySelector(`#recent-sender-time-${id_name}`).innerHTML = texts[i].timestamp; 
                document.querySelector(`#recent-sender-text-${id_name}`).innerHTML = texts[i].message_text; 
            }
        }); 
        document.querySelector('#recent-one').addEventListener('click', function(){
            document.querySelector('#message-card-send-name').innerHTML = document.querySelector('#recent-sender-name-one').innerHTML;
            document.querySelector('#lastone-text').innerHTML =  document.querySelector('#recent-sender-text-one').innerHTML; 
        }); 
        document.querySelector('#recent-two').addEventListener('click', function(){
            document.querySelector('#message-card-send-name').innerHTML = document.querySelector('#recent-sender-name-two').innerHTML;
            document.querySelector('#lastone-text').innerHTML =  document.querySelector('#recent-sender-text-two').innerHTML; 
        }); 
        document.querySelector('#recent-three').addEventListener('click', function(){
            document.querySelector('#message-card-send-name').innerHTML = document.querySelector('#recent-sender-name-three').innerHTML;
            document.querySelector('#lastone-text').innerHTML =  document.querySelector('#recent-sender-text-three').innerHTML; 
        }); 

        document.querySelector('#chat-submit').addEventListener('click', () => send_message())
    }
    else if (content === 'settings'){
        document.querySelector('#settings').style.display = 'block'; 
    }
    

}

function send_message() {
    const receiver_name = document.querySelector('#chat-receiver').value; 
    const message_text = document.querySelector('#chat-message').value; 

    fetch('/sendMessage', {
        method: 'POST',
        body: JSON.stringify({
            receiver_name : receiver_name, 
            message_text : message_text
        })
    })
    .then(response => response.json())
    .then(chat => {
        console.log(chat); 
        refresh_chat(`${receiver_name}`);  
    }); 
    return false; 
}

function refresh_chat(name) {
    document.querySelector('#welcome').style.display = 'none'; 
    document.querySelector('#main').style.display = 'none'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none'; 
    document.querySelector('#hangman-pic').style.display = 'none';
    document.querySelector('#settings').style.display = 'none'; 
    document.querySelector('#chat').style.display = 'block';
    document.querySelector('#chat-receiver').value = ''; 
    document.querySelector('#chat-message').value = ''; 
    document.querySelector('#message-card-send-name').innerHTML = `<${name}>`; 
    
}

function welcome_page() {
    document.querySelector('#welcome').style.display = 'block'; 
    document.querySelector('#main').style.display = 'none'; 
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#gameboard').style.display = 'none'; 
    document.querySelector('#player-input').style.display = 'none'; 
    document.querySelector('#hangman-pic').style.display = 'none';
    document.querySelector('#chat').style.display = 'none';  
    document.querySelector('#settings').style.display = 'none'; 
}

function wipeout() {
    document.querySelector('#char-one').innerHTML = ''; 
    document.querySelector('#char-two').innerHTML = ''; 
    document.querySelector('#char-three').innerHTML = ''; 
    document.querySelector('#char-four').innerHTML = ''; 
    document.querySelector('#char-five').innerHTML = ''; 
    document.querySelector('#game-id').innerHTML = ''; 
    document.querySelector('#hangman-pic-pic').src = '/static/game/hangman.jpg'; 
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

function hangman(number){
    
    document.querySelector('#hangman-pic-pic').src = '/static/game/hangman' + number + '.jpg'; 
}

function gameboard(){

    document.querySelector('#welcome').style.display = 'none'; 
    document.querySelector('#main').style.display = 'none'; 
    document.querySelector('#profile').style.display = 'none'; 
    document.querySelector('#gameboard').style.display = 'block'; 
    document.querySelector('#player-input').style.display = 'block'; 
    document.querySelector('#hangman-pic').style.display = 'block'; 
    document.querySelector('#chat').style.display = 'none'; 
    
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
                        wipeout();
                        welcome_page();
                    } else {
                        
                        console.log(game.wrong_guesses)
                        wrong_guess_count = game.wrong_guesses + 1
                        console.log(wrong_guess_count)
                        fetch(`/game/${game_id}`, {
                            method: 'PUT', 
                            body : JSON.stringify({
                                wrong_guesses: wrong_guess_count
                            })
                        })
                        hangman(wrong_guess_count)
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

                        wipeout(); 
                    }
                }
            } else {
            
                if(game.wrong_guesses === 6){
                    alert('You lost :( TRY AGAIN')
                    wipeout();
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
                    hangman(wrong_guess_count)
                }
            }

            document.querySelector('#guess-char').value = ''; 
        });
        
    }); 
}


