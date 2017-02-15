'use strict';


const commonUtil = require('./commonUtil');


var logger = commonUtil.logger;

module.exports.sendJsonRes = sendJsonRes;
module.exports.sendErrorRes = sendErrorRes;
module.exports.logHttp = logHttp;
module.exports.allowOrgin = allowOrgin;


/**
 * response 200 with json
 * 
 * @param res: http response
 * @param code: http code, machine readable number
 * @param message: http message, human readable string
 * @param result: json result
 */
function sendJsonRes(res, code, message, result) {
  return res.json({
    code: code,
    message: message,
    res: result
  });

}

/**
 * response error
 * 
 * @param res: http response
 * @param code: http code, machine readable number
 * @param message: http message, human readable string
 */
function sendErrorRes(res, code, message) {
  return res.status(code).send({
    code: code,
    message: message
  });
}

/**
 * middleware: log http request and response
 *
 * @param req: http resquest
 * @param res: http response
 * @param next: http next operation
 */
function logHttp(req, res, next) {
  var oldWrite = res.write,
      oldEnd = res.end;

  var chunks = [];

  res.write = function(chunk) {
    chunks.push(chunk.toString('utf8'));
    oldWrite.apply(res, arguments);
  };

  res.end = function(chunk) {
    if (chunk)
      chunks.push(chunk.toString('utf8'));

    var body = chunks.join('');
    logger.debug("request: %s", req.baseUrl + req.path);
    logger.debug("  request method: %s", req.method);
    if(req.body !== null && typeof req.body === 'object') {
      logger.debug("  request body: %j", req.body);
    }
    else {
      logger.debug("  request body: %s", req.body);
    }
    logger.debug("  response body: %s", body);

    oldEnd.apply(res, arguments);
  };

  next();
}

/**
 * middleware: allow cross origin
 *
 * @param req: http resquest
 * @param res: http response
 * @param next: http next operation
 */
function allowOrgin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  next();
}
