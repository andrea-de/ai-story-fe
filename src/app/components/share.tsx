import React from 'react';

const ShareButton = () => {
    const handleShare = async () => {
        try {
            await navigator.share({
                title: 'My App',
                text: 'Check out this link!',
                url: 'https://example.com',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <button onClick={handleShare}>Share</button>
    );
};

export default ShareButton;