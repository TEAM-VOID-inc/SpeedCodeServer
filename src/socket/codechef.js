const {gettopicbyid } = require('../socketcontroller/codechef');

var loop;

const getcodechefandemit = (socket, payload) => {
    loop = setInterval(async() =>{
        try {
            const data = await gettopicbyid ({id : payload.id, pageid: payload.pageid});
            socket.emit("codechefdata", data);
        } catch (error) {
            
        }
    }, 60000)
}


function stopemitting(){
    clearInterval(loop);
}


const getcodechefdata = (socket) => {
    socket.on("codechefdata", payload => {
        getcodechefandemit(socket, payload);
        
        socket.on("disconnect", () => {
            stopemitting();
        })
    })
}


module.exports = {
    getcodechefdata
}

