import React, { useEffect } from "react";
import autoAnimate from "@formkit/auto-animate";

interface AutoAnimateContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AutoAnimateContainer: React.FC<
  React.PropsWithChildren<AutoAnimateContainerProps>
> = ({ children, ...props }) => {
  const parent = React.useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div ref={parent} {...props}>
      {children}
    </div>
  );
};

export default AutoAnimateContainer;
