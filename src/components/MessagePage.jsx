import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ChatInput from "./ChatInput";
import { setMessages } from "../redux/messageSlice";

const MessagePage = ({socket}) => {
  const chatEndRef = useRef(null);

  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.userReducer?.selectedUser);
  const authUser = useSelector((state) => state.userReducer?.authUser?.user);
  const messages = useSelector((state) => state.messageReducer.messages);
  // const socket  = useSelector((store) => store.socket);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the ref
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/message/${selectedUser._id}`);
        dispatch(setMessages(res.data.messages));
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessages([]));
      }
    };

    if (selectedUser) {
      fetchMessages();
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever the component is mounted or messages change
  }, [messages]); // Re-run the effect when messages change

  return (
    <div>
      <div className="md:min-w-[550px] flex flex-col">
        <div className="flex gap-2 items-center bg-slate-300 text-black rounded px-4 py-2 mb-2">
          <img className="inline-block h-10 w-10 rounded-full" src={selectedUser.avatar} alt="" />
          <div className="flex justify-between">
            <h2 className="text-lg font-bold ml-5">{selectedUser.userName}</h2>
          </div>
        </div>
      </div>
      <div
        className="chat-messages"
        style={{ overflowX: "scroll", height: "73vh", paddingBottom: "10px" }}
      >
        {messages.map((message) => (
          <div
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            key={message._id}
            ref={chatEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={`${
                    message.senderId === authUser._id
                      ? authUser.avatar
                      : selectedUser.avatar
                  }`}
                />
              </div>
            </div>
            {
            message.isFile ?
            <a href={`http://localhost:8080/uploads/${message.message}`} download className="chat-bubble" > {message.message} </a> :
            <div
              className={`chat-bubble ${
                message.senderId === authUser._id
                  ? "bg-[#7dd1d1] text-black"
                  : ""
              }`}
            >
              {message.message}
            </div>
          }
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <ChatInput socket={socket}  />
      </div>
    </div>
  );
};

export default MessagePage;
