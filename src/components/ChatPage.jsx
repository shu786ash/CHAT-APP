/* eslint-disable react/prop-types */
import {} from 'react';
import SideBar from './SideBar';
import MessagePage from './MessagePage';
import { useSelector } from 'react-redux';


function ChatPage({socket}) {

  const selectedUser = useSelector(state=>state.userReducer?.selectedUser?.userName);

  return (

    <div className="flex h-[90vh] bg-slate-950 border-4 rounded-md overflow-auto">
      <SideBar />
      <div className="flex-1 p-4 relative">
        {selectedUser ? (
          <MessagePage socket={socket} />): (
            <div className="text-center">Select a user to start chatting</div>
          )}
      </div>
      </div>
  )
}

export default ChatPage
