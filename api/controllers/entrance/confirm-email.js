/* eslint-disable no-throw-literal, max-len */

module.exports = {
  /**
   * @swagger
   *
   * /confirm-email:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Entrance
   */

  friendlyName: 'Confirm email',

  description: `Confirm a new user's email address, or an existing user's request for an email address change,
then redirect to either a special landing page (for newly-signed up users), or the account page
(for existing users who just changed their email address).`,

  inputs: {
    token: {
      description: 'The confirmation token from the email.',
      example: '4-32fad81jdaf$329',
    },
  },

  exits: {
    success: {
      description: 'Email address confirmed and requesting user logged in.',
    },

    redirect: {
      description:
        'Email address confirmed and requesting user logged in.  Since this looks like a browser, redirecting...',
      responseType: 'redirect',
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },

    emailAddressNoLongerAvailable: {
      responseType: 'view',
      statusCode: 409,
      viewTemplatePath: '500',
      description: 'The email address is no longer available.',
      // eslint-disable-next-line max-len
      extendedDescription:
        'This is an edge case that is not always anticipated by websites and APIs.  Since it is pretty rare, the 500 server error page is used as a simple catch-all.  If this becomes important in the future, this could easily be expanded into a custom error page or resolution flow.  But for context: this behavior of showing the 500 server error page mimics how popular apps like Slack behave under the same circumstances.',
      output: {
        message: 'test',
      },
    },
  },

  fn: async function({token}, exits) {
    const {res, req} = this;
    // If no token was provided, this is automatically invalid.
    if (!token) {
      throw 'invalidOrExpiredToken';
    }

    // Get the user with the matching email token.
    const user = await User.findOne({
      where: {emailProofToken: token},
    });

    // If no such user exists, or their token is expired, bail.
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      // console.log('invalidOrExpiredToken!!!')
      // console.log('Date.now()=>', Date.now())
      throw 'invalidOrExpiredToken';
    }

    if (user.emailStatus === 'unconfirmed') {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦╦═╗╔═╗╔╦╗ ╔╦╗╦╔╦╗╔═╗  ╦ ╦╔═╗╔═╗╦═╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ╠╣ ║╠╦╝╚═╗ ║───║ ║║║║║╣   ║ ║╚═╗║╣ ╠╦╝  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚  ╩╩╚═╚═╝ ╩   ╩ ╩╩ ╩╚═╝  ╚═╝╚═╝╚═╝╩╚═  └─┘┴ ┴┴ ┴┴┴─┘
      // If this is a new user confirming their email for the first time,
      // then just update the state of their user record in the database,
      // store their user id in the session (just in case they aren't logged
      // in already), and then redirect them to the "email confirmed" page.
      await sails.services.user.changeEmailStatusToConfirmed({id: user.id});
      this.req.session.userId = user.id;

      // In case there was an existing session, broadcast a message that we can
      // display in other open tabs.
      if (sails.hooks.sockets) {
        await sails.helpers.broadcastSessionChange(this.req);
      }

      if (this.req.wantsJSON) {
        return;
      }

      return req.logIn(user, (err) =>
        res.loggedIn(err, user, null, null, () => {
          return res.redirect(sails.config.paths.emailConfirmation);
        }),
      );
    } else if (user.emailStatus === 'change-requested') {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦ ╦╔═╗╔╗╔╔═╗╔═╗╔╦╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ║  ╠═╣╠═╣║║║║ ╦║╣  ║║  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚═╝╩ ╩╩ ╩╝╚╝╚═╝╚═╝═╩╝  └─┘┴ ┴┴ ┴┴┴─┘
      if (!user.emailChangeCandidate) {
        // eslint-disable-next-line max-len
        throw new Error(
          `Consistency violation: Could not update Stripe customer because this user record's emailChangeCandidate ("${user.emailChangeCandidate}") is missing.  (This should never happen.)`,
        );
      }

      // Last line of defense: since email change candidates are not protected
      // by a uniqueness constraint in the database, it's important that we make
      // sure no one else managed to grab this email in the mean time since we
      // last checked its availability. (This is a relatively rare edge case--
      // see exit description.)
      if (
        (await User.count({where: {emailAddress: user.emailChangeCandidate}})) > 0
      ) {
        // reset user's email status to 'confirmed' because the derived address have been taken.
        // so next time if user click the link, will not see the same error again
        // (instead, will show the link has expired message).
        await sails.services.user.changeEmailStatusToConfirmed({id: user.id});

        // response with the error mesage.
        return exits.emailAddressNoLongerAvailable({
          message: `The email address you chosen to change(${user.emailChangeCandidate}), has been taken recently.`,
        });
      }

      // Finally update the user in the database, store their id in the session
      // (just in case they aren't logged in already), then redirect them to
      // their "my account" page so they can see their updated email address.
      await User.update(
        {
          emailStatus: 'confirmed',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailAddress: user.emailChangeCandidate,
          emailChangeCandidate: '',
        },
        {where: {id: user.id}},
      );
      this.req.session.userId = user.id;

      // In case there was an existing session, broadcast a message that we can
      // display in other open tabs.
      if (sails.hooks.sockets) {
        await sails.helpers.broadcastSessionChange(this.req);
      }

      if (this.req.wantsJSON) {
        return;
      }
      throw {redirect: '/account'};
    } else {
      // eslint-disable-next-line max-len
      throw new Error(
        `Consistency violation: User ${user.id} has an email proof token, but somehow also has an emailStatus of "${user.emailStatus}"!  (This should never happen.)`,
      );
    }
  },
};
