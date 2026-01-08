import { useRef, useState, useEffect, useCallback } from "react";
import { type ChartDataProps } from "@/api/device";
import { LineChart } from "./";
import { useDebounce } from "@/assets/js";
import { echarts, type GlobalOptions } from "./echarts/config";

export interface MChartDemoFetchDataProps {
  start: boolean;
  end: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}
export interface MLineChartDemoProps extends ComponentDefaultProps, ChartDataProps {
  globalOptions?: GlobalOptions;
  fetchData?: (props: MChartDemoFetchDataProps) => void;
}
const defaultGlobalOptions: GlobalOptions = {
  dataZoom: [
    { show: true, realtime: true, height: 20, bottom: 20, start: 20, end: 80, textStyle: { color: "#fff" } },
    { type: "inside", realtime: true, start: 20, end: 80 },
  ],
  grid: { bottom: 65, top: "15%" },
};
export const LineChartDemo: React.FC<MLineChartDemoProps> = ({ className, legend, xAxis, series, fetchData, globalOptions = defaultGlobalOptions }) => {
  const isFetchingRef = useRef(false);
  const [lenX, setLenX] = useState(xAxis.length);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const lastZoomRef = useRef<{ start: number; end: number; direction: "left" | "right" | null } | null>(null);

  const handleDataZoom = useCallback((instance: echarts.ECharts) => {
    if (isFetchingRef.current) return;

    const currentOption = instance.getOption() as any;
    if (!currentOption.dataZoom || !currentOption.dataZoom.length) return;

    const { start, end } = currentOption.dataZoom[0];
    if (start <= 0.1) {
      lastZoomRef.current = { start, end, direction: "left" };
      triggerFetch("left");
    } else if (end >= 99.9) {
      lastZoomRef.current = { start, end, direction: "right" };
      triggerFetch("right");
    }
  }, []);
  const triggerFetch = (direction: "left" | "right") => {
    fetchData?.({
      start: direction === "right",
      end: direction === "left",
      onStart: () => (isFetchingRef.current = true),
      onEnd: () => (isFetchingRef.current = false),
    });
  };

  useEffect(() => {
    const instance = chartInstanceRef.current;
    if (!instance || xAxis.length === lenX) return;

    const newLen = xAxis.length;
    const oldLen = lenX;
    const diff = newLen - oldLen;
    const lastZoom = lastZoomRef.current;

    if (diff > 0 && lastZoom) {
      let newStart = lastZoom.start;
      let newEnd = lastZoom.end;

      if (lastZoom.direction === "left") {
        newStart = (((lastZoom.start / 100) * oldLen + diff) / newLen) * 100;
        newEnd = (((lastZoom.end / 100) * oldLen + diff) / newLen) * 100;
      } else if (lastZoom.direction === "right") {
        newStart = (((lastZoom.start / 100) * oldLen) / newLen) * 100;
        newEnd = (((lastZoom.end / 100) * oldLen) / newLen) * 100;
      }

      instance.setOption({ dataZoom: [{ start: newStart, end: newEnd }] });
      lastZoomRef.current = null;
    }
    setLenX(newLen);
  }, [xAxis.length]);

  const onChartReady = (instance: echarts.ECharts) => {
    chartInstanceRef.current = instance;
    const debouncedHandler = useDebounce(() => handleDataZoom(instance), 300);
    instance.on("dataZoom", debouncedHandler);
  };

  return (
    <LineChart
      loading={isFetchingRef.current}
      onChartReady={onChartReady}
      className={className}
      globalOptions={{
        tooltip: {},
        legend: { data: legend, top: "3%" },
        ...globalOptions,
      }}
      options={{
        series,
        xAxis: [{ type: "category", data: xAxis }],
        yAxis: [{ type: "value" }],
      }}
    />
  );
};
