import {React, useState, useRef} from "react";
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { wait } from "../utils/Functionabilities";
import Cookies from "universal-cookie";

function Login () {

    const cookies = new Cookies();
    const navigate = useNavigate()
    const [keepLoggedIn, SetKeepLoggedIn] = useState(false);
    const [emailInvalid, SetEmailInvalid] = useState(false);
    const [passwordInvalid, SetPasswordInvalid] = useState(false);
    const [showPassword, SetShowPassword] = useState(false);

    const ToggleShowPassword = () => {
        SetShowPassword(!showPassword)
    }

    const ToggleKeepLoggedIn = () => {
        SetKeepLoggedIn(!keepLoggedIn);
    }

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    function isValidEmailAddress(address) {
        return !! address.match(/.+@.+/);
    }

    

    const Login = async () => {
        await axios.post('http://localhost:8000/login/', {
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim()
        })
        .then(async function (response) {
            if (response.data["detail"] === "account not found") 
            {
                alert("Login failed");
            }
            else if (response.data["detail"] === "password doesn't match")
            {
                alert("Login failed")
            }
            else 
            { 
                if(response.data["detail"]){
                    cookies.set("jwt_auth", response.data["detail"], {"sameSite": "unset"})
                    await wait(300);
                    navigate("/");
                }
            }
        })
        .catch(function (error) {
            console.log(error, 'error');
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        let emailValid = true;
        let passwordValid = true;

        if (!isValidEmailAddress(emailRef.current.value.trim()))
        {
            SetEmailInvalid(true);
            emailValid = false;
        }
        
        if (passwordRef.current.value.trim() === "")
        {
            SetPasswordInvalid(true);
            passwordValid = false;
        }

        if (emailValid && passwordValid)
        {
            Login();
        }
    }

    return (  
        <div className="flex h-[100vh] w-full flex-col bg-gray-100 py-10">
            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex flex-col px-6 py-6 text-center mx-auto my-[40px] bg-white rounded-xl md:w-[500px] w-[350px] shadow-lg" noValidate>

                {/* login info */}
                <div className="my-2">
                    <p className="mb-3 text-4xl font-extrabold text-dark-grey-900">Sign In</p>
                    <p className="mb-4 text-grey-700">Enter your email and password</p>
                </div>

                {/* login fields */}

                {/* email field */}
                <div className="flex flex-col mb-5">
                    <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">Email</label>
                    <input id="email" type="email" ref={emailRef} required={emailInvalid} placeholder="Email" className="w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-300 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl peer"/>
                    <p htmlFor="email" className="text-start hidden peer-required:block peer-invalid:block text-pink-600 text-sm px-2 animate-nav-bars-menu-popup">Please provide a valid email address.</p>
                </div>

                {/* password field */}
                <div className="flex flex-col mb-5">
                    <label htmlFor="password" className="mb-2 text-sm text-start text-grey-900">Password</label>
                    <div className="relative">
                        <input id="password" ref={passwordRef} required={passwordInvalid} type={showPassword ? "text" : "password"} placeholder="Password" className="flex items-center w-full pl-5 pr-10 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-300 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl peer"/>
                        {showPassword ? 
                            <VisibilityOffIcon className={`absolute right-2 -translate-y-[50%] peer-required:-translate-y-[90%] top-[50%] text-gray-400 hover:text-gray-500`} onClick={ToggleShowPassword}/>
                            :
                            <VisibilityIcon className={`absolute right-2 -translate-y-[50%] peer-required:-translate-y-[90%] top-[50%] text-gray-400 hover:text-gray-500`} onClick={ToggleShowPassword}/>
                        }
                        <p htmlFor="password" className="relative text-start hidden text-pink-600 peer-required:block text-sm px-2 animate-nav-bars-menu-popup">Please provide a password.</p>
                    </div>
                </div>

                {/* keep me logged in and forgot password button*/}
                <div className="flex flex-row justify-between mb-8">
                    {/* keep me logged in tick */}
                    <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                        <input onChange={ToggleKeepLoggedIn} type="checkbox" checked={keepLoggedIn} className="sr-only peer"/>
                        <div className="w-5 h-5 bg-white hover:bg-gray-300 border-2 rounded-sm border-gray-500 peer-checked:border-0 peer-checked:bg-green-600">
                            <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick"/>
                        </div>
                        <span className="ml-3 text-sm font-normal text-gray-900">Keep me logged in</span>
                    </label>

                    {/* forgot password */}
                    <button>
                        <p className="mr-4 text-sm font-medium text-green-800 hover:underline">Forgot password?</p>
                    </button>
                </div>

                {/* Sign in Button*/}
                <button type="submit" className="max-w-[250px] min-w-[250px] mx-auto px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-green-700 bg-green-600">Sign In</button>

                {/* not registered text and create an account button*/}
                <div className="flex flex-row mx-auto">
                    <p className="text-sm leading-relaxed text-gray-900 mr-2">Not registered yet?</p>
                    <button onClick={() => navigate('/register')}>
                        <p className="text-sm font-bold text-grey-700 hover:underline">Create an Account</p>
                    </button>
                </div>

                {/* or separator */}
                <div className="flex items-center my-4">
                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                    <p className="mx-4 text-grey-600">or</p>
                    <hr className="h-0 border-b border-solid border-grey-500 grow"/>
                </div>
                
                {/* Sign in with Google o auth*/}
                <button className="flex items-center justify-center mx-auto w-[250px] py-4 my-4 text-sm font-medium rounded-2xl text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200">
                    <img className="h-5 mr-2 pointer-events-none" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt=""/>
                    <p className="select-none">Sign in with Google</p>
                </button>

            </form>      
        </div>
    )
}

export default Login;