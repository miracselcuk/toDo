import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Tasks from "./pages/Tasks"
import FriendsTasks from "./pages/FriendsTasks";

function App() {

    const token = localStorage.getItem('token');

    return (
        <Routes>
            <Route path='/login' element={!token ? <Login /> : <Navigate to='/' />} />
            <Route path='/register' element={!token ? <Register /> : <Navigate to='/' />} />
            <Route path="/tasks/:friendUsername" element={<FriendsTasks />} />
            <Route path="/" element={<Tasks />} />

        </Routes>
    )
}

export default App
