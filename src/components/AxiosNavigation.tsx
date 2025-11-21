import type { ReactNode, FC } from "react";
import { useAxiosNavigation } from "@/api/useRequest";

interface AxiosNavigationProps {
  children: ReactNode;
}

export const AxiosNavigation: FC<AxiosNavigationProps> = ({ children }) => {
  useAxiosNavigation();
  return <>{children}</>;
};
