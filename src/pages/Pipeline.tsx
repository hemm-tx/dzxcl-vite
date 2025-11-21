import { Flex } from "@/components";
import { selectFJData, useAppSelector } from "@/store";
import { Zoom } from "react-awesome-reveal";

export default function Home() {
  const animationDuration = useAppSelector((state) => state.system.animationDuration);
  const data = useAppSelector(selectFJData);

  const labels_cfg = [
    { text: "排风机1", x: 1640, y: 20 },
    { text: "排风机2", x: 2020, y: 20 },
    { text: "新风机组1", x: 1550, y: 1070 },
    { text: "新风机组2", x: 2450, y: 20 },
  ];

  return (
    <Flex.Col full className="place-items-center">
      <Zoom triggerOnce duration={animationDuration} className="absolute top-20 w-[95%]">
        <svg viewBox="0 0 3654 1224" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
          <image href="/modal/pipeline.png" x="0" y="0" width="3654" height="1224" />
          {data?.fjStatus.pf1 && (
            <path
              id="Exhaust-fan-1"
              d="M2106,46 L2164,560 Q2161,571 2145,577 L1820,577 Q1812,575 1805,563 L1805,468"
              stroke="#009"
              strokeWidth="12"
              fill="none"
              opacity="0.3"
              strokeDasharray="80"
              strokeDashoffset="80"
            />
          )}
          {data?.fjStatus.pf2 && (
            <path
              id="Exhaust-fan-2"
              d="M1734,57 L1728,298 Q1728,312 1705,320 L1397,320 Q1368,324 1358,349 L1278,864 Q1274,886 1251,889 L872,890"
              stroke="#009"
              strokeWidth="12"
              fill="none"
              opacity="0.3"
              strokeDasharray="80"
              strokeDashoffset="80"
            />
          )}
          {data?.fjStatus.xf1 && (
            <>
              <path
                id="New-fan-1-0"
                d="M1649,1064 L1668,618
            M1701,463 L1704,401 Q1710,380 1763,382 L1863,380 Q1885,387 1890,403 L1893,443 Q1882,463 1869,463 L1859,463 Q1846,460 1844,446 L1844,424
            M1701,463 L1704,401 Q1710,380 1763,382 L1863,380 Q1885,387 1890,403 L1893,443 Q1882,463 1869,463 L1859,465 Q1845,470 1844,474 L1844,558
            M1701,463 L1704,401 Q1710,380 1763,382 L1863,380 Q1885,387 1890,403 L1893,443 L1899,447 Q1906,463 1917,463 L1943,463 Q1946,451 1948,446 L1947,428
            M1701,463 L1704,401 Q1710,380 1763,382 L1863,380 Q1885,387 1890,403 L1893,443 L1899,447 Q1906,463 1917,463 L1943,463 Q1949,476 1950,481 L1951,503 M1951,516 L1952,555
            M1701,463 L1704,401 Q1710,380 1763,382 L1863,380 Q1885,387 1890,403 L1893,443 L1899,447 Q1906,463 1917,463 L1970,463
            M1996,463 L2016,463 Q2020,453 2022,448 L2020,423
            M1996,463 L2016,463 Q2025,472 2024,480 L2025,491 M2028,517 L2029,558
            M1996,463 L2036,463 Q2043,465 2046,472 L2047,492 M2049,518 L2050,529 Q2053,533 2060,534 L2138,534"
                stroke="#090"
                strokeWidth="12"
                fill="none"
                opacity="0.3"
                strokeDasharray="80"
                strokeDashoffset="80"
              />
              <path
                id="New-fan-1-1"
                d="M1705,618 L1705,634 Q1709,640 1717,644 L1781,645
            M1886,645 L1982,644 Q1990,640 1992,632 L1990,593 M1989,566 L1985,517
            M1984,502 L1984,500 L1988,497 L2091,497
            M1984,502 L1984,492 L1985,470 L1983,425 L1981,416 L1978,362 Q1987,357 1994,355 L2018,355 Q2027,359 2031,368 L2032,387 Q2038,391 2044,395 L2059,395 L2070,400
            M1984,502 L1984,492 L1985,470 L1983,425 L1981,416 L1978,362 Q1965,355 1960,354 L1903,355 M1883,355 L1792,356 L1779,361"
                stroke="#FEC838"
                strokeWidth="12"
                fill="none"
                opacity="0.3"
                strokeDasharray="80"
                strokeDashoffset="80"
              />
            </>
          )}
          {data?.fjStatus.xf2 && (
            <>
              <path
                id="New-fan-2-0"
                d="M2556,82 L2658,438 Q2660,443 2658,448
            M2542,456 L2405,456 Q2397,465 2396,472 L2411,548 Q2408,559 2397,562 L2366,562 L2350,570
            M2542,456 L2405,456 Q2397,465 2396,472 L2411,548 Q2419,559 2428,562 L2465,562 L2476,568
            M2542,456 L2363,456 L2331,456 L2228,457 Q2222,458 2221,465 L2229,523 L2229,534
            M2542,456 L2363,456 Q2350,448 2342,436 L2339,417 Q2330,408 2321,406 L2230,406 L2214,413
            M2542,456 L2363,456 Q2350,448 2342,436 L2339,417 Q2346,408 2352,406 L2399,406 L2408,411"
                stroke="#090"
                strokeWidth="12"
                fill="none"
                opacity="0.3"
                strokeDasharray="80"
                strokeDashoffset="80"
              />
              <path
                id="New-fan-2-1"
                d="M2634,434 L2625,400 Q2623,391 2611,388
            M2547,390 L2452,389 Q2441,383 2433,371 L2430,352
            M2547,390 L2452,389 Q2441,395 2440,401 L2443,418 L2458,441 L2459,444 M2466,477 L2492,596 Q2490,603 2479,605 L2282,605 Q2277,607 2275,615 L2277,636 L2277,648
            M2547,390 L2192,390 Q2182,393 2180,402 L2187,467 Q2181,477 2170,481 M2136,481 L2115,481 L2101,486
            M2547,390 L2192,390 Q2182,393 2180,402 L2189,467 L2191,491 L2200,560 Q2204,568 2209,569 L2240,571 L2249,574"
                stroke="#FEC838"
                strokeWidth="12"
                fill="none"
                opacity="0.3"
                strokeDasharray="80"
                strokeDashoffset="80"
              />
            </>
          )}
          <style>
            {`/* 设置动画效果 */
              @keyframes fluid-animation {
                0% { stroke-dashoffset: 80; }
                100% { stroke-dashoffset: -80; }
              }
              @keyframes fluid-animation-reverse {
                0% { stroke-dashoffset: -80; }
                100% { stroke-dashoffset: 80; }
              }
              #New-fan-1-0, #New-fan-2-0 {
                animation: fluid-animation 3s linear infinite;
              }
              #New-fan-1-1, #New-fan-2-1, #Exhaust-fan-1, #Exhaust-fan-2 {
                animation: fluid-animation-reverse 3s linear infinite;
              }
            `}
          </style>
          {labels_cfg.map((item, idx) => (
            <CreateLabel key={`label-${idx}`} text={item.text} x={item.x} y={item.y} />
          ))}
        </svg>
      </Zoom>
    </Flex.Col>
  );
}

interface LabelProps {
  key: string | number;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  bgc?: string;
}
const CreateLabel: React.FC<LabelProps> = ({ text, x, y, width = 200, height = 70, color = "#fff", bgc = "#2FE7FF88" }) => (
  <>
    <rect width={width} height={height} fill={bgc} x={x} y={y} rx={20} />
    <text x={x + width / 2} y={y + height / 2 + 4} fill={color} fontSize={30} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
      {text}
    </text>
  </>
);
