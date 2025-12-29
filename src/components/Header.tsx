import { Button, Switch, Descriptions, Radio, type RadioChangeEvent } from "antd";
import { Clock } from "./Clock";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector, setAnimationDuration, login_out, setMediaMTXStart } from "@/store";
import { message, modal } from "@/utils/antdGlobal";
import { MPopCardModal } from "./Modal";
import { UseInvoke } from "@/assets/js";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const menuData = [
    {
      label: "首页",
      path: "/index/home",
      x: 824,
    },
    {
      label: "资源管理",
      path: "/index/resource",
      x: 2690,
    },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    modal.confirm({
      maskClosable: true,
      title: "确认退出",
      content: "确认退出当前账户吗？",
      onOk() {
        dispatch(login_out());
        navigate("/login");
      },
      onCancel() {},
    });
  };

  return (
    <>
      <div className="size-full flex justify-center items-center relative">
        <svg className="absolute size-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 7680 320">
          <image x="0px" y="0px" width="7680" height="320" preserveAspectRatio="none" xlinkHref="/images/header_bg.svg" />
          <foreignObject x="0" y="30%" width="100%" height="100%">
            <h1 className="text-white text-center font-bold text-[112px] h-30 content-center cursor-default text-shadow-[0_0_20px_#0aafe6,_0_0_20px_rgba(10,_175,_230_0)]">
              {import.meta.env.VITE_PROJECT_HEADER_TITLE}
            </h1>
          </foreignObject>
          <foreignObject x="0" y="35%" width="100%" height="30%">
            <Button style={{ fontSize: "3.5rem", height: "100%" }} variant="link" color="red" icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
            <Button style={{ fontSize: "3.5rem" }} variant="link" color="cyan" icon={<SettingOutlined />} onClick={() => setModalOpen(true)}>
              系统设置
            </Button>
          </foreignObject>
          {menuData.map((item) => (
            <foreignObject x={item.x * 2} y="192" width="640" height="120" key={item.path}>
              <div
                className={`size-full flex justify-center items-center cursor-pointer ${
                  location.pathname.includes(item.path) ? "text-amber-400" : "text-white"
                } hover:text-amber-300`}
                onClick={() => handleMenuClick(item.path)}
              >
                <span className={`text-center font-bold text-[52px] font-[bitterBoldFont]`}>{item.label}</span>
              </div>
            </foreignObject>
          ))}
        </svg>
        <div className="absolute top-1/2 right-2">
          <Clock />
        </div>
      </div>
      <MPopCardModal open={modalOpen} onCancel={() => setModalOpen(false)}>
        <SystemSet />
      </MPopCardModal>
    </>
  );
}

const SystemSet = () => {
  const dispatch = useAppDispatch();
  const system = useAppSelector((state) => state.system);
  const [loading, setLoading] = useState(false);

  const handleAnimationDuration = (e: RadioChangeEvent) => dispatch(setAnimationDuration(e.target.value));
  const handleSwitchMedia = () => {
    setLoading(true);
    if (!system.mediaMTXStart) {
      new UseInvoke()
        .success(() => dispatch(setMediaMTXStart(true)))
        .error(() => message.error("摄像头数据请在客户端调用"))
        .finally(() => setLoading(false))
        .invoke("start_mediamtx");
    } else {
      new UseInvoke()
        .success(() => dispatch(setMediaMTXStart(false)))
        .error(() => message.error("摄像头数据请在客户端调用"))
        .finally(() => setLoading(false))
        .invoke("stop_mediamtx");
    }
  };

  // useEffect(() => {
  //   setTimeout(() => !system.mediaMTXStart && handleSwitchMedia(), 5000);
  //   return () => {
  //     system.mediaMTXStart && handleSwitchMedia();
  //   };
  // }, []);

  return (
    <Descriptions
      title="系统设置"
      size="small"
      column={2}
      items={[
        {
          key: "cameraSwitch",
          label: <span className="text-white">开启摄像头数据</span>,
          children: <Switch loading={loading} checked={system.mediaMTXStart} onChange={handleSwitchMedia} />,
        },
        {
          key: "animationDuration",
          label: <span className="text-white">动画运行速度</span>,
          children: (
            <Radio.Group size="small" value={system.animationDuration} onChange={handleAnimationDuration} buttonStyle="solid">
              <Radio.Button value={300}>快速</Radio.Button>
              <Radio.Button value={500}>默认</Radio.Button>
              <Radio.Button value={1000}>慢速</Radio.Button>
            </Radio.Group>
          ),
        },
      ]}
    />
  );
};
