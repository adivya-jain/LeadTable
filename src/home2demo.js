import React, { useState, useEffect } from "react";
import { read, utils, writeFile } from 'xlsx';
import { Table, Input, Button, Space, Select, Pagination } from 'antd';
// import 'antd/dist/antd.css';
const { Option } = Select;


const HomeComponent = () => {
  const [Leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedLeads, setSortedLeads] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    columnKey: null,
    order: null,
  });
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const pageSize = 10; // Number of items to display per page

  useEffect(() => {
    // Apply the filter when leadStatusFilter changes
    const filteredLeads = Leads.filter((lead) => {
      return !leadStatusFilter || lead.LeadStatus === leadStatusFilter;
    });
    setSortedLeads(filteredLeads);
  }, [leadStatusFilter, Leads]);


  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          setLeads(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };



  const handleSort = (columnKey) => {
    let newOrder = "asc"; // Default sorting order is ascending.

    // If the same column is clicked again, toggle the sorting order.
    if (sortOrder.columnKey === columnKey) {
      newOrder = sortOrder.order === "asc" ? "desc" : "asc";
    }

    // Sort the data based on the selected column and order.
    const sortedData = [...Leads].sort((a, b) => {
      if (newOrder === "asc") {
        return a[columnKey] < b[columnKey] ? -1 : 1;
      } else {
        return a[columnKey] > b[columnKey] ? -1 : 1;
      }
    });

    // Update the state with the new sorted data and sorting order.
    setSortedLeads(sortedData);
    setSortOrder({ columnKey, order: newOrder });
  };




  const handleExport = () => {
    const headings = [
      [
        'CustomerId',
        'CustomerName',
        'Phone',
        'Email',
        'Country',
        'LeadStatus'
      ]
    ];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, Leads, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, 'Lead Report.xlsx');
  };

  const handleChangeFilter = (value) => {
    setLeadStatusFilter(value); // Update the filter value
  };

  // Calculate the visible Leads based on currentPage and pageSize
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const visibleLeads = Leads.slice(start, end);

  const handleLeadStatusChange = (value, record) => {
    // Update the LeadStatus for the specific record
    const updatedLeads = Leads.map((lead) => {
      if (lead.CustomerId === record.CustomerId) {
        return { ...lead, LeadStatus: value };
      }
      return lead;
    });
    setLeads(updatedLeads);
  };


  return (
    <>
      <div className="row mb-2 mt-5">
        <div className="col-sm-6 offset-3">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <div className="custom-file">
                  <input
                    type="file"
                    name="file"
                    className="custom-file-input"
                    id="inputGroupFile"
                    required
                    onChange={handleImport}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                  <label className="custom-file-label" htmlFor="inputGroupFile">
                    Choose file
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <button onClick={handleExport} className="btn btn-primary float-right">
                Export <i className="fa fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 offset-3">
          <Table
            columns={[
              {
                title: 'CustomerId',
                dataIndex: 'CustomerId',
                key: 'CustomerId'
              },
              {
                title: 'CustomerName',
                dataIndex: 'CustomerName',
                key: 'CustomerName'
              },
              {
                title: 'Phone',
                dataIndex: 'Phone',
                key: 'Phone'
              },
              {
                title: 'Email',
                dataIndex: 'Email',
                key: 'Email'
              },
              {
                title: 'Country',
                dataIndex: 'Country',
                key: 'Country'
              },
              {
                title: 'LeadStatus',
                dataIndex: 'LeadStatus',
                key: 'LeadStatus',
                render: (text, record) => (
                  <Select
                    style={{ width: 100 }}
                    value={record.LeadStatus}
                    onChange={(value) => handleLeadStatusChange(value, record)}
                  >
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                  </Select>)
              }
            ]}
            dataSource={visibleLeads}
            pagination={false} // Disable default pagination
          />
          <Pagination
            current={currentPage}
            total={Leads.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false} // You can enable this option if needed
          />
        </div>
      </div>
    </>
  );
};

export default HomeComponent;
