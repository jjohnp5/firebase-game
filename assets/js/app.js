var db = firebase.database();

var name = "";
var email = "";
var gameReady = false;

var roomNumber;
var player;
var enemy;
var wins = 0;

var game = {
    choices: ["rock", "paper", "scissors"],
    player: player,

}

function setName(id, name){
    $(`.name-${id}`).text(name);
}

function writeUser(roomId, name,email, player, wins){
    db.ref(`/game/${roomId}/${player}`).set({name: name, email: email, wins: wins});

}

function chooseRPS(roomId, player, choice){
    db.ref(`/game/${roomId}/${player}/choice`).set(choice);

}
function setTurn(roomId, turn){
    db.ref(`/game/${roomId}/turn`).set(turn);

}
function setWins(roomId, player, wins){
    db.ref(`/game/${roomId}/${player}/wins`).set(wins);

}
function resetWins(roomId, player, wins){
    db.ref(`/game/${roomId}/${player}/wins`).set(0);
}



function gameState(){
    firebase.database().ref('/game').once('value').then(function(d){

        

        
        if(!gameReady && !player && !roomNumber){
            if(!d.val()){
                roomNumber = 1;
                player = 1;
                enemy = 2;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                    console.log(d.val()[roomNumber]);
                    if(d.val()[enemy].hasOwnProperty("name")){
                        setName(enemy, d.val()[enemy].name)
                    }
                    if(d.val().turn === 0){
                        $('.turn').text(d.val().turn)
                    }else if(d.val().turn === player){
                        $('.turn').text(d.val()[player].name)
                    }else if(d.val().turn === enemy){
                        $('.turn').text(d.val()[enemy].name)
                    }
                    console.log(d.val());
                
                })
                
            }else if(d.val() && d.val()[d.val().length-1].length < 3){
                roomNumber = d.val().length -1;
                player = 2;
                enemy = 1;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                setTurn(roomNumber, 1);
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                    console.log(d.val()[roomNumber]);
                    if(d.val()[enemy].hasOwnProperty("name")){
                        setName(enemy, d.val()[enemy].name)
                    }
                    if(d.val().turn === 0){
                        $('.turn').text(d.val().turn)
                    }else if(d.val().turn === enemy){
                        $('.turn').text(d.val()[enemy].name)
                    }else if(d.val().turn === player){
                        $('.turn').text(d.val()[player].name)
                    }
                    console.log(d.val());
                
                })
            }else{
                console.log('2 players currently playing');
            }

            // }else if(d.val() && (!d.val()[d.val().length-1].hasOwnProperty('1') && !d.val()[d.val().length-1].hasOwnProperty('2'))){
            //     roomNumber = d.val().length;
            //     console.log(roomNumber);
            //     player = 1;
            //     enemy = 2;
            //     writeUser(roomNumber, name, email, player, wins);
            //     gameReady = true;
            //     $('.registration').remove();
            //     var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
            //         chats.on('child_added', function(chat){
            //             $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
            //     });
            // }else if(d.val() && !d.val()[d.val().length-1].hasOwnProperty('1') && d.val()[d.val().length-1].hasOwnProperty('2')){
            //     roomNumber = d.val().length;
            //     console.log(roomNumber);
            //     player = 1;
            //     enemy = 2;
            //     writeUser(roomNumber, name, email, player, wins);
            //     gameReady = true;
            //     $('.registration').remove();
            //     var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
            //         chats.on('child_added', function(chat){
            //             $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
            //     });
            // }else if(d.val() && d.val()[d.val().length-1].hasOwnProperty('1') && !d.val()[d.val().length-1].hasOwnProperty('2')){
            //     roomNumber = d.val().length;
            //     console.log(roomNumber);
            //     player = 2;
            //     enemy = 1;
            //     writeUser(roomNumber, name, email, player, wins);
            //     gameReady = true;
            //     $('.registration').remove();
            //     var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
            //         chats.on('child_added', function(chat){
            //             $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
            //     });
            // }
            
        }
    })

}
firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
    console.log(d.val()[roomNumber]);
    if(d.val()[enemy].hasOwnProperty("name")){
        setName(enemy, d.val()[roomNumber][enemy].name)
    }
    console.log(d.val());

})


$('.clear').on('click', ()=>{ 
    clearGame();

})

$('button[type="submit"]').on('click', (e)=>{
    e.preventDefault();
    name = $('#name').val();
    email = $('#email').val();
    gameState();
    
    
})

$('.send').on('click', function(e){
    e.preventDefault();
    const updateChat = firebase.database().ref(`/game/${roomNumber}/chat`);
    var push = updateChat.push();
    push.set({name: name, message: $('.message').val()});
    $('.message').val("");
    
    
})


function clearGame(){
    db.ref('/game').set("");
}

