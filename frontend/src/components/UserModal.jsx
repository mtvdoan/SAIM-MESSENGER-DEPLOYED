import { Fragment, useState, useEffect, useContext } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { animated } from "react-spring";
import axios from "axios";
import Boop from "./Boop";
import aolemoji from "../images/aolemoji.png";

const UserModal = (props) => {
    const [open, setOpen] = useState(false);
    const { user, setUser, socket } = useContext(UserContext);
    const [usersList, setUsersList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const handleOpen = () => setOpen(!open);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/users/", { withCredentials: true })
            .then((response) => {
                setUsersList(response.data.allUsers);
                console.log("allusers in usermodal", response.data.allUsers);
                console.log("buuuupr");
            })
            .catch((err) => console.log(err));
    }, []);

    const findOneUser = (userId) => {
        axios
            .get("http://localhost:8000/api/users/" + userId)
            .then((response) => {
                setUser(response.data);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <div className="grid grid-cols-1 content-starts h-96 w-96 overflow-y-auto">
                {usersList.length > 0 &&
                    usersList.map((user, index) => (
                        <div className="flex ml-10">
                            <Fragment>
                                <div className="m-2 text-center flex flex-col m">
                                    <Boop rotation={"2"} timing={"200"}>
                                        <Button
                                            onClick={() => {
                                                setModalData(user);
                                                setModalIsOpen(true);
                                            }}
                                            color="white"
                                            size="lg"
                                        >
                                            <div className="text-sm font-extrabold">
                                                {user.screenName}
                                            </div>
                                        </Button>
                                    </Boop>
                                </div>
                            </Fragment>
                        </div>
                    ))}
                <Dialog
                    open={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                >
                    <DialogHeader
                        className="text-3xl whitespace-normal"
                        style={{ maxWidth: "1000px" }}
                    >
                        {modalData ? modalData.screenName : "nothing"}
                        <Boop rotation={"5"} timing={"200"}>
                            <img
                                src={aolemoji}
                                style={{
                                    height: "100px",
                                    width: "150px",
                                }}
                                alt="aolemoji"
                            />
                        </Boop>
                    </DialogHeader>
                    <DialogBody divider className="whitespace-normal">
                        <div className="text-2xl">
                            Email:{modalData ? modalData.email : "nothing"}
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <div className="">
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => setModalIsOpen(false)}
                                className="mr-1"
                            >
                                <span>Close</span>
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    );
};

export default UserModal;
