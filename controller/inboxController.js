// external imports
const createError = require("http-errors");
const mongoose = require("mongoose");
// internal imports
const User = require("../models/People");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");

// get inbox page
async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
}

// search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const currentUserId = new mongoose.Types.ObjectId(req.user.userid);

      // Partner ids from indexed distinct queries — bounded by this user's conversation count, not total users
      const [partnerIdsWhenCreator, partnerIdsWhenParticipant] =
        await Promise.all([
          Conversation.distinct("participant.id", { "creator.id": currentUserId }),
          Conversation.distinct("creator.id", { "participant.id": currentUserId }),
        ]);

      const excludeIds = [
        currentUserId,
        ...partnerIdsWhenCreator,
        ...partnerIdsWhenParticipant,
      ];

      const users = await User.find(
        {
          _id: { $nin: excludeIds },
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar",
      );

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    const participantId = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({
        errors: {
          common: {
            msg: "Invalid participant id",
          },
        },
      });
    }

    const me = new mongoose.Types.ObjectId(req.user.userid);
    const them = new mongoose.Types.ObjectId(participantId);

    const existing = await Conversation.findOne({
      $or: [
        { "creator.id": me, "participant.id": them },
        { "creator.id": them, "participant.id": me },
      ],
    })
      .select("_id")
      .lean();

    if (existing) {
      return res.status(409).json({
        errors: {
          common: {
            msg: "A conversation with this user already exists",
          },
        },
      });
    }

    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();

    const conversationPayload = {
      _id: result._id,
      creator: result.creator,
      participant: result.participant,
      last_updated: result.last_updated,
    };

    global.io
      .to(String(req.user.userid))
      .to(String(participantId))
      .emit("new_conversation", { conversation: conversationPayload });

    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// get messages of a conversation
async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const conversation = await Conversation.findById(
      req.params.conversation_id,
    );

    if (!conversation) {
      return res.status(404).json({
        errors: {
          common: {
            msg: "Conversation not found",
          },
        },
      });
    }

    const userId = String(req.user.userid);
    const isCreator = String(conversation.creator.id) === userId;
    const isParticipant = String(conversation.participant.id) === userId;

    if (!isCreator && !isParticipant) {
      return res.status(403).json({
        errors: {
          common: {
            msg: "You are not part of this conversation",
          },
        },
      });
    }

    const partner = isCreator ? conversation.participant : conversation.creator;

    res.status(200).json({
      data: {
        messages: messages,
        participant: partner,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

// send new message
async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      const senderId = String(req.user.userid);
      const receiverId = String(req.body.receiverId);

      global.io.to(senderId).to(receiverId).emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}

// delete conversation and its messages
async function deleteConversation(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        errors: {
          common: {
            msg: "Invalid conversation id",
          },
        },
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        errors: {
          common: {
            msg: "Conversation not found",
          },
        },
      });
    }

    const userId = String(req.user.userid);
    const isCreator = String(conversation.creator?.id ?? "") === userId;
    const isParticipant =
      String(conversation.participant?.id ?? "") === userId;

    if (!isCreator && !isParticipant) {
      return res.status(403).json({
        errors: {
          common: {
            msg: "You are not allowed to delete this conversation",
          },
        },
      });
    }

    await Message.deleteMany({ conversation_id: conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({
      message: "Conversation deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message || "Unknown error occurred!",
        },
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
};
