import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, {useState} from 'react';
import {UserProvider} from './context/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import AwayMessagesList from './components/AwayMessagesList';
import CreateAwayMessage from './components/CreateAwayMessage';
import UpdateAwayMessage from './components/UpdateAwayMessageModal';
import ViewAwayMessageModal from './components/ViewAwayMessageModal';
import Home from './components/Home';
import UserModal from './components/UserModal';
import CreateRoom from './components/CreateRoom';
import Lobby from './components/Lobby';
import PrivateChat from './components/PrivateChat';
import './App.css';
import UsersList from './components/UsersList';

function App() {
    const [authorized, setAuthorized] = useState("");
    return (
        <>
        <div className="bg_image">
            <BrowserRouter>
                <UserProvider>
                    <Routes>
                        <Route>
                            <Route index element={<Login authorized={authorized} setAuthorized={setAuthorized}/>}/>
                            <Route path="/register" element={<Register authorized= {authorized} setAuthorized={setAuthorized}/>}/>
                            <Route path="/home/:id" element={<Home setAuthorized={setAuthorized}/>}/>
                            <Route path="/users" element={<UsersList setAuthorized={setAuthorized}/>}/>
                            <Route path="/home/:id" element={<UserModal setAuthorized={setAuthorized}/>}/>
                            <Route path="/awayMessages" element={<AwayMessagesList setAuthorized={setAuthorized}/>}/>
                            <Route path="/awayMessages/:id/" element={<ViewAwayMessageModal setAuthorized={setAuthorized}/>}/>
                            <Route path="/awayMessages/:id/" element={<UpdateAwayMessage setAuthorized={setAuthorized}/>}/>
                            <Route path="/awayMessages" element={<CreateAwayMessage setAuthorized={setAuthorized}/>}/>
                            <Route path="/rooms" element={<CreateRoom/>}/>
                            <Route path="/rooms/all" element={<Lobby authorized={authorized} setAuthorized={setAuthorized}/>}/>  
                            <Route path="/rooms/:roomId" element={<PrivateChat authorized={authorized} setAuthorized={setAuthorized}/>}/>                        
                        </Route>
                    </Routes>
                </UserProvider>
            </BrowserRouter>
        </div>
        </>
    );
}

export default App;