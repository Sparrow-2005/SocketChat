// import React, { useContext, useState } from 'react'
// import assets, { messagesDummyData } from '../assets/assets'
// import { useRef } from 'react';
// import { useEffect } from 'react';
// import { formatMessageTime } from '../lib/utils';
// import { ChatContext } from '../../context/ChatContext';
// import { AuthContext } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// const ChatContainer = () => {
//     const {messages,selectedUser,setSelectedUser,sendMessage,getMessages}=useContext(ChatContext);
//     const {authUser,onlineUsers}=useContext(AuthContext);
//     const scrollEnd = useRef();
//     const [input, setInput] = useState('');
//     //handles sending a message when the user presses Enter
//     const handleSendMessage =async (e) => {
//        e.preventDefault();
//        if(input.trim()==='') return;
//        await sendMessage({
//             text: input.trim()
//        });
//        setInput('');

//     }

//     //Handle sending an image
//     const handleSendImage = async (e) => {
//         const file = e.target.files[0];
//         if (!file || !file.type.startsWith("image/")) {
//             toast.error("Select an image file");
//             return;
//         }
//         const reader = new FileReader();
//         reader.onloadend=async () => {
//             await sendMessage({
//                 image: reader.result
//             });
//             e.target.value = ''; // Reset the input value
//         }
//         reader.readAsDataURL(file);
//     }
//     useEffect(() => {
//         if (!selectedUser) return;

//         getMessages(selectedUser._id); // Fetch immediately on user select

//         const interval = setInterval(() => {
//           getMessages(selectedUser._id); // Fetch every 1 second
//         }, 1000); // 1000ms = 1 second

//         return () => clearInterval(interval); // Cleanup on unmount or selectedUser change
//       }, [selectedUser]);
//     useEffect(() => {
//     // Scroll to the bottom of the chat area when selectedUser changes
//         if (scrollEnd.current && messages) {
//             scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [messages]);

//   return selectedUser? (
//     <div className='h-full overflow-scroll relative backdrop-blur-lg'>
//         {/* ------HEADER-------- */}
//          <div className='flex item-center gap-3 py-3 mx-4 border-b border-stone-500'>
//             <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
//             <p className='flex-1 text-lg text-white flex items-center gap-2'>
//                 {selectedUser.fullName}
//                 {onlineUsers.includes(selectedUser._id)}<span className='w-2 h-2 rounded-full bg-green-500'></span>
//             </p>
//             <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
//             <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 max-h-5 mt-1.5 mr-1.5' />
//          </div>
//          {/* -----CHAT AREA----- */}
//          <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
//             {messages.map((msg, index) => (
//                 <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId!==authUser._id && 'flex-row-reverse'}`}>
//                     {msg.image?(
//                         <img src={msg.image} alt=""  className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
//                     ):(
//                         <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId===authUser._id ?'rounded-br-none':'rounded-bl-none'}`}>{msg.text}</p>
//                     )}
//                     <div className='text-center text-xs'>
//                         <img src={msg.senderId===authUser._id ? authUser?.profilePic ||  assets.avatar_icon: selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
//                         <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
//                     </div>
//                 </div>
//             ))}
//             <div ref={scrollEnd}></div>
//          </div>
//          {/* bottom area */}
//          <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
//             <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
//                 <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==="Enter"?handleSendMessage(e):null} type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
//                 <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden/>
//                 <label htmlFor="image">
//                     <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
//                 </label>
//             </div>
//             <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
//          </div>
//     </div>
//   ):(
//     <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
//         <img src={assets.logo_icon} className='max-w-16' alt="" />
//         <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
//     </div>
//   )
// }

// export default ChatContainer



import React, { useContext, useState, useRef, useEffect } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [showHelpSidebar, setShowHelpSidebar] = useState(false);


  // handles sending a message when the user presses Enter
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim() === "") return;

//     try {
//       await sendMessage({ text: input.trim() });
//       setInput("");
//     } catch (error) {
//       console.error("Message sending error:", error);
//       toast.error("Failed to send message.");
//     }
//   };
const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
  
    try {
      await sendMessage({ text: input.trim() });
      setInput("");
  
      // 👇 Force scroll to bottom when sender sends message
      setTimeout(() => {
        if (scrollEnd.current) {
          scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // slight delay to ensure message is added
    } catch (error) {
      console.error("Message sending error:", error);
      toast.error("Failed to send message.");
    }
  };
  

  // Handle sending an image
//   const handleSendImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Select an image file");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       try {
//         await sendMessage({ image: reader.result });
//         e.target.value = ""; // Reset the input value
//       } catch (err) {
//         console.error("Image send error:", err);
//         toast.error("Failed to send image.");
//       }
//     };
//     reader.readAsDataURL(file);
//   };
const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await sendMessage({ image: reader.result });
        e.target.value = ""; // Reset the input value
  
        // 👇 Force scroll to bottom when sender sends image
        setTimeout(() => {
          if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100); // slight delay to ensure image is added
      } catch (err) {
        console.error("Image send error:", err);
        toast.error("Failed to send image.");
      }
    };
  
    reader.readAsDataURL(file);
  };
  

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id); // Fetch immediately on user select

    const interval = setInterval(() => {
      getMessages(selectedUser._id); // Fetch every 1 second
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [selectedUser]);

//   useEffect(() => {
//     if (!scrollEnd.current || !messages || messages.length === 0) return;

//     const chatContainer = scrollEnd.current?.parentElement;

//     if (!chatContainer) return;

//     const isNearBottom =
//       chatContainer.scrollHeight -
//         chatContainer.scrollTop -
//         chatContainer.clientHeight <
//       200;

//     if (isNearBottom) {
//       scrollEnd.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
//Scroll to bottom only when new chat opens
useEffect(() => {
    if (!scrollEnd.current || !selectedUser) return;
    scrollEnd.current.scrollIntoView({ behavior: "auto" }); // Instantly scroll when user opens a chat
  }, [selectedUser]);
  //Scroll to bottom on new message only if user is near the bottom
  useEffect(() => {
    if (!scrollEnd.current || !messages || messages.length === 0) return;
  
    const chatContainer = scrollEnd.current?.parentElement;
  
    if (!chatContainer) return;
  
    const isNearBottom =
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight <
      200;
  
    if (isNearBottom) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll on new message if user is near bottom
    }
  }, [messages]);
    

  useEffect(() => {
    if (scrollEnd.current && selectedUser && messages.length > 0) {
      // Delay the scroll to ensure the DOM has rendered messages
      setTimeout(() => {
        scrollEnd.current.scrollIntoView({ behavior: "auto" });
      }, 50); // Small delay to allow rendering
    }
  }, [selectedUser, messages.length]);
  

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------HEADER-------- */}
      <div className="flex item-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) &&  <span className="w-2 h-2 rounded-full bg-green-500"></span>}
          
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="max-w-7"
        />
        
      </div>

      {/* -----CHAT AREA----- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {Array.isArray(messages) &&
          messages
            .filter((msg) => msg && msg.senderId) // 💡 prevent undefined or malformed items
            .map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 justify-end ${
                  msg.senderId !== authUser._id && "flex-row-reverse"
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  />
                ) : (
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                      msg.senderId === authUser._id
                        ? "rounded-br-none"
                        : "rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <div className="text-center text-xs">
                  <img
                    src={
                      msg.senderId === authUser._id
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    alt=""
                    className="w-7 rounded-full"
                  />
                  <p className="text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;

