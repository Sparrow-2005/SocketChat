import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Set up axios defaults
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    //check if user is authenthicated and if so set user data and connect the socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            //const {data} = await axios.get("/api/user/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            } 
        } catch (error) {
            toast.error(error.message);
        }
    }
    //login function to handle user authentication and socket connection
    const login= async (state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            //const {data} = await axios.post(`/api/user/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            
        }
    }
    //logout function to handle user logout and disconnect the socket
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("You have been logged out successfully");
        socket.disconnect();
    }
    //Update profile function to handle user profile updates
    // const updateProfile = async (body) => {
    //     try {
    //         //const {data} = await axios.put("/api/auth/update-profile", body);
    //         //const {data} = await axios.put("/api/user/update-Profile", body);
    //         const { data } = await axios.put("/api/auth/update-profile", body, {
    //             headers: {
    //                 token: token,
    //             }
    //         });
    //         if(data.success){
    //             setAuthUser(data.user);
    //             toast.success("Profile updated successfully");
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // }
    const updateProfile = async (body) => {
        try {
          const { data } = await axios.put("/api/auth/update-profile", body, {
            headers: {
              token: token, 
            },
          });
      
          if (data.success) {
            setAuthUser(data.user);
            toast.success("Profile updated successfully");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
          console.error("Update Profile Error:", error.message);
        }
      };
      
    //connect to socket server to handle socket connection and online users update
    const connectSocket=(userData)=>{
        if(!userData||socket?.connected) return;
        const newSocket=io(backendUrl,{
            query:{
                userId: userData._id
            }
        });
        newSocket.on();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        });
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;

        }
        checkAuth();
    },[])
    const value={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );  
}