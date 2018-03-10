var db = firebase.database();

var name = "";
var email = "";
var gameReady = false;

var roomNumber;
var player;
var wins = 0;

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



// writeUser(1, "john", "jj@js.com", 1); 
function gameState(){
    firebase.database().ref('/game').once('value').then(function(d){
        // d.val().forEach((element, i) => {
        //   element.forEach((e, j)=>{
        //       console.log(JSON.stringify(e) + "index: " + j)
        //   })
        // });
        console.log(d.key);
        
        if(!gameReady && !player && !roomNumber){
            if(!d.val()){
                roomNumber = 1;
                player = 1;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
            }else if(d.val() && d.val()[d.val().length-1].length < 3){
                roomNumber = d.val().length -1;
                player = 2;
                writeUser(roomNumber, name, email, player, wins);
                gameReady = true;
                $('.registration').remove();
                setTurn(roomNumber, 1);
                var chats = firebase.database().ref(`/game/${roomNumber}/chat`);
                    chats.on('child_added', function(chat){
                        $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
                
            }
            
        }
    })

}


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
