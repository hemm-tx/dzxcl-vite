import { request } from "./useRequest";

export interface RecordResultProps<T> {
  total: number;
  data: T[];
}

export interface QueryTableParamsProps {
  page?: number;
  limit?: number;
  start_time?: string;
  end_time?: string;
  order?: "desc" | "asc";
}

export interface PostAffirmAlarmParamsProps {
  alarm_id: string;
  device_id: string;
  status: "0" | "1" | "2";
}

export class AlarmService {
  static url_prefix = "/alarm";

  static async get_alarm_table_data(props: QueryTableParamsProps): Promise<ResultProps<RecordResultProps<AlarmTableDataProps>>> {
    return await request(`${this.url_prefix}/table/alarm`, { ...props }, "GET");
  }

  static async get_log_table_data(props: QueryTableParamsProps): Promise<ResultProps<RecordResultProps<RecordTableDataProps>>> {
    return await request(`${this.url_prefix}/table/log`, { ...props }, "GET");
  }

  static async post_affirm_alarm(props: PostAffirmAlarmParamsProps): Promise<ResultProps<undefined>> {
    return await request(`${this.url_prefix}/affirm_alarm`, { ...props }, "POST");
  }
}
