import { request } from "./useRequest";

export interface ChartSeriesProps {
  name: string;
  type: "line";
  data: number[];
}

export interface ChartDataProps {
  legend: string[];
  xAxis: string[];
  series: ChartSeriesProps[];
}

export interface DeviceDetailProps<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  status: number;
}

export class DeviceService {
  static url_prefix = "/device";

  static async get_chart_data(device_type: "pf" | "xf" | "wsd" | "yc", device_id: string): Promise<ResultProps<ChartDataProps>> {
    return await request(`${this.url_prefix}/${device_type}_chart`, { device_id }, "GET");
  }

  static async post_edit_device_params(device_id: string, key: string, value: string | number | boolean): Promise<ResultProps<undefined>> {
    return await request(`${this.url_prefix}/edit_device_params`, { device_id, key, value }, "POST");
  }

  static async get_full_data(): Promise<ResultProps<GetFullDataProps>> {
    return await request(`${this.url_prefix}/full_data`, {}, "GET");
  }

  static async get_device_detail<T>(
    device_id: string,
    start_time?: string,
    end_time?: string,
    page?: number,
    page_size?: number
  ): Promise<DeviceDetailProps<T>> {
    return await request(`${this.url_prefix}/device_detail`, { device_id, page, page_size, start_time, end_time }, "GET");
  }
}
