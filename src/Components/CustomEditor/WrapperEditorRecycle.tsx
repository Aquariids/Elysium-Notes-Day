import { ReactNode, useState } from "react";
import s from "./CustomEditor.module.scss";
import Modal from "./Modal";

const WrapperEditorRecycle = ({ routerReclycle, children }: any) => {
  const [display, setDisplay] = useState("none");
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTimeoutInProgress, setIsTimeoutInProgress] = useState(false);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  return (
    <div
      onMouseMove={() => {}}
      onClick={(event) => {
        const { clientX, clientY } = event;
        setDisplay("flex");
        setIsAnimating(true);
        setIsTimeoutInProgress(true);
        if (!isClickBlocked) {
          setPosition({ x: clientX, y: clientY });
          setIsClickBlocked(true);
          setTimeout(() => {
            setDisplay("none");
            setIsAnimating(false);
            setIsTimeoutInProgress(false);
            setIsClickBlocked(false);
          }, 3000);
        }
      }}
    >
      {routerReclycle && (
        <Modal
          className={`${s.modal} ${isAnimating ? `${s.animated}` : ""}`}
          style={{
            display: display,
            position: "absolute",
            left: position.x,
            top: position.y,
          }}
        />
      )}

      {children}
    </div>
  );
};

export default WrapperEditorRecycle;
