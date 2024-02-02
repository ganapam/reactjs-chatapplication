import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from '../Context/ChatContext';
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  // Function to format the timestamp to show 'today', 'yesterday', or the date
  const formatDate = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return 'TODAY';
    } else if (
      messageDate.getDate() === now.getDate() - 1 &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return 'YESTERDAY';
    } else {
      return messageDate.toDateString();
    }
  };

  // Separate array to store unique dates
  const uniqueDates = [];

  return (
    <div className="messages">
      {messages.map((message, index) => {
        const formattedDate = formatDate(message.date.seconds * 1000);

        // Check if the date has been encountered before
        if (!uniqueDates.includes(formattedDate)) {
          // Add the date to the unique dates array
          uniqueDates.push(formattedDate);

          return (
            <React.Fragment key={message.id}>
              <div className="message-date text-center">{formattedDate}</div>
              <Message message={message} />
            </React.Fragment>
          );
        } else {
          return <Message key={message.id} message={message} />;
        }
      })}
    </div>
  );
};

export default Messages;
