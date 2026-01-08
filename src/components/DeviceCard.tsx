import { Button, Tabs, Descriptions, Switch, Radio } from "antd";
import { SettingOutlined, BlockOutlined, LineChartOutlined } from "@ant-design/icons";
import { Border5, Flex, LineChartDemo, CustomizeWrapperComponent, type MChartDemoFetchDataProps } from "@/components";
import { useState, useRef } from "react";
import { DeviceInputNumber, DeviceOnlineBadge } from "./Devices";
import { selectFJData, useAppDispatch, useAppSelector, post_edit_device_params } from "@/store";
import { DeviceService, type ChartDataProps } from "@/api";
import { message } from "@/utils/antdGlobal";
import { formattedDate_EST } from "@/assets/js";

interface ICardProps {
  label: string;
  value: number | string;
  unit: string;
}

interface IDeviceCardProps {
  url: string;
  device_id: string;
  device_type: "pf" | "xf";
  online: boolean;
  cardData: ICardProps[];
  setParamsTab: React.ReactNode;
}

const DataCard: React.FC<{ data: ICardProps[] }> = ({ data }) => {
  return (
    <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-1 h-full overflow-y-auto">
      {data.map((item, index) => (
        <Border5 key={index} className="w-full h-17" title={item.label} value={item.value} suffix={item.unit} />
      ))}
    </div>
  );
};

type menuProps = "chart" | "set" | "card";

export const DeviceCard: React.FC<IDeviceCardProps> = ({ url, online, cardData, device_id, device_type, setParamsTab }) => {
  const [showCont, setShowCont] = useState<menuProps>("card");
  const [loading, setLoading] = useState(false);
  const chartCfg = useRef<ChartDataProps | undefined>(undefined);

  const menuClick = async (key: menuProps) => {
    setShowCont(key);
    if (key === "chart") {
      setLoading(true);
      await DeviceService.get_chart_data(device_type, device_id)
        .then((res) => (chartCfg.current = res.data))
        .finally(() => setLoading(false));
    }
  };
  const menuButtonCfg: { id: menuProps; icon: React.ReactNode }[] = [
    { id: "set", icon: <SettingOutlined /> },
    { id: "card", icon: <BlockOutlined /> },
    { id: "chart", icon: <LineChartOutlined /> },
  ];

  const push_chart_data = (props: MChartDemoFetchDataProps) => {
    const { start, end, onStart, onEnd } = props;
    if (!chartCfg.current) return;
    const current_xAxis = chartCfg.current.xAxis;
    const total = current_xAxis.length + 100 > 1000 ? 1000 : current_xAxis.length + 100;
    let query;
    if (end && start) {
      const start_time = formattedDate_EST(current_xAxis[current_xAxis.length > 900 ? current_xAxis.length - 900 : 0]);
      query = DeviceService.get_device_detail<MDeviceDetailColumnProps>(device_id, start_time, undefined, 1, total);
    } else {
      const start_time = start ? formattedDate_EST(current_xAxis[current_xAxis.length > 900 ? current_xAxis.length - 900 : 0]) : undefined;
      const end_time = end ? formattedDate_EST(current_xAxis[current_xAxis.length - 1 > 900 ? 900 : current_xAxis.length - 1]) : undefined;
      query = DeviceService.get_device_detail<MDeviceDetailColumnProps>(device_id, start_time, end_time, 1, total);
    }
    onStart?.();
    query
      .then((res) => {
        if (res.data.length <= 1) {
          message.info("没有更多数据");
          return;
        }
        if (!chartCfg.current) return;
        chartCfg.current.xAxis = [];
        chartCfg.current.series[0].data = [];
        for (let idx = res.data.length - 1; idx >= 0; idx--) {
          const item = res.data[idx];
          chartCfg.current?.xAxis.push(item.updated_at);
          chartCfg.current?.series[0].data.push(item.data[0].value);
          chartCfg.current?.series[1].data.push(item.data[1].value);
        }
      })
      .finally(() => onEnd?.());
  };

  return (
    <Flex.Row full align="center" className="@container/device-card relative overflow-hidden max-[1200px]:justify-center">
      <div className="max-w-[120px] relative text-center h-full">
        <Flex.Row center className="h-[calc(100%-24px)]">
          <img src={url} alt="风机" className="max-w-[120px]" />
        </Flex.Row>
        <DeviceOnlineBadge online={online} />
      </div>
      <Flex.Col className="flex-1 ml-3 relative h-full border-l-1 border-[#07A6FF88] @max-[280px]/device-card:hidden">
        <Flex justify="end" className="h-6 *:mx-2 border-b-1 border-[#07A6FF88]">
          {menuButtonCfg.map((item) => (
            <Button
              key={item.id}
              size="small"
              variant="link"
              color={showCont === item.id ? "orange" : "cyan"}
              icon={item.icon}
              onClick={() => menuClick(item.id)}
            />
          ))}
        </Flex>
        {showCont === "card" ? (
          <DataCard data={cardData} />
        ) : showCont === "chart" ? (
          <CustomizeWrapperComponent loading={loading} timeout={10000} emptyDescription="暂无数据">
            {chartCfg.current && (
              <LineChartDemo
                {...chartCfg.current}
                fetchData={push_chart_data}
                globalOptions={{
                  grid: { top: "25%", left: "10%" },
                  dataZoom: [{ type: "inside", realtime: true, start: 20, end: 80 }],
                }}
              />
            )}
          </CustomizeWrapperComponent>
        ) : (
          <div className="p-2 size-full overflow-y-auto">{setParamsTab}</div>
        )}
      </Flex.Col>
    </Flex.Row>
  );
};

