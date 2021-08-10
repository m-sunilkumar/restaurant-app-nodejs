const MONGO_DUPLICATE_ENTITY_ERROR = 11000;

const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;

  if (err.statusCode === 301) {
    return res.status(301).redirect("/not-found");
  }
  if (err.name === "ValidationError")
    return (err = handleValidationError(err, res));
  if (err.code && err.code == MONGO_DUPLICATE_ENTITY_ERROR) {
    return (err = handleDuplicateKeyError(err, res));
  }

  return res
    .status(err.statusCode)
    .json({ message: "failed", error: err.toString() });
};

//Hnadle duplicate key error
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  res.status(code).send({ message: error, fields: field });
};

//handle validation error of different fields
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  if (errors.length > 1) {
    const formattedErrors = errors.join(" ");
    res.status(code).send({ message: formattedErrors, fields: fields });
  } else {
    res.status(code).send({ message: errors, fields: fields });
  }
};
module.exports = {
  errorHandler,
};
