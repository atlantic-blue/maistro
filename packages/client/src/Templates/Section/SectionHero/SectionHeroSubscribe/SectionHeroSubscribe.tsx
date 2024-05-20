import React from 'react';
import { randImg, randWord } from '@ngneat/falso';
import classNames from 'classnames';
import { Button, Callout, Flex, Heading, Section, TextField } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';

import { SectionHeroProps, SectionHeroSubscribeProps } from '../SectionHeroTypes';

import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';
import * as animationStyles from "../../../Styles/animation.scss"

import * as styles from "./SectionHeroSubscribe.scss"
import { InfoCircledIcon } from '@radix-ui/react-icons';

const SectionHeroSubscribe: React.FC<SectionHeroSubscribeProps> = (props) => {
    const [email, setEmail] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSubmitted, setIsSubmitted] = React.useState(false)

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        setIsLoading(true)

        fetch(props.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                emailListId: props.emailListId,
            })
        })
            .then(response => {
                if (response.ok) {
                    setIsSubmitted(true)
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

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

                    {isSubmitted ? (
                        <>
                            <Callout.Root color="green">
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    {props.successMessage}
                                </Callout.Text>
                            </Callout.Root>

                        </>
                    ) : (
                        <form action="" onSubmit={onSubmit}>
                            <Flex align="stretch" direction="column" justify="center" gap="3">
                                <TextField.Root
                                    size="3"
                                    required
                                    type="email"
                                    placeholder="Your email..."
                                    onChange={e => setEmail(e.target.value)}
                                />

                                <Button
                                    size="4"
                                    className={styles.heroButton}
                                    loading={isLoading}
                                >
                                    {props.ctaLink ? (
                                        <a aria-label={props.cta} href={props.ctaLink} target="_blank" rel="noopener noreferrer">
                                            {props.cta}
                                        </a>
                                    ) : props.cta
                                    }
                                </Button>
                            </Flex>
                        </form>
                    )}
                </Flex>
            </div>
        </Section>
    );
};

export const SectionHeroSubscribeItem: TemplateStruct<SectionHeroSubscribeProps> = {
    name: TemplateComponentType.HERO_SUBSCRIBE,
    Component: SectionHeroSubscribe,
    classNames: [
        ...Object.values(styles),
        ...Object.values(animationStyles)
    ],
    categories: [TemplateCategory.HERO],
    description: "Hero Subscribe",
    props: {
        title: "Captivating Experiences Await",
        content: "Join us on our journey.",
        img: {
            src: randImg(),
            alt: randWord({ length: 10 }).join(" "),
        },
        cta: "Subscribe",
        url: "",
        emailListId: "",
        redirectTo: "",
        successMessage: "Thanks for joining our mailing list!",
    },
}

export default SectionHeroSubscribe;