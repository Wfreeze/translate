import { useRef, useState } from "react";
import { Row, Col, Upload, Button, Select } from "antd";
import axios from "axios";
function App() {
  const [file, setFile] = useState();
  const [lang, setLang] = useState("en_US");
  const [jsonFile, setJsonFile] = useState();

  const ref = useRef(null);
  const onUploadChange = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:3000/upload", formData);
  };
  const onJsonUploadChange = async () => {
    const formData = new FormData();
    formData.append("file", jsonFile);
    await axios.post("http://localhost:3000/uploadJson", formData);
  };
  const exportFile = async (params) => {
    const res = await axios.get("http://localhost:3000/downLoad", { params });
    if (res.data) {
    }
  };
  const onUploadCurrent = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:3000/uploadCurrentTranslator", formData);
  };
  const onUploadPref = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:3000/uploadPrefTranslator", formData);
  };
  const exportprefFile = async (params) => {
    const res = await axios.get("http://localhost:3000/downLoadPrefExcle", { params });
    if (res.data) {
    }
  };
  return (
    <Row ref={ref.current}>
      <Col
        span={24}
        style={{
          height: 50,
          lineHeight: "50px",
          textAlign: "center",
          fontSize: 24,
          fontWeight: "bolder",
        }}
      >
        常规导出
      </Col>
      <Col span={10} offset={2}>
        <Upload
          beforeUpload={(_file) => {
            setFile(_file);
            return false;
          }}
          accept=".xlsx"
          showUploadList={false}
          multiple={false}
          onChange={onUploadChange}
        >
          <Button type="primary">导入表格</Button>
        </Upload>
      </Col>
      <Col span={10} offset={2}>
        <Upload
          beforeUpload={(_file) => {
            setJsonFile(_file);
            return false;
          }}
          accept=".json"
          showUploadList={false}
          multiple={false}
          onChange={onJsonUploadChange}
        >
          <Button type="primary">导入JSON</Button>
        </Upload>
      </Col>
      <Col span={8}>
        <Button type="primary" onClick={() => exportFile({})}>
          导出表格
        </Button>
      </Col>
      <Col span={8}>
        <Select value={lang} onChange={(value) => setLang(value)}>
          <Select.Option value={"en_US"}>导出英文JSON</Select.Option>
          <Select.Option value={"ru_RU"}>导出俄文JSON</Select.Option>
        </Select>
      </Col>
      <Col span={8}>
        <Button
          type="primary"
          onClick={() => exportFile({ type: "json", lang: lang })}
        >
          导出JSON
        </Button>
      </Col>
        <Col     span={24}
        style={{
          height: 50,
          lineHeight: "50px",
          textAlign: "center",
          fontSize: 32,
          fontWeight: "bolder",
        }}>合并翻译</Col>
        <Col span={4}>
        <Upload
          beforeUpload={(_file) => {
            setFile(_file);
            return false;
          }}
          accept=".xlsx"
          showUploadList={false}
          multiple={false}
          onChange={onUploadCurrent}
        >
          <Button type="primary">导入现有翻译表格</Button>
        </Upload>
        </Col>
      <Col span={4}>
      <Upload
          beforeUpload={(_file) => {
            setFile(_file);
            return false;
          }}
          accept=".xlsx"
          showUploadList={false}
          multiple={false}
          onChange={onUploadPref}
        >
          <Button type="primary">导入优化翻译表格</Button>
        </Upload>
        </Col>
        <Col span={4}><Button
          type="primary"
          onClick={() => exportprefFile({  lang: lang })}
        >
          导出合并后表格
        </Button>
        </Col>
    </Row>
  );
}

export default App;
