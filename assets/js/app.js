let db = firebase.database();

let name = "";
let email = "";
let gameReady = false;

let roomNumber;
let player;
let enemy;
let wins = 0;

let choice = "";

function setName(id, name){
    $(`.name-${id}`).text(name);
}

function writeUser(roomId, name,email, player, wins){
    db.ref(`/game/${roomId}/${player}`).set({name: name, email: email, wins: wins, choice: ""});

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

        console.log(d.val())

        
        if(!gameReady && !player && !roomNumber){
            if(!d.val()){
                roomNumber = 1;
                player = 1;
                enemy = 2;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                $(`.player-${player} .choices`).removeClass("display");
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                // firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                //     console.log(d.val()[roomNumber]);
                //     if(d.val()[enemy].hasOwnProperty("name")){
                //         setName(enemy, d.val()[enemy].name)
                //     }
                //     if(d.val().turn === 0){
                //         $('.turn').text(d.val().turn)
                //     }else if(d.val().turn === player){
                //         $('.turn').text(d.val()[player].name)
                //     }else if(d.val().turn === enemy){
                //         $('.turn').text(d.val()[enemy].name)
                //     }
                //     console.log(d.val());
                
                // })
                
            }else if(d.val() && d.val()[d.val().length-1].length < 3){
                roomNumber = d.val().length -1;
                player = 2;
                enemy = 1;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                $(`.player-${player} .choices`).removeClass("display");
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                setTurn(roomNumber, 1);
                // firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                //     console.log(d.val()[roomNumber]);
                //     if(d.val()[enemy].hasOwnProperty("name")){
                //         setName(enemy, d.val()[enemy].name)
                //     }
                //     if(d.val().turn === 0){
                //         $('.turn').text(d.val().turn)
                //     }else if(d.val().turn === enemy){
                //         $('.turn').text(d.val()[enemy].name)
                //     }else if(d.val().turn === player){
                //         $('.turn').text(d.val()[player].name)
                //     }
                //     console.log(d.val());
                
                // })
            }else if(d.val() && d.val().length >= 2 && d.val()[d.val().length-1].hasOwnProperty('1') && !d.val()[d.val().length-1].hasOwnProperty('2')){
                roomNumber = d.val().length -1;
                player = 2;
                enemy = 1;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                $(`.player-${player} .choices`).removeClass("display");
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                setTurn(roomNumber, 1);
                // firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                //     console.log(d.val()[roomNumber]);
                //     if(d.val()[enemy].hasOwnProperty("name")){
                //         setName(enemy, d.val()[enemy].name)
                //     }
                //     if(d.val().turn === 0){
                //         $('.turn').text(d.val().turn)
                //     }else if(d.val().turn === enemy){
                //         $('.turn').text(d.val()[enemy].name)
                //     }else if(d.val().turn === player){
                //         $('.turn').text(d.val()[player].name)
                //     }
                //     console.log(d.val());
                
                // })
                console.log('2 players currently playing');
            }else if(d.val() && d.val().length >= 2 && !d.val()[d.val().length]){
                roomNumber = d.val().length;
                player = 1;
                enemy = 2;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                $(`.player-${player} .choices`).removeClass("display");
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                setName(player, name);
                
                console.log('2 players currently playing');
            }
            firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                if(d.val()[enemy].hasOwnProperty("name")){
                    setName(enemy, d.val()[enemy].name)
                }
                
                switch(d.val()[enemy].choice){
                    case "rock":
                        if(d.val()[player].choice === "rock"){
                            console.log("draw");
                            chooseRPS(roomNumber, player, "");
                        }else if(d.val()[player].choice === "paper"){
                            console.log("lose");
                            chooseRPS(roomNumber, player, "");
                        }else if(d.val()[player].choice === "scissors"){
                            console.log("win");
                            chooseRPS(roomNumber, player, "");
                            setWins(roomNumber, player, d.val()[player].wins += 1)
                        }
                        break;
                    case "paper":
                        if(d.val()[player].choice === "rock"){
                            console.log("win");
                            chooseRPS(roomNumber, player, "");
                            setWins(roomNumber, player, d.val()[player].wins += 1)
                        }else if(d.val()[player].choice === "paper"){
                            console.log("draw");
                            chooseRPS(roomNumber, player, "");

                        }else if(d.val()[player].choice === "scissors"){
                            console.log("lose");
                            chooseRPS(roomNumber, player, "");

                        }
                        break;
                    case "scissors":
                        if(d.val()[player].choice === "rock"){
                            console.log("lose");
                            chooseRPS(roomNumber, player, "");

                        }else if(d.val()[player].choice === "paper"){
                            console.log("win");
                            chooseRPS(roomNumber, player, "");
                            setWins(roomNumber, player, d.val()[player].wins += 1)
                        }else if(d.val()[player].choice === "scissors"){
                            console.log("draw");
                            chooseRPS(roomNumber, player, "");

                        }
                        break;
                }

                
                
            
            });
            firebase.database().ref(`/game/${roomNumber}`).on('value', function(d){
                
                if(d.val().turn === 0){
                    $('.turn').text(d.val().turn)
                }else if(d.val().turn === enemy){
                    $('.turn').text(d.val()[enemy].name)
                }else if(d.val().turn === player){
                    $('.turn').text(d.val()[player].name)
                }

                if(d.val().turn != player){
                    $(`.player-${player} button`).attr("disabled", "disabled");
                }else{
                    $(`.player-${player} button`).removeAttr("disabled");

                }
            });

            
        }
        
    })

}


$('.clear').on('click', ()=>{ 
    clearGame();

})

$('.choices button').on('click', function(){
    let choice = $(this).data('id');
    chooseRPS(roomNumber, player, choice);
    if(player === 1){
        setTurn(roomNumber, 2);
    }else{
        setTurn(roomNumber, 1);
    }
    // if()

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

