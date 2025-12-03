function transformDocument(doc) {
  if (!doc) return null;

  if (Array.isArray(doc)) {
    return doc.map((item) => transformDocument(item));
  }

  const obj = doc.toObject ? doc.toObject() : doc;

  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }

  delete obj.__v;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (!value) return;

    if (typeof value === "object") {
      if (value.$numberDecimal) {
        obj[key] = parseFloat(value.$numberDecimal);
      } else if (value.constructor && value.constructor.name === "ObjectId") {
        obj[key] = value.toString();
      } else if (value._id || Array.isArray(value)) {
        obj[key] = transformDocument(value);
      }
    }
  });

  return obj;
}

module.exports = transformDocument;
