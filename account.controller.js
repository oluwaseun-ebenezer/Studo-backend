const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbConnect = require("./helper/dbConnect");

exports.create = async (req, res) => {
  try {
    const client = await dbConnect.run();

    const {
      first_name,
      last_name,
      email,
      department,
      faculty,
      level,
      password,
    } = req.body;

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      throw new Error("Email regex failed!");
    }

    hash = await bcrypt.hash(password, 10);

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .insertOne({
        first_name,
        last_name,
        email,
        department,
        faculty,
        level,
        password: hash,
      });

    return res.status(201).json({
      message: `${req.body.email} account created successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 0,
      message: `${req.body.email} account creation failed`,
    });
  } finally {
    await client.close();
  }
};
