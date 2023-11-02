import { useEffect, useState } from "react"
import { myAxios } from "../helpers/axios";
import { VscPersonAdd } from 'react-icons/vsc'
import { MdPending } from 'react-icons/md'
import { AiOutlineArrowRight, AiOutlineCloseCircle } from 'react-icons/ai'
import { Link } from "react-router-dom";


interface Friend {
    username: string;
}

interface Request {
    id: number;
    fromUsername: string;
}

export default function Friends({ toggle }: { toggle: () => void }) {

    const [friends, setFriends] = useState<Friend[]>([]);
    const [show, setShow] = useState(false);
    const [friendName, setFriendName] = useState('');
    const [requests, setRequests] = useState<Request[]>([]);
    const [showReq, setshowReq] = useState(false);
    const [refresh, setRefresh] = useState(null);

    useEffect(() => {
        const showFriends = async () => {
            const response = await myAxios.get('/friends');
            if (response.status === 200) {
                const data = await response.data.friends
                setFriends(data)
                console.log(data)
            }
        }
        showFriends();
    }, [refresh])

    useEffect(() => {
        const showRequests = async () => {
            const response = await myAxios.get('/requests');
            if (response.status === 200) {
                const data = await response.data.requests;
                setRequests(data);
                console.log(data);
            }
        }
        showRequests();
    }, [refresh])

    const sendRequest = async () => {
        const response = await myAxios.post(`/request/${friendName}`, {});
        if (response.status === 201) {
            alert("Friend request sent!");
            setFriendName('')
        }
    }

    const accept = async (id: number) => {
        try {
            const response = await myAxios.post(`/accept/${id}`, {});
            console.log(response)
            setRefresh(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const reject = async (id: number) => {
        try {
            const response = await myAxios.post(`/reject/${id}`, {});
            console.log(response)
            setRefresh(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="text-gray-300 mt-5 w-[300px] border border-[#0ea5e9] rounded text-center">
            <div className="ml-2">
                {!show ? (
                    <div className="mt-1">
                        <button onClick={() => setShow(true)} className="flex space-y-0.5 space-x-2 py-2">
                            <VscPersonAdd style={{ color: 'white' }} size={32} />
                            <span className="text-xl">Add Friend</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-1 mt-3.5">
                        <input
                            className="focus:outline-none text-center ml-1 mt-1 w-full focus:border-sky-500 focus:ring focus:ring-sky-500 bg-blue-100 rounded text-black"
                            type="text"
                            placeholder="Username"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                        />
                        <div>
                            <button
                                onClick={sendRequest}
                                disabled={friendName.length < 1}
                                className="text-xl mt-1 rounded p-0.5 px-2 disabled:bg-gray-700 bg-sky-500 border border-black hover:scale-105 disabled:hover:scale-100"
                            >
                                Send
                            </button>
                        </div>
                        <div className="flex">
                            <button onClick={() => setShow(false)}>
                                <AiOutlineCloseCircle size={20} className={'mt-1 mr-2'} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex space-x-2 py-2 ml-0.5">
                    <MdPending style={{ color: 'white' }} size={30} />
                    <button onClick={() => showReq ? setshowReq(false) : setshowReq(true)} className="text-xl">Requests ({requests.length})</button>
                </div>

                {showReq && (
                    requests.map((request) => (
                        <div className="flex p-2 border border-slate-800 mr-2 text-xl mt-2 justify-between" key={request.id}>
                            <p>{request.fromUsername}</p>
                            <div className="text-white space-x-1">
                                <button onClick={() => accept(request.id)} className="rounded bg-sky-500 px-2 border border-black hover:scale-105">Accept</button>
                                <button onClick={() => reject(request.id)} className="rounded bg-rose-500 px-2 border border-black hover:scale-105">Reject</button>
                            </div>
                        </div>
                    ))
                )}

                {friends.length > 0 && (
                    <div className="mb-2">
                        <div>
                            <h3 className="text-gray-300 mt-4 mb-4 mr-2 border-b border-[#0ea5e9]">My friends</h3>
                        </div>
                        <div>
                            {friends.map((friend, index) => (
                                <div key={index}>
                                    <Link to={`/tasks/${friend.username}`} onClick={toggle} className={`${friends.length === 1 ? null : 'border-b border-[#0ea5e9]'} text-lg hover:bg-sky-500 hover:text-xl hover:text-white flex space-y-1.5 justify-between`}>
                                        <span className="ml-1">
                                            {friend.username}
                                        </span>
                                        <div className="mr-3">
                                            <AiOutlineArrowRight size={18} style={{ color: 'white' }} />
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}