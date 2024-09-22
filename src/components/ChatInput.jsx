/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice'
import axios from "axios";

const ChatInput = ({socket}) => {
  const [message, setMessage] = useState("");
  const selectedUser = useSelector(state => state?.userReducer?.selectedUser);
  const dispatch=useDispatch();
  const {messages} = useSelector(store=>store.messageReducer);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFile, setIsFile] = useState(false)

  const handleSubmit = async (isFile) => {
    // event.preventDefault();
    try {
      const res=await axios.post(`/message/send/${selectedUser._id}`, { message, isFile: isFile });
      console.log("msg sent successfully");
      dispatch(setMessages([...messages, res?.data.newMessage]))
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        // console.log(selectedFile)
        const data = event.target.result;
        // console.log(userInfo.username)
        const filename = `${selectedUser.userName}-${selectedFile.name}`;
        const fileType = selectedFile.type;

        socket.emit('fileUpload', { data, filename , fileType}, (response) => {
          if (response.status) {
            console.log("successfully uploaded")
            // handleSendMessage({msg: filename,isFile: true});
            setMessage(filename)
            setIsFile(true)
            // handleSubmit(true)

          }else {
            console.log("could not uploaded")
          }
        }); // Send data and filename to server
    };

    reader.readAsArrayBuffer(selectedFile);
};

useEffect(() => {
  if (isFile) {
    handleSubmit(true);
    setIsFile(false);
  }
}, [isFile])



  return (
    <>
      <div
        className="w-[95%] absolute bottom-3 flex flex-row"
        action=""
        // onSubmit={handleSubmit}
        // method="POST"
      >
        <input type="file" className="file-input file-input-bordered file-input-xs w-full max-w-xs" onChange={ (e) => handleFileChange(e)} />
        <button
          type="submit"
          className="flex inset-y-0 end-0 items-center pr-4 bg-gray-600"
          onClick={handleFileUpload}
        >
          send
        </button>

        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="border text-md rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
        />
        <button
          type="submit"
          className="absolute flex inset-y-0 end-0 items-center pr-4 bg-gray-600"
          onClick={ () => handleSubmit(false) }
        >
          <SendHorizontal />
        </button>
      </div>
    </>
  );
};

export default ChatInput;
