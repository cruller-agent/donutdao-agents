const { registerFid } = require('./register-fid');
const { addSigner } = require('./add-signer');
const { postCast } = require('./post-cast');
const { swapEthToUsdc } = require('./swap-to-usdc');
const { autoSetup, checkAllBalances, determineFundingStrategy } = require('./auto-setup');
const { setProfileData, registerFname, setupFullProfile } = require('./set-profile');
const { checkFidSync, checkSignerSync, getCast } = require('./x402');
const {
  saveCredentials,
  loadCredentials,
  listCredentials,
  setActiveAccount,
  updateCredentials,
  getCredentialsPath
} = require('./credentials');
const { postToChannel, getChannel, searchChannels } = require('./post-to-channel');
const { postToGroup, getGroup, getGroupFeed } = require('./group-post');
const { sendDM, sendToConversation } = require('./dm-send');
const { getInbox, getConversation, formatConversation, formatMessage } = require('./dm-read');
const config = require('./config');

module.exports = {
  // Full autonomous setup
  autoSetup,
  checkAllBalances,
  determineFundingStrategy,

  // Core functions
  registerFid,
  addSigner,
  postCast,
  swapEthToUsdc,

  // Profile setup
  setProfileData,
  registerFname,
  setupFullProfile,

  // Channel posting
  postToChannel,
  getChannel,
  searchChannels,

  // Group posting
  postToGroup,
  getGroup,
  getGroupFeed,

  // Direct Messages (Warpcast-specific)
  sendDM,
  sendToConversation,
  getInbox,
  getConversation,
  formatConversation,
  formatMessage,

  // Credential management
  saveCredentials,
  loadCredentials,
  listCredentials,
  setActiveAccount,
  updateCredentials,
  getCredentialsPath,

  // Utilities
  checkFidSync,
  checkSignerSync,
  getCast,

  // Config
  config
};
