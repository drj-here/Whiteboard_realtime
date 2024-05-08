import './style.css'
import React, { useEffect, useState } from 'react'
import {toast,ToastContainer} from 'react-toastify'
import io from 'socket.io-client'
import ClientRoom from './ClientRoom'
import JoinCreateRoom from './JoinCreateRoom'
import Room from './Room'
import Sidebar from './Sidebar'

const server='http://localhost:5000'
const connectionOptions={
  "force new connection":true,
  reconnectionAttempts:"Infinity",
  timeout:10000,
  transports:["websocket"],
}

const socket=io(server,connectionOptions)

function App() {
  const [userNum,setUserNum]=useState(0)
  const [roomJoined,setRoomJoined]=useState(false)
  const [user,setUser]=useState({})
  const [users,setUsers]=useState([])

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  useEffect(()=>{
    if(roomJoined){
      socket.emit("user-joined",user)
    }
  },[roomJoined])
  return (
    <div className='home'>
      <ToastContainer/>
      {
        roomJoined ?(
          <>
          <Sidebar users={users} socket={socket}/>
          {
            user.presenter?(
              <Room 
              userNum={userNum}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNum={setUserNum}/>
            ):(
              <ClientRoom
              userNum={userNum}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNum={setUserNum}/>
            )
          }
          </>
        ):(
          <JoinCreateRoom
          uuid={uuid}
          setRoomJoined={setRoomJoined}
          setUser={setUser}/>
        )
      }
    </div>
  )
}

export default App
