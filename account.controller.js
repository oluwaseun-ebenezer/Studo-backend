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

    const existing_account = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .findOne({ email });

    if (existing_account) {
      return res.status(400).json({
        message: `${req.body.email} account already exist`,
      });
    }

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

    return res.status(200).json({
      message: `Account updated successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Account updated failed`,
    });
  } finally {
    await client.close();
  }
};

exports.retrieve = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      throw new Error("invalid account id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .findOne({ _id: ObjectId(id) }, { projection: { password: 0, _id: 0 } });

    return res.status(200).json(result);
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Account fetch failed`,
    });
  } finally {
    await client.close();
  }
};

exports.login = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const { email, password } = req.body;

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      throw new Error("Email regex failed!");
    }

    hash = await bcrypt.hash(password, 10);

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.ACCOUNT_COLLECTION)
      .findOne({ email }, { projection: { _id: 1, password: 1 } });

    bcrypt.compare(password, result.password).then((valid) => {
      if (!valid) {
        return res.status(400).json({ message: "Wrong Credentials!" });
      } else {
        const token = jwt.sign({ email, id: result._id }, process.env.JWT_KEY, {
          expiresIn: 86400,
        });

        return res.status(200).json({
          email,
          id: result._id,
          token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `Authentication failed`,
    });
  } finally {
    await client.close();
  }
};
