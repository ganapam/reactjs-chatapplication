import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase";
const Chats = () => {
  const [chats, setChats] = useState({}); // Set initial value to an empty object
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.exists ? doc.data() : {});
      });
    
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          ?.filter(([, chatData]) => chatData?.userInfo)
          .sort(([, a], [, b]) => b.date - a.date)
          .map(([chatId, chatData]) => (
    <div
      className="userChat"
      key={chatId}
      onClick={() => handleSelect(chatData.userInfo)}
    >
      <img src={chatData.userInfo.photoURL || ''} alt="" />
      <div className="userChatInfo">
        <span>{chatData.userInfo.displayName || 'Unknown User'}</span>
        <p>{chatData.lastMessage?.text || 'No messages'}</p>
      </div>
    </div>
  ))}
    </div>
  );
};

export default Chats;
