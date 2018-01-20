import * as mongoose from "mongoose";

let schemaStock = new mongoose.Schema({
  stockIndex: String,
  endedValue: Number,
  totalTransNum: Number
});

var connection = mongoose.createConnection(
  "mongodb://root:root@ds151207.mlab.com:51207/stock-crawler"
);
const Stock = connection.model("Stock", schemaStock);
export default Stock;
