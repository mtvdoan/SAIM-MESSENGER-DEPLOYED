import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import UserModal from "./UserModal";
const UsersList = (props) => {
    const { user, setUser, socket } = useContext(UserContext);
    const [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/users/", {withCredentials:true} )
            .then((response) => {
                console.log("response", response);
                setUsersList(response.data.allUsers);
            })
            .catch((err) => console.log(err));
    }, []);
    const userScreenName =
        usersList.length > 0 &&
        usersList.map((user, index) => <p key={user.id}>{user.screenName}</p>);
    return (
        <>
            <div>
                <div
                    className="m-4 border-2 border-black-400 overflow-y-auto"
                    style={{ height: "400px" }}
                >
                    <div className="m-4 overflow-y-auto">
                        <p className="text-2xl font-extrabold">Buddies</p>
                        <div className="ml-10 text-2xl">{userScreenName}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UsersList;
