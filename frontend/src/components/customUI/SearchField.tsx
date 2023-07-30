import * as React from "react";
import { Input, InputProps } from "../ui/input";
import { AiOutlineSearch } from "react-icons/ai";

const SearchField = React.forwardRef<HTMLInputElement, InputProps> (
    ({className, type, ...props}, ref) => {
        return (
            <div className="relative w-1/2 left-4">
            <AiOutlineSearch className="h-8 w-8  absolute p-1 box-border right-3 top-1/2 transform -translate-y-1/2"/>
            <Input className={className} {...props} ref={ref} type={type}/>
            </div>
        )
    }
    
)

export default SearchField;