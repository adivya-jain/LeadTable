// import React, { useState } from 'react';
// import { Upload, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import * as XLSX from 'xlsx';

// const ExcelFileUpload = () => {
//   const [excelData, setExcelData] = useState(null);

//   const handleUpload = async (info) => {
//     if (info.file.status === 'done') {
//       try {
//         const fileData = await readExcelFile(info.file.originFileObj);
//         setExcelData(fileData);
//         console.log("file uploaded")
//       } catch (error) {
//         message.error('Error reading Excel file.');
//       }
//     } else if (info.file.status === 'error') {
//       message.error('File upload failed.');
//     }
//   };

//   const readExcelFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const binaryString = e.target.result;
//         const workbook = XLSX.read(binaryString, { type: 'binary' });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//         resolve(jsonData);
//       };
//       reader.onerror = (error) => {
//         reject(error);
//       };
//       reader.readAsBinaryString(file);
//     });
//   };

//   return (
//     <div>
//       <Upload
//         accept=".xls,.xlsx"
//         showUploadList={false}
//         customRequest={({ file, onSuccess, onError }) => {
//           // You can customize the file upload request here if needed.
//           // In this example, we're handling it in the handleUpload function.
//           handleUpload({ file, onSuccess, onError });
//         }}
//       >
//         <Button icon={<UploadOutlined />}>Upload Excel File</Button>
//       </Upload>
//       {excelData && (
//         <div>
//           <h2>Excel Data:</h2>
//           <pre>{JSON.stringify(excelData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcelFileUpload;
