const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const dbConnect = require("./dbConnect");

module.exports = async (req, res, next) => {
  const client = await dbConnect.run();

  try {
    const [_, id, token] = req.headers.authorization.split(" ");

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const { account_id } = decodedToken;

    if (id !== account_id) {
      return res.status(401).json({
        message: `Authorization failed!.`,
      });
    }

    if (!ObjectId.isValid(id)) {
      throw new Error("invalid account id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .findOne({ _id: ObjectId(id) });

    if (result) {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `Authorization failed!.`,
    });
  }
};
