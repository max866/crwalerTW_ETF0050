/* 
npm install request --save
npm install cheerio --save
npm install icon-lite --save
執行方法為 json-server app.js
自動產出ETF0050.json檔
http://localhost:3000 可以看JSON API
 */

var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs = require('fs');

var url = 'https://tw.stock.yahoo.com/q/q?s=0050';
var newData = [];
var m = 1;

var catchData = function() {
// 取得網頁資料
request({ url , encoding: null //禁止使用預設編碼
}, function (err, res, body){
    if (!err){
        let str = iconv.decode(body, 'big5');
        var $ = cheerio.load(str);
        var mydata = []
        
        $('tbody','tr').each(function(i,elem){
            mydata.push($(this).text().split('\n'));
        });
        newData.push({ 
            "id":m, 
            "資料時間":mydata[1][23].trim(), //trim()去除字串中的空白
            "股票代號":mydata[2][17].trim(), 
            "時間":mydata[2][18].trim(), 
            "成交":mydata[2][19].trim(), 
            "買進":mydata[2][20].trim(), 
            "賣出":mydata[2][21].trim(), 
            "漲跌":mydata[2][22].trim(), 
            "張數":mydata[2][23].trim(), 
            "昨收":mydata[2][24].trim(),                    
            "開盤":mydata[2][25].trim(), 
            "最高":mydata[2][26].trim(), 
            "最低":mydata[2][27].trim() 
   })
   m++;
  
  fs.writeFileSync(__dirname+"/ETF0050.json",JSON.stringify(newData,null,2));
        }   
        else{
            console.log('錯誤：' + err);
            }
    }
);

//將爬到的資料return到json-server
module.exports = () => {
    const data = { ETF0050 : [] }
      data.ETF0050.push(newData)
    return data
  }
}

catchData();
setInterval(catchData,60*60*1000);//60分鐘撈一次資料
//setInterval(catchData,10000);//10sec撈一次資料

