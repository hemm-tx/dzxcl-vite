import { Button, Descriptions, Form, InputNumber, Switch, Badge, Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { message, modal } from "@/utils/antdGlobal";
import { encrypt } from "@/assets/js";
import { useState } from "react";

export interface MDeviceStatusProps {
  status: boolean;
}

export interface MDeviceOnlineProps {
  online: boolean;
}

export interface MDevicesDescriptionsDefaultProps extends MDeviceOnlineProps {
  title?: string;
  key?: string | number;
}

export const DeviceOnlineBadge: React.FC<MDeviceOnlineProps> = ({ online }) => {
  return (
    <Badge
      status={online ? "success" : "error"}
      text={<span className={`${online ? "text-[#52c41a]" : "text-red-500"} cursor-default font-bold text-xs`}>{`设备${online ? "在线" : "离线"}`}</span>}
    />
  );
};

export const DeviceStartStatusBadge: React.FC<MDeviceStatusProps> = ({ status }) => {
  return status ? <span className="text-green-500">运行</span> : <span className="text-red-500">停机</span>;
};

export interface DeviceInputNumberProps extends ComponentDefaultProps {
  label?: string;
  defaultValue?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  isReactive?: boolean;
  onSubmit?: (value: number) => void;
  verify?: boolean;
}
export const DeviceInputNumber: React.FC<DeviceInputNumberProps> = (props) => {
  const { label, defaultValue, disabled, min = -100, max = 100, step = 1, isReactive, onSubmit, verify } = props;
  const [verifyCode, setVerifyCode] = useState<string>("");

  const onFinish = (values: { inputNumber: number | null }) => {
    if (values.inputNumber === null) {
      message.warning("请正确输入所需内容");
      return;
    }
    if (values.inputNumber === defaultValue) return;
    if (verify) {
      modal.confirm({
        title: "请输入权限密码验证修改权限",
        content: <Input.Password placeholder="请输入密码" onChange={(e) => setVerifyCode(e.target.value)} />,
        onOk() {
          if (encrypt(verifyCode) === import.meta.env.VITE_VERIFY_CODE) values.inputNumber && onSubmit?.(values.inputNumber);
          else message.error("密码错误，请重新输入");
        },
      });
    } else onSubmit?.(values.inputNumber);
  };

  return (
    <Form size="small" onFinish={onFinish} disabled={disabled} style={{ display: "inline-flex", ...props.style }}>
      <Form.Item name="inputNumber" label={label} initialValue={defaultValue}>
        <InputNumber controls={false} size="small" min={min} max={max} step={step} />
      </Form.Item>
      <Form.Item>
        {isReactive ? (
          <>
            <div className="ml-3 max-[1600px]:hidden">
              <Button variant="solid" color="cyan" size="small" icon={<SaveOutlined />} htmlType="submit">
                保存
              </Button>
            </div>
            <div className="ml-2 min-[1600px]:hidden">
              <Button variant="solid" color="cyan" size="small" icon={<SaveOutlined />} htmlType="submit" />
            </div>
          </>
        ) : (
          <Button variant="solid" color="cyan" size="small" icon={<SaveOutlined />} className="ml-3" htmlType="submit">
            保存
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export interface MControlPanelProps extends MDevicesDescriptionsDefaultProps {
  deviceSwitch: boolean;
  setSwitch?: (label: string, value: boolean) => void;
  valveAngle: number;
}
/**
 * 排风控制器组件
 * @param props
 * @returns
 */
export const MControlPanel: React.FC<MControlPanelProps> = (props) => {
  const { title, online, deviceSwitch, setSwitch, valveAngle } = props;
  return (
    <div className="size-full relative">
      <Descriptions
        title={title}
        column={2}
        extra={<DeviceOnlineBadge online={online} />}
        items={[
          {
            key: "switch",
            label: "风阀开关",
            children: <Switch defaultChecked={deviceSwitch} onChange={(checked) => setSwitch?.("set_switch", checked)} disabled={!online} />,
          },
          {
            key: "practical",
            label: "风阀角度",
            children: `${valveAngle} °`,
          },
        ]}
      />
    </div>
  );
};

export interface MPressureControlProps extends MDevicesDescriptionsDefaultProps {
  valveAngle: number;
  differential: number;
  currentDifferential: number;
  setDifferential?: (label: string, value: number) => void;
}
/**
 * 压差控制器组件
 * @param props
 * @returns
 */
export const MPressureControl: React.FC<MPressureControlProps> = (props) => {
  const { title, online, valveAngle, differential, currentDifferential, setDifferential } = props;
  return (
    <div className="size-full relative">
      <Descriptions
        title={title}
        column={2}
        extra={<DeviceOnlineBadge online={online} />}
        items={[
          {
            key: "valve-angle",
            label: "阀门开度",
            children: `${valveAngle} °`,
          },
          {
            key: "differential-pressure",
            label: "实际压差",
            children: `${currentDifferential} Pa`,
          },
          {
            key: "set_differential_pressure",
            label: "设定压差",
            children: (
              <DeviceInputNumber
                min={0}
                max={100}
                defaultValue={differential}
                disabled={!online}
                verify
                onSubmit={(value) => setDifferential?.("set_differential_pressure", value)}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export interface MRoomControlProps extends MDevicesDescriptionsDefaultProps {
  differential: number;
  actualDifferential: number;
  setDifferential?: (value: number) => void;
}
/**
 * 房间控制器组件
 * @param props
 * @returns
 */
export const MRoomControl: React.FC<MRoomControlProps> = (props) => {
  const { title, online, differential, actualDifferential, setDifferential } = props;
  return (
    <div className="size-full relative">
      <Descriptions
        title={title}
        column={1}
        extra={<DeviceOnlineBadge online={online} />}
        items={[
          {
            key: "practical",
            label: "实际房间压差",
            children: `${actualDifferential} Pa`,
          },
          {
            key: "setting",
            label: "设定房间压差",
            children: <DeviceInputNumber defaultValue={differential} disabled={!online} onSubmit={(value) => setDifferential?.(value)} />,
          },
        ]}
      />
    </div>
  );
};

export interface MFumeHoodProps extends MDevicesDescriptionsDefaultProps {
  doorHeight: number;
  faceVelocity: number;
  valveAngle: number;
  emergencyExhaust: boolean;
  setEmergencyExhaust?: (label: string, value: boolean) => void;
  deviceSwitch: boolean;
  setDeviceSwitch?: (label: string, value: boolean) => void;
}
/**
 * 通风柜组件
 * @param props
 * @returns
 */
export const MFumeHood: React.FC<MFumeHoodProps> = (props) => {
  const { title, online, doorHeight, faceVelocity, valveAngle, emergencyExhaust, setEmergencyExhaust, deviceSwitch, setDeviceSwitch } = props;
  return (
    <div className="size-full relative">
      <Descriptions
        title={title}
        column={2}
        extra={<DeviceOnlineBadge online={online} />}
        items={[
          {
            key: "door-height",
            label: "实时门高",
            children: `${doorHeight} cm`,
          },
          {
            key: "face-velocity",
            label: "面风速",
            children: `${faceVelocity} m/s`,
          },
          {
            key: "valve-angle",
            label: "阀门开度",
            children: `${valveAngle} °`,
          },
          {
            key: "emergency-exhaust",
            label: "紧急排风",
            children: (
              <Switch disabled={!online} defaultChecked={emergencyExhaust} onChange={(checked) => setEmergencyExhaust?.("emergency_exhaust", checked)} />
            ),
          },
          {
            key: "device-switch",
            label: "通风柜启停",
            children: <Switch disabled={!online} defaultChecked={deviceSwitch} onChange={(checked) => setDeviceSwitch?.("set_switch", checked)} />,
          },
        ]}
      />
    </div>
  );
};

export interface MSprayTowerProps extends MDevicesDescriptionsDefaultProps, ComponentDefaultProps {
  frequency: number;
  differential: number;
  currentPH: number;
  currentMinPH: number;
  currentMaxPH: number;
  status: boolean;
  setMinPH?: (value: number) => void;
  setMaxPH?: (value: number) => void;
}
/**
 * 喷淋塔组件
 */
export const MSprayTower: React.FC<MSprayTowerProps> = (props) => {
  const { title, online, currentPH, differential, frequency, currentMinPH, currentMaxPH, status, setMinPH, setMaxPH, className, style } = props;
  return (
    <div className={`size-full relative ${className}`} style={style}>
      <Descriptions
        title={title}
        column={2}
        extra={<DeviceOnlineBadge online={online} />}
        items={[
          {
            key: "frequency",
            label: "运行频率",
            children: `${frequency} Hz`,
          },
          {
            key: "differential-pressure",
            label: "管道压差",
            children: `${differential} Pa`,
          },
          {
            key: "current-ph",
            label: "当前PH值",
            children: `${currentPH}`,
          },
          {
            key: "additive-pump-status",
            label: "加药泵状态",
            children: <DeviceStartStatusBadge status={status} />,
          },
          {
            key: "setting-min-ph",
            label: "设定最小PH值",
            span: 2,
            children: (
              <DeviceInputNumber
                style={{ height: "24px" }}
                max={currentMaxPH}
                min={0}
                step={0.1}
                defaultValue={currentMinPH}
                disabled={!online}
                verify
                onSubmit={(value) => setMinPH?.(value)}
              />
            ),
          },
          {
            key: "setting-max-ph",
            label: "设定最大PH值",
            span: 2,
            children: (
              <DeviceInputNumber
                style={{ height: "24px" }}
                max={14}
                min={currentMinPH}
                step={0.1}
                defaultValue={currentMaxPH}
                disabled={!online}
                verify
                onSubmit={(value) => setMaxPH?.(value)}
              />
            ),
          },
        ]}
      />
    </div>
  );
};
