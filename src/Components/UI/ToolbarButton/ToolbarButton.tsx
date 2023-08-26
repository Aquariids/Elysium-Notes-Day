import { ButtonProps } from "./ToolbarButton.props";

const ToolbarButton = ({ children, name, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};

export default ToolbarButton;
