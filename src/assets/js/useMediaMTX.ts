import { useAppDispatch, useAppSelector, setIsMediaMTXStart, setMediaMTXStartLoading, setMediaMTXStart } from "@/store";
import { useEffect } from "react";
import { UseInvoke } from "./";
import { message } from "@/utils/antdGlobal";

export const useMediaMTX = () => {
  const dispatch = useAppDispatch();
  const { mediaMTXStart, mediaMtxStartLoading } = useAppSelector((state) => state.system);

  useEffect(() => {
    setMediaMTXStartLoading(true);
    if (!mediaMTXStart) {
      new UseInvoke()
        .success(() => dispatch(setIsMediaMTXStart(true)))
        .error(() => {
          dispatch(setMediaMTXStart(false));
          message.error("摄像头数据请在客户端调用");
        })
        .finally(() => setMediaMTXStartLoading(false))
        .invoke("start_mediamtx");
    } else {
      new UseInvoke()
        .success(() => dispatch(setIsMediaMTXStart(false)))
        .error(() => {
          dispatch(setMediaMTXStart(true));
          message.error("摄像头数据请在客户端调用");
        })
        .finally(() => setMediaMTXStartLoading(false))
        .invoke("stop_mediamtx");
    }
  }, [mediaMTXStart]);

  return { mediaMtxStartLoading };
};
