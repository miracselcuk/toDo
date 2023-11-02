import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [res, setRes] = useState(0);
    const [info, setInfo] = useState<string | null>(null);

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

    const handleLogin = async () => {
        if (!email || !password) {
            setRes(400);
            setInfo('Please fill in the fields.');
            return;
        }

        try {
            const response: AxiosResponse | void = await axios.post('http://localhost:3000/signin', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response && 'status' in response && response.status === 200) {
                setRes(response.status);
                setInfo("Successfully logged in. You're being directed.");
                const data = response.data?.accessToken;
                if (data) {
                    localStorage.setItem('token', data);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                setInfo(axiosError.response.data.error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="md:flex text-xl p-4 border-b">
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
                    <div className="w-full md:w-1/3 p-2 text-center justify-center items-center">
                        <div className="text-blue-100">
                            <button
                                id="enter"
                                onClick={handleLogin}
                                className="md:mr-6 text-3xl rounded-xl px-20 p-3 bg-sky-500 border border-black hover:border-sky-500"
                                style={{ width: '100%' }}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-blue-200 md:mb-4 p-4 text-center">
                <Link className="hover:text-sky-500" to={"/register"}>
                    Don't you have an account yet? Register.
                </Link>
            </div>
            <div className="font-bold text-center text-xl mt-5">
                <div className={res === 200 ? 'text-green-600' : 'text-red-600'}>{info}</div>
            </div>
        </>
    )
}