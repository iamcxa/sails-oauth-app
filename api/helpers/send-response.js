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
      return {
        exit: `${messageArray[messageArray.length - 2]}.${
          messageArray[messageArray.length - 1]
        }`,
        response: messageArray[messageArray.length - 2],
      };
    };

    // reformat message
    payload = {
      data: {},
      payload,
      success: statusCode < 400,
      statusCode,
      action: req.options.action,
      controller: req.options.controller,
      stack: sourceData ? sourceData.stack : payload.stack,
      locale: req.param('locale', req.getLocale()),
      message:
        typeof payload.message === 'string' ? sails.__(payload.message) : payload.message,
      isAuthenticated: req.isAuthenticated || !!req.session.userId || !!req.session.me,

      // for extra identified usage
      exit:
        typeof payload.message === 'string' ?
          getExitFromMessage(payload.message).exit :
          undefined,
      response:
        typeof payload.message === 'string' ?
          getExitFromMessage(payload.message).response :
          undefined,
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
    }

    // runs response callback in order to deal with necessary processes
    if (typeof callback === 'function') {
      // eslint-disable-next-line callback-return
      const result = await callback(req, res, payload);

      // if payload transform into another response, then return it
      if (result && result.socket) {
        return result;
      }
      payload = result;
    }

    // Set status code
    res.status(statusCode);

    // If the user-agent wants JSON, always respond with JSON
    if (req.wantsJSON) {
      delete payload.payload;
      return res.json(payload);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = typeof options === 'string' ? {view: options} : options || {};

    // If a view was provided in options, serve it.
    // Otherwise, try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
      return res.view(options.view, payload.payload);
    }

    // If provide a redirect param, do it by the provided value type.
    if (!req.me && (options.redirect || !req.url.includes('/api'))) {
      return res.redirect(options.redirect || '/login');
    }

    // If no second argument provided, try to serve the default view,
    // but fall back to sending JSON(P) if any errors occur.
    return res.view(statusCode, {data: payload.payload}, (err, html) => {
      // If a view error occurred, fall back to JSON(P).
      if (err) {
        // Additionally:
        // • If the view was missing, ignore the error but provide a verbose log.
        if (err.code === 'E_VIEW_FAILED') {
          sails.log.warn(
            'response :: Could not locate view for error page (sending JSON instead).  Details: ',
            err,
          );
        } else {
          // Otherwise, if this was a more serious error, log to the console with the details.
          sails.log.warn(
            'response :: When attempting to render error page view, an error occurred (sending JSON instead).  Details: ',
            err,
          );
        }
        delete payload.payload;
        return res.json(payload);
      }
      return res.send(html);
    });
  },
};
