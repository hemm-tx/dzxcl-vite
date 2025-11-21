import type { TooltipComponentOption, GridComponentOption } from "echarts";

export const tooltipOptions: TooltipComponentOption = {
  backgroundColor: "rgba(125,125,125,0.7)",
  borderRadius: 10,
  borderWidth: 0,
  trigger: "axis",
  axisPointer: {
    type: "cross",
    crossStyle: {
      color: "#fff",
    },
    label: {
      backgroundColor: "#1CD1F866",
      borderColor: "#ccc",
      borderWidth: 1,
      padding: [6, 10],
      borderRadius: 3,
    },
  },
  textStyle: {
    color: "#fff",
  },
};

export const gridOptions: GridComponentOption = {
  left: "3%",
  right: "4%",
  bottom: "3%",
  containLabel: false,
};
