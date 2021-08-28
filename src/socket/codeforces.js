const {gettopicbyid } = require('../socketcontroller/codeforces');

var loop;

const getcodeforcesandemit = (socket, payload) => {
    loop = setInterval(async() =>{
        try {
            const data = await gettopicbyid ({id : payload.id, pageid: payload.pageid});
            socket.emit("Codeforcesdata", data);
        } catch (error) {
        }
    }, 30000)
}


function stopemitting(){
    clearInterval(loop);
}


const getcodeforcesdata = (socket) => {
    socket.on("Codeforcesdata", payload => {
        getcodeforcesandemit(socket, payload);
        
        socket.on("disconnect", () => {
            stopemitting();
        })
    })
}


module.exports = {
    getcodeforcesdata
}