export const DeviceCardPF = () => {
  const { pfDataList } = useAppSelector(selectFJData) ?? {};
  const dispatch = useAppDispatch();

  const setParams = (id: string, label: string, value: number) => {
    dispatch(post_edit_device_params({ device_id: id, key: label, value }))
      .unwrap()
      .then(() => message.success("保存成功"));
  };

  const tabsItems = pfDataList?.map((item, idx) => ({
    key: item.device_id,
    label: `风机-${idx + 1}`,
    children: (
      <DeviceCard
        url="/images/fj.png"
        online={item.online}
        device_id={item.device_id}
        device_type="pf"
        cardData={[
          { label: "运行频率", value: item.data[0].value as number, unit: "Hz" },
          { label: "管道压差", value: item.data[1].value as number, unit: "bar" },
          { label: "设定压差", value: item.data[2].value as number, unit: "bar" },
        ]}
        setParamsTab={
          <Descriptions
            size="small"
            column={1}
            title="参数设置"
            items={[
              {
                key: "set-switch",
                label: "设备开关",
                children: <Switch checked={item.data[0].value as boolean} disabled />,
              },
              {
                key: "set_differential",
                label: "设定压差",
                children: (
                  <DeviceInputNumber
                    style={{ height: "24px" }}
                    defaultValue={item.data[2].value as number}
                    isReactive
                    min={0}
                    max={2000}
                    verify
                    onSubmit={(val) => setParams(item.device_id, "set_differential_pressure", val)}
                  />
                ),
              },
            ]}
          />
        }
      />
    ),
  }));
  return (
    <CustomizeWrapperComponent loading={pfDataList === undefined || pfDataList.length === 0} timeout={5000} emptyDescription="暂无设备信息">
      <Tabs className="size-full cont-h-full" size="small" destroyOnHidden tabPosition="left" items={tabsItems} />;
    </CustomizeWrapperComponent>
  );
};

export const DeviceCardXF = () => {
  const dispatch = useAppDispatch();
  const { xfDataList } = useAppSelector(selectFJData) ?? {};
  const setParams = (id: string, label: string, value: number | boolean) => {
    dispatch(post_edit_device_params({ device_id: id, key: label, value }))
      .unwrap()
      .then(() => message.success("保存成功"));
  };

  const tabsItems = xfDataList?.map((item, idx) => ({
    key: item.device_id,
    label: `空调-${idx + 1}`,
    children: (
      <DeviceCard
        url="/images/ktjz.png"
        online={item.online}
        device_id={item.device_id}
        device_type="xf"
        cardData={[
          { label: "出风温度", value: item.data[0].value as number, unit: "℃" },
          { label: "回风湿度", value: item.data[1].value as number, unit: "%RH" },
          { label: "设定温度", value: item.data[4].value as number, unit: "℃" },
          { label: "设定湿度", value: item.data[5].value as number, unit: "%RH" },
        ]}
        setParamsTab={
          <Descriptions
            size="small"
            column={1}
            title="参数设置"
            items={[
              {
                key: "device-start",
                label: "设备开关",
                children: <Switch checked={item.data[2].value as boolean} onChange={(val) => setParams(item.device_id, "set_switch", val)} />,
              },
              {
                key: "set_start_pattern",
                label: "运行模式",
                children: (
                  <Radio.Group
                    size="small"
                    options={[
                      { label: "制冷", value: 1 },
                      { label: "制热", value: 2 },
                      { label: "通风", value: 4 },
                      { label: "自动", value: 6 },
                    ]}
                    defaultValue={item.data[3].value as number}
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) => setParams(item.device_id, "set_start_pattern", e.target.value)}
                  />
                ),
              },
              {
                key: "set-temperature",
                label: "设定温度",
                children: (
                  <DeviceInputNumber
                    style={{ height: "24px" }}
                    defaultValue={item.data[4].value as number}
                    isReactive
                    min={12}
                    max={45}
                    onSubmit={(val) => setParams(item.device_id, "set_temperature", val)}
                  />
                ),
              },
              {
                key: "set-humidity",
                label: "设定湿度",
                children: (
                  <DeviceInputNumber
                    style={{ height: "24px" }}
                    defaultValue={item.data[5].value as number}
                    isReactive
                    min={20}
                    max={80}
                    onSubmit={(val) => setParams(item.device_id, "set_humidity", val)}
                  />
                ),
              },
            ]}
          />
        }
      />
    ),
  }));

  return (
    <CustomizeWrapperComponent loading={xfDataList === undefined || xfDataList.length === 0} timeout={5000} emptyDescription="暂无设备信息">
      <Tabs className="size-full cont-h-full" size="small" destroyOnHidden tabPosition="left" items={tabsItems} />;
    </CustomizeWrapperComponent>
  );
};
