import { useEffect, useState } from "react"
import { myAxios } from "../helpers/axios";
import Task_, { Task } from "../components/Task";
import { useParams } from "react-router-dom";

export default function FriendsTasks() {

    const { friendUsername } = useParams();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const showTask = async () => {
            const response = await myAxios.get(`/tasks/${friendUsername}`);
            if (response.status === 200) {
                const data = await response.data.tasks
                setTasks(data)
            }
        }
        showTask();
    }, [friendUsername])

    const completeTask = async () => {
        alert('You do not have permission to update this task.')
    }

    return (
        <>
            <div className="text-gray-300 mt-5 space-y-2">
                <div>
                    <p className="text-xl p-2 border-b border-[#0ea5e9] w-[180px]">{friendUsername}'s tasks</p>
                </div>
                {tasks.map((task) => (
                    <div className="border border-slate-800 p-4 rounded" key={task.id}>
                        <Task_ task={task} completeTask={completeTask} />
                    </div>
                ))}
            </div>
        </>
    )
}