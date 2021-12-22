module.exports = {
  friendlyName: 'Send Response',

  description: 'Send Unified Response Body and Message',

  sync: false,

  inputs: {
    data: {
      type: 'ref',
      readOnly: true,
      required: false,
    },

    options: {
      type: 'json',
      readOnly: true,
      required: false,
    },

    env: {
      type: 'ref',
      readOnly: true,
      required: true,
    },

    statusCode: {
      type: 'number',
      readOnly: true,
      required: true,
    },

    callback: {
      type: 'ref',
      readOnly: true,
    },
  },

  fn: async function({
    data: sourceData,
    options: sourceOptions,
    env,
    statusCode,
    callback,
  }) {
    // Get access to `req`, `res`, & `sails`
    const {req, res} = env;
    const sails = req._sails;
    let payload = sourceData;
    let options = sourceOptions;

    // get data format
    if (!payload) {
      payload = {
        message: '',
      };
    } else if (_.isString(payload)) {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        sails.log.verbose('JSON parse error=>', e);
        payload = {
          message: payload,
        };
      }
    } else if (_.isObject(payload)) {
      payload = {
        ...payload,
      };
    }

    const getExitFromMessage = (message) => {
      const messageArray = message.split('.');
      if (message.length > 2) {
        return {
          exit: `${messageArray[messageArray.length - 2]}.${
            messageArray[messageArray.length - 1]
          }`,
          response: messageArray[messageArray.length - 2],
        };
      }
      return {
        exit: undefined,
        response: undefined,
      };
    };

    // reformat message
    payload = {
      data: payload.data || {},
      payload,

      // status
      success: statusCode < 400,
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      statusCode,

      // user settings
      locale: req.param('locale', req.getLocale()),
      timezone: req.user ? req.user.timezone : undefined,

      // api information
      action: req.options.action,
      controller: req.options.controller,
      stack: sourceData ? sourceData.stack : payload.stack,

      // for extra identified usage
      response:
        typeof payload.message === 'string' ?
          getExitFromMessage(payload.message).response :
          undefined,
      exit:
        typeof payload.message === 'string' ?
          getExitFromMessage(payload.message).exit :
          undefined,
      message:
        typeof payload.message === 'string' ? sails.__(payload.message) : payload.message,
    };

    if (payload.exit) {
      res.setHeader('X-Exit', payload.exit);
      res.setHeader('X-Exit-Friendly-Name', payload.response);
      res.setHeader('X-Exit-Description', payload.message);
    }

    // delete information if in production mode.
    if (sails.config.environment === 'production') {
      delete payload.stack;
      delete payload.controller;
      delete payload.action;
      delete payload.timezone;
    }

    // runs response callback in order to deal with necessary processes
    if (typeof callback === 'function') {
      let result;
      if (callback.constructor.name === 'AsyncFunction') {
        // eslint-disable-next-line callback-return
        result = await callback(req, res, payload);
      } else {
        // eslint-disable-next-line callback-return
        result = callback(req, res, payload);
      }

      // if payload transform into another response, then return it
      if (result && result.socket) {
        return result;
      }
      payload = result;
    }

    // If the user-agent wants JSON, always respond with JSON
    if (req.wantsJSON) {
      delete payload.payload;
      return res.status(statusCode).json(payload);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = typeof options === 'string' ? {view: options} : options || {};

    // If a view was provided in options, serve it.
    // Otherwise, try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
      return res.status(statusCode).view(options.view, payload.payload);
    }

    // If provide a redirect param, do it by the provided value type.
    if (!req.user && (options.redirect || !req.url.includes('/api'))) {
      return res.redirect(options.redirect || sails.config.paths.login);
    }

    // If no second argument provided, try to serve the default view,
    // but fall back to sending JSON(P) if any errors occur.
    return res.status(statusCode).view(statusCode, payload, (err, html) => {
      // If a view error occurred, fall back to JSON(P).
      if (err) {
        // Additionally:
        // • If the view was missing, ignore the error but provide a verbose log.
        if (err.code === 'E_VIEW_FAILED') {
          sails.log.warn(
            'Response :: Could not locate view for error page (sending JSON instead), ' +
              err.message,
          );
          sails.log.verbose('Details: ', err);
        } else {
          // Otherwise, if this was a more serious error, log to the console with the details.
          sails.log.warn(
            'Response :: When attempting to render error page view, an error occurred (sending JSON instead), ' +
              err.message,
          );
          sails.log.verbose('Details: ', err);
        }
        if (payload && payload.payload) {
          delete payload.payload;
        }
        return res.json(payload);
      }
      return res.send(html);
    });
  },
};
