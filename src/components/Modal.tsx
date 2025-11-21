import { Modal } from "antd";
import React from "react";
import { CloseCircleFilled } from "@ant-design/icons";

export interface MPopCardModalProps {
  title?: string;
  loading?: boolean;
  open: boolean;
  onCancel: () => void;
  children?: React.ReactNode;
  width?: string | number;
}

export const MPopCardModal: React.FC<MPopCardModalProps> = ({ title, loading, open, onCancel, children, width = 600 }) => {
  return (
    <Modal
      title={title}
      loading={loading}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      centered
      width={width}
      closeIcon={<CloseCircleFilled style={{ color: "#CCCCCC", fontSize: "20px" }} />}
    >
      {children}
    </Modal>
  );
};
