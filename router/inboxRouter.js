// external imports
const express = require("express");

// internal imports
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
} = require("../controller/inboxController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const { checkLogin } = require("../middleWares/common/checkLogIn");
const attachmentUpload = require("../middleWares/inbox/attachmentUpload");

const router = express.Router();

// inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// search user for conversation
router.post("/search", checkLogin, searchUser);

// add conversation
router.post("/conversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// delete conversation and related messages
router.delete("/:conversationId", checkLogin, deleteConversation);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
