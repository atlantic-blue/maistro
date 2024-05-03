import { TemplateComponentType } from "../../Templates/templateTypes";
import HeaderBasicEditor from "./HeaderBasicEditor";
import HeroBasicEditor from "./HeroBasicEditor";
import HeroSlidesEditor from "./HeroSlidesEditor";
import HeroVideoEditor from "./HeroVideoEditor";
import SectionBlankEditor from "./SectionBlankEditor";

const editors: Record<TemplateComponentType, React.FC<any>> = {
    [TemplateComponentType.HEADER_BASIC]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_BURGER]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_STICKY]: HeaderBasicEditor,
    [TemplateComponentType.HERO_BASIC]: HeroBasicEditor,
    [TemplateComponentType.HERO_IMAGE]: HeroBasicEditor,
    [TemplateComponentType.HERO_SLIDES]: HeroSlidesEditor,
    [TemplateComponentType.HERO_VIDEO]: HeroVideoEditor,
    [TemplateComponentType.SECTION_BLANK]: SectionBlankEditor,
}

export default editors
