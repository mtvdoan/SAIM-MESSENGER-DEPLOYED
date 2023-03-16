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

const AwayMessageModal = (props) => {
    const helper=(message, object)=>{
      console.log(message, object);
      return object;
    }
    const { label, message, creator } = props;
    console.log( label, message, creator )
    const { user, socket } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [awayMessagesList, setAwayMessagesList] = useState([]);
    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/awayMessages/")
            .then((response) => {
                setAwayMessagesList(response.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
      <>
        <div className="grid grid-cols-1 content-center">
            <Fragment>
                <div className="m-2 text-center">
                    <Boop rotation={"2"} timing={"200"}>
                        <Button
                            onClick={handleOpen}
                            variant="gradient"
                            color="purple"
                            size="lg"
                        >
                            <div className="text-sm font-extrabold">
                                {label}
                            </div>
                        </Button>
                    </Boop>
                </div>
                <Dialog open={open} handler={handleOpen}>
                    <DialogHeader
                        className="text-3xl whitespace-normal"
                        style={{ maxWidth: "1000px" }}
                    >
                        {label}
                        <Boop rotation={"5"} timing={"200"}>
                            <img
                                src={aolemoji}
                                style={{ height: "100px", width: "150px" }}
                                alt="aolemoji"
                            />
                        </Boop>
                    </DialogHeader>
                    <DialogBody divider className="whitespace-normal">
                        <div className="text-2xl">"{message}"</div>
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

export default AwayMessageModal;
