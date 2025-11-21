declare interface IconComponentProps {
  size?: number;
  color?: string;
}

interface MStatisticProps {
  value: string | number;
  title: string;
  suffix: string;
}

declare interface ComponentDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  key?: string | number;
  loading?: boolean;
}

declare interface ContentComponentDefaultProps extends ComponentDefaultProps {
  children?: React.ReactNode | string;
}

declare interface WeatherDataConfig {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud?: string;
  dew?: string;
}

declare interface AlarmTableDataProps {
  key: string;
  id: string;
  device_id: string;
  device_name: string;
  msg: string;
  created_at: string;
  updated_at: string;
  status: string;
}

declare interface RecordTableDataProps {
  key: string;
  id: string;
  device_id: string;
  device_name: string;
  msg: string;
  created_at: string;
}

declare interface DeviceDataProps {
  label: string;
  title: string;
  value: string | number | boolean;
  unit?: string;
  edit?: {
    type: string;
  };
}

declare interface DeviceParamsProps {
  device_id: string;
  online: boolean;
  updated_at: string;
  fault: boolean;
  data: DeviceDataProps[];
}

declare interface DeviceStatusDataProps {
  total: number;
  online: number;
  offline: number;
  fault: number;
}

declare interface ResultProps<T> {
  status: number;
  msg?: string;
  data: T;
}

declare interface AlarmStatusProps {
  total: number;
  last_week: number;
  current_week: number;
  today: number;
  yesterday: number;
  today_affirm: number;
  today_dispose: number;
}

declare interface GetFullDataProps {
  device_data: DeviceParamsProps[];
  device_status: DeviceStatusDataProps;
  alarm: AlarmStatusProps;
  log: { total: number };
}
