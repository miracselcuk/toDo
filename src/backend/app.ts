import express from "express";
import { signup, signin, me } from "./app/auth";
import { createTask, showOwnTasks, editTask, showTasks } from "./app/task";
import authenticateUser from "./utils/authMiddleware";
import { acceptFriendRequest, addFriend, friendList, rejectFriendRequest, requestsList } from "./app/friend";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser()) // !
app.use(cors(
    {
        origin: ['http://localhost:5173']
    }
));

app.post("/signup", signup);
app.post("/signin", signin);

app.get("/", authenticateUser, showOwnTasks); //done
app.post("/createTask", authenticateUser, createTask); //done
app.post("/task/:taskId", authenticateUser, editTask); //done -> TODO: Add/edit description?
app.get("/tasks/:username", authenticateUser, showTasks) //done

app.get("/friends", authenticateUser, friendList); //done
app.post("/request/:username", authenticateUser, addFriend); //done
app.get("/requests", authenticateUser, requestsList); //done
app.post("/reject/:requestID", authenticateUser, rejectFriendRequest); //done
app.post("/accept/:requestID", authenticateUser, acceptFriendRequest); //done
app.get("/me", authenticateUser, me)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
