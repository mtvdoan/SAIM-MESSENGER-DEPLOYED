import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo1 from "../images/logo1.png";
import Chat from "./Home";
import man from "../images/aolemoji.png";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import App from "../App";
import io from "socket.io-client";
import Boop from "./Boop";
import useSound from "use-sound";
import windowXp from "../sounds/windowXp.mp3";
import aolemoji from "../images/aolemoji.png";
const Login = (props) => {
    const { user, setUser } = useContext(UserContext);
    const [play] = useSound(windowXp, { volume: 0.05 });
    const [state, setState] = useState({
        login: {
            email: "",
            password: "",
        },
    });
    const { login } = state;
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    const handleLoginInputs = (e) => {
        props.setAuthorized("");
        setState({
            ...state,
            login: { ...state.login, [e.target.name]: e.target.value },
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:8000/api/users/login", login, {
                withCredentials: true,
            })

            .then((res) => {
                setUser({
                    id: res.data.user._id,
                    email: res.data.user.email,
                    screenName: res.data.user.screenName,
                    room: "",
                });
                console.log(
                    "TEST. What is email in localStorage?",
                    localStorage.getItem("email")
                );
                console.log("setuser", res.data.user);
                alert(`Thanks for logging in, ${res.data.user.screenName}`);
                play({ windowXp });
                navigate(`/home/${res.data.user._id}`);
            })
            .catch((err) => {
                console.log(err.response.data.errors);
                setErrors(err.response.data.errors);
            });
    };

    return (
        <>
            <div className="">
                <nav className=" whitespace-nowrap m-2 border-gray-200 px-2 sm:px-4 py-2.5 rounded-sm shadow-lg fill-indigo-400border-2 bg-blue-400">
                    <div className="container flex flex-wrap items-center justify-between mx-auto">
                        <div className="flex items-center">
                            <Boop rotation={"5"} timing={"100"}>
                                <img
                                    src={man}
                                    className=" h-20 w-25"
                                    alt="Flowbite Logo"
                                />
                            </Boop>
                            <h1 className="text-4xl content-centerfont-extrabold text-white dark:text-white">
                                <Boop rotation={"3"} timing={"100"}>
                                    SAIM - MESSENGER 👋
                                </Boop>
                            </h1>
                        </div>
                        <p className="tracking-tighter text-gray-900 md:text-lg dark:text-gray-900">
                            A space where millennials can chat and share their
                            hilarious away messages
                        </p>
                        <div
                            className="hidden w-full md:block md:w-auto"
                            id="navbar-default"
                        ></div>
                    </div>
                </nav>
            </div>
            <div className="items-center flex m-2">
                <span className=" block max-w-xs max-h-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 mt-2 m-auto">
                    <div className="border-2  border-black rounded-lg bg-blue-700 max-h-56 max-w-76">
                        <p className="p-2 tracking-tighter font-extrabold text-white text-xl">
                            Do you remember AIM?
                        </p>
                        <div className="flex justify-center flex-row">
                            <p className="font-extrabold text-6xl">"</p>
                            <div>
                                <Boop
                                    rotation={"20"}
                                    duration={"2000"}
                                    className=""
                                >
                                    <img
                                        src={aolemoji}
                                        alt="aolemoji"
                                        className="-mt-10 mb-6"
                                        // style={{height: "200px"}}
                                    />
                                </Boop>
                            </div>
                            <p className="font-extrabold text-6xl">"</p>
                        </div>
                        <p className="p-2 font-extrabold tracking-tighter text-white text-xl -mt-10">
                            It's 'still' the SAIM-MESSENGER
                        </p>
                    </div>
                    <hr />
                    <form onSubmit={handleLogin}>
                        <p className="text-red-600">
                            {errors && (
                                <span className="accent">{errors}📸</span>
                            )}
                        </p>
                        <div className="mb-6 mt-0">
                            <label className="block">
                                <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex text-sm font-medium text-black">
                                    eMail! 🔑
                                </span>
                                <input
                                    onChange={handleLoginInputs}
                                    type="email"
                                    name="email"
                                    className="mt-1 px-3 py-2 text-black bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                    placeholder="you@example.com"
                                />
                                <Link
                                    className=" text-blue-700 underline"
                                    to={"/register"}
                                >
                                    No account? Sign Up!
                                </Link>
                            </label>
                        </div>
                        <div>
                            <label className="block">
                                <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-black">
                                    PaSsWoRd:
                                </span>
                                <input
                                    onChange={handleLoginInputs}
                                    type="password"
                                    name="password"
                                    className="mt-1 px-3 text-black py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                                    placeholder="Enter Your Password"
                                />
                            </label>
                        </div>
                        <button type="submit" className="m-8 flex">
                            <a
                                href="#_"
                                className="relative px-6 py-3 font-bold text-black group"
                                type="submit"
                            >
                                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-blue-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                                <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                                <span className="relative">Sign On</span>
                            </a>
                        </button>
                        <hr />
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                            © 2023{" "}
                            <a
                                href="https://flowbite.com/"
                                className="hover:underline"
                            >
                                SAIM MESSENGER™
                            </a>
                            . All Rights Reserved.{" "}
                        </span>
                    </form>
                </span>
            </div>
        </>
    );
};

export default Login;
