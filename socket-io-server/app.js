const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
//const getApiAndEmit = "TODO"


let interval;
io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
    clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 5000);
    socket.on("disconnect", () => {
    console.log("Client disconnected");
    });
});

const getApiAndEmit = async socket => {
    try {
    const res = await axios.get(
        "https://api.darksky.net/forecast/b472c1f17087324018909923f95f040f/43.7695,11.2558"
    ); // Getting the data from DarkSky
    console.log("peticion");
    socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
    } catch (error) {
        console.log(error);
    console.error(`Error: ${error.code}`);
    }
};

server.listen(port, () => console.log(`Listening on port ${port}`));