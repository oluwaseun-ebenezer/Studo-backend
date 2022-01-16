const { ObjectId } = require("mongodb");
const dbConnect = require("../middlewares/dbConnect");

exports.taskPayloadValidation = (req, res, next) => {
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

  //   String validation
  [title, description].forEach((item) => {
    if (typeof item !== "string") {
      return res.status(400).json();
    }
  });

  //   Number validation
  [priority, reminder, tracker, on_screen, time_frame].forEach((item) => {
    if (typeof item !== "number") {
      return res.status(400).json();
    }
  });

  //   Priority validation
  if (![0, 1, 2].includes(priority)) {
    return res.status(400).json();
  }

  //   On_screen validation
  if (![0, 1].includes(on_screen)) {
    return res.status(400).json();
  }

  //   Schedule & Reminder date validation
  [schedule, reminder].forEach((item) => {
    if (typeof item !== "number") {
      return res.status(400).json();
    }
  });
  req.body.reminder = new Date(reminder);
  req.body.schedule = new Date(schedule);

  //   Object validation
  [tags].forEach((item) => {
    if (typeof item !== "object") {
      return res.status(400).json();
    }
  });

  new_tags = [];
  //   Tags Object validation
  tags.forEach((id) => {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json();
    }
    new_tags.push(ObjectId(id));
  });
  req.body.tags = tags;

  next();
};
