import { useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState<string | null>(null);
    const [res, setRes] = useState(0);

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === "Enter") {
                event.preventDefault();
                const button = document.getElementById("enter");
                if (button) {
                    button.click();
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const handleSubmit = async () => {
        if (!username || !email || !password) {
            setRes(400);
            setInfo('Please fill in the fields.');
            return;
        }
        try {
            const response: AxiosResponse | void = await axios.post('http://localhost:3000/signup', {
                username,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response && 'status' in response && response.status === 200) {
                setRes(response.status);
                setInfo("The account was created successfully. You will be redirected to the login screen.");
                const data = response.data?.accessToken;
                if (data) {
                    localStorage.setItem('token', data);
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                setInfo(axiosError.response.data.error);
            }
        }
    }

    return (
        <>
            <div className="md:flex text-xl p-4">
                <div className="w-full md:w-1/3 p-2">
                    <input
                        className="focus:outline-none focus:borde r-sky-500 focus:ring focus:ring-sky-500 bg-blue-100 w-full p-4 rounded text-black"
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <input
                        className="focus:outline-none focus:border-sky-500 focus:ring focus:ring-sky-500 bg-blue-100 w-full p-4 rounded text-black"
                        type="email"
                        value={email}
                        placeholder="E-Mail"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <input
                        className="focus:outline-none focus:border-sky-500 focus:ring focus:ring-sky-500 bg-blue-100 w-full p-4 rounded text-black"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="md:flex justify-between border-b text-center">
                <div className="text-blue-200 hover:text-sky-500 md:mb-4 p-4 ml-2">
                    <Link to="/login" className="">Already have an account?</Link>
                </div>
                <div className="text-blue-100">
                    <button id="enter" onClick={handleSubmit} className="md:mr-6 text-3xl rounded-xl px-10 p-2 bg-sky-500 border border-black hover:scale-105 hover:border-sky-500">Sign Up</button>
                </div>
            </div>
            <div className="font-bold text-center text-xl mt-10">
                <div className={res === 200 ? 'text-green-600' : 'text-red-600'}>{info}</div>
            </div>
        </>
    )
}