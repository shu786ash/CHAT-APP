import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

function Login() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post("/user/login", formData);
      console.log("form submitted successfully", response);
      if (response) {
        dispatch(setAuthUser(response.data));
        navigateTo("/chatPage");
      }
    } catch (error) {
      console.log("error while submitting form", error);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-lg 2xl:max-w-xl border border-gray-300 rounded-lg py-[3%] px-[8%]">
          <h2 className="text-center text-4xl font-bold leading-tight text-white">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400 ">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              title=""
              className=" text-blue-400 transition-all duration-200 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          <form
            action=""
            method="POST"
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <div className="space-y-5">
              <div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-[#191926] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    required
                  ></input>
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-[#191926] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                    placeholder="Enter Your Password"
                    required
                  ></input>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-blue-900 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-blue-900/80"
                >
                  Login <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
