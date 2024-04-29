import React, { useState } from 'react';
import classNames from 'classnames';

import { HeaderBurgerLink, HeaderProps } from '../../Header/HeaderTypes';

import * as styles from "./NavNested.scss"

interface LinkProps {
    id: string
    link?: HeaderBurgerLink
}

const Link: React.FC<LinkProps> = (props) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const onMouseEnter = () => {
        setIsDropdownVisible(true)
    }

    const onMouseLeave = () => {
        setIsDropdownVisible(false)
    }

    if (!props.link) {
        return null
    }

    return (
        <li
            key={props.link.href}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <a href={props.link.href}>
                {props.link.value}
            </a>
            {isDropdownVisible && props.link.links && (
                <ul className={styles.dropdown}>
                    <NestedNav
                        prevId={props.id}
                        classnames={{
                            navLinks: styles.navLinksNested
                        }}
                        links={props.link.links}
                    />
                </ul>
            )}
        </li>
    )
}

interface NestedNavProps {
    links?: HeaderProps["links"]
    classnames?: {
        navLinks: string
    }
    prevId?: string
}

const NestedNav: React.FC<NestedNavProps> = (props) => {
    if (!props.links) {
        return null
    }

    return (
        <ul className={classNames(styles.navLinks, props.classnames?.navLinks)}>
            {Object
                .keys(props.links)
                .map(link => {
                    const nextLink = props.links && props.links[link];
                    const id = nextLink?.links ? `${link}.links` : `${link}.value`
                    let nextId = props.prevId ? `${props.prevId}.${id}` : id

                    return (
                        <Link
                            key={link}
                            id={nextId}
                            link={nextLink}
                        />
                    )
                })}
        </ul>
    )
}

export default NestedNav
