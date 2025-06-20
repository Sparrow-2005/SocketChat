import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const {login}=useContext(AuthContext);
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState==="Sign Up"?'signup':'login', {fullName,email,password,bio})
  }
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-evenly gap-8 px-4 max-sm:flex-col backdrop-blur-2xl">
      {/* left side */}
      <img
        src={assets.SocketC}
        alt=""
        className="w-[min(40vw,500px)] max-sm:w-[60%]"
      />
      {/* right side */}
      <form
        onSubmit={onSubmitHandler}
        className="w-[min(30vw,400px)] border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted  && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
          
        </h2>
        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />
            <input
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        {
          currState === "Sign Up" && isDataSubmitted && (
            <textarea
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide a short bio"
              required
            />
          ) 
        }
        <button type="submut" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {currState === "Sign Up" ?"Create Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-2">
            {currState === "Sign Up" ? (
              <p className="text-sm text-gray-600">Already have an account? <span onClick={()=>{setCurrState("Login");setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
            ):(
              <p className="text-sm text-gray-600">Create an account <span onClick={()=>{setCurrState("Sign Up")}} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
            )}
        </div>
      </form>
    </div>

  );
};

export default LoginPage;
