import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthUser, setSelectedUser } from "../redux/userSlice";
import { ArrowRight } from "lucide-react";

const Profile = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.userReducer?.authUser?.user);

  useEffect(() => {
    if (!user) {
      handleLogout();
    }
  }, [user]);

  const handleLogout = () => {
    axios
      .post("/user/logout")
      .then((res) => {
        if (res) navigateTo("/login");
        dispatch(setAuthUser(null));
        dispatch(setSelectedUser(null));
      })
      .catch((err) => console.error("err at logout", err));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white w-[30vw] p-6 rounded-lg shadow-md text-black">
        <h1 className="font-bold text-[2rem] mb-5">PROFILE</h1>
        <div className="flex items-center justify-center mb-6">
          <img
            src={user.avatar}
            alt="Profile Picture"
            className="h-24 w-24 rounded-full"
          />
        </div>
        <form>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={user.userName}
              disabled
              className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={user.fullName}
              disabled
              className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </form>
        <div>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
            onClick={() => navigateTo("/editProfile")}
          >
            Edit Profile <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
