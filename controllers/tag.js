const { ObjectId } = require("mongodb");

const dbConnect = require("../middlewares/dbConnect");

exports.create = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");

    const { title, color_code } = req.body;

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TAG_COLLECTION)
      .insertOne({
        account_id: ObjectId(account_id),
        title,
        color_code,
        created_at: new Date(),
        updated_at: new Date(),
      });

    return res.status(201).json({
      id: result.insertedId,
      message: `Tag created successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Tag creation failed`,
    });
  } finally {
    await client.close();
  }
};

exports.update = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");

    const { tag_id, title, color_code } = req.body;

    if (!ObjectId.isValid(tag_id)) {
      throw new Error("invalid Tag id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TAG_COLLECTION)
      .updateOne(
        { _id: ObjectId(tag_id), account_id: ObjectId(account_id) },
        {
          $set: { title, color_code, updated_at: new Date() },
        }
      );
    console.log(result.matchedCount, result.modifiedCount);
    return res.status(200).json({
      message: `${result.modifiedCount} Tag updated successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Tag update failed`,
    });
  } finally {
    await client.close();
  }
};

exports.retrieveAll = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TAG_COLLECTION)
      .find({ account_id: ObjectId(account_id) })
      .toArray();

    return res.status(200).json(result);
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Tag fetch failed`,
    });
  } finally {
    await client.close();
  }
};

exports.remove = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");
    const { tag_id } = req.body;

    if (!ObjectId.isValid(tag_id)) {
      throw new Error("invalid Tag id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TAG_COLLECTION)
      .deleteOne({ _id: ObjectId(tag_id), account_id: ObjectId(account_id) });

    return res.status(200).json({
      message: `${result.deletedCount} Tag deleted successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Tag deletion failed`,
    });
  } finally {
    await client.close();
  }
};
