import { TemplateComponentType } from "../../Templates/templateTypes";
import HeaderBasicEditor from "./HeaderBasicEditor";
import HeroBasicEditor from "./HeroBasicEditor";

const editors: Record<TemplateComponentType, React.FC<any>> = {
    [TemplateComponentType.HEADER_BASIC]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_BURGER]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_STICKY]: HeaderBasicEditor,
    [TemplateComponentType.HERO_BASIC]: HeroBasicEditor,
}

export default editors
