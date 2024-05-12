import React from 'react';

import { TemplateStruct, TemplateCategory } from '../../../templateTypes';

import * as styles from "./SectionAboutUsTeam.scss"

const SectionAboutUsTeam = (props) => {
    // Placeholder for team member data
    const teamMembers = [
        { id: 1, name: 'Julian Tellez Mendez', role: 'CEO', imageUrl: 'https://maistro.website/assets/pages/retreats/julian.png', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
        { id: 2, name: 'Raul Gomez Acuña', role: 'CEO', imageUrl: 'https://maistro.website/assets/pages/retreats/raul.png', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
        // Add more team members as needed
    ];

    return (
        <div className={styles.aboutUs} {...props}>
            <h2>Our Team</h2>
            <div className={styles.teamMembers}>
                {teamMembers.map((member) => (
                    <div key={member.id} className={styles.teamMember}>
                        <img src={member.imageUrl} alt={member.name} />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                        <p>{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SectionAboutUsTeamItem: TemplateStruct = {
    name: "SectionAboutUsTeam",
    Component: SectionAboutUsTeam,
    categories: [TemplateCategory.ABOUT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
}

export default SectionAboutUsTeam;