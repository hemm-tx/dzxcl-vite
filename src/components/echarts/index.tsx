import React, { useEffect, useRef } from "react";
import { echarts, type GlobalOptions, type BarChartOption, type LineChartOption, type PieChartOption } from "./config";
import themeCfg from "./theme.json";

// 定义组件必要的数据类型
type EchartsOption = BarChartOption | LineChartOption | PieChartOption;
type ComponentConfig = { loading?: boolean; style?: React.CSSProperties; className?: string };
type ChartProps<T> = {
  onChartReady?: (instance: echarts.ECharts) => void;
  options: T;
  globalOptions?: GlobalOptions;
} & ComponentConfig;

echarts.registerTheme("custom", themeCfg);
const EchartsComponent: React.FC<ChartProps<EchartsOption>> = ({
  options,
  globalOptions,
  onChartReady,
  loading = false,
  style = {},
  className = "size-full",
}) => {
  const conRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // 初始化 Echarts
    if (conRef.current) {
      chartInstance.current = echarts.init(conRef.current, "custom");
      chartInstance.current.setOption({ ...options, ...globalOptions }, false, true);
      onChartReady?.(chartInstance.current);
    }

    // 销毁组件实例，释放内存
    return () => chartInstance.current?.dispose();
  }, []);

  // 监听 options 变化，更新组件实例
  useEffect(() => chartInstance.current?.setOption({ ...options }), [options]);

  // 定义 resize 函数，更新 Echarts 尺寸
  const resize = () => chartInstance.current?.resize({ animation: { duration: 500 } });

  // 定义 loading 状态
  useEffect(() => {
    if (chartInstance.current) {
      if (loading) chartInstance.current.showLoading();
      else chartInstance.current.hideLoading();
    }
  }, [loading]);

  // 监听窗口尺寸变化
  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <div ref={conRef} style={style} className={className}></div>;
};

// 创建 createChartComponent 函数，用于创建 Echarts 组件
const createChartComponent =
  <T extends EchartsOption>() =>
  (props: ChartProps<T>) =>
    <EchartsComponent {...props} />;

// 创建 BarChart、LineChart、PieChart 组件并导出
const BarChart = createChartComponent<BarChartOption>();
const LineChart = createChartComponent<LineChartOption>();
const PieChart = createChartComponent<PieChartOption>();

// export default EchartsComponent;
export { BarChart, LineChart, PieChart };

// 导出一些通用的配置项
export { tooltipOptions, gridOptions } from "./generalCfg";
