import { useAppSelector, useAppDispatch, post_edit_device_params } from "@/store";
import { useState } from "react";
import { Flex, MPopCardModal, SVGForeignIcon } from "@/components";
import { MSprayTower } from "@/components/Devices";
import { Zoom } from "react-awesome-reveal";
import { message } from "@/utils/antdGlobal";

const devices = [
  {
    x: "1580",
    y: "220",
    id: "PLC-029",
    plt_id: "PLT-031",
  },
  {
    x: "2225",
    y: "145",
    id: "PLC-030",
    plt_id: "PLT-032",
  },
];

export default function FlueGas() {
  const dispatch = useAppDispatch();
  const system = useAppSelector((state) => state.system);
  const deviceDataList = useAppSelector((state) => state.device.deviceDataList);
  const [showModal, setShowModal] = useState(false);

  const [modalData, setModalData] = useState({
    online: false,
    title: "",
    id: "",
    plt_id: "",
    data: {
      frequency: 0,
      differential: 0,
      status: false,
      currentPH: 0,
      currentMinPH: 0,
      currentMaxPH: 0,
    },
  });

  const handleClick = (id: string, plt_id: string) => {
    const plt = deviceDataList[plt_id];
    const tfg = deviceDataList[id];
    setShowModal(true);
    setModalData({
      title: `喷淋塔-${plt_id}`,
      online: plt.online,
      plt_id,
      id,
      data: {
        frequency: +tfg.data[0].value,
        differential: +tfg.data[1].value,
        status: plt.data[3].value as boolean,
        currentPH: +plt.data[0].value,
        currentMinPH: +plt.data[2].value,
        currentMaxPH: +plt.data[1].value,
      },
    });
  };

  const edit_max_ph = (id: string, value: number) => {
    dispatch(post_edit_device_params({ device_id: id, key: "set_ph_max_value", value }))
      .unwrap()
      .then(() => {
        setModalData((prev) => ({ ...prev, data: { ...prev.data, currentMaxPH: value } }));
        message.success("保存成功");
      });
  };

  const edit_min_ph = (id: string, value: number) => {
    dispatch(post_edit_device_params({ device_id: id, key: "set_ph_min_value", value }))
      .unwrap()
      .then(() => {
        setModalData((prev) => ({ ...prev, data: { ...prev.data, currentMinPH: value } }));
        message.success("保存成功");
      });
  };

  return (
    <>
      <Flex.Col full className="place-items-center relative overflow-hidden">
        <Zoom triggerOnce duration={system.animationDuration} className="absolute top-20 w-[95%]">
          <svg viewBox="0 0 3680 1223" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
            <image href="/modal/flue-gas.png" x="0" y="0" width="3680" height="1223" />
            {system.deviceIconShow &&
              devices.map((item) => <SVGForeignIcon.Device key={item.id} {...item} onClick={() => handleClick(item.id, item.plt_id)} />)}
          </svg>
        </Zoom>
      </Flex.Col>
      <MPopCardModal title="排风机组-废气处理" open={showModal} onCancel={() => setShowModal(false)} width={700}>
        <MSprayTower
          className="py-5 px-8"
          title={modalData.title}
          online={modalData.online}
          {...modalData.data}
          setMinPH={(e) => edit_min_ph(modalData.plt_id, e)}
          setMaxPH={(e) => edit_max_ph(modalData.plt_id, e)}
        />
      </MPopCardModal>
    </>
  );
}
