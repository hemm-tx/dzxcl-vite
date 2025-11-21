import { type FC } from "react";

interface MDeviceHeaderDataProps {
  label: string;
  value: string | number;
}

interface MDeviceHeaderProps extends ComponentDefaultProps {
  data: MDeviceHeaderDataProps[];
}

export const DeviceHeader: FC<MDeviceHeaderProps> = ({ data, className }) => {
  const itemCfg = [
    { color: "#5BDEAB", x: 140 },
    { color: "#FF9F6B", x: 340 },
    { color: "#FEC838", x: 550 },
    { color: "#4899FE", x: 755 },
  ];
  return (
    <svg className={className} viewBox="0 0 950 60" preserveAspectRatio="xMidYMid meet">
      <style>
        {`${itemCfg
          .map((item, idx) => {
            return `.device-header-item-${idx} {
            x: ${item.x};
            .value {
               color: ${item.color};
               text-shadow: 0px 0px 5px ${item.color};
             }
           }`;
          })
          .join("")}
        `}
      </style>
      <image href="/modal/device-header.png" x="0" y="0" height="55" width="950" />
      {data.map((item, idx) => (
        <foreignObject key={idx} className={`device-header-item-${idx}`} y="-3" width="150" height="55">
          <div className="flex flex-col h-full justify-center cursor-default">
            <span className="text-2xl font-[electronicFont] value">{item.value}</span>
            <span className="text-[#03A5C4] text-xs font-bold">{item.label}</span>
          </div>
        </foreignObject>
      ))}
    </svg>
  );
};
