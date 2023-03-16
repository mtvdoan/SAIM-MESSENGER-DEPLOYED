import { UserContext } from "../context/UserContext";
import React, { fetchData, useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Boop from "./Boop";
const CreateRoom = (props) => {
    const navigate = useNavigate();
    const { user, setUser, socket } = useContext(UserContext);
    const [roomName, setRoomName] = useState("");
    const [passKey, setPasskey] = useState("");
    const [roomId, setRoomId] = useState("");
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        if (roomName !== "") {
            navigate(`/rooms/${roomId}`);
        }
    }, [user]);

    const createRoom = (e) => {
        e.preventDefault();
        if (roomName.trim() === "") {
            setErrors(["Room name cannot be empty"]);
            return;
        }
        if (passKey.trim() === "") {
            setErrors(["Pass key cannot be empty"]);
            return;
        }
        axios
            .post(
                "http://localhost:8000/api/rooms",
                {
                    name: roomName,
                    passKey,
                    hostId: user.id,
                    hostScreenName: user.screenName,
                    membersJoined: [user.id],
                },
                { withCredentials: true }
            )
            .then((res) => {
                console.log("What is res after creating a Room?", res);
                console.dir(e.target);
                setUser({ ...user, room: roomName });
                setRoomId(res.data._id);
                socket.emit("join-room", roomName);
                alert("Thanks for creating a new room!  Joining room now...🤖");
            })
            .catch((err) => {
                console.log(err.response.data.errors);
                setErrors(err.response.data.errors);
            });
    };
    return (
        <>
            <div>
                <div>
                    <h1 className="text-black m-4 font-extrabold text-xl">
                        Create a Room
                    </h1>
                    <div className="m-4">
                        <form onSubmit={(e) => createRoom(e)}>
                            {errors.length > 0 && (
                                <div className="accent text-red-700">
                                    {errors.map((error) => (
                                        <div key={error}>{error}</div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <div className="m-2">
                                    <label className="text-black pr-2">
                                        Room Name:
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        onChange={(e) =>
                                            setRoomName(e.target.value)
                                        }
                                        value={roomName}
                                        className="form-control text-black"
                                    />
                                </div>
                                <Boop rotation={"15"} duration={"200"}>
                                    <button
                                        type="submit"
                                        onClick={createRoom}
                                        className="text-white shadow-xl bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Create Room
                                    </button>
                                </Boop>
                            </div>
                            <div className="m-2">
                                <label
                                    htmlFor="passKey"
                                    className="text-black pr-2"
                                >
                                    Pass Key:
                                </label>
                                <input
                                    type="text"
                                    className="text-black"
                                    name="passKey"
                                    value={passKey}
                                    onChange={(e) => setPasskey(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <hr />
            </div>
        </>
    );
};

export default CreateRoom;
