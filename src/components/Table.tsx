import { useEffect, useRef, useState } from "react";
import { ConfigProvider, Spin, Table } from "antd";
import type { TableProps } from "antd";
import { CustomizeEmpty } from "./CustomizeEmpty";

interface WrapperTableProps<T> extends ComponentDefaultProps {
  columns?: TableProps<T>["columns"];
  dataSource: T[];
}

type TableDataProps = AlarmTableDataProps | RecordTableDataProps;

export const WrapperTable = <T extends TableDataProps>({ className, style, dataSource, columns, loading = false }: WrapperTableProps<T>) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableBodyHeight, setTableBodyHeight] = useState(0);

  const handleResize = () => {
    if (tableRef.current) setTableBodyHeight(tableRef.current.offsetHeight - 40);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`size-full ${className}`} style={style} ref={tableRef}>
      <Spin spinning={loading}>
        <ConfigProvider renderEmpty={() => <CustomizeEmpty description="no data" />}>
          <Table<T>
            className="size-full absolute"
            columns={columns}
            size="small"
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: tableBodyHeight, x: "max-content" }}
          />
        </ConfigProvider>
      </Spin>
    </div>
  );
};

const createTable =
  <T extends TableDataProps>(defaultColumns: TableProps<T>["columns"]) =>
  (props: WrapperTableProps<T>) => {
    const columns = props.columns || defaultColumns;
    return <WrapperTable {...props} columns={columns} />;
  };

const AlarmTableColumns: TableProps<AlarmTableDataProps>["columns"] = [
  {
    title: "设备名称",
    dataIndex: "device_name",
    key: "alarm_device_name",
    width: 150,
  },
  {
    title: "报警时间",
    dataIndex: "created_at",
    key: "alarm_created_at",
    width: 150,
  },
  {
    title: "报警信息",
    dataIndex: "msg",
    key: "alarm_msg",
    width: 100,
  },
  {
    title: "报警状态",
    dataIndex: "status",
    key: "alarm_status",
    width: 100,
  },
  {
    title: "更新时间",
    key: "alarm_updated_at",
    dataIndex: "updated_at",
    width: 150,
  },
];

const RecordTableColumns: TableProps<RecordTableDataProps>["columns"] = [
  {
    title: "设备名称",
    dataIndex: "device_name",
    key: "log_device_name",
    width: 150,
  },
  {
    title: "操作时间",
    dataIndex: "created_at",
    key: "log_updated_at",
  },
  {
    title: "操作信息",
    dataIndex: "msg",
    key: "log_msg",
    width: 200,
  },
];

export const AlarmTable = createTable<AlarmTableDataProps>(AlarmTableColumns);
export const RecordTable = createTable<RecordTableDataProps>(RecordTableColumns);
