import * as request from "request";
import * as cheerio from "cheerio";
import * as iconv from "iconv-lite";
import * as fs from "fs";
import * as schedule from "node-schedule";
import * as mongoose from "mongoose";
import * as stock from "./model/Stock";

var url = "https://tw.stock.yahoo.com/q/q?s=0050";
var newData: any[] = [];
var nowTime = new Date();

//var n = nowTime.getFullYear()+'-'+nowTime.getMonth()+'-'+nowTime.getDate();

var catchData = () => {
  // 取得網頁資料
  request(
    {
      url,
      encoding: null //禁止使用預設編碼
    },
    (err, res, body) => {
      if (!err) {
        let str = iconv.decode(body, "big5");
        var $ = cheerio.load(str);
        var mydata: any[] = [];

        $("tbody", "tr").each((i, elem) => {
          mydata.push(
            $(this)
              .text()
              .split("\n")
          );
        });
        //判斷json檔案內是否為空決定m的起始值
        var jsonFile = fs.readFileSync(__dirname + "/ETF0050.json", "utf8");
        var words = JSON.parse(jsonFile);
        if (words.length === 0) {
          m = 1;
        } else {
          m = words.length + 1;
        }
        newData.push({
          id: m,
          資料時間: mydata[1][23].trim(), //trim()去除字串中的空白
          股票代號: mydata[2][17].trim(),
          時間: mydata[2][18].trim(),
          成交: mydata[2][19].trim(),
          買進: mydata[2][20].trim(),
          賣出: mydata[2][21].trim(),
          漲跌: mydata[2][22].trim(),
          張數: mydata[2][23].trim(),
          昨收: mydata[2][24].trim(),
          開盤: mydata[2][25].trim(),
          最高: mydata[2][26].trim(),
          最低: mydata[2][27].trim()
        });
        m++;

        fs.writeFileSync(
          __dirname + "/ETF0050.json",
          JSON.stringify(newData, null, 2)
        );

        let singleStock = new stock({
          stockIndex: mydata[2][17].trim(),
          endedValue: mydata[2][24].trim(),
          totalTransNum: mydata[2][23].trim()
        });

        singleStock.save(err => {
          if (err) return console.error("ERROR");
        });
      } else {
        console.log("錯誤：" + err);
      }
    }
  );

  //將爬到的資料return到json-server
  module.exports = () => {
    const data = { ETF0050: [] };
    data.ETF0050.push(newData);
    return data;
  };
};

// catchData();
// setInterval(catchData,60*60*1000);//60分鐘撈一次資料
//setInterval(catchData,10000);//10sec撈一次資料

schedule.scheduleJob("0 10 9-15 1-31 1-12 1-5", function() {
  catchData();
});
