import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatPage from "./components/ChatPage";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from "./redux/userSlice";
import { setMessages } from "./redux/messageSlice";

function App() {
  const authUser = useSelector(state => state.userReducer?.authUser?.user);
  // const socket = useSelector(store=>store.socket);
  const messages = useSelector((state) => state.messageReducer.messages);

  const [socket,setSocket]=useState(null);


  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      console.log("socket io in app jsx");
      const socket = io('http://localhost:8080', {
        query:{
          userId:authUser._id
        }
      });
      socket.on("connect", () => {
        console.log('Connected to server');
      });

      setSocket(socket)
      // dispatch(setSocket(socket))

      socket?.on('getOnlineUsers', (onlineUsers)=>{
        console.log(onlineUsers)
        dispatch(setOnlineUsers(onlineUsers))
      })

      socket?.on("newMessage", (newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
      });

      return () => socket.close()
    }else {
      if (socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }


  }, [authUser, messages]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/chatPage" element={<ChatPage socket={socket}/>}></Route>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/editProfile" element={<EditProfile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
