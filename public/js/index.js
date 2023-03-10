const createBoard = () => {
    location.href = "/uuid"
}

const joinBoard = () => {
    let id = document.getElementById("gameid").value
    location.href = `${id}`
}