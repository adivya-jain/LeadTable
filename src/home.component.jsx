import React, { useState } from "react";
import { read, utils, writeFile } from 'xlsx';
import { Table, Input, Button, Space, Select, Pagination } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'; // Import the missing icons

const { Option } = Select;

const HomeComponent = () => {
  const [Leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedLeads, setSortedLeads] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    columnKey: null,
    order: null,
  });
  const pageSize = 10; // Number of items to display per page

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
          setSortedLeads(rows); // Set sortedLeads initially to match the imported data.
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSort = (columnKey) => {
    if (columnKey === "CustomerId" || columnKey === "CustomerName") {
      let newOrder = "asc"; // Default sorting order is ascending.

      // If the same column is clicked again, toggle the sorting order.
      if (sortOrder.columnKey === columnKey) {
        newOrder = sortOrder.order === "asc" ? "desc" : "asc";
      }

      // Sort the data based on the selected column and order.
      const sortedData = [...sortedLeads].sort((a, b) => {
        if (columnKey === "CustomerId" || columnKey === "CustomerName") {
          if (newOrder === "asc") {
            return a[columnKey].localeCompare(b[columnKey]);
          } else {
            return b[columnKey].localeCompare(a[columnKey]);
          }
        } else {
          return 0; // For other columns, no sorting is performed.
        }
      });

      // Update the state with the new sorted data and sorting order.
      setSortedLeads(sortedData);
      setSortOrder({ columnKey, order: newOrder });
    }
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
    utils.sheet_add_json(ws, sortedLeads, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, 'Lead Report.xlsx');
  };

  // Calculate the visible Leads based on currentPage and pageSize
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const visibleLeads = sortedLeads.slice(start, end);

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
                Export <DownloadOutlined />
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
                key: 'CustomerId',
                // sorter: true,
                // sortOrder: sortOrder.columnKey === 'CustomerId' && sortOrder.order,
                // onHeaderCell: (column) => ({
                //   onClick: () => handleSort(column.dataIndex),
                // }),
              },
              {
                title: 'CustomerName',
                dataIndex: 'CustomerName',
                key: 'CustomerName',
                sorter: true,
                sortOrder: sortOrder.columnKey === 'CustomerName' && sortOrder.order,
                onHeaderCell: (column) => ({
                  onClick: () => handleSort(column.dataIndex),
                }),
              },
              {
                title: 'Phone',
                dataIndex: 'Phone',
                key: 'Phone',
              },
              {
                title: 'Email',
                dataIndex: 'Email',
                key: 'Email',
                // The following code is for email filtering
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                  <div style={{ padding: 8 }}>
                    <Input
                      placeholder="Filter by Email"
                      value={selectedKeys[0]}
                      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                      onPressEnter={() => {
                        confirm();
                      }}
                      style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          confirm();
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                      >
                        Search
                      </Button>
                      <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        Reset
                      </Button>
                    </Space>
                  </div>
                ),
                onFilter: (value, record) =>
                  record.Email.toLowerCase().includes(value.toLowerCase()),
                // End of email filtering logic
              },
              {
                title: 'Country',
                dataIndex: 'Country',
                key: 'Country',
              },
              {
                title: 'LeadStatus',
                dataIndex: 'LeadStatus',
                key: 'LeadStatus',
              }
            ]}
            dataSource={visibleLeads}
            pagination={false} // Disable default pagination
          />
          <Pagination
            current={currentPage}
            total={sortedLeads.length}
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
