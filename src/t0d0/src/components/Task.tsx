import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im'

export type Task = {
    id: number,
    title: string,
    description: string,
    ownerId: string,
    completed: boolean,
    createdAt: string,
    completedAt: string
}

function formatDateTime(originalDate: string) {
    const date = new Date(originalDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
}


export default function Task_({ task, completeTask }: { task: Task, completeTask: (id: number) => void }) {

    return (
        <div className="flex items-center">
            <div className="flex items-center space-x-5 ml-0.5">
                <button onClick={() => completeTask(task.id)}>
                    {task.completed ? <ImCheckboxChecked style={{ color: '#0ea5e9' }} /> : <ImCheckboxUnchecked />}
                </button>
                <div>
                    {task.completed ? <del>{task.title}</del> : task.title}
                </div>
            </div>
            <div className="ml-auto text-xs">
                {task.completed
                    ?
                    <div>
                        <i>
                            completed at: {formatDateTime(task.completedAt)}
                        </i>
                    </div>
                    :
                    <div>
                        <i>
                            created at: {formatDateTime(task.createdAt)}
                        </i>
                    </div>}
            </div>
        </div>
    );
}