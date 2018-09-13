const {BrowserWindow, app} = require("electron");
const config = require("./config");

let win;
function createWindow(){
    win = new BrowserWindow({width: 800, height: 600});
    // win.loadFile("./webpack-example/electron/dest/index.html");
    win.loadURL(`http://${config.host}:${config.port}`);
    win.webContents.openDevTools();
}

app.on("ready", createWindow);