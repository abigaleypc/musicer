import React from 'react';

// const { ipcRenderer } = window.require('electron');
// const { app } = window.require('electron').remote;
const BrowserWindow = window.require('electron').remote.BrowserWindow
const path = require('path')

const manageWindowBtn = document.getElementById('manage-window')
let win

export default class Header extends React.Component {
  constructor(props){
    super(props);
  }

  loginWindow(){
    const modalPath = path.join( __dirname, 'manage-modal.html')
    win = new BrowserWindow({ width: 400, height: 275 })
    win.on('resize', updateReply)
    win.on('move', updateReply)
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
    function updateReply () {
      const manageWindowReply = document.getElementById('manage-window-reply')
      const message = `Size: ${win.getSize()} Position: ${win.getPosition()}`
      manageWindowReply.innerText = message
    }
  }

  render(){
    return (
      <div style={styles.header}>
        <h4>豆瓣FM</h4>
        <button onClick={this.loginWindow}>登录</button>
      </div>
    )
  }
}

const styles = {
  header:{
    display:'flex',
    justifyContent:'space-between',
    height:50,
    background:'#333'
  }
}
