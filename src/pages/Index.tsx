import {
  useAppSelector,
  useAppDispatch,
  validate_token,
  get_alarm_table_data,
  get_log_table_data,
  post_affirm_alarm,
  // setFullData,
  get_full_data,
} from "@/store";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { message, notification } from "@/utils/antdGlobal";
import { Flex, Header as HeaderComponent, StarsBackground } from "@/components";
// import { SocketService } from "@/assets/js";

export default function Index() {
  const { Header, Content } = Layout;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const { alarmTotal, logTotal, alarmTableData, alarmStatusData } = useAppSelector((state) => state.device);
  const [hisAlarmTotal, setHisAlarmTotal] = useState(0);

  useEffect(() => {
    if (alarmTotal !== 0) {
      dispatch(get_alarm_table_data());
      if (alarmTotal > hisAlarmTotal) {
        alarmTableData.forEach((item, idx) => {
          if (idx >= alarmTotal - hisAlarmTotal) return;
          notification.error({
            key: item.id,
            message: <span className="text-[#666666]">设备告警</span>,
            onClose: () => dispatch(post_affirm_alarm({ alarm_id: item.id, device_id: item.device_id, status: "1" })),
            description: (
              <Flex.Col className="text-[#666666]">
                <span>告警设备：{item.device_name}</span>
                <span>告警时间: {item.created_at}</span>
                <span>告警内容: {item.msg}</span>
              </Flex.Col>
            ),
          });
        });
        setHisAlarmTotal(alarmTotal);
      }
    }
  }, [alarmTotal]);

  useEffect(() => {
    if (alarmStatusData && alarmStatusData.today > 0) dispatch(get_alarm_table_data());
  }, [alarmStatusData?.today, alarmStatusData?.today_affirm, alarmStatusData?.today_dispose]);

  useEffect(() => {
    dispatch(get_log_table_data());
  }, [logTotal]);

  // useEffect(() => {
  //   if (user.access_token === "") return;
  //   const socket = new SocketService("ws://localhost:8081/socket/ws")
  //     .onOpen((_, ws) => ws?.send(JSON.stringify({ token: user.access_token })))
  //     .onMessage((event) => {
  //       const { device_data, device_status, alarm, log } = JSON.parse(event.data);
  //       dispatch(setFullData({ device_data, device_status, alarm, log }));
  //     })
  //     .onError(() => message.error("连接服务器失败！请重新登陆或检查网络连接"))
  //     .connect();
  //   return () => socket.disconnect();
  // }, [user.access_token]);

  useEffect(() => {
    const _timer = setInterval(() => dispatch(get_full_data()), 5000);
    return () => clearInterval(_timer);
  }, []);

  useEffect(() => {
    dispatch(validate_token())
      .unwrap()
      .then(() => {
        if (user.username !== "") message.success(`欢迎回来，${user.username}`);
        else {
          const local_userinfo_str = localStorage.getItem("userinfo");
          if (local_userinfo_str) {
            const { username } = JSON.parse(local_userinfo_str);
            message.success(`欢迎回来，${username}`);
          } else message.success("欢迎回来 !");
        }
      })
      .catch(() => {
        message.error("登录失效，请重新登录！");
        navigate("/login");
      });
  }, []);

  return (
    <div className="w-screen h-screen bg-[url('/images/bg.png')] bg-img-container">
      <Layout className="size-full" style={{ background: "transparent" }}>
        <Header className="w-full" style={{ padding: 0, height: 80, background: "transparent" }}>
          <HeaderComponent />
        </Header>
        <Content className="flex relative bg-transparent" style={{ flexGrow: 1 }}>
          <StarsBackground />
          <div className="z-10 size-full">
            <Outlet></Outlet>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
