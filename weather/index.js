const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceval = (tempval, real) => {
  let temperature = tempval.replace("{%tempval%}", real.main.temp);
  temperature = temperature.replace("{%tempmin%}", real.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", real.main.temp_max);
  temperature = temperature.replace("{%city%}", real.name);
  temperature = temperature.replace("{%country%}", real.sys.country);
  temperature = temperature.replace("{%tempstatus%}", real.weather[0].main);
  return temperature;
};
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?lat=26.214&lon=81.252&appid=d29b9e25894bb6ed5f1f4e6b2a1e447a"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceval(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(3000, "127.0.0.1");
