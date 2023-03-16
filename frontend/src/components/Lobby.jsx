import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Boop from "./Boop";
import useSound from "use-sound";
import DoorOpen from "../sounds/DoorOpen.mp3";
const Lobby = (props) => {
    const { user, socket } = useContext(UserContext);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [passKey, setPassKey] = useState("");
    const [play] = useSound(DoorOpen, { volume: 0.15 });
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
                setPassKey(res.data.passKey);
            })
            .catch((err) => console.log(err));
    }, []);
    const joinRoom = (e) => {
        e.preventDefault();
        axios
            .get("http://localhost:8000/api/rooms/" + roomId, {
                withCredentials: true,
            })
            .then((res) => {
                console.log(passKey);
                if (res.data.passKey === passKey) {
                    axios
                        .put(
                            "http://localhost:8000/api/rooms/add/" + roomId,
                            { userid: user.id },
                            { withCredentials: true }
                        )
                        .then((res) => {
                            console.log(
                                "Information of room to join:",
                                res.data
                            );
                            socket.emit("join-room", selectedRoom);
                            navigate(`/rooms/${roomId}`);
                            play(DoorOpen);
                        })
                        .catch((err) => console.log(err));
                } else {
                    alert("Invalid pass key 😔");
                }
            })
            .catch((err) => console.log(err));
    };

    const onChangeHandler = (e) => {
        setSelectedRoom(e.target.selectedOptions[0].innerText);
        setRoomId(e.target.value);
        const selectedRoom = rooms.find((room) => room._id === e.target.value);
        if (selectedRoom) {
            setPassKey(selectedRoom.passKey);
        }
    };
    return (
        <>
            <div>
                <h1 className="text-xl text-black m-4 font-extrabold">
                    Pick a Room
                </h1>
                <div className="container text-black flex justify-center">
                    <form onSubmit={joinRoom}>
                        <select
                            onChange={onChangeHandler}
                            className="form-control"
                        >
                            <option selected>Choose a Room</option>
                            {rooms.map((room, i) => (
                                <option
                                    id={room.name}
                                    key={room._id}
                                    value={room._id}
                                >
                                    {room.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="text-black"
                            name="passKey"
                            value={passKey}
                            placeholder="Enter Pass Key"
                            onChange={(e) => setPassKey(e.target.value)}
                        />
                        <Boop rotation={"15"} duration={"200"}>
                            <button className="shadow-lg bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Join
                            </button>
                        </Boop>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Lobby;
