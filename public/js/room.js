let gameStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let moves = 0;
let myClick;
let otherClick;
const socket = io("/");
let enableClick = false;

document.getElementById("url").value = location.href;

function copyToClip() {
  // Get the text field
  var copyText = document.getElementById("url");

  // Get the copy button
  var copyButton = document.getElementById("copy");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);


  //Empty the textbox
  copyText.value = "Copied";

  // Disable the copy button
  copyButton.disabled = true;
  copyButton.classList.remove("bg-blue-500")
  copyButton.classList.remove("hover:bg-blue-600")
  copyButton.classList.add("bg-gray-500")
}

console.log(ROOM_ID);
socket.emit("join-room", ROOM_ID);

socket.on("user-connected", () =>{
    document.getElementById("message").innerText = "User Connected"
    myClick = "X"
    otherClick = "O"
    enableClick = true
    socket.emit("can-play")
})

socket.on("can-play", ()=>{
    console.log('in canplay');
    myClick = "O"
    otherClick = "X"
    document.getElementById("message").innerText= "User Connected"
    enableClick = true
})

function clicked(id) {
    console.log('clicked',enableClick);
    if(enableClick){
        moves += 1
        const element = document.getElementById(id)
        element.innerHTML = myClick
        element.onclick = null
        socket.emit("clicked", id);
        enableClick = false
        gameStatus[id - 1] = 1

        if ((gameStatus[0] == 1 && gameStatus[1] == 1 && gameStatus[2] == 1)||
        (gameStatus[0] ==1 && gameStatus[3] == 1 && gameStatus[6] == 1)||
        (gameStatus[0] ==1 && gameStatus[4] == 1 && gameStatus[8] == 1)||
        (gameStatus[2] ==1 && gameStatus[5] == 1 && gameStatus[8] == 1)||
        (gameStatus[2] ==1 && gameStatus[4] == 1 && gameStatus[6] == 1)||
        (gameStatus[1] ==1 && gameStatus[4] == 1 && gameStatus[7] == 1)||
        (gameStatus[3] ==1 && gameStatus[4] == 1 && gameStatus[5] == 1)||
        (gameStatus[6] ==1 && gameStatus[7] == 1 && gameStatus[8] == 1)) {
            document.getElementById("message").innerHTML = "You win";
            enableClick = false;
            setTimeout(()=>{location.href='/';}, 4000);
        }else if(moves==9){
            document.getElementById("message").innerText = "It's a Draw";
            setTimeout(()=>{location.href='/';}, 4000);
        }
    }
}

socket.on("clicked", (id) =>{
    moves += 1
    const element = document.getElementById(id)
    console.log(otherClick);
        element.innerHTML = otherClick
        element.onclick = null
        enableClick = true
        gameStatus[id - 1] = 2

        if ((gameStatus[0] == 2 && gameStatus[1] == 2 && gameStatus[2] == 2)||
        (gameStatus[0] ==2 && gameStatus[4] == 2 && gameStatus[8] == 2)||
        (gameStatus[2] ==2 && gameStatus[5] == 2 && gameStatus[8] == 2)||
        (gameStatus[0] ==2 && gameStatus[3] == 2 && gameStatus[6] == 2)||
        (gameStatus[2] ==2 && gameStatus[4] == 2 && gameStatus[6] == 2)||
        (gameStatus[1] ==2 && gameStatus[4] == 2 && gameStatus[7] == 2)||
        (gameStatus[3] ==2 && gameStatus[4] == 2 && gameStatus[5] == 2)||
        (gameStatus[6] ==2 && gameStatus[7] == 2 && gameStatus[8] == 2)) {
            document.getElementById("message").innerHTML = "You Lose";
            enableClick = false;
            setTimeout(()=>{location.href='/';}, 4000);
        }else if(moves==9){
            document.getElementById("message").innerHTML = "It's a Draw";
            setTimeout(()=>{location.href='/';}, 4000);
        }
})

socket.on("full-room",()=>{
    document.getElementById("message").innerHTML = "Room Full..."
    setTimeout(() => {
        location.href = "/"
    }, 5000);
})

socket.on("user-disconnected",()=>{
    document.getElementById("message").innerText = "User disconnected"
    setTimeout(() => {
        location.href = "/"
    }, 4000);
})