const validator = require("validator");

const validateUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !validator.isLength(name, { min: 1 })) {
    return res.status(400).send({ message: "Name is required" });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).send({ message: "Invalid email address" });
  }

  if (!password || !validator.isLength(password, { min: 8 })) {
    return res.status(400).send({ message: "Invalid password" });
  }

  next();
};

module.exports = validateUser;
