const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const dbConnect = require("./helper/dbConnect");

exports.create = async (req, res) => {
  const client = await dbConnect.run();

  try {
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
      id: result.insertedId,
      message: `${req.body.email} account created successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `${req.body.email} account creation failed`,
    });
  } finally {
    await client.close();
  }
};

exports.update = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const { id, first_name, last_name, department, faculty, level } = req.body;

    if (!ObjectId.isValid(id)) {
      throw new Error("invalid account id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            first_name,
            last_name,
            department,
            faculty,
            level,
          },
        }
      );

    return res.status(201).json({
      message: `${req.body.email} account updated successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `${req.body.email} account updated failed`,
    });
  } finally {
    await client.close();
  }
};
