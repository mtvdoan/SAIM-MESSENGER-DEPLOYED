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
const CreateAwayMessage = (props) => {
    const helper = (message, object) => {
        console.log(message, object);
        return object;
    };
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [awayMessagesList, setAwayMessagesList] = useState([]);
    // const [usersList, setUsersList] = useState([]);
    const { user, setUser, socket } = useContext(UserContext);
    const userScreenName = user["screenName"];
    console.log("userScreenName", userScreenName);
    const [awayMessageLabel, setAwayMessageLabel] = useState(props.label);
    const [awayMessageCreator, setAwayMessageCreator] = useState(props.creator);
    const [awayMessage, setAwayMessage] = useState(props.awayMessage);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/awayMessages/")
            .then((response) =>
                setAwayMessagesList(
                    response.data,
                    response.data.awayMessageCreator,
                    console.log("All Away Messages:", response.data)
                )
            )
            .catch((err) => console.log(err));
    }, []);
    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:8000/api/awayMessages/", {
                awayMessageLabel,
                awayMessageCreator: userScreenName,
                awayMessage,
            })
            .then((res) => {
                setAwayMessagesList([...awayMessagesList, res.data]);
                console.log("Creation successful on backend", res.data);
                alert("An Away Message has been successfully created.");

             navigate(`/home/${user.id}`)
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
        handleClose();
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <div className="h-auto grid grid-cols-1 content-center m-10">
                <Fragment>
                    <div>
                        <Boop rotation={"2"} timing={"200"}>
                            <Button
                                onClick={handleOpen}
                                variant="gradient"
                                color="green"
                                size="lg"
                            >
                                <div className="text-3xl">
                                    Create Away Message
                                </div>
                            </Button>
                        </Boop>
                    </div>

                    <Dialog open={open} handler={handleOpen}>
                        <DialogHeader>
                            Create an Away Message
                            <img
                                src={aolemoji}
                                style={{ height: "100px", width: "150px" }}
                                alt="aolemoji"
                            />
                        </DialogHeader>
                        <DialogBody divider>
                            <div>
                                <form onSubmit={onSubmitHandler}>
                                    {errors.length > 0 &&
                                        errors.map((error, i) => (
                                            <>
                                                <p
                                                    key={i}
                                                    className=" text-red-700"
                                                >
                                                    {error}
                                                </p>
                                            </>
                                        ))}
                                    <div className="flex w-72 flex-col gap-6">
                                        <Input
                                            type="text"
                                            color="purple"
                                            label="Away Message Title"
                                            onChange={(e) =>
                                                setAwayMessageLabel(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            type="text"
                                            color="indigo"
                                            label="Away Message"
                                            onChange={(e) =>
                                                setAwayMessage(e.target.value)
                                            }
                                        />

                                        <Input
                                            type="text"
                                            color="blue"
                                            label="Away Message Creator"
                                            value={userScreenName}
                                            onChange={(e) =>
                                                setAwayMessageCreator(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="m-4 animate-bounce">
                                        <Boop rotation={"15"} timing={"200"}>
                                            <Button
                                                type="submit"
                                                variant="gradient"
                                                color="green"
                                            >
                                                <span>Create!</span>
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
                                    onClick={handleClose}
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
export default CreateAwayMessage;
