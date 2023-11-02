import { useEffect, useState } from "react"
import { myAxios } from "../helpers/axios";
import Task_, { Task } from "../components/Task";
import Picker from '@emoji-mart/react'
import { BsEmojiSunglasses } from 'react-icons/bs'


export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [refresh, setRefresh] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const showTask = async () => {
            const response = await myAxios.get('/');
            if (response.status === 201) {
                const data = await response.data
                setTasks(data)
            }
        }
        showTask();
    }, [refresh])

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === "Enter") {
                event.preventDefault();
                const button = document.getElementById("enter");
                if (button) {
                    button.click();
                    close();
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const addTask = async () => {
        if (title.length < 1) {
            return
        }
        try {
            const tasks = await myAxios.post('/createTask', {
                title: title
            })
            const data = await tasks.data
            setTasks(data);
            setTitle('');
        } catch (e) {
            alert(e)
        }
    }

    const completeTask = async (id: number) => {
        try {
            const response = await myAxios.post(`/task/${id}`, {});
            if (response.status === 200) {
                setRefresh(response.data);
            }
        } catch (error) {
            console.error("Task completion error:", error);
        }
    }

    const addEmojiToTitle = (emoji: string) => {
        setTitle((prevTitle) => prevTitle + emoji);
    };

    const open = () => {
        setShow(true);
    };

    const close = () => {
        setShow(false);
    };

    return (
        <>
            {localStorage.getItem('token') && (
                <div className="text-white flex mt-5 space-x-2">
                    <button onClick={!show ? open : close} className="flex ml-4 mr-2 items-center">
                        <BsEmojiSunglasses style={{ color: '#475569' }} size={22} />
                    </button>
                    <input
                        className="focus:outline-none w-full focus:borde r-sky-500 focus:ring focus:ring-sky-500 bg-blue-100 p-3 rounded text-black"
                        type="text"
                        placeholder="Add Task"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                        id="enter"
                        disabled={title.length < 1}
                        onClick={addTask}
                        className="text-2xl rounded px-16 p-2 disabled:bg-gray-700 bg-sky-500 border border-black hover:scale-105 disabled:hover:scale-100"
                    >
                        Add
                    </button>
                </div>
            )}

            {show &&
                <div className="fixed">
                    <Picker onEmojiSelect={(e: { native: string }) => addEmojiToTitle(e.native)} emojiButtonSize={32} emojiSize={32} />
                </div>
            }

            <div className="text-gray-300 mt-5 space-y-2">
                {tasks.map((task) => (
                    <div className="border border-slate-800 p-4 rounded" key={task.id}>
                        <Task_ task={task} completeTask={completeTask} />
                    </div>
                ))}
            </div>
        </>
    )
}