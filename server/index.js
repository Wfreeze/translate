const express = require("express");
const fs = require("fs");
const xlsx = require("xlsx");
const multer = require("multer");
const cors = require("cors");
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
// 处理 POST 请求，并处理上传的文件
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const file = req.file; // 假设上传的文件字段名为 "file"
  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0]; // 假设只有一个工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表数据转换为 JSON 格式
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // 在这里可以对解析的表格数据进行处理
    console.log(jsonData)
    global.excleData = jsonData;
    res.status(200).send("File uploaded and parsed successfully.");
  } catch (err) {
    res.status(500).send("Error while parsing the file.");
  }
});

// 创建存储器
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 假设该目录已存在
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// 创建 multer 实例并配置
const jsonUpload = multer({ storage });
app.post("/uploadJson", jsonUpload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const file = req.file; // 假设上传的文件字段名为 "file"

  fs.readFile(file.path, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error while handling the file.");
      return;
    }

    try {
      // 解析 JSON 数据
      const jsonData = JSON.parse(data);
      res.status(200).send("File uploaded successfully.");
      // 在这里可以对解析得到的 JSON 数据进行处理
      global.jsonData = jsonData;
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while handling the file.");
    }
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log("Server started on port 3000");
  global.jsonData = {};
  global.excleData = [];
});
app.get("/downLoad", (req, res) => {
  if (req.query.type === "json") {
    const index = req.query.lang === "ru_RU" ? 2 : 1;
    const obj = { ...(global.jsonData || {}) };
    excleData?.forEach((ele) => {
      const key = ele[0],
        value = ele[index];
        // obj[key] = value;
      // 翻译改版需重新替换
      if (value && obj[key]) {
        obj[key] = value;
      }
    });

    // 设置响应头，告诉浏览器这是一个 JSON 文件
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=example.json");

    const fileName = "demo.json";
    // 将buffer数据写入到文件中
    fs.writeFileSync(fileName, JSON.stringify(obj, null, 4));
    // 返回下载链接
    res.download(fileName);
  } else {
    // 添加一个工作表
    // 创建excel文档对象
    const workbook = xlsx.utils.book_new();
    // 创建sheet名称
    const sheetName = "Sheet1";
    const data = [["中文", "英文", "俄文"]];
    excleData.forEach((ele) => {
      if (ele[0] && !global.jsonData[ele[0]]) {
        data.push(ele);
      }
    });
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    // 将workbook转换为buffer数据
    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");
    res.send(buffer);
    // 设置文件名
    // const fileName = "demo.xlsx";
    // // 将buffer数据写入到文件中
    // fs.writeFileSync(fileName, buffer, { flag: "w", encoding: "utf-8" });
    // // 返回下载链接
    // res.download(fileName);
  }
});
// 处理 POST 请求，并处理上传的文件
app.post("/uploadCurrentTranslator", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const file = req.file; // 假设上传的文件字段名为 "file"
  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0]; // 假设只有一个工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表数据转换为 JSON 格式
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // 现有翻译资源表格
    global.CurrentExcleData = jsonData;
    res.status(200).send("File uploaded and parsed successfully.");
  } catch (err) {
    res.status(500).send("Error while parsing the file.");
  }
});
app.post("/uploadPrefTranslator", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const file = req.file; // 假设上传的文件字段名为 "file"
  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0]; // 假设只有一个工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表数据转换为 JSON 格式
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // 优化后翻译资源表格
    global.PrefExcleData = jsonData;
    res.status(200).send("File uploaded and parsed successfully.");
  } catch (err) {
    res.status(500).send("Error while parsing the file.");
  }
});
app.get("/downLoadPrefExcle", (req, res) => {
    // 添加一个工作表
    // 创建excel文档对象
    const workbook = xlsx.utils.book_new();
    const index = req.query.lang === "ru_RU" ? 3 : 2;
    const prefExcleData =  global.PrefExcleData
    const CurrentExcleData =  global.CurrentExcleData
    const sheetName = "Sheet1";
    const data = [['key',"中文", "英文", "俄文"]];
    CurrentExcleData.forEach((ele) => {
      const item = prefExcleData?.find(item=>item[1] === ele[1])
      const newELe = [...ele]
      if (ele[1] && item?.[index]) {
            newELe[index] = item[index]
        }
        data.push(newELe);
    });
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    // 将workbook转换为buffer数据
    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");
    res.send(buffer);
    // 设置文件名
    // const fileName = "demo.xlsx";
    // // 将buffer数据写入到文件中
    // fs.writeFileSync(fileName, buffer, { flag: "w", encoding: "utf-8" });
    // // 返回下载链接
    // res.download(fileName);
});