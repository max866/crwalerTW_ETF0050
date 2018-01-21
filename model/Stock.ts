import * as mongoose from "mongoose";

const connection = mongoose.connect("mongodb://<account>:<password>@<hostname>:<port>/<db-Name>");
let schemaStock = new mongoose.Schema({
  stockIndex: String,
  endedValue: Number,
  totalTransNum: Number,
  date: { type: Date, default: Date.now }
});
const Stock = connection.model("Stock", schemaStock);
export default Stock;
