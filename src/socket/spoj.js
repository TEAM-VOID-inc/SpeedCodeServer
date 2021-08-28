const {gettopicbyid } = require('../socketcontroller/spoj');

var loop;

const getspojandemit = (socket, payload) => {
    loop = setInterval(async() =>{
        try {
            const data = await gettopicbyid ({id : payload.id, pageid: payload.pageid});
            socket.emit("spojdata", data);
        } catch (error) {
        }
    }, 60000)
}


function stopemitting(){
    clearInterval(loop);
}


const getspojdata = (socket) => {
    socket.on("spojdata", payload => {
        getcodeforcesandemit(socket, payload);
        
        socket.on("disconnect", () => {
            stopemitting();
        })
    })
}


module.exports = {
    getspojdata
}

