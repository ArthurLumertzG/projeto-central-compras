function convertIdMiddleware(req, res, next) {
  if (req.params.id) {
    req.params._id = req.params.id;
  }

  if (req.query.id) {
    req.query._id = req.query.id;
    delete req.query.id;
  }

  if (req.body) {
    convertIdsInObject(req.body);
  }

  next();
}

function convertIdsInObject(obj) {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    obj.forEach((item) => convertIdsInObject(item));
    return;
  }

  Object.keys(obj).forEach((key) => {
    if (key === "id") {
      return;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      convertIdsInObject(obj[key]);
    }
  });
}

module.exports = convertIdMiddleware;
