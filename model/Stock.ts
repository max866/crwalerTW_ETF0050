import * as mongoose from "mongoose";

const connection = mongoose.connect("mongodb://root:root@ds151207.mlab.com:51207/stock-crawler");
let schemaStock = new mongoose.Schema({
  stockIndex: String,
  endedValue: Number,
  totalTransNum: Number,
  date: { type: Date, default: Date.now }
});
const Stock = connection.model("Stock", schemaStock);
export default Stock;
