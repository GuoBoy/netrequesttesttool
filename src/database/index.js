import db from './initdb'

function addRecord (pj, callback) {
  db.pjs.insert(pj, (err, doc) => {
    callback(err, doc)
  })
}

function getRecord (id, callback) {
  if (id !== undefined) {
    db.pjs.findOne({
      id: id
    }, (_, doc) => {
      callback(doc)
    })
  }
  db.pjs.find({}, function (_, doc) {
    callback(doc)
  })
}

function delRecord (id) {
  db.pjs.remove({
    id: id
  }, {}, (err, num) => {
    return {
      err: err,
      num: num
    }
  })
}

function updateRecord (id, pj) {
  db.pjs.update({
    id: id
  }, {
    ...pj
  }, {}, (err, num) => {
    return {
      err: err,
      num: num
    }
  })
}

export {
  addRecord,
  getRecord,
  delRecord,
  updateRecord
}
