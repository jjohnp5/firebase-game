$(document).ready(function () {


    let db = firebase.database();

    let name = "";
    let gameReady = false;

    let roomNumber;
    let player;
    let enemy;
    let wins = 0;
    let enemySet = false;

    let choice = "";

    function setName(id, name) {
        $(`.name-${id}`).text(name);
    }

    function writeUser(roomId, name, player, wins) {
        db.ref(`/game/${roomId}/${player}`).set({ name: name, wins: wins, choice: "" });
        db.ref(`/game/${roomId}/disconnected`).set(`${name} has connected`);
    }

    function chooseRPS(roomId, player, choice) {
        db.ref(`/game/${roomId}/${player}/choice`).set(choice);

    }
    function setTurn(roomId, turn) {
        db.ref(`/game/${roomId}/turn`).set(turn);

    }
    function setWins(roomId, player, wins) {
        db.ref(`/game/${roomId}/${player}/wins`).set(wins);

    }
    function resetWins(roomId, player, wins) {
        db.ref(`/game/${roomId}/${player}/wins`).set(0);
    }

    let winDisplay = $('.win');

    function gameState() {
        db.ref('/game').once('value').then(function (d) {
            
            console.log(d.val())


            if (!gameReady && !player && !roomNumber) {
                if (!d.val()) {
                    roomNumber = 1;
                    player = 1;
                    enemy = 2;
                    writeUser(roomNumber, name, player, wins);
                    gameReady = true;
                    $('.registration').remove();
                    $(`.player-${player} .choices`).removeClass("display");

                    setName(player, name);


                } else if (d.val() && d.val()[d.val().length - 1]) {
                    let playerSet = false;
                    for (let i = 1; i < d.val().length; i++) {
                        if (d.val()[i].hasOwnProperty('1') && !d.val()[i].hasOwnProperty('2') && !playerSet) {
                            roomNumber = i;
                            player = 2;
                            enemy = 1;

                        } else if (!d.val()[i].hasOwnProperty('1') && d.val()[i].hasOwnProperty('2') && !playerSet) {
                            roomNumber = i;
                            player = 1;
                            enemy = 2;

                        } else if (!d.val()[i].hasOwnProperty('1') && !d.val()[i].hasOwnProperty('2') && !playerSet) {
                            roomNumber = i;
                            player = 1;
                            enemy = 2;

                        }
                        writeUser(roomNumber, name, player, wins);
                        gameReady = true;
                        $('.registration').remove();
                        $(`.player-${player} .choices`).removeClass("display");

                        setName(player, name);
                        
                        playerSet = true;
                        winDisplay.text('Ready to play!');
                        
                        
                    }
                    if (d.val() && !d.val()[d.val().length] && !playerSet) {
                        roomNumber = d.val().length;
                        player = 1;
                        enemy = 2;
                        writeUser(roomNumber, name, player, wins);
                        gameReady = true;
                        $('.registration').remove();
                        $(`.player-${player} .choices`).removeClass("display");

                        setName(player, name);
                        playerSet = true;
                        console.log('2 players currently playing');
                    }
                    

                }
                
                $('.chat').removeClass('display');
                var chats = db.ref(`/game/${roomNumber}/chat`);
                chats.on('child_added', function (chat) {
                    $('.chatbox').append($('<p class="chat-message">').text(`${chat.val().name}: ${chat.val().message}`))
                });
            }
            db.ref(`/game/${roomNumber}`).on('value', function (d) {
                
                if (d.val()[enemy] && enemySet === false) {
                    setName(enemy, d.val()[enemy].name)
                    enemySet = true;
                    setTurn(roomNumber, 1);
                    // winDisplay.text(`${d.val()[enemy].name} joined the room..`);
                }
                $(`.player-${player}-wins`).text(`Wins: ${d.val()[player].wins}`);
                if (enemySet) {
                    $(`.player-${enemy}-wins`).text(`Wins: ${d.val()[enemy].wins}`);

                    switch (d.val()[enemy].choice) {
                        case "rock":
                            if (d.val()[player].choice === "rock") {
                                console.log("draw");
                                winDisplay.text('Draw!');
                                chooseRPS(roomNumber, player, "");
                            } else if (d.val()[player].choice === "paper") {
                                console.log("win");
                                winDisplay.text('You Win!');
                                chooseRPS(roomNumber, player, "");
                                setWins(roomNumber, player, d.val()[player].wins += 1)
                            } else if (d.val()[player].choice === "scissors") {
                                console.log("lose");
                                winDisplay.text('You lose!');
                                chooseRPS(roomNumber, player, "");
                            }
                            break;
                        case "paper":
                            if (d.val()[player].choice === "rock") {
                                console.log("lose");
                                winDisplay.text('You lose!');
                                chooseRPS(roomNumber, player, "");
                            } else if (d.val()[player].choice === "paper") {
                                console.log("draw");
                                winDisplay.text('Draw!');
                                chooseRPS(roomNumber, player, "");

                            } else if (d.val()[player].choice === "scissors") {
                                console.log("win");
                                winDisplay.text('You Win!');
                                chooseRPS(roomNumber, player, "");
                                setWins(roomNumber, player, d.val()[player].wins += 1);

                            }
                            break;
                        case "scissors":
                            if (d.val()[player].choice === "rock") {
                                console.log("win");
                                winDisplay.text('You Win!');
                                chooseRPS(roomNumber, player, "");
                                setWins(roomNumber, player, d.val()[player].wins += 1);
                            } else if (d.val()[player].choice === "paper") {
                                console.log("lose");
                                winDisplay.text('You Lose!');
                                chooseRPS(roomNumber, player, "");

                            } else if (d.val()[player].choice === "scissors") {
                                console.log("draw");
                                winDisplay.text('Draw!');
                                chooseRPS(roomNumber, player, "");

                            }
                            break;
                    }
                    $('.player-1').removeClass("border green red");
                    $('.player-2').removeClass("border green red");
                    if (d.val().turn === 0) {
                        $('.turn').text(d.val().turn)
                    } else if (d.val().turn === enemy) {
                        $('.turn').text(`${d.val()[enemy].name}'s turn`)
                        $(`.player-${enemy}`).addClass("border red")
                    } else if (d.val().turn === player) {
                        $('.turn').text(`${d.val()[player].name}'s turn`)
                        $(`.player-${player}`).addClass("border green")
                    }

                    if (d.val().turn != player) {
                        $(`.player-${player} button`).attr("disabled", "disabled");
                    } else {
                        $(`.player-${player} button`).removeAttr("disabled");

                    }
                }






            });
            db.ref(`/game/${roomNumber}`).on('child_removed', function (d) {
                setWins(roomNumber, player, 0);
                $('.turn').text(``)
                enemySet = false;
                $(`.name-${d.key}`).text("");
                $(`.player-${d.key}-wins`).text("");
            });
            // db.ref(`/game/${roomNumber}`).on('child_added', function(d){
            //     if (d.val().name){
            //     winDisplay.text(`${d.val().name} joined the room..`);
            //     }
            // })



            db.ref(`/game/${roomNumber}/disconnected`).onDisconnect().set(`${name} disconnected`)
            db.ref(`/game/${roomNumber}/${player}`).onDisconnect().set(null);
            db.ref(`/game/${roomNumber}/disconnected`).on('value', function (d) {
                $('.chatbox').append($('<p class="chat-message">').text(d.val()));
                winDisplay.text('Waiting for connection...');

            })
            db.ref(`/game/${roomNumber}/chat`).onDisconnect().set(null);




        })

    }


    $('.clear').on('click', () => {
        clearGame();

    })

    $('.choices button').on('click', function () {
        let choice = $(this).data('id');
        chooseRPS(roomNumber, player, choice);
        if (player === 1) {
            setTurn(roomNumber, 2);
        } else {
            setTurn(roomNumber, 1);
        }
        // if()

    })

    $('button[type="submit"]').on('click', (e) => {
        e.preventDefault();
        name = $('#name').val();
        gameState();


    })

    $('.send').on('click', function (e) {
        e.preventDefault();
        const updateChat = db.ref(`/game/${roomNumber}/chat`);
        var push = updateChat.push();
        push.set({ name: name, message: $('.message').val() });
        $('.message').val("");


    })


    function clearGame() {
        db.ref('/game').set("");
    }

})