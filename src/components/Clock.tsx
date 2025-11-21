import { useState, useEffect } from "react";
import "@/assets/styles/clock.scss";

export function Clock() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const [today, setToday] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const cd = new Date();
      setTime(zeroPadding(cd.getHours(), 2) + ":" + zeroPadding(cd.getMinutes(), 2) + ":" + zeroPadding(cd.getSeconds(), 2));
      setDate(zeroPadding(cd.getFullYear(), 4) + "-" + zeroPadding(cd.getMonth() + 1, 2) + "-" + zeroPadding(cd.getDate(), 2));
      setToday(week[cd.getDay()]);
    }, 1000);

    return () => {
      timer && clearInterval(timer);
    };
  }, []);

  const zeroPadding = (num: number, digit: number) => {
    let zero = "";
    for (let i = 0; i < digit; i++) {
      zero += "0";
    }
    return (zero + num).slice(-digit);
  };

  return (
    <div className="M-clock">
      <div className="date">
        <span>{date}</span>
        <ol>{today}</ol>
      </div>
      <div className="time">{time}</div>
    </div>
  );
}
