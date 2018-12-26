// const { shell } = require("electron");
// var fs = require("fs");
// var path = require("path");

export const resolvePath = (assetPath, p) => {
  return [assetPath, p].join("/");
};

export const thumbPath = (thumbPath, id) => {
  thumbPath = thumbPath.replace(/\/\//g, "/");
  return [
    "http://widged.com/labs/asset-explorer/js-libs/thumbs/",
    id,
    ".jpg"
  ].join("");
};

export const openItem = pth => {
  // return shell.openItem(pth);
};

export const fileExists = raw => {
  return true;
};

export const pathAndUp = src => {
  return src;
};

export const openExternal = url => {
  console.log("[openExternal]", url);
  window.open(url);
};

export const fetchConfig = () => {
  const { tags, terms, others } = location.search
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc, d) => {
      const [k, v] = d.split("=");
      acc[k] = decodeURIComponent(v).split(",");
      return acc;
    }, {});

  return {
    tagsToFilter: tags || [],
    termsToFilter: terms || [],
    othersToFilter: others || []
  };
};

function fetchTextLines(file, onLines) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const allText = rawFile.responseText;
        const lines = allText.split(/[\n\r]+/);
        onLines(lines);
      }
    }
  };
  rawFile.send(null);
}

function importLines(lines, nedb, onProgress, onComplete) {
  const batches = lines.reduce(
    (acc, line, i) => {
      let last = acc[acc.length - 1];
      last.push(line);
      if (i % 500 === 0) {
        acc.push([]);
      }
      return acc;
    },
    [[]]
  );
  let insertCount = 0;
  const nextBatch = () => {
    if (!batches.length) {
      return onComplete(insertCount);
    }
    const batch = batches.shift();
    let pending = batch.length;
    batch.forEach((line, i) => {
      if (!(typeof line === "string") || !line.match('"_id"')) {
        // console.log(line);
        return;
      }
      const json = JSON.parse(line);
      nedb.find({ _id: json._id }, function(err, docs) {
        if (docs.length === 0) {
          nedb.insert(json, err => {
            insertCount++;
            if (insertCount % 100 === 0) {
              onProgress(insertCount);
            }
          });
        }
      });
      pending--;
      if (pending === 0) {
        nextBatch();
      }
    });
  };
  nextBatch();

  /*

    */
  // alert(allText);
}

export const loadDatabase = (db, filename, onLoadStatus) => {
  // if environment is browser
  fetchTextLines(filename, lines => {
    db.find({}, function(err, docs) {
      if (!docs || docs.length < lines.length - 100) {
        onLoadStatus({ status: "importing" });
        importLines(
          lines,
          db,
          insertCount => {
            onLoadStatus({
              status: "imported",
              qty: insertCount + "/" + lines.length
            });
          },
          qty => {
            onLoadStatus({
              status: "complete",
              qty
            });
          }
        );
      } else {
        onLoadStatus({ status: "complete", qty: docs.length });
      }
    });
  });
};

export default {
  resolvePath,
  thumbPath,
  openItem,
  fileExists,
  pathAndUp,
  openExternal,
  fetchConfig
};
