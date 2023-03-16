import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import io from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";
import aolemoji from "../images/aolemoji.png";
import "../App.css";
import Boop from "./Boop";
import UserModal from "./UserModal";
import UsersList from "./UsersList";
import axios from "axios";
import useSound from "use-sound";
import WindowsXpShutDown from "../sounds/WindowsXpShutDown.mp3";
import IM from "../sounds/IM.mp3";
import CreateRoom from "./CreateRoom";
import Lobby from "./Lobby";
const Home = (props) => {
    const [state, setState] = useState({
        login: {
            email: "",
            password: "",
        },
    });
    const { login } = state;
    const [usersList, setUsersList] = useState([]);
    const { user, setUser, socket } = useContext(UserContext);
    const [screenName, setScreenName] = useState("");
    const [password, setPassword] = useState("");
    const [play] = useSound(WindowsXpShutDown, { volume: 0.05 });
    const [play2] = useSound(IM);
    console.log("whatis ", user, socket);
    console.log("what my sn", user.screenName);
    console.log("what is socket", socket);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (user.id === 0) {
            props.setAuthorized("You have to be logged in to view this page");
            alert("You need to be logged in to view this page");
            console.log("testing unauth");
            navigate("/");
        }
    }, []);
    const findOneUser = (userId) => {
        axios
            .get("http://localhost:8000/api/users/" + userId)
            .then((response) => {
                setUser(response.data);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        console.log("Test for useEffect with socket.on()");
        socket.on("private_message_response", (data) => {
            console.log("what is my socket", socket);
            console.log("Got your message");
            console.log(
                "user should have have received data and confirm",
                data
            );
            setMessages((prevState) => [...prevState, data]);
        });
        console.log("what is my socket.id", socket.id);
        return () => setUser({ ...user });
    }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/users/", { withCredentials: true })
            .then((response) =>
                setUsersList(
                    // response.data,
                    response.data.allUsers,
                    console.log("All users:", response.data.allUsers)
                )
            )
            .catch((err) => console.log(err));
    }, []);
    console.log("console io", io);

    const handleLogOutClick = () => {
        axios
            .get("http://localhost:8000/api/users/logout", {
                withCredentials: true,
            })
            .then((res) => {
                console.log("Logged out!");
                socket.disconnect();
                localStorage.clear();
                // window.location.reload(false);
                setUser(null);
                // res.cookie.clear();
                alert(`Logging ${user.screenName} out. Bye!`);
                navigate("/");
                window.location.reload(); //Help users sign in and out without closing windows.
            });
        play(WindowsXpShutDown);
    };
    return (
        <>
            <div>
                <div className="h-auto ">
                    <nav className="whitespace-nowrap m-2 border-gray-200 px-2 sm:px-4 py-10 rounded-2xl shadow-2xl fill-indigo-400border-2  bg-blue-400">
                        <div className="container grid grid-cols-2 content-center flex flex-wrap items-center justify-between mx-auto">
                            <div className="flex items-center justify">
                                <h1 className="text-5xl mr-44 font-extrabold text-white dark:text-white">
                                    SAIM - MESSENGER
                                </h1>
                            </div>
                            <div className="grid grid-1 contents-center ">
                                <Boop rotation={"10"} timing={"100"}>
                                    <p className="tracking-tighter text-gray-900 md:text-lg dark:text-gray-400">
                                        <mark className="grid w-auto grid-cols-2 content-center m-auto m-4 p-4 bg-blue-800 rounded-xl shadow-lg h-28 w-80">
                                            <h1 className=" text-5xl font-extrabold text-white dark:text-white mt-10">
                                                @ {user.screenName}
                                            </h1>
                                            <img
                                                src={aolemoji}
                                                alt="aolemoji"
                                                style={{
                                                    height: "150px",
                                                    width: "200px",
                                                }}
                                                className=" ml-36"
                                            />
                                        </mark>
                                    </p>
                                </Boop>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="flex justify-center m-4">
                    <div>
                        <div
                            className=" block max-h-sm p-2 m-10 bg-gray-300 rounded-lg shadow-2xl hover:bg-gray-100  dark:border-gray-700 mt-2"
                            style={{ width: "500px" }}
                        >
                            <div className="border-2 flex flex-col  border-black rounded-lg bg-blue-700 max-h-96 max-w-96">
                                <p className="p-2 font-extrabold tracking-tighter text-white text-4xl -mt-30">
                                    SAIM - MESSENGER
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
                                                className="-mt-10"
                                            />
                                        </Boop>
                                    </div>
                                    <p className="font-extrabold text-6xl">"</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <h1 className="text-4xl font-extrabold m-4 text-black">
                                    Buddies:
                                </h1>
                                <UserModal
                                    className=""
                                    userScreenName={user.screenName}
                                    userEmail={user.email}
                                />
                            </div>
                            <div className="grid grid-cols-2 content-center">
                                <div class="text-center">
                                    <a
                                        href="#_"
                                        class="relative inline-block text-lg group"
                                    >
                                        <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-black">
                                            <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                            <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-yellow-500 group-hover:-rotate-180 ease"></span>
                                            <span class="relative">
                                                <Link to="/awayMessages">
                                                    Away Messages
                                                </Link>
                                            </span>
                                        </span>
                                        <span
                                            class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                                            data-rounded="rounded-lg"
                                        ></span>
                                    </a>
                                </div>
                                <div className="">
                                    <Boop rotation={"25"} timing={"100"}>
                                        <a
                                            href
                                            onClick={() => handleLogOutClick()}
                                            className=" cursor-pointer relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl group"
                                        >
                                            <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                                                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                                            </span>
                                            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                                            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                                                Log Out
                                            </span>
                                        </a>
                                    </Boop>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-2 border-gray-200 rounded-xl bg-gray-200"
                        style={{ width: "700px", height: "600px" }}
                    >
                        <div className="m-2 border-2 border-black h-14 from-b rounded-xl bg-gradient-to-r from-blue-500 to-blue-400">
                            <p className="text-white font-bold m-4 text-2xl">
                                {" "}
                                Instant Message
                            </p>
                        </div>
                        <div
                            className="border-2 m-2 border-black rounded-xl bg-white"
                            style={{ height: "500px" }}
                        >
                            <CreateRoom />
                            <Lobby />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
