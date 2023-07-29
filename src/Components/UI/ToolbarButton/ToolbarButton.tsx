import { ButtonProps } from "./ToolbarButton.props";
import s from './ToolbarButton.module.scss';

const ToolbarButton = ({children, name, ...props}:ButtonProps) => {
    console.log(name);
    
        return (

            <button {...props}>
            {children}
            </button>
        )
    }



export default ToolbarButton;