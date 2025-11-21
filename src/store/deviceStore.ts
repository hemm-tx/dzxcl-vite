import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from ".";
import { AlarmService, DeviceService } from "@/api";
import type { QueryTableParamsProps, RecordResultProps, PostAffirmAlarmParamsProps } from "@/api";

interface SDeviceSliceProps {
  deviceDataList: { [key: string]: DeviceParamsProps };
  deviceStatusData: DeviceStatusDataProps | null;
  alarmStatusData: AlarmStatusProps | null;
  alarmTotal: number;
  logTotal: number;
  alarmTableData: AlarmTableDataProps[];
  logTableData: RecordTableDataProps[];
}

const initialState: SDeviceSliceProps = {
  deviceDataList: {},
  deviceStatusData: null,
  alarmStatusData: null,
  alarmTotal: 0,
  logTotal: 0,
  alarmTableData: [],
  logTableData: [],
};

export const get_alarm_table_data = createAsyncThunk<ResultProps<RecordResultProps<AlarmTableDataProps>>, QueryTableParamsProps | undefined>(
  "deviceStore/get_alarm_table_data",
  async (params) => await AlarmService.get_alarm_table_data(params ?? {}).then((res) => res)
);

export const get_log_table_data = createAsyncThunk<ResultProps<RecordResultProps<RecordTableDataProps>>, QueryTableParamsProps | undefined>(
  "deviceStore/get_log_table_data",
  async (params) => await AlarmService.get_log_table_data(params ?? {}).then((res) => res)
);

export const post_affirm_alarm = createAsyncThunk<ResultProps<undefined>, PostAffirmAlarmParamsProps>(
  "deviceStore/post_affirm_alarm",
  async (params) => await AlarmService.post_affirm_alarm(params).then((res) => res)
);

export const post_edit_device_params = createAsyncThunk<ResultProps<undefined>, { device_id: string; key: string; value: string | number | boolean }>(
  "deviceStore/post_edit_device_params",
  async (params) => await DeviceService.post_edit_device_params(params.device_id, params.key, params.value).then((res) => res)
);

export const get_full_data = createAsyncThunk<ResultProps<GetFullDataProps>, undefined>(
  "deviceStore/get_full_data",
  async () => await DeviceService.get_full_data().then((res) => res)
);

const deviceSlice = createSlice({
  name: "deviceStore",
  initialState,
  reducers: {
    setDeviceDataList: (state, action) => {
      const payload = action.payload as DeviceParamsProps[];
      state.deviceDataList = Object.fromEntries([...payload.map((item) => [item.device_id, item])]);
    },
    setDeviceStatusData: (state, action) => {
      state.deviceStatusData = action.payload;
    },
    setAlarmStatusData: (state, action) => {
      state.alarmTotal = action.payload.total;
      state.alarmStatusData = action.payload;
    },
    setLogTotal: (state, action) => {
      state.logTotal = action.payload.total;
    },
    setFullData: (state, action) => {
      const payload = action.payload.device_data as DeviceParamsProps[];
      state.deviceDataList = Object.fromEntries([...payload.map((item) => [item.device_id, item])]);
      state.deviceStatusData = action.payload.device_status;
      state.alarmTotal = action.payload.alarm.total;
      state.alarmStatusData = action.payload.alarm;
      state.logTotal = action.payload.log.total;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_alarm_table_data.fulfilled, (state, action) => {
      state.alarmTableData = action.payload.data.data;
    });
    builder.addCase(get_log_table_data.fulfilled, (state, action) => {
      state.logTableData = action.payload.data.data;
    });
    builder.addCase(post_edit_device_params.fulfilled, () => {
      get_full_data();
    });
    builder.addCase(get_full_data.fulfilled, (state, action) => {
      const { device_data, device_status, alarm, log } = action.payload.data;
      state.deviceDataList = Object.fromEntries([...device_data.map((item) => [item.device_id, item])]);
      state.deviceStatusData = device_status;
      state.alarmTotal = alarm.total;
      state.alarmStatusData = alarm;
      state.logTotal = log.total;
    });
  },
});

export const { setDeviceDataList, setDeviceStatusData, setAlarmStatusData, setLogTotal, setFullData } = deviceSlice.actions;
export default deviceSlice.reducer;

export const selectFJData = createSelector(
  (state: RootState) => state.device.deviceDataList,
  (deviceDataList) => {
    if (deviceDataList === null) return undefined;
    const pfDataList: DeviceParamsProps[] = [];
    const xfDataList: DeviceParamsProps[] = [];
    let fjStatus: { pf1: Boolean; pf2: Boolean; xf1: Boolean; xf2: Boolean } = { pf1: false, pf2: false, xf1: false, xf2: false };

    for (const item in deviceDataList) {
      if (item.includes("PLC")) {
        pfDataList.push(deviceDataList[item]);
        if (item === "PLC-029") fjStatus.pf1 = deviceDataList[item].data[3].value as boolean;
        else if (item === "PLC-030") fjStatus.pf2 = deviceDataList[item].data[3].value as boolean;
      } else if (item.includes("KTJZ")) {
        xfDataList.push(deviceDataList[item]);
        if (item === "KTJZ-036") fjStatus.xf1 = deviceDataList[item].data[2].value as boolean;
        else if (item === "KTJZ-037") fjStatus.xf2 = deviceDataList[item].data[2].value as boolean;
      }
    }
    return { pfDataList, xfDataList, fjStatus };
  }
);

export const selectDeviceHeaderData = createSelector(
  (state: RootState) => state.device.deviceStatusData,
  (deviceStatusData) => {
    if (deviceStatusData === null) return undefined;
    const { total, offline, fault } = deviceStatusData;
    return [
      {
        label: "监测设备数量",
        value: total,
      },
      {
        label: "预警设备数量",
        value: fault,
      },
      {
        label: "离线设备数量",
        value: offline,
      },
      {
        label: "离线设备占比",
        value: (offline / total) * 100 + " %",
      },
    ];
  }
);

export const selectDevicePieChartData = createSelector(
  (state: RootState) => state.device.deviceStatusData,
  (deviceStatusData) => {
    if (deviceStatusData === null) return undefined;
    const { total, online, offline, fault } = deviceStatusData;
    return {
      title: "设备总数",
      total,
      data: [
        { value: online, name: "在线设备" },
        { value: offline, name: "离线设备" },
        { value: fault, name: "告警设备" },
      ],
    };
  }
);

export const selectAlarmCompareData = createSelector(
  (state: RootState) => state.device.alarmStatusData,
  (_data) => {
    if (_data === null) return undefined;
    else {
      const { last_week, current_week, today, yesterday, today_affirm, today_dispose } = _data;
      return [
        {
          title: "本周报警总数",
          value: current_week,
          unit: "条",
          label: "较上周",
          compare: last_week !== 0 ? +(((_data.current_week - last_week) / last_week) * 100).toFixed(2) : 0,
        },
        {
          title: "当天报警总数",
          value: today,
          unit: "条",
          label: "较昨日",
          compare: yesterday !== 0 ? +(((_data.today - yesterday) / yesterday) * 100).toFixed(2) : 0,
        },
        {
          title: "今日已确认报警数",
          value: today_affirm,
          unit: "条",
          label: "总占比",
          compare: today !== 0 ? +((today_affirm / today) * 100).toFixed(2) : 0,
        },
        {
          title: "今日已处理报警数",
          value: today_dispose,
          unit: "条",
          label: "总占比",
          compare: today !== 0 ? +((today_dispose / today) * 100).toFixed(2) : 0,
        },
      ];
    }
  }
);
