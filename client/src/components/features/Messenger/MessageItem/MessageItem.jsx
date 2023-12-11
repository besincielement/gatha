import React, { useState } from "react";
import { dateFormatter } from "../../../../utils/dateUtils";
import { devLog } from "../../../../utils/errorUtils";
import UsernameInitials from "../../../common/UsernameInitials/UsernameInitials";
import DeleteMessage from "../DeleteMessage/DeleteMessage";
import OnlineStatusIndicator from "../OnlineStatusIndicator/OnlineStatusIndicator";
import styles from "./MessageItem.module.css";

const MessageItem = ({ msg, user, onlineUsers }) => {
  // state for isNotDeleted
  const [isNotDeleted, setIsNotDeleted] = useState(true);

  // Function to update isNotDeleted state
  const updateIsNotDeleted = () => {
    setIsNotDeleted(false);
  };

  return (
    <li
      key={msg._id}
      className={`${styles.messageContainer} ${
        msg.sender?.id === user.userId
          ? styles.senderMessage
          : styles.receiverMessage
      }`}>
      <div className={styles.sender}>
        <span className={styles.topBar}>
          <UsernameInitials
            firstName={msg.sender?.firstName}
            lastName={msg.sender?.lastName}
            radius={"2.6"}
            fontSize={"1.1"}
            borderWidth={"0.4"}
          />
          <span className={styles.username}>{msg.sender?.username}</span>
        </span>

        <div className={styles.onlineContainer}>
          <span className={styles.onlineStatus}>
            <OnlineStatusIndicator
              isOnline={onlineUsers.includes(msg.sender?.id)}
            />
          </span>
        </div>
      </div>

      <div className={styles.message}>
        {msg.isDeleted || !isNotDeleted ? (
          <p className={styles.deletedMessage}>
            This message has been deleted.
          </p>
        ) : (
          <p>{msg.text}</p>
        )}
      </div>
      <span className={styles.bottomBar}>
        {msg.sender?.id === user.userId && !msg.isDeleted && isNotDeleted && (
          <span className={styles.delete}>
            <DeleteMessage
              senderId={user.userId}
              messageId={msg._id}
              updateIsNotDeleted={updateIsNotDeleted}
            />
          </span>
        )}
        <div className={styles.date}>
          {dateFormatter(new Date(msg.createdAt))}
        </div>
      </span>
    </li>
  );
};
export default MessageItem;
