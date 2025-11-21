import { useEffect, useState, type FC } from "react";
import { Empty, Spin } from "antd";
import { Flex } from "./Layout";

export interface CustomizeEmptyProps extends ComponentDefaultProps {
  description?: string | React.ReactNode;
}

export const CustomizeEmpty: FC<CustomizeEmptyProps> = ({ description, className, style }) => {
  return (
    <Flex.Col full center className={className} style={style}>
      <Empty
        image="/images/empty.svg"
        description={
          !description ? (
            <span className="text-white mt-3 cursor-default">no data</span>
          ) : typeof description === "string" ? (
            <span className="text-white mt-3 cursor-default">{description}</span>
          ) : (
            description
          )
        }
      />
    </Flex.Col>
  );
};

export interface CustomizeWrapperProps extends ComponentDefaultProps {
  children?: React.ReactNode;
  timeout?: number;
  error?: boolean;
  emptyDescription?: string | React.ReactNode;
}

export const CustomizeWrapperComponent: FC<CustomizeWrapperProps> = ({ loading = false, error, timeout, children, emptyDescription, className, style }) => {
  const [isTimeout, setIsTimeout] = useState(false);

  const handleTimeout = () => {
    if (timeout) setTimeout(() => setIsTimeout(true), timeout);
  };

  useEffect(handleTimeout, []);

  return (
    <div className={`size-full ${className}`} style={style}>
      <Spin spinning={loading && !isTimeout}>{(isTimeout && loading) || error ? <CustomizeEmpty description={emptyDescription} /> : children}</Spin>
    </div>
  );
};
