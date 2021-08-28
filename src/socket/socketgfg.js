const {getGFG} = require('../socketcontroller/gfg');

var loop;

const getGFGandemit = (socket, payload) => {
    loop = setInterval(async() =>{
        try {
            const data = await getGFG({id : payload.id});
            socket.emit("GFGdata", data);
        } catch (error) {
        }
    }, 60000)
}


function stopemitting(){
    clearInterval(loop);
}


const getgfgdata = (socket) => {
    socket.on("GFGdata", payload => {
        getGFGandemit(socket, payload);
        
        socket.on("disconnect", () => {
            stopemitting();
        })
    })
}


module.exports = {
    getgfgdata
}

