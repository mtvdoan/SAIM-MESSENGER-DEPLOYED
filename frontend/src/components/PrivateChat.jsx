import React, { useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import aolemoji from "../images/aolemoji.png";
import "../App.css";
import Boop from "./Boop";
import UserModal from "./UserModal";
import UsersList from "./UsersList";
import useSound from "use-sound";
import WindowsXpShutDown from "../sounds/WindowsXpShutDown.mp3";
import IM from "../sounds/IM.mp3";
import CreateRoom from "./CreateRoom";
import Lobby from "./Lobby";
import DoorClose from "../sounds/DoorClose.mp3";

const PrivateChat = (props) => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    // const { roomName } = useParams();
    const { user, setUser, socket } = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [roomName, setRoomName] = useState("");
    const [hostId, setHostId] = useState("");
    const [hostScreenName, setHostScreenName] = useState("");
    const [play] = useSound(DoorClose, { volume: 0.05 });
    const [play2] = useSound(IM, { volume: 0.1 });
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/rooms", { withCredentials: true })
            .then((res) => setRooms(res.data))
            .catch((err) => console.log(err));
    }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/rooms/" + roomId, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("INFOBOMB", res);
                setRoomName(res.data.name);
                setHostId(res.data.hostId);
                setHostScreenName(res.data.hostScreenName);
            })
            .catch((err) => console.log(err));
    }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/users/" + user.id, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("user", res);
                setUser({ ...user, room: roomName });
            })
            .catch((err) => console.log(err));
    }, []);
    console.log("What is the name of the chat room?", roomName); //it shows yays
    console.log("does user have a room info?", user); //yes
    useEffect(() => {
        socket.on("private_message_response", (data) => {
            console.log("Got your message");
            setMessages((prevState) => [...prevState, data]);
        });
        return () => setUser({ ...user, room: "" });
        // return () => setUser({ ...user, room: roomName });
    }, []);
    const sendMessage = (e) => {
        e.preventDefault();
        console.log("Sending private message");
        play2(IM);
        socket.emit("private_message", {
            user: user.screenName,
            room: roomName,
            message: currentMessage,
        });
        setCurrentMessage("");
    };
    const deleteChatRoom = (e) => {
        axios
            .delete(
                `http://localhost:8000/api/rooms/deleteChatRoom/${roomId}`,
                { withCredentials: true }
            )
            .then((res) => {
                alert(
                    "Chat room has been successfully deleted.  Sending you back to home."
                );
                console.log("Chat room has been deleted");
                removeFromDom(roomId);
                navigate(`/home/${user.id}`);
            })
            .catch((err) => console.log(err));
    };
    const removeFromDom = (roomId) => {
        setRooms(rooms.filter((r) => r._id !== roomId));
    };
    const doorClose = () => {
        play(DoorClose);
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
                {/* The chat box itself */}
                <div
                    className="rounded-xl mt-0 m-auto shadow-2xl text-xlp-2 grid grid-col-2 content-center"
                    style={{ width: "1300px" }}
                >
                    <div
                        className="border-1 rounded-xl border-black bg-gray-300"
                        style={{ width: "auto", height: "675px" }}
                    >
                        <h2
                            className=" rounded-t-lg text-3xl p-4 tracking-widest font-extrabold dark:text-white bg-blue-500 border-black border-2"
                            style={{ width: "auto" }}
                        >
                            <div className="flex">
                                <div className="tracking-tighter text-blue-900">
                                    ROOM NAME: &nbsp; &nbsp;
                                </div>
                                <p>{roomName}</p>
                            </div>
                            <div className="flex">
                                <div className="tracking-tighter text-blue-900">
                                    HOST/CREATOR: &nbsp; &nbsp;
                                </div>
                                <p>{hostScreenName}</p>
                            </div>
                        </h2>

                        <div
                            className=""
                            style={{
                                width: "auto",
                                height: "300px",
                            }}
                        >
                            <div
                                className="border-2 whitespace-normal border-black overflow-auto p-2 m-4 bg-white"
                                id="messages"
                                style={{ maxHeight: "900px" }}
                            >
                                <div
                                    className="rt-body whitespace-normal m-2 card overflow-y-auto border-1 border-black"
                                    style={{
                                        width: "auto",
                                        height: "300px",
                                        overflow: "visible",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    <div
                                        className="overflow-y-auto border-1 text-3xl whitespace-normal border-black m-4 overflow-x-hidden"
                                        style={{
                                            height: "300px",
                                            whiteSpace: "wrap",
                                        }}
                                    >
                                        {messages.map((m, i) => (
                                            <div
                                                className={`text-black rt-tr-group ${
                                                    i % 2 === 0
                                                        ? "bg-gray-200"
                                                        : "bg-white"
                                                }`}
                                                style={{
                                                    fontSize: "24px",
                                                    display: "flex",
                                                    maxWidth: "1200px",
                                                }}
                                                key={i}
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: "1200px",
                                                        color: "red",
                                                        wordWrap: "break-word", // set word-wrap to break-word
                                                    }}
                                                    className="whitespace-normal font-extrabold text-black mr-4 text-xl "
                                                >
                                                    {m.user}:
                                                </div>
                                                <p
                                                    className=""
                                                    style={{
                                                        wordBreak: "break-all", // set word-break to break-all
                                                    }}
                                                >
                                                    {m.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6 m-2">
                                    <form id="chatEntry" onSubmit={sendMessage}>
                                        <input
                                            type="text"
                                            id="message"
                                            value={currentMessage}
                                            onChange={(e) =>
                                                setCurrentMessage(
                                                    e.target.value
                                                )
                                            }
                                            className=" form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <div className="">
                                            <button className="m-2 relative text-lg group grid grid-col-1 content-center">
                                                <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                                    <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                                    <span className="relative m-2">
                                                        Send
                                                    </span>
                                                </span>
                                                <span
                                                    className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                                                    data-rounded="rounded-lg"
                                                ></span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-evenly m-2">
                    <Boop rotation={5} timing={200}>
                        <button
                            onClick={doorClose}
                            className="bg-green-500 rounded-xl hover:bg-blue-700 text-white font-bold py-2 px-2 border border-blue-700 rounded"
                        >
                            <Link className="text-3xl" to={`/home/${user.id}`}>
                                Go Back Home
                            </Link>
                        </button>
                    </Boop>
                    <div className="">
                        {(() => {
                            return hostId == user.id ? (
                                <>
                                    <Boop rotation={5} timing={200}>
                                        <button
                                            onClick={() =>
                                                deleteChatRoom(roomId)
                                            }
                                            className="text-3xl hover:animate-pulse rounded-xl bg-red-500 hover:bg-red-900 text-white font-bold py-2 px-2 border border-blue-700 rounded"
                                        >
                                            Delete
                                        </button>
                                    </Boop>
                                </>
                            ) : null;
                        })()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivateChat;
