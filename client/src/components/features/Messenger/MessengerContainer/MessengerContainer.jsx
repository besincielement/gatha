import React, { useState } from "react";
import styles from "./MessengerContainer.module.css";
import RenderMessages from "../RenderMessages/RenderMessages";
import SendMessage from "../SendMessage/SendMessage";
import GroupSettingBar from "../GroupSettingBar/GroupSettingBar";
import { FaRegHandPointLeft } from "react-icons/fa6";
import useUserContext from "../../../../hooks/useUserContext";
import GroupRegularUserSettingsContainer from "../GroupRegularUserSettingsContainer/GroupRegularUserSettingsContainer";
import GroupAdminSettingsContainer from "../GroupAdminSettingsContainer/GroupAdminSettingsContainer";

function MessengerContainer() {
  const { selectedGroup } = useUserContext();

  // State to track the current view
  const [currentView, setCurrentView] = useState("default");

  // Function to switch the current view
  const switchView = (view) => {
    setCurrentView(view);
  };

  // Event handlers for changing the view
  const handleDefaultViewClick = () => {
    switchView("default");
  };

  const handleRegularUserSettingsClick = () => {
    switchView("regularUserSettings");
  };

  const handleAdminUserSettingsClick = () => {
    switchView("adminUserSettings");
  };

  // Function to dynamically render different views based on the current view state
  const renderView = () => {
    switch (currentView) {
      // Render regular user settings with a callback for the default view
      case "regularUserSettings":
        return (
          <GroupRegularUserSettingsContainer
            onDefaultViewClick={handleDefaultViewClick}
          />
        );
      // Render admin user settings with a callback for the default view
      case "adminUserSettings":
        return (
          <GroupAdminSettingsContainer
            onDefaultViewClick={handleDefaultViewClick}
          />
        );
      default:
        // Render default view with the latest messages of the selected group
        return selectedGroup ? (
          <>
            <div className={styles.groupBar}>
              <GroupSettingBar
                selectedGroup={selectedGroup}
                onAdminSettingsClick={handleAdminUserSettingsClick}
                onRegularUserSettingsClick={handleRegularUserSettingsClick}
              />
            </div>
            <div className={styles.messages}>
              <RenderMessages selectedGroup={selectedGroup} />
            </div>
            <div className={styles.send}>
              <SendMessage selectedGroup={selectedGroup} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.selectGroup}>
              <p>Please select a group.</p>
              <FaRegHandPointLeft />
            </div>
          </>
        );
    }
  };

  return <div className={styles.messengerContainer}>{renderView()}</div>;
}

export default MessengerContainer;
