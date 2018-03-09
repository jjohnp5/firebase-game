var db = firebase.database();


function writeUser(roomId, name,email, player){
    db.ref('/game/'+roomId+"/"+player).set({name: name, email: email});
}


writeUser(1, "john", "jj@js.com", 1); 
function readData(id){
    var data = firebase.database().ref('/game');
    data.on('value', function(d){
        d.val().forEach((element, i) => {
          element.forEach((e, j)=>{
              console.log(JSON.stringify(e) + "index: " + j)
          })
        });
    })
}

readData(1);