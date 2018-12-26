const { shell } = require("electron");
var fs = require("fs");
var path = require("path");

export const resolvePath = (assetPath, p) => {
  return path.resolve(assetPath, p);
};

export const loadDatabase = (db, filename, onLoadStatus) => {
  /*
  db.find({}, function(err, docs) {
    onLoadStatus({ status: "complete", qty: docs.length });
  });
  */
};

export default {
  resolvePath,
  loadDatabase
};
