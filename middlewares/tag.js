const { ObjectId } = require("mongodb");

exports.tagPayloadValidation = (req, res, next) => {
  const { title, color_code } = req.body;

  //   String validation
  [title, color_code].forEach((item) => {
    if (typeof item !== "string") {
      return res.status(400).json();
    }
  });

  if (color_code.length != 6) {
    return res.status(400).json({ code: "UGLY_COLOR_CODE" });
  }

  next();
};
