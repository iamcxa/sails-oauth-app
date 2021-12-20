module.exports = {
  includeRole: () => {
    return {
      include: [
        {
          model: sails.models.role,
        },
      ],
    };
  },
};
