import { FC, ReactNode } from "react";

interface DirectionProps {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
}

interface FlexLayoutProps extends ComponentDefaultProps {
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  center?: boolean;
  full?: boolean;
  children?: ReactNode;
}

interface FlexLayoutNameProps {
  Row: FC<FlexLayoutProps>;
  Col: FC<FlexLayoutProps>;
}

export const Flex: FC<FlexLayoutProps & DirectionProps> & FlexLayoutNameProps = (props) => {
  const { className, style, children, center, justify, align, full, direction } = props;
  const isCenter = (): string => {
    const _classes: string[] = [];
    if (direction) _classes.push(`flex-${direction}`);
    if (full) _classes.push("size-full");
    if (center) _classes.push("justify-center items-center");
    else {
      if (justify) _classes.push(`justify-${justify}`);
      if (align) _classes.push(`items-${align}`);
    }
    return _classes.join(" ");
  };
  return (
    <div className={`flex ${isCenter()} ${className}`} style={style}>
      {children}
    </div>
  );
};

const FlexRow: FC<FlexLayoutProps> = (props) => <Flex {...props} direction="row" />;
const FlexCol: FC<FlexLayoutProps> = (props) => <Flex {...props} direction="col" />;

Flex.Row = FlexRow;
Flex.Col = FlexCol;
