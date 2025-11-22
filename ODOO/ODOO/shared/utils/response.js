/**
 * Standard API Response Formatter
 * All services should use this for consistent response format
 */

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    ...(data && { data })
  };
  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

const sendError = (res, message, statusCode = 400, data = null) => {
  return sendResponse(res, statusCode, false, message, data);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError
};

