import { TemplateComponentType } from "../../Templates/templateTypes";
import HeaderBasicEditor from "./HeaderBasicEditor";
import HeroBasicEditor from "./HeroBasicEditor";
import HeroSlidesEditor from "./HeroSlidesEditor";

const editors: Record<TemplateComponentType, React.FC<any>> = {
    [TemplateComponentType.HEADER_BASIC]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_BURGER]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_STICKY]: HeaderBasicEditor,
    [TemplateComponentType.HERO_BASIC]: HeroBasicEditor,
    [TemplateComponentType.HERO_IMAGE]: HeroBasicEditor,
    [TemplateComponentType.HERO_SLIDES]: HeroSlidesEditor,
}

export default editors
