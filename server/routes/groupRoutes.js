import express from "express";
import {
  createGroup,
  addMemberToGroup,
  getGroupMembers,
  getAllGroups,
  deleteGroupById,
} from "../controllers/groupControllers.js";
import { authorizeUser } from "../middleware/userAuthorization.js";
import { validator } from "../middleware/validator.js";
import { validateGroupRules } from "../middleware/groupSanitizer.js";
import { isGroupAdminMiddleware } from "../middleware/isGroupAdminMiddleware.js";

const router = express.Router();

// Protected endpoint
router.use(authorizeUser);

router.post(
  "/create-group/:userId",
  validateGroupRules,
  validator,
  createGroup
);

router.get("/get-members/:groupId", getGroupMembers);
router.get("/get-groups", getAllGroups);

// Protected endpoint with admin rights
router.patch(
  "/add-member/:groupId/:userId",
  isGroupAdminMiddleware,
  addMemberToGroup
);
router.delete(
  "/delete/:groupId/:userId",
  isGroupAdminMiddleware,
  deleteGroupById
);

export default router;
