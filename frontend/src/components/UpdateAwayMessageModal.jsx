import { Fragment, useState, useEffect, useContext } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import aolemoji from "../images/aolemoji.png";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import Boop from "./Boop";
import { animated } from "react-spring";
const UpdateAwayMessageModal = (props) => {
    const [awayMessageLabel, setAwayMessageLabel] = useState(props.label);
    console.log(awayMessageLabel);
    const [awayMessage, setAwayMessage] = useState(props.message);
    const [awayMessageCreator, setAwayMessageCreator] = useState(props.creator);
    const helper = (message, object) => {
        console.log(message, object);
        return object;
    };

    const handleOpen = () => setOpen(!open);
    const [open, setOpen] = useState(false);
    const [awayMessagesList, setAwayMessagesList] = useState([]);
    console.log("awaymlist", awayMessagesList);
    const [usersList, setUsersList] = useState([]);
    const { user, setUser, socket } = useContext(UserContext);
    const userScreenName = user["screenName"];
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    const newAwayMessage = {
        awayMessageLabel: awayMessageLabel,
        awayMessageCreator: user.screenName,
        awayMessage: awayMessage,
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log("getting into axios");
        axios
            .put(
                "http://localhost:8000/api/awayMessages/" +
                    helper("id", props.id),
                helper("newawaymessage", newAwayMessage)
            )
            .then((res) => {
                console.log("Update successful on backend", res.data);
                setAwayMessagesList();
                navigate(`/home/${user.id}`);
                alert("Away Message has been updated!");
            })
            .catch((err) => {
                console.log(err);
                const errorRes = err.response.data.error.errors;
                const errorArray = [];
                for (const key of Object.keys(errorRes)) {
                    errorArray.push(errorRes[key].message);
                }
                setErrors(errorArray);
            });
        setOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 content-center">
                <Fragment>
                    <div>
                        <Boop rotation={"2"} timing={"200"}>
                            <Button
                                onClick={handleOpen}
                                variant="gradient"
                                color="green"
                                size="lg"
                            >
                                <div className="text-sm font-extrabold">
                                    Update Away Message
                                </div>
                            </Button>
                        </Boop>
                    </div>
                    <Dialog open={open} handler={handleOpen}>
                        <DialogHeader className="text-4xl whitespace-normal">
                            Update an Away Message
                            <img
                                src={aolemoji}
                                style={{ height: "100px", width: "150px" }}
                                alt="aolemoji"
                            />
                        </DialogHeader>
                        <DialogBody
                            className=""
                            style={{ height: "300px", width: "300px" }}
                            divider
                        >
                            <div>
                                <form onSubmit={onSubmitHandler}>
                                    {errors.length > 0 &&
                                        errors.map((error, i) => (
                                            <>
                                                <p
                                                    key={i}
                                                    className="text-danger"
                                                >
                                                    {error}
                                                </p>
                                            </>
                                        ))}
                                    <div className="flex w-72 flex-col gap-6">
                                        <Input
                                            type="text"
                                            className=""
                                            color="purple"
                                            label="Away Message Title"
                                            value={awayMessageLabel}
                                            onChange={(e) =>
                                                setAwayMessageLabel(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <label
                                            for="message"
                                            class="block text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Your message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={awayMessage}
                                            label="Away Message"
                                            onChange={(e) =>
                                                setAwayMessage(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                    <div className="m-4 animate-bounce">
                                        <Boop rotation={"15"} timing={"200"}>
                                            <Button
                                                type="submit"
                                                variant="gradient"
                                                color="green"
                                            >
                                                <span>Update!</span>
                                            </Button>
                                        </Boop>
                                    </div>
                                </form>
                            </div>
                        </DialogBody>
                        <DialogFooter>
                            <div className="">
                                <Button
                                    variant="text"
                                    color="red"
                                    onClick={handleOpen}
                                    className="mr-1"
                                >
                                    <span>Close</span>
                                </Button>
                            </div>
                        </DialogFooter>
                    </Dialog>
                </Fragment>
            </div>
        </>
    );
};
export default UpdateAwayMessageModal;
