import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthUser, setSelectedUser } from "../redux/userSlice";
import { ArrowRight } from "lucide-react";

const EditProfile = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.userReducer?.authUser?.user);

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    avatar: null,
  });

  const handleInputChange = (event) => {
    if (event.target.name === "avatar") {
      const file = event.target.files[0];
      setFormData({ ...formData, avatar: file });
    } else {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    console.log(formDataToSend);
    const response = await axios.post("/user/updateUser", formDataToSend);
    if (response) {
      console.log("updated Successfully", response.data);
      dispatch(setAuthUser(response.data));
      navigateTo("/profile");
    }
  };

  const handleLogout = () => {
    axios
      .post("/user/logout")
      .then((res) => {
        navigateTo("/login");
        dispatch(setAuthUser(null));
        dispatch(setSelectedUser(null));
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  };

  useEffect(() => {
    if (!user || user == null) {
      handleLogout();
    }
  }, [user]);

  return (
    <div className="flex justify-center">
      <div className="bg-white w-[30vw] p-6 rounded-lg shadow-md text-black">
        <h1 className="font-bold text-[2rem] mb-5">EDIT PROFILE</h1>
        <div className="flex items-center justify-center mb-6">
          <img
            src={user?.avatar}
            alt="Profile Picture"
            className="h-24 w-24 rounded-full"
          />
        </div>
        <form method="POST" action="" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              className="mt-1 p-2 bg-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              className="mt-1 p-2 bg-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="mt-1 p-2 bg-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block float-left text-sm font-medium text-gray-700">
              Avatar
            </label>
            <input
              type="file"
              name="avatar"
              className="mt-1 p-2 bg-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
          >
            Update Profile <ArrowRight className="ml-2" size={16} />
          </button>
        </form>
        <div></div>
      </div>
    </div>
  );
};

export default EditProfile;
