import {
  useAppDispatch,
  useAppSelector,
  setCameraIconShow,
  setHumitureIconShow,
  setDifferentialIconShow,
  setDeviceIconShow,
  selectDeviceHeaderData,
  selectAlarmCompareData,
} from "@/store";
import { Divider } from "antd";
import { useState, useEffect } from "react";
import { Border1, Border3, DeviceHeader, IconTemplate, IconName, DeviceCardXF, DeviceCardPF, Flex, CustomizeWrapperComponent } from "@/components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

export default function Home() {
  const animationDuration = useAppSelector((state) => state.system.animationDuration);
  const deviceStatusData = useAppSelector(selectDeviceHeaderData);
  const alarmMsgData = useAppSelector(selectAlarmCompareData);
  return (
    <Flex.Col full className="place-items-center bg-transparent relative overflow-hidden">
      <Fade triggerOnce direction="down" className="absolute top-5" duration={animationDuration}>
        {deviceStatusData && <DeviceHeader className="w-[950px] h-[60px]" data={deviceStatusData} />}
      </Fade>
      <Outlet></Outlet>
      <Fade triggerOnce duration={animationDuration} direction="left" className="absolute top-20 left-5">
        <SystemIcons className="w-15" />
      </Fade>
      <Fade triggerOnce duration={animationDuration} direction="up" className="absolute bottom-5 left-10 w-[calc(100%-5rem)] h-1/4">
        <Flex.Row full>
          <Border3 className="w-1/4 h-full" title="设备报警信息">
            <CustomizeWrapperComponent loading={alarmMsgData === undefined || alarmMsgData?.length === 0} timeout={10000}>
              <div className="size-full min-2xl:grid min-2xl:grid-cols-2 min-2xl:gap-2 max-2xl:overflow-y-auto">
                {alarmMsgData?.map((item, index) => (
                  <Border1 key={index} className="text-white overflow-hidden max-2xl:p-2 cursor-default">
                    <Flex.Col full justify="center" className="min-h-15">
                      <p className="whitespace-normal text-ellipsis overflow-hidden text-xs">{item.title}</p>
                      <ol className="text-2xl">
                        <span className="font-[electronicFont] text-[#00DEFF] text-shadow-[0_0_5px_#00DEFF]">{item.value}</span>
                        <span className="text-sm font-normal px-1.5">{item.unit}</span>
                        <i className="text-xs">{item.label}：</i>
                        <i className={`text-xs ${item.compare < 0 ? "text-[#00CC00]" : "text-[#CC0000]"}`}>{`${item.compare < 0 ? "↓" : "↑"} ${
                          item.compare
                        }%`}</i>
                      </ol>
                    </Flex.Col>
                  </Border1>
                ))}
              </div>
            </CustomizeWrapperComponent>
          </Border3>
          <Border3 className="ml-5 w-[calc((75%-2.5rem)/2)]" title="新风空调机组">
            <DeviceCardXF />
          </Border3>
          <Border3 className="ml-5 w-[calc((75%-2.5rem)/2)]" title="排风机组">
            <DeviceCardPF />
          </Border3>
        </Flex.Row>
      </Fade>
    </Flex.Col>
  );
}

const SystemIcons = ({ className }: { className?: string }) => {
  const CreateIcons = ({ iconName, label, isActive, onClick }: { iconName: IconName; label: string; isActive: boolean; onClick?: () => void }) => {
    const [hover, setHover] = useState(false);
    return (
      <svg viewBox="0 0 147 112" className="cursor-pointer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a52ff" />
            <stop offset="100%" stopColor="#13C2C2" />
          </linearGradient>
          <linearGradient id="gradient-hover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff573388" />
            <stop offset="100%" stopColor="#ffc30088" />
          </linearGradient>
          <linearGradient id="gradient-active" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5733" />
            <stop offset="100%" stopColor="#ffc300" />
          </linearGradient>
        </defs>
        <image href="/modal/icon-border.png" x="0" y="0" height="112" width="147" />
        <g transform="translate(0,-10)">
          <IconTemplate name={iconName} color={`${isActive ? "url(#gradient-active)" : hover ? "url(#gradient-hover)" : "url(#gradient)"}`} />
        </g>
        <text
          x="73"
          y="90"
          fill={`${isActive ? "url(#gradient-active)" : hover ? "url(#gradient-hover)" : "url(#gradient)"}`}
          fontSize="24"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </svg>
    );
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("/");
  const { cameraIconShow, humitureIconShow, differentialIconShow, deviceIconShow } = useAppSelector((state) => state.system);

  const MenuData: { iconName: IconName; label: string; path: string }[] = [
    { iconName: "Resource", label: "二楼设备", path: "/index/resource" },
    { iconName: "Pipeline", label: "二楼通排风", path: "/index/resource/pipeline" },
    { iconName: "FlueGas", label: "顶楼废气", path: "/index/resource/flue-gas" },
  ];

  useEffect(() => {
    if (location.pathname === "") {
      setActiveMenu("/home");
    } else setActiveMenu(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className={`${className} *:mt-3`}>
        {MenuData.map((item) => (
          <CreateIcons key={item.path} label={item.label} iconName={item.iconName} isActive={activeMenu === item.path} onClick={() => navigate(item.path)} />
        ))}
        <Divider size="small" />
        <CreateIcons label="摄像头" iconName="Camera" isActive={cameraIconShow} onClick={() => dispatch(setCameraIconShow(!cameraIconShow))} />
        <CreateIcons label="温湿度" iconName="Humiture" isActive={humitureIconShow} onClick={() => dispatch(setHumitureIconShow(!humitureIconShow))} />
        <CreateIcons
          label="压差"
          iconName="Differential"
          isActive={differentialIconShow}
          onClick={() => dispatch(setDifferentialIconShow(!differentialIconShow))}
        />
        <CreateIcons label="设备" iconName="Device" isActive={deviceIconShow} onClick={() => dispatch(setDeviceIconShow(!deviceIconShow))} />
      </div>
    </>
  );
};
