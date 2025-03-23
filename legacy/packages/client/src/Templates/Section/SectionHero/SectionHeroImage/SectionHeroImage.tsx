import React from 'react';
import { Button, Flex, Heading, Section } from '@radix-ui/themes';

import { SectionHeroProps } from '../SectionHeroTypes';

import * as styles from "./SectionHeroImage.scss"
import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';
import * as animationStyles from "../../../Styles/animation.scss"
import classNames from 'classnames';

const SectionHeroImage: React.FC<SectionHeroProps> = (props) => {
    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
            style={{ backgroundImage: `url(${props?.img?.src})` }}
        >
            <div className={styles.heroWrapper}>
                <div className={styles.heroImageFilter} />
                <Flex className={styles.heroContent} align="center" direction="column" justify="center" gap="3">
                    <Heading
                        as="h1"
                        size="9"
                        className={classNames(styles.heroTitle, animationStyles.fadeIn)}
                    >
                        {props.title}
                    </Heading>
                    <TemplateWysiwyg
                        content={props.content}
                        className={styles.heroText}
                    />
                    <Button
                        size="4"
                        className={styles.heroButton}
                    >
                        <a aria-label={props.cta} href={props.ctaLink} target="_blank" rel="noopener noreferrer">
                            {props.cta}
                        </a>
                    </Button>
                </Flex>
            </div>
        </Section>
    );
};

export default SectionHeroImage;