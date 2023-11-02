import { ReactNode, useState } from "react";
import { GiThreeFriends } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Friends from "./Friends";
import { Link } from "react-router-dom";

export default function UpSide({ children }: { children: ReactNode }) {
    const [show, setShow] = useState(false);

    const open = () => {
        setShow(true);
    };

    const close = () => {
        setShow(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="max-w-5xl md:p-8 mx-auto mt-5">
            <div className="p-4 md:p-8 text-center border-b">
                <Link to="/" onClick={() => close()} className="text-8xl text-sky-500 rounded-xl hover:rounded-xl transition duration-700 ease-in-out transform hover:scale-105 hover:bg-sky-500 hover:text-black">TO-DO</Link>
                {localStorage.getItem('token') && (
                    <div className="justify-center flex mt-10 space-x-4">
                        <button onClick={!show ? open : close}>
                            <GiThreeFriends style={{ color: show ? '#0ea5e9' : 'white' }} size={28} />
                        </button>
                        <button onClick={logout}>
                            <RiLogoutBoxRLine style={{ color: 'white' }} size={28} />
                        </button>
                    </div>
                )}
            </div>
            <div className={`overflow-hidden flex justify-center transition-all max-h-0 ${show ? 'max-h-screen' : ''}`}>
                {show && <Friends toggle={close} />}
            </div>
            {children}
        </div>
    );
}