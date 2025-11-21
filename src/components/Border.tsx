import { createContext, useContext } from "react";
import "@/assets/styles/border.scss";

interface IBorderBoxTitleProps {
  title?: string | React.ReactNode;
  onClose?: () => void;
}

interface IBorderBoxProps extends ContentComponentDefaultProps, IBorderBoxTitleProps {}

const BorderTitleContext = createContext<IBorderBoxTitleProps | undefined>(undefined);

interface ICloseBtnIconProps extends ComponentDefaultProps {
  onClick?: () => void;
}

const CloseBtnIcon: React.FC<ICloseBtnIconProps> = ({ className, onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className} width="24px" height="24px">
      <style>
        {`
          .close-btn-group {
            cursor: pointer;
          }
          .close-btn-group {
            stroke: #2FE7FF;
          }
          .close-btn-group:hover {
            stroke: #FF5733;
          }
        `}
      </style>
      <g className="close-btn-group" onClick={onClick}>
        <polyline points="12,115 12,12 115,12 115,115 12,115" fill="none" strokeWidth="2" strokeDasharray="8,8" />
        <path d="M30 30 L98 98" fill="none" strokeWidth="4" />
        <path d="M30 98 L98 30" fill="none" strokeWidth="4" />
        <polyline id="close_btn" points="1,127 1,1 127,1 127,127 1,127" fill="transparent" strokeWidth="2" />
        <animate attributeName="stroke" from="#2FE7FF" to="#FF5733" dur="0.3s" repeatCount="1" begin="close_btn.mouseover" />
        <animate attributeName="stroke" from="#FF5733" to="#2FE7FF" dur="0.3s" repeatCount="1" begin="close_btn.mouseout" />
      </g>
    </svg>
  );
};

const BorderBoxTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { title } = useContext(BorderTitleContext) || {};

  return title ? (
    <>
      <div className="M-tit">
        <span>{title}</span>
        <p></p>
      </div>
      <div className="M-cont">{children}</div>
    </>
  ) : (
    children
  );
};

const BorderBoxTitle2: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { title, onClose } = useContext(BorderTitleContext) || {};

  return title ? (
    <div className="size-full flex flex-col relative">
      <div className="mb-2 flex justify-between items-center">
        <span className="border-l-2 pl-2 py-0.5 border-[#2FE7FF] bg-[linear-gradient(to_right,#2FE7FF88,#1070aa00)] text-base text-white flex-1 font-bold cursor-default">
          {title}
        </span>
        {onClose && <CloseBtnIcon className="ml-1" onClick={onClose} />}
      </div>
      <div className="flex-1 relative">{children}</div>
    </div>
  ) : (
    children
  );
};

export const Border1: React.FC<ContentComponentDefaultProps> = ({ children, className }) => {
  return (
    <div className={`${className} flex justify-center items-center`}>
      <div className="M-border-box-1">
        {children}
        <div className="for-b"></div>
      </div>
    </div>
  );
};

