import { lazy } from "react";

const IconList = {
  Camera: lazy(() => import("@/assets/icons").then((m) => ({ default: m.CameraIcon }))),
  Differential: lazy(() => import("@/assets/icons").then((m) => ({ default: m.DifferentialIcon }))),
  Humiture: lazy(() => import("@/assets/icons").then((m) => ({ default: m.HumitureIcon }))),
  Setting: lazy(() => import("@/assets/icons").then((m) => ({ default: m.SettingIcon }))),
  Device: lazy(() => import("@/assets/icons").then((m) => ({ default: m.DeviceIcon }))),
  Pipeline: lazy(() => import("@/assets/icons").then((m) => ({ default: m.PipelineIcon }))),
  FlueGas: lazy(() => import("@/assets/icons").then((m) => ({ default: m.FlueGasIcon }))),
  Resource: lazy(() => import("@/assets/icons").then((m) => ({ default: m.ResourceIcon }))),
  BubbleCamera: lazy(() => import("@/assets/icons").then((m) => ({ default: m.BubbleCamera }))),
  BubbleDifferential: lazy(() => import("@/assets/icons").then((m) => ({ default: m.BubbleDifferential }))),
  BubbleHumiture: lazy(() => import("@/assets/icons").then((m) => ({ default: m.BubbleHumiture }))),
  BubbleSetting: lazy(() => import("@/assets/icons").then((m) => ({ default: m.BubbleSetting }))),
  BubbleDevice: lazy(() => import("@/assets/icons").then((m) => ({ default: m.BubbleDevice }))),
};

export type IconName = keyof typeof IconList;
export type IconTemplateProps = { name: IconName } & IconComponentProps;
interface BubbleIconDefaultProps {
  x: number | string;
  y: number | string;
  id?: string;
  onClick?: () => void;
}
export type ForeignIconProps = BubbleIconDefaultProps & IconTemplateProps;
interface BubbleIconProps extends IconComponentProps, BubbleIconDefaultProps {}

export const IconTemplate: React.FC<IconTemplateProps> = ({ name, size, color }) => {
  const Icon = IconList[name];
  return <Icon {...{ size, color }} />;
};

export const SVGForeignIcon: React.FC<ForeignIconProps> & {
  Camera: React.FC<BubbleIconProps>;
  Differential: React.FC<BubbleIconProps>;
  Humiture: React.FC<BubbleIconProps>;
  Setting: React.FC<BubbleIconProps>;
  Device: React.FC<BubbleIconProps>;
} = ({ name, size = 120, color, x, y, id, onClick }) => {
  return (
    <>
      <foreignObject id={id} className="cursor-pointer" x={`${+x - size / 2}`} y={`${+y - size}`} width={size} height={size} onClick={onClick}>
        <IconTemplate {...{ name, size, color }} />
      </foreignObject>
      {id && (
        <animateTransform
          xlinkHref={`#${id}`}
          attributeName="transform"
          type="translate"
          values="0 0;0 -10;0 0"
          begin="0.5"
          repeatCount="indefinite"
          dur="1s"
        />
      )}
    </>
  );
};

SVGForeignIcon.Camera = (props) => <SVGForeignIcon {...props} name="BubbleCamera" />;
SVGForeignIcon.Differential = (props) => <SVGForeignIcon {...props} name="BubbleDifferential" />;
SVGForeignIcon.Humiture = (props) => <SVGForeignIcon {...props} name="BubbleHumiture" />;
SVGForeignIcon.Setting = (props) => <SVGForeignIcon {...props} name="BubbleSetting" />;
SVGForeignIcon.Device = (props) => <SVGForeignIcon {...props} name="BubbleDevice" />;
