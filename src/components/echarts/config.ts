// 按需导入组件，echarts 太大了，按需导入可以减小打包体积
import * as echarts from "echarts/core";
// 引入柱状图，折线图，饼图等图表组件
import { BarChart, LineChart, PieChart, type BarSeriesOption, type LineSeriesOption, type PieSeriesOption } from "echarts/charts";
// 引入提示框，标题，直角坐标系，图例等组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  type TitleComponentOption,
  type TooltipComponentOption,
  type GridComponentOption,
  type LegendComponentOption,
} from "echarts/components";
// 引入 Canvas 标签布局、过渡动画等特性
import { LabelLayout } from "echarts/features";
// 引入 Canvas 渲染器，使 Echarts 支持在 canvas 中渲染
import { CanvasRenderer } from "echarts/renderers";

// 注册组件
echarts.use([BarChart, LineChart, PieChart, TitleComponent, TooltipComponent, GridComponent, LabelLayout, CanvasRenderer, LegendComponent]);

export { echarts };

// 定义 BarChartOption、LineChartOption、PieChartOption 类型
type GlobalOptions = TitleComponentOption & TooltipComponentOption & GridComponentOption & LegendComponentOption;

export type BarChartOption = echarts.ComposeOption<BarSeriesOption & GlobalOptions>;

export type LineChartOption = echarts.ComposeOption<LineSeriesOption & GlobalOptions>;

export type PieChartOption = echarts.ComposeOption<PieSeriesOption & GlobalOptions>;
