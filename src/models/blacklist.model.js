const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to added in blacklist"]
    }
}, {
    timestamps: true
})

const tokenBlackListModel = mongoose.model("blackListTokens", blacklistTokenSchema);

module.exports = tokenBlackListModel; 