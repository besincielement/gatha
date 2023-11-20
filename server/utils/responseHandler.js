import Group from "../models/Group.js";
import User from "../models/User.js";

/**
 * Utility helper to find user by user ID
 * @param {*} userId
 * @returns
 */
export const findUserById = async (userId) => User.findById(userId);

/**
 * Utility helper to find user by username
 * @param {*} username
 * @returns
 */
export const findUserByUsername = async (username) =>
  User.findOne({ username });

/**
 * Utility helper to find if a user if already a member of a group
 * @param {*} groupId
 * @param {*} userId
 * @returns
 */
export const isUserAlreadyMember = async (groupId, userId) => {
  // Find the group by ID and check if the user is a member
  const existingGroup = await Group.findOne({
    _id: groupId,
    members: userId,
  });

  return existingGroup !== null;
};

/**
 * Utility helper to update the group
 * @param {*} groupId
 * @param {*} memberId
 * @param {*} operation
 * @returns
 */
export const updateGroupMembers = async (groupId, memberId, operation) => {
  try {
    return await Group.findByIdAndUpdate(
      groupId,
      { [operation]: { members: memberId } },
      { new: true }
    )
      .populate({ path: "members", select: "username firstName lastName" })
      .populate("admin", "username firstName lastName");
  } catch (error) {
    throw new Error(
      "An error occurred while updating group members. Please try again later."
    );
  }
};
