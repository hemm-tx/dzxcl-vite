import { Outlet } from "react-router-dom";
import { AxiosNavigation } from "@/components";
import { ConfigProvider, App as AntdApp } from "antd";
import {
  DescriptionsTheme,
  GlobalTheme,
  MessageTheme,
  ModalTheme,
  StatisticTheme,
  TableTheme,
  TabsTheme,
  CheckboxTheme,
  SpinTheme,
} from "./assets/js/WrapperAntd";
import AppWrapper from "./utils/antdGlobal";

const App = () => {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: GlobalTheme,
          components: {
            Descriptions: DescriptionsTheme,
            Modal: ModalTheme,
            Form: {
              labelColor: "white",
            },
            Statistic: StatisticTheme,
            Table: TableTheme,
            Message: MessageTheme,
            Tabs: TabsTheme,
            Checkbox: CheckboxTheme,
            Spin: SpinTheme,
          },
        }}
      >
        <AntdApp>
          <AppWrapper />
          <AxiosNavigation>
            <Outlet></Outlet>
          </AxiosNavigation>
        </AntdApp>
      </ConfigProvider>
    </div>
  );
};

export default App;