export const Border2: React.FC<IBorderBoxProps> = ({ children, className, title }) => {
  const classes = [
    "top-[-2px] left-[-2px]",
    "top-[-2px] right-[-2px] rotate-90",
    "bottom-[-2px] right-[-2px] rotate-180",
    "bottom-[-2px] left-[-2px] rotate-[270deg]",
  ];
  return (
    <div className={className}>
      <div className="p-1 relative border-2 rounded-[10px] border-[#1070aa] size-full">
        <div className="p-[10px_15px] size-full bg-[#14328555] rounded-[10px]">
          <BorderTitleContext.Provider value={{ title }}>
            <BorderBoxTitle>{children}</BorderBoxTitle>
          </BorderTitleContext.Provider>
        </div>
        <div className="for-b"></div>
        {classes.map((className, idx) => (
          <svg key={idx} className={`absolute ${className}`} viewBox="0 0 100 100" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <path d="M 5 80 L 5 30 A25 25 0 0 1 30 5 L 80 5" fill="none" stroke="#7CE7FD" strokeWidth="10" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export const Border3: React.FC<IBorderBoxProps> = ({ children, className, title }) => {
  const classes = [
    "top-[-2px] left-[-2px]",
    "top-[-2px] right-[-2px] rotate-90",
    "bottom-[-2px] right-[-2px] rotate-180",
    "bottom-[-2px] left-[-2px] rotate-[270deg]",
  ];
  return (
    <div className={className}>
      <div className="p-1 relative size-full">
        <div className="p-[10px_15px] size-full bg-[#14328555] rounded-[10px]">
          <BorderTitleContext.Provider value={{ title }}>
            <BorderBoxTitle>{children}</BorderBoxTitle>
          </BorderTitleContext.Provider>
        </div>
        {classes.map((className, idx) => (
          <svg
            key={idx}
            className={`absolute ${className}`}
            viewBox="0 0 200 200"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid meet"
          >
            <polyline points="5,200 5,25 25,5 80,5" fill="none" stroke="#2FE7FF" strokeWidth="4" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export const Border4: React.FC<IBorderBoxProps> = ({ children, className }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <g id="bg">
        <image xlinkHref="/images/circle_bg.svg" />
      </g>
      <animateTransform
        attributeName="transform"
        begin="0s"
        from="0 100 100"
        to="360 100 100"
        type="rotate"
        dur="30s"
        repeatCount="indefinite"
        xlinkHref="#bg"
      />
      <text x="100" y="100" fontSize="28px" alignmentBaseline="middle" textAnchor="middle" fill="#fff">
        {children}
      </text>
    </svg>
  );
};

export const Border5: React.FC<IBorderBoxProps & { value?: number | string; suffix?: string }> = ({ className, title, value, suffix }) => {
  return (
    <svg className={className} viewBox="0 0 200 110" width="200" height="110" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        strokeWidth="1px"
        stroke="rgb(7, 200, 255)"
        fillOpacity="0.102"
        fill="rgb(14, 126, 204)"
        d="M186.262,75.638 C186.637,75.638 186.994,75.614 187.342,75.578 L187.342,98.777 L160.002,98.777 L160.002,87.208 C160.002,84.412 157.747,82.146 154.966,82.146 C152.185,82.146 149.930,84.412 149.930,87.208 L149.930,98.777 L10.355,98.777 L10.355,30.808 C15.521,30.808 16.830,27.894 16.830,24.300 C16.830,20.706 15.521,17.792 10.355,17.792 L10.355,6.223 L187.342,6.223 L187.342,61.237 C186.994,61.201 186.637,61.177 186.262,61.177 C181.295,61.177 178.708,64.414 178.708,68.408 C178.708,72.401 181.295,75.638 186.262,75.638 Z"
      />
      <text x="65" y="25" fontSize="18px" alignmentBaseline="middle" textAnchor="middle" fill="#fff" className="cursor-default">
        {title}
      </text>
      <text x="100" y="75" fontSize="36px" alignmentBaseline="middle" textAnchor="middle" fill="#fff" className="cursor-default">
        <tspan className="font-[electronicFont] text-[#00DEFF] text-shadow-[0_0_5px_#00DEFF]">{value}</tspan>
        <tspan fontSize="22px">{" " + suffix}</tspan>
      </text>
    </svg>
  );
};

export const Border6: React.FC<IBorderBoxProps> = ({ children, className, title, onClose }) => {
  const classes = ["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 rotate-[270deg]"];

  return (
    <div className={className}>
      <div className="p-1 relative size-full">
        <div className="p-[10px_15px] size-full bg-[#14328555]">
          <BorderTitleContext.Provider value={{ title, onClose }}>
            <BorderBoxTitle2>{children}</BorderBoxTitle2>
          </BorderTitleContext.Provider>
        </div>
        {classes.map((className, idx) => (
          <svg
            key={idx}
            className={`absolute ${className}`}
            viewBox="0 0 50 50"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            preserveAspectRatio="xMidYMid meet"
          >
            <polyline points="5,50 5,5 50,5" fill="none" stroke="#2FE7FF" strokeWidth="5" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export const Border7: React.FC<IBorderBoxProps> = ({ children, className, title, onClose }) => {
  return (
    <div className={className}>
      <div className="p-1 relative size-full">
        <div className="p-[10px_15px] size-full bg-[#14328555] rounded-[10px]">
          <BorderTitleContext.Provider value={{ title, onClose }}>
            <BorderBoxTitle2>{children}</BorderBoxTitle2>
          </BorderTitleContext.Provider>
        </div>
      </div>
    </div>
  );
};
