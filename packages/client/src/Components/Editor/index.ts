import { TemplateComponentType } from "../../Templates/templateTypes";
import HeaderBasicEditor from "./HeaderBasicEditor";

const editors: Record<TemplateComponentType, React.FC<any>> = {
    [TemplateComponentType.HEADER_BASIC]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_BURGER]: HeaderBasicEditor
}

export default editors
