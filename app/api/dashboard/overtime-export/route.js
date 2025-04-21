// import ExcelJS from "exceljs";

// export async function GET(req, res) {
//   // Your sample data (use actual data from your database here)
//   const data = [
//     {
//       username: "Admin",
//       department: null,
//       creation_timestamp: "2025-04-20T15:18:46.872Z",
//       type: "Public Holiday",
//       status: "pending",
//       start_time: "2025-04-20T23:00:00.000Z",
//       end_time: "2025-04-21T03:00:00.000Z",
//       approver_username: null,
//     },
//     {
//       username: "Admin",
//       department: null,
//       creation_timestamp: "2025-01-07T11:20:20.060Z",
//       type: "Regular",
//       status: "confirmed",
//       start_time: "2025-01-04T01:21:00.000Z",
//       end_time: "2025-01-04T05:25:00.000Z",
//       approver_username: null,
//     },
//   ];

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Overtime Export");

//   // Define the columns for the worksheet
//   worksheet.columns = [
//     { header: "Username", key: "username", width: 20 },
//     { header: "Department", key: "department", width: 20 },
//     { header: "Creation Timestamp", key: "creation_timestamp", width: 25 },
//     { header: "Type", key: "type", width: 20 },
//     { header: "Status", key: "status", width: 15 },
//     { header: "Start Time", key: "start_time", width: 25 },
//     { header: "End Time", key: "end_time", width: 25 },
//     { header: "Approver Username", key: "approver_username", width: 20 },
//   ];

//   // Add the data rows to the worksheet
//   data.forEach((item) => worksheet.addRow(item));

//   // Send the file as a response to be downloaded
//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );
//   res.setHeader(
//     "Content-Disposition",
//     'attachment; filename="overtime-export.xlsx"'
//   );

//   await workbook.xlsx.write(res);
//   res.end();
// }
