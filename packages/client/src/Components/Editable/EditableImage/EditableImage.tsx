import React, { useState } from 'react';
import { postFile } from '../../../Api/Project/postFile';
import { convertFileToBase64 } from '../../../Utils/toBase64';
import env from '../../../env';

interface EditableImageProps {
    defaultImage: string
    onChange: (content: string) => void
    className?: string

    // TODO remove
    projectId: string
}

export const uploadImage = async ({
    file,
    userId,
    projectId,
}: {
    file: File,
    userId: string,
    projectId: string
}) => {
    try {
        const fileBase64 = await convertFileToBase64(file)
        const { key } = await postFile({
            userId,
            projectId,
            fileContent: fileBase64,
            fileName: file.name,
            fileType: file.type,
        })

        const baseUrl = env.hosting.baseUrl
        const src = `${baseUrl}/${key}`

        return src
    } catch (error) {
        // TODO app level error
        console.log(error)
        return ""
    }
}

const EditableImage: React.FC<EditableImageProps> = (props) => {
    const [preview, setPreview] = useState<string>(props.defaultImage);

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event.target.files || !event.target.files[0]) {
            return
        }

        const file = event.target.files[0]
        const src = await uploadImage({
            file,
            userId: "TOD",
            projectId: props.projectId,
        })

        setPreview(src);
        props.onChange(src)
    };

    return (
        <div className={props.className}>
            {preview && <img src={preview} alt="Preview" style={{ maxWidth: '96px' }} />}
            <input type="file" onChange={handleFileChange} accept="image/*" style={{ maxWidth: '96px' }} />
        </div>
    );
};

export default EditableImage;
