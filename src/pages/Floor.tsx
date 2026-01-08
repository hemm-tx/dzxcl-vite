import { useAppSelector, useAppDispatch, post_edit_device_params } from "@/store";
import { Tabs, Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import {
  SVGForeignIcon,
  MPopCardModal,
  MIframe,
  Border6,
  Flex,
  MControlPanel,
  MFumeHood,
  MPressureControl,
  DeviceOnlineBadge,
  LineChartDemo,
} from "@/components";
import type { MChartDemoFetchDataProps } from "@/components";
import { LineChartOutlined } from "@ant-design/icons";
import { Slide, Zoom } from "react-awesome-reveal";
import { DeviceService, type ChartDataProps } from "@/api";
import CameraCfg from "@/assets/json/cameraCfg.json";
import HumitureCfg from "@/assets/json/humitureCfg.json";
import DifferentialCfg from "@/assets/json/differentialCfg.json";
import deviceCfg from "@/assets/json/deviceCfg.json";
import { formattedDate_EST } from "@/assets/js";
import { message } from "@/utils/antdGlobal";
// import { message } from "@/utils/antdGlobal";

interface IModalCfgProps {
  open: boolean;
  title: string;
}

interface IBubbleCardCfgProps extends IModalCfgProps {
  data: DeviceParamsProps | undefined;
  type: "" | "wsd" | "yc";
}

export default function Home() {
  const system = useAppSelector((state) => state.system);
  const deviceDataList = useAppSelector((state) => state.device.deviceDataList);

  const [cameraCardCfg, setCameraCardCfg] = useState<IModalCfgProps & { src: string }>({
    open: false,
    src: "",
    title: "",
  });

  const [deviceModalVisible, setDeviceModalVisible] = useState<IModalCfgProps & { deviceData: DeviceParamsProps[] }>({
    open: false,
    title: "",
    deviceData: [],
  });

  const [bubbleCardCfg, setBubbleCardCfg] = useState<IBubbleCardCfgProps>({
    open: false,
    title: "",
    data: undefined,
    type: "",
  });

  const cameraCardOpen = (src: string, title: string) => setCameraCardCfg({ open: true, src, title });
  const cameraCardClose = () => setCameraCardCfg({ open: false, src: "", title: "" });

  const deviceModalOpen = (title: string, ids: string[]) => {
    const deviceData = ids.map((id) => deviceDataList[id]);
    setDeviceModalVisible({ open: true, title, deviceData });
  };
  const deviceModalClose = () => setDeviceModalVisible({ open: false, title: "", deviceData: [] });

  const bubbleClick = (id: string, title: string) => {
    const bubbleData: IBubbleCardCfgProps = { open: true, title, data: deviceDataList[id], type: "" };
    if (id.includes("WSD")) bubbleData.type = "wsd";
    else if (id.includes("YC")) bubbleData.type = "yc";
    setBubbleCardCfg(bubbleData);
  };
  const bubbleClose = () => setBubbleCardCfg({ open: false, title: "", data: undefined, type: "" });

  return (
    <>
      <Flex.Col full className="place-items-center relative overflow-hidden">
        <Zoom duration={system.animationDuration} triggerOnce className="absolute top-20 w-[95%]">
          <svg viewBox="0 0 3654 1224" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
            <image href="/modal/floor.png" x="0" y="0" width="3654" height="1224" />
            {/* {system.deviceIconShow && <SVGForeignIcon.Device id="device" x="980" y="640" onClick={() => deviceModalOpen("设备控制面板")} />} */}
            {system.deviceIconShow &&
              deviceCfg.map((item) => (
                <SVGForeignIcon.Device key={item.id[0]} id={item.id[0]} x={item.x} y={item.y} onClick={() => deviceModalOpen(item.position, item.id)} />
              ))}
            {system.cameraIconShow &&
              CameraCfg.map((item) => <SVGForeignIcon.Camera key={item.id} {...item} onClick={() => cameraCardOpen(item.id, item.description)} />)}
            {system.humitureIconShow &&
              HumitureCfg.map((item) => <SVGForeignIcon.Humiture key={item.id} {...item} onClick={() => bubbleClick(item.id, item.position)} />)}
            {system.differentialIconShow &&
              DifferentialCfg.map((item) => <SVGForeignIcon.Differential key={item.id} {...item} onClick={() => bubbleClick(item.id, item.position)} />)}
          </svg>
        </Zoom>
        <Flex.Col className="absolute bottom-[calc(25%+2.5rem)] right-10 w-1/5">
          {bubbleCardCfg.open && bubbleCardCfg.data && (
            <Slide direction="right" duration={system.animationDuration} triggerOnce key={bubbleCardCfg.data.device_id}>
              {bubbleCardCfg.type === "wsd" ? (
                <HumitureCard
                  online={bubbleCardCfg.data.online}
                  device_id={bubbleCardCfg.data.device_id}
                  temperature={bubbleCardCfg.data.data[0].value as number}
                  humidity={bubbleCardCfg.data.data[1].value as number}
                  title={bubbleCardCfg.title}
                  onClose={bubbleClose}
                />
              ) : bubbleCardCfg.type === "yc" ? (
                <DifferentialCard
                  online={bubbleCardCfg.data.online}
                  device_id={bubbleCardCfg.data.device_id}
                  differential={bubbleCardCfg.data?.data[0].value as number}
                  title={bubbleCardCfg.title}
                  onClose={bubbleClose}
                />
              ) : (
                <></>
              )}
            </Slide>
          )}
        </Flex.Col>
        <Flex.Col className="absolute top-15 right-10 w-1/5">
          {cameraCardCfg.open && (
            <Slide direction="right" duration={system.animationDuration} triggerOnce>
              <CameraCard key={`${system.mediaMTXStart}-${cameraCardCfg.src}`} device_id={cameraCardCfg.src} {...cameraCardCfg} onClose={cameraCardClose} />
            </Slide>
          )}
        </Flex.Col>
      </Flex.Col>
      <MPopCardModal {...deviceModalVisible} width={700} onCancel={deviceModalClose}>
        <DeviceTabs className="h-50 relative mt-4" deviceData={deviceModalVisible.deviceData} />
      </MPopCardModal>
    </>
  );
}

const DeviceTabs: React.FC<{ deviceData: DeviceParamsProps[] } & ComponentDefaultProps> = ({ deviceData, className }) => {
  const dispatch = useAppDispatch();
  const handle_edit_params = (id: string, label: string, value: number | boolean) => {
    dispatch(post_edit_device_params({ device_id: id, key: label, value }));
    // DeviceService.post_edit_device_params(id, label, value).then(() => message.success("提交成功"));
  };

  const tabsItems = deviceData.map((item) => {
    const { device_id, data, online } = item;
    if (device_id.includes("QYYCKZQ"))
      return {
        key: device_id,
        label: "区域压差控制器",
        children: (
          <MPressureControl
            title={device_id}
            online={online}
            valveAngle={data[0].value as number}
            currentDifferential={data[1].value as number}
            differential={data[2].value as number}
            setDifferential={(label, val) => handle_edit_params(device_id, label, val)}
          />
        ),
      };
    else if (device_id.includes("PFKZQ"))
      return {
        key: device_id,
        label: "排风控制面板",
        children: (
          <MControlPanel
            title={device_id}
            deviceSwitch={data[0].value as boolean}
            online={online}
            valveAngle={data[1].value as number}
            setSwitch={(label, val) => handle_edit_params(device_id, label, val)}
          />
        ),
      };
    else
      return {
        key: device_id,
        label: "通风柜",
        children: (
          <MFumeHood
            title={device_id}
            online={online}
            valveAngle={data[0].value as number}
            faceVelocity={data[1].value as number}
            doorHeight={data[2].value as number}
            emergencyExhaust={data[3].value as boolean}
            deviceSwitch={data[4].value as boolean}
            setEmergencyExhaust={(label, val) => handle_edit_params(device_id, label, val)}
            setDeviceSwitch={(label, val) => handle_edit_params(device_id, label, val)}
          />
        ),
      };
  });
  return <Tabs className={`${className} cont-h-full`} centered tabPosition="left" items={tabsItems} />;
};

interface MHumitureDataProps {
  online: boolean;
  temperature?: number | string;
  humidity?: number | string;
}

interface MDifferentialDataProps {
  online: boolean;
  differential?: number | string;
}

interface IPopCardProps {
  key?: string;
  title: string;
  device_id: string;
  onClose: () => void;
}

interface MHumitureStatisticProps {
  label: string;
  value: string | number;
  unit: string;
  src: string;
}

interface MHumitureProps extends IPopCardProps, MHumitureDataProps {}
interface MDifferentialProps extends IPopCardProps, MDifferentialDataProps {}
interface MCameraProps extends IPopCardProps {
  src: string;
}
const HumitureCard: React.FC<MHumitureProps> = ({ title, online, device_id, temperature, humidity, onClose }) => {
  const [iProps, setIProps] = useState<MHumitureStatisticProps[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chartCfg = useRef<ChartDataProps | undefined>(undefined);

  const get_chart_data = async () => {
    setLoading(true);
    setOpen(true);
    await DeviceService.get_chart_data("wsd", device_id)
      .then((res) => (chartCfg.current = res.data))
      .finally(() => setLoading(false));
  };

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

  const MStatistic: React.FC<MHumitureStatisticProps> = ({ label, value, unit, src }) => {
    return (
      <Flex.Row center className="cursor-default">
        <div>
          <img src={src} width="48px" alt="img.png" />
        </div>
        <Flex.Col className="ml-2">
          <span className="text-sm text-white">{label}</span>
          <div className="text-xl font-bold bg-gradient-to-b from-[#BFD6E3] to-[#4CC5FE] text-linear-gradient">
            <span>{value}</span>
            <em className="pl-1 text-base">{unit}</em>
          </div>
        </Flex.Col>
      </Flex.Row>
    );
  };

  useEffect(() => {
    setIProps([
      { label: "当前温度", value: temperature ?? 0, unit: "℃", src: "/modal/temperature.png" },
      { label: "当前湿度", value: humidity ?? 0, unit: "%RH", src: "/modal/humidity.png" },
    ]);
  }, [temperature, humidity]);

  return (
    <>
      <Border6 className="w-full h-40" title={title} onClose={onClose}>
        <Flex.Row justify="between" align="center" className="h-6 text-xs">
          <DeviceOnlineBadge online={online} />
          <Button size="small" variant="link" color="cyan" icon={<LineChartOutlined />} onClick={get_chart_data}>
            查看趋势
          </Button>
        </Flex.Row>
        <div className="w-full h-[calc(100%-1.5rem)] grid grid-cols-2">
          {iProps.map((item) => (
            <MStatistic key={item.src} {...item} />
          ))}
        </div>
      </Border6>
      <MPopCardModal title="房间温湿度数据趋势" loading={loading} open={open} onCancel={() => setOpen(false)}>
        {chartCfg.current && <LineChartDemo className="w-full h-80" {...chartCfg.current} fetchData={push_chart_data} />}
      </MPopCardModal>
    </>
  );
};

const DifferentialCard: React.FC<MDifferentialProps> = ({ differential, online, device_id, title, onClose }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const chartCfg = useRef<ChartDataProps | undefined>(undefined);

  const get_chart_data = async () => {
    setLoading(true);
    setOpen(true);
    await DeviceService.get_chart_data("yc", device_id)
      .then((res) => (chartCfg.current = res.data))
      .finally(() => setLoading(false));
  };

  const push_chart_data = async (props: MChartDemoFetchDataProps) => {
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
        }
      })
      .finally(() => onEnd?.());
  };

  return (
    <>
      <Border6 className="w-full h-40" title={title} onClose={onClose}>
        <Flex.Row justify="between" align="center" className="h-6 text-xs">
          <DeviceOnlineBadge online={online} />
          <Button size="small" variant="link" color="cyan" icon={<LineChartOutlined />} onClick={get_chart_data}>
            查看趋势
          </Button>
        </Flex.Row>
        <Flex center className="w-full h-[calc(100%-1.5rem)]">
          <div>
            <img src="/modal/differential.png" width="60px" alt="differential.png" />
          </div>
          <Flex.Col className="pl-4">
            <span className="text-3xl font-bold bg-gradient-to-b from-[#BFD6E3] to-[#4CC5FE] text-linear-gradient">
              {differential ?? 0}
              <em className="pl-1 text-base">Pa</em>
            </span>
            <span className="text-sm text-white">当前压差</span>
          </Flex.Col>
        </Flex>
      </Border6>
      <MPopCardModal title="房间压差数据趋势" loading={loading} open={open} onCancel={() => setOpen(false)}>
        {chartCfg.current && <LineChartDemo className="w-full h-80" {...chartCfg.current} fetchData={push_chart_data} />}
      </MPopCardModal>
    </>
  );
};

const CameraCard: React.FC<MCameraProps> = ({ key, src, title, onClose }) => {
  return (
    <Border6 className="w-full h-60" key={key} {...{ title, onClose }}>
      <MIframe src={`http://localhost:8889/stream/${src}`} />
    </Border6>
  );
};
