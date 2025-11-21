import { fetchWeather, selectDevicePieChartData, useAppDispatch, useAppSelector } from "@/store";
// import { fetchWeather, selectDevicePieChartData, selectUpdateTime, selectWeatherData, useAppDispatch, useAppSelector } from "@/store";
import { AlarmTable, RecordTable, PieChart, Border6, CustomizeWrapperComponent, Flex } from "@/components";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { RedoOutlined } from "@ant-design/icons";
import { Fade } from "react-awesome-reveal";

export default function Home() {
  const device_pie_data = useAppSelector(selectDevicePieChartData);
  const { alarmTableData, logTableData } = useAppSelector((state) => state.device);

  return (
    <div className="size-full bg-transparent relative overflow-hidden">
      <svg className="absolute bottom-0" viewBox="0 0 3840 1858" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="floor-2" x1="100%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1677ff" stopOpacity=".1" />
            <stop offset="100%" stopColor="#1677ff" stopOpacity=".5">
              {/* <animate attributeName="offset" values="0;1;0" dur="5s" repeatCount="indefinite" /> */}
              <animate attributeName="stop-opacity" values="0;.5;0" dur="5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <image href="/modal/exterior.png" x="0" y="0" width="3840" height="1858" />
      </svg>
      <MHomeCard className="absolute left-10 w-1/5 h-1/3 top-10" title="设备状态信息">
        <CustomizeWrapperComponent error={!device_pie_data}>{device_pie_data && <CreatePieChart {...device_pie_data} />}</CustomizeWrapperComponent>
      </MHomeCard>
      <MHomeCard className="absolute left-10 w-1/5 h-[calc(66%-5rem)] bottom-5" title="报警信息">
        <AlarmTable dataSource={alarmTableData} />
      </MHomeCard>
      <MHomeCard className="absolute right-10 w-1/5 h-1/3 top-10" title="天气信息" direction="right">
        <Weather />
      </MHomeCard>
      <MHomeCard className="absolute right-10 w-1/5 h-[calc(66%-5rem)] bottom-5" title="操作日志" direction="right">
        <RecordTable dataSource={logTableData} />
      </MHomeCard>
    </div>
  );
}

const Weather: React.FC = () => {
  const dispatch = useAppDispatch();
  const { weather, loading, error, weatherData } = useAppSelector((state) => state.weather);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [updateTime, setUpdateTime] = useState<string[]>(["YY-MM-DD", "hh-mm-ss"]);

  const refreshClick = () => dispatch(fetchWeather());

  useEffect(() => {
    if (weather.obsTime === "") refreshClick();
    else {
      const date = new Date(weather.obsTime);
      const now = new Date();
      const diff = (now.getTime() - date.getTime()) / 1000;
      if (diff >= 60 * 60 * 2) refreshClick();
      else setTimer(setInterval(() => refreshClick(), 60 * 60 * 1000 - diff * 1000));
    }
    return () => timer && clearInterval(timer);
  }, [weather.obsTime]);

  const formattedDate = (timeStr: string) => {
    const date = new Date(timeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return [`${year}-${month}-${day}`, `${hour}:${minute}:${second}`];
  };

  useEffect(() => {
    setUpdateTime(formattedDate(weather.obsTime));
    return () => {};
  }, []);

  return (
    <CustomizeWrapperComponent
      loading={loading}
      error={error}
      timeout={10000}
      emptyDescription={
        <Flex.Col>
          <span className="text-white mt-3 mb-4 cursor-default text-xs">获取信息失败，请检查网络连接</span>
          <Button size="small" variant="link" color="cyan" icon={<RedoOutlined />} onClick={refreshClick}>
            点击刷新
          </Button>
        </Flex.Col>
      }
    >
      {!loading && (
        <div className="size-full grid grid-cols-3 gap-3 place-items-center overflow-x-hidden">
          <Flex.Row full center className="relative text-white shadow-[0px_0px_10px_#00DEFF99_inset] col-span-3 rounded-xl">
            <i className={`text-4xl qi-${weather.icon}`}></i>
            <Flex.Col className="pl-3">
              <span className="text-sm">{weather.text}</span>
              <div className="text-2xl text-center ml-2">
                <span className="font-[electronicFont]">{weather.temp}</span>
                <em className="text-base pl-1">°C</em>
              </div>
            </Flex.Col>
            <span className="absolute left-3 top-2 text-xs">株洲市天元区</span>
            <Flex.Col className="absolute right-3 bottom-2 text-xs">
              <span>{updateTime?.[0]}</span>
              <span className="pl-1">{updateTime?.[1]}</span>
            </Flex.Col>
          </Flex.Row>
          {weatherData.map((item, index) => (
            <Flex.Col full justify="center" key={index} className="shadow-[0px_0px_10px_#00DEFF99_inset] rounded-xl">
              <span className="text-white text-xs text-left ml-4">{item.title}</span>
              <div className="text-white text-xl w-full text-center ml-3">
                <span className="font-[electronicFont]">{item.value}</span>
                <em className="text-sm pl-1">{item.suffix}</em>
              </div>
            </Flex.Col>
          ))}
        </div>
      )}
    </CustomizeWrapperComponent>
  );
};

const CreatePieChart: React.FC<{ total: number; data: any; title: string }> = ({ total, data, title }) => {
  const rich = {
    yellow: {
      color: "#ffc72b",
      padding: [-5, 2],
      align: "center",
    },
    total: {
      color: "#ffc72b",
      fontSize: 22,
      align: "center",
    },
    white: {
      color: "#fff",
      padding: [3, 0],
      align: "center",
    },
    blue: {
      color: "#49dff0",
      padding: [3, 0],
      align: "center",
    },
    hr: {
      borderColor: "#0b5263",
      width: "100%",
      borderWidth: 1,
      height: 0,
    },
  };

  return (
    <PieChart
      options={{
        title: {
          text: title,
          left: "center",
          top: "50%",
          padding: [14, 0],
          textStyle: {
            color: "#fff",
            fontSize: 12,
            align: "center",
          },
        },
        legend: {
          selectedMode: false,
          formatter: () => "{total|" + total + "}",
          data: ["在线设备"],
          left: "center",
          top: "center",
          icon: "none",
          align: "center",
          textStyle: {
            color: "#fff",
            rich,
          },
        },
        series: [
          {
            name: "设备状态",
            type: "pie",
            radius: ["35%", "65%"],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10,
            },
            label: {
              formatter: (params: any) => {
                const percent = ((params.value / total) * 100).toFixed(1);
                return "{white|" + params.name + "}{yellow|" + params.value + "}\n{hr|}\n{blue|" + percent + "%}";
              },
              rich,
            },
            data,
          },
        ],
      }}
    />
  );
};

interface MHomeCardProps {
  title: string;
  children: React.ReactNode;
  className: string;
  direction?: "left" | "right";
}

const MHomeCard: React.FC<MHomeCardProps> = ({ title, children, className, direction = "left" }) => {
  const animationDuration = useAppSelector((state) => state.system.animationDuration);
  return (
    <Fade triggerOnce direction={direction} duration={animationDuration} className={className}>
      <Border6 className="size-full" title={title}>
        {children}
      </Border6>
    </Fade>
  );
};
