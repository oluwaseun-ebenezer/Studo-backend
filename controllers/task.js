const { ObjectId } = require("mongodb");

const dbConnect = require("../middlewares/dbConnect");

exports.create = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");

    const {
      title,
      description,
      priority,
      tags,
      schedule,
      reminder,
      tracker,
      on_screen,
      time_frame,
    } = req.body;

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TASK_COLLECTION)
      .insertOne({
        account_id: ObjectId(account_id),
        title,
        description,
        priority,
        tags,
        schedule,
        reminder,
        tracker,
        on_screen,
        time_frame,
        created_at: new Date(),
        updated_at: new Date(),
      });

    return res.status(201).json({
      id: result.insertedId,
      message: `Task created successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Task creation failed`,
    });
  } finally {
    await client.close();
  }
};

exports.update = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");

    const {
      task_id,
      title,
      description,
      priority,
      tags,
      schedule,
      reminder,
      tracker,
      on_screen,
      time_frame,
    } = req.body;

    if (!ObjectId.isValid(task_id)) {
      throw new Error("invalid Task id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TASK_COLLECTION)
      .updateOne(
        { _id: ObjectId(task_id), account_id: ObjectId(account_id) },
        {
          $set: {
            title,
            description,
            priority,
            tags,
            schedule,
            reminder,
            on_screen,
            time_frame,
            updated_at: new Date(),
          },
          $inc: {
            tracker: tracker,
          },
        }
      );
    console.log(result.matchedCount, result.modifiedCount);
    return res.status(200).json({
      message: `${result.modifiedCount} Task updated successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Task update failed`,
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
      .collection(process.env.TASK_COLLECTION)
      .find({ account_id: ObjectId(account_id) })
      .toArray();

    return res.status(200).json(result);
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Task fetch failed`,
    });
  } finally {
    await client.close();
  }
};

exports.retrieve = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new Error("invalid task id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TASK_COLLECTION)
      .findOne({ _id: ObjectId(id), account_id: ObjectId(account_id) });

    if (result == null) {
      return res.status(404).json();
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `Task fetch failed`,
    });
  } finally {
    await client.close();
  }
};

exports.remove = async (req, res) => {
  const client = await dbConnect.run();

  try {
    const [_, account_id, ...rest] = req.headers.authorization.split(" ");
    const { task_id } = req.body;

    if (!ObjectId.isValid(task_id)) {
      throw new Error("invalid Task id!");
    }

    const result = await client
      .db(process.env.DATABASE)
      .collection(process.env.TASK_COLLECTION)
      .deleteOne({ _id: ObjectId(task_id), account_id: ObjectId(account_id) });

    return res.status(200).json({
      message: `${result.deletedCount} Task deleted successfully.`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: `Task deletion failed`,
    });
  } finally {
    await client.close();
  }
};
