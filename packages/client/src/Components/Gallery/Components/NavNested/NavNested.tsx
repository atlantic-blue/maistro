import React, { useState } from 'react';
import classNames from 'classnames';

import { HeaderBurgerLink, HeaderProps } from '../../Header/HeaderTypes';
import EditableContent from '../../../Editable/EditableContent/EditableContent';

import * as styles from "./NavNested.scss"

interface LinkProps {
    id: string
    edit?: boolean
    link?: HeaderBurgerLink
    onChange: (id: string, content: string) => void
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
                {props.edit ? (
                    <EditableContent
                        onContentChange={content => {
                            let id = props.id
                            if (props.link?.links) {
                                id = id.replace("links", "value")
                            }

                            return props.onChange(id, content)
                        }}
                    >
                        {props.link.value}
                    </EditableContent>
                ) : props.link.value
                }
            </a>
            {isDropdownVisible && props.link.links && (
                <ul className={styles.dropdown}>
                    <NestedNav
                        edit={props.edit}
                        prevId={props.id}
                        classnames={{
                            navLinks: styles.navLinksNested
                        }}
                        links={props.link.links}
                        onChange={(id, content) => {
                            return props.onChange(id, content)
                        }}
                    />
                </ul>
            )}
        </li>
    )
}

interface NestedNavProps {
    edit?: boolean
    links?: HeaderProps["links"]
    onChange: (id: string, content: string) => void
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
                            edit={props.edit}
                            onChange={(id, content) => {
                                return props.onChange(id, content)
                            }}
                        />
                    )
                })}
        </ul>
    )
}

export default NestedNav
