import React, { useState } from 'react';

interface EditableVideoProps {
    defaultVideo: string
    onChange: (content: string) => void
    className?: string
}

const EditableVideo: React.FC<EditableVideoProps> = (props) => {
    const [preview, setPreview] = useState<string>(props.defaultVideo);

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
            {preview && (
                <video
                    style={{ maxWidth: '96px' }}
                    preload="metadata"
                    loop
                    autoPlay
                    muted
                >
                    <source src={preview} type="video/mp4" />
                </video>
            )}
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ maxWidth: '96px' }}
            />
        </div>
    );
};

export default EditableVideo;