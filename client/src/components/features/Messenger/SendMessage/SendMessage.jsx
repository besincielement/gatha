import { useState, useEffect, useRef } from "react";
import EmojiPicker from "../EmojiPicker/RenderEmojiPicker";
import ErrorDisplay from "../../../common/ErrorDisplay/ErrorDisplay";
import styles from "./SendMessage.module.css";
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import ReactIconNavigate from "../../../common/ReactIconNavigate/ReactIconNavigate";
import socket from "../../../../api/socket";
import { devLog } from "../../../../utils/errorUtils";
import useUserContext from "../../../../hooks/useUserContext";
import { isMobile } from "../../../../utils/deviceUtils";
import useSetCallbackWhenSelectedGroupChanges from "../../../../hooks/useSetCallbackWhenSelectedGroupChanges";

function SendMessage({ selectedGroup }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { setIsTyping, setTypingUser } = useUserContext();

  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerContainerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Close emoji picker if it's open and user clicked outside the emoji picker container
      if (
        showEmojiPicker &&
        emojiPickerContainerRef.current &&
        !emojiPickerContainerRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.emojiButton}`)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.body.addEventListener("click", handleDocumentClick);

    return () => {
      document.body.removeEventListener("click", handleDocumentClick);
    };
  }, [showEmojiPicker]);

  // Set up socket listeners for typing events
  useEffect(() => {
    socket.on("typing", ({ user }) => {
      devLog(`${user} is typing...`);
      setTypingUser(user);
      setIsTyping(true);
    });

    socket.on("stop_typing", ({ user }) => {
      devLog(`${user} stopped typing.`);
      setIsTyping(false);
      setTypingUser("");
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [setIsTyping, setTypingUser]);

  // Handle emoji selection
  useEffect(() => {
    if (chosenEmoji.emoji) {
      // Append the selected emoji to the current input value
      setInput((prevInput) => prevInput + chosenEmoji.emoji);
      setShowEmojiPicker(false);

      // Focus on the input field after selecting an emoji
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setShowEmojiPicker(false);
    }
  }, [chosenEmoji]);

  // Send a message when the send button is clicked or Enter is pressed
  const sendMessage = (e) => {
    if (input && input.trim()) {
      socket.emit(
        "send_message",
        {
          text: input,
          groupId: selectedGroup?.groupId,
        },
        (acknowledgment) => {
          devLog("Acknowledgment:", acknowledgment);
          if (acknowledgment.error) {
            setError(acknowledgment.error);
          } else {
            setInput("");
            setError("");
            socket.emit("stop_typing", { groupId: selectedGroup?.groupId });
          }
        }
      );
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    } else {
      const isInputEmpty = input.trim() === ""; // Check if input is empty
      if (!isInputEmpty) {
        socket.emit("typing", { groupId: selectedGroup?.groupId });
      }

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (isInputEmpty) {
          socket.emit("stop_typing", { groupId: selectedGroup?.groupId });
        }
      }, 1000);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  // Clear input field when selects a different group
  useSetCallbackWhenSelectedGroupChanges(selectedGroup, () => setInput(""));

  return (
    <form className={styles.sendMessageContainer}>
      <div className={styles.sendMessageLine}>
        {isMobile ? (
          <>
            <input
              ref={inputRef}
              name='message-input'
              type='text'
              placeholder='Message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className={styles.sendMessageButton}>
              <ReactIconNavigate
                onClick={sendMessage}
                size={2}
                icon={IoMdSend}
                margin={0}
              />
            </span>
          </>
        ) : (
          <>
            <textarea
              ref={inputRef}
              name='message-input'
              placeholder='Message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <MdEmojiEmotions
              className={styles.emojiButton}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />

            <div
              ref={emojiPickerContainerRef}
              onMouseLeave={() => setShowEmojiPicker(false)}>
              {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
            </div>
            <span className={styles.sendMessageButton}>
              <ReactIconNavigate
                onClick={sendMessage}
                size={3}
                icon={IoMdSend}
                margin={0}
              />
            </span>
          </>
        )}
      </div>
      <ErrorDisplay error={error} />
    </form>
  );
}

export default SendMessage;
