import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch, post_Login } from "@/store";
import { Flex, StarsBackground } from "@/components";
import { encrypt } from "@/assets/js";
import { message } from "@/utils/antdGlobal";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const login_loading = "post_login/pending";
  const [buttonLoading, setButtonLoading] = useState(false);

  const onFinish = (val: UserInfoType) => {
    const { username, password } = val;
    setButtonLoading(true);
    message.open({
      key: login_loading,
      type: "loading",
      content: "登录中...",
      duration: +import.meta.env.VITE_API_TIMEOUT / 1000,
    });
    dispatch(post_Login({ username, password: encrypt(password) }))
      .unwrap()
      .then(() => {
        message.open({
          key: login_loading,
          type: "success",
          content: "登录成功 !",
          duration: 3,
        });
        navigate("/index/home");
      })
      .catch(() =>
        message.open({
          key: login_loading,
          type: "error",
          content: "登录失败，请检查用户名和密码",
          duration: 3,
        })
      )
      .finally(() => setButtonLoading(false));
  };

  return (
    <Flex center className="w-screen h-screen bg-[url('/images/bg.png')] bg-img-container">
      <StarsBackground />
      <Flex.Col align="center" justify="around" className="bg-[#155D8BCC] rounded-lg w-120 h-80 max-sm:w-4/5 max-sm:h-80">
        <h1 className="text-3xl font-bold max-[360px]:text-2xl mt-10 text-white">{import.meta.env.VITE_PROJECT_HEADER_TITLE}</h1>
        <Flex.Col full center>
          <Form name="login" size="large" initialValues={{ remember: true }} className="w-3/5 min-w-90 max-sm:min-w-4/5" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名!" },
                { pattern: /^[a-zA-Z0-9]+$/, message: "用户名只能包含字母和数字!" },
                { min: 4, message: "用户名长度不能少于4位!" },
                { max: 16, message: "用户名长度不能超过16位!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码!" },
                { min: 6, message: "密码长度不能少于6位!" },
                { max: 20, message: "密码长度不能超过20位!" },
              ]}
            >
              <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={buttonLoading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Flex.Col>
        <span className="absolute bottom-1 text-xs cursor-default text-white">©2024湖南正海现代研发部</span>
      </Flex.Col>
    </Flex>
  );
}
