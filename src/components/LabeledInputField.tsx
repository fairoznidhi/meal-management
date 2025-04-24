import { InputFieldType } from "./InputField";

interface LabeledInputFieldType extends InputFieldType{
    label?:string;
}
const withLabel = (WrappedComponent:React.ComponentType<InputFieldType>) => {
    return function LabelInputField({label,...props}:LabeledInputFieldType){
        return (
            <div>
                <div>{label}</div>
                <WrappedComponent {...props}/>
            </div>
            
        )
    }
};

export default withLabel;