import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setSelectedUser } from "../redux/userSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    axios
      .get("/user/getUser")
      .then((res) => {
        setUserList(res.data);
      })
      .catch((err) => console.error("err at getting users", err));
  }, []);

  const handleClick = () => {
    axios.post("/user/logout")
      .then(() => {
        navigateTo("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }
  

  const setClick = (user) => {
    dispatch(setSelectedUser(user));
  };

  const selectedUser = useSelector(
    (state) => state.userReducer?.selectedUser?.userName
  );
  const [userList, setUserList] = useState([]);
  const authUser = useSelector((state) => state.userReducer?.authUser?.user);
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);
  useEffect(() => {
    if (!authUser || authUser == null || authUser == undefined) handleClick();
  }, [authUser]);

  return (
    <>
      <div className="w-1/3 p-4 border-r-4">
        <div className="flex justify-between items-center">
          <div>
            <img
              className="inline-block h-10 w-10 rounded-full cursor-pointer"
              src={authUser?.avatar || ""}
              alt=""
              onClick={() => navigateTo("/profile")}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{authUser?.userName}</h2>
          </div>
          <button className="text-red-500" onClick={handleClick}>
            <LogOut />
          </button>
        </div>
        <div className="max-h-[80vh] mt-[15%] overflow-auto">
          <ul>
            {userList.map((user) => (
              <li
                key={user._id}
                className={`cursor-pointer p-4 text-md rounded ${
                  selectedUser === user.userName
                    ? "bg-gray-200 text-black"
                    : "hover:bg-gray-400 hover:text-black"
                }`}
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setClick(user)}
              >
                <div
                  className={`avatar ${
                    onlineUsers && onlineUsers.includes(user._id)
                      ? "online"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full">
                    <img src={user.avatar} />
                  </div>
                </div>
                <p className="ml-4">{user.userName}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
