import Datastore from 'nedb'
import path from 'path'

const db = {}
const config = {
  autoload: true,
  timestampData: true
}
db.pjs = new Datastore({
  ...config,
  filename: process.env.NODE_ENV === 'development' ? path.join(__static, 'projects.dll') : '../../static/projects.dll'
})

export default db
