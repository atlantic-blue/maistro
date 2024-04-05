import React, { useState } from 'react';

interface EditableImageProps {
    defaultImage: string
    onChange: (content: string) => void
    className?: string
}

const EditableImage: React.FC<EditableImageProps> = (props) => {
    const [preview, setPreview] = useState<string>(props.defaultImage);

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event.target.files || !event.target.files[0]) {
            return
        }

        const file = event.target.files[0]
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        props.onChange(objectUrl)
    };

    return (
        <div className={props.className}>
            {preview && <img src={preview} alt="Preview" style={{ maxWidth: '96px' }} />}
            <input type="file" onChange={handleFileChange} accept="image/*" style={{ maxWidth: '96px' }} />
        </div>
    );
};

export default EditableImage;