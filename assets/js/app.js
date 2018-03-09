var db = firebase.database();


var roomNumber = 0;
var playerId = 0;

gameState();
function writeUser(roomId, name,email, player){
    db.ref('/game/'+roomId+"/"+player).set({name: name, email: email});
    gameState();
}


// writeUser(1, "john", "jj@js.com", 1); 
function gameState(){
    var data = firebase.database().ref('/game');
    let value
    data.on('value', function(d){
        // d.val().forEach((element, i) => {
        //   element.forEach((e, j)=>{
        //       console.log(JSON.stringify(e) + "index: " + j)
        //   })
        // });
        if(!d.val()){
            roomNumber = 1;
            player = 1;
            writeUser(roomNumber, "john", "ema", player);
        }else if(d.val().length < 2){
            roomNumber = d.val().length -1;
            player = 2;
            writeUser(roomNumber, "mike", "ppp", player);
            
        }
        console.log(d.val());
    })

}

$('button').on('click', ()=>{ 
    writeUser(2, "john", "jj@js.com", 1); 
})

function clearGame(){
    db.ref('/game').set("");
}
