import { Spin } from "antd";
import React, { useState } from "react";

export interface MIframeProps {
  src: string;
  key?: string;
}

export const MIframe: React.FC<MIframeProps> = ({ src }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="size-full">
      <Spin spinning={loading} size="large" tip="加载中..." wrapperClassName="size-full">
        <iframe
          allow="camera; microphone; display-capture"
          loading="lazy"
          width="100%"
          height="100%"
          title="RTSP Stream"
          src={src}
          onLoad={() => setLoading(false)}
          onError={() => console.log("加载失败：")}
        />
      </Spin>
    </div>
  );
};
