/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
    const { imageUrl } = data;

    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Image not found');
            }
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                postMessage(reader.result);
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            postMessage({ error: error.message });
        });
});
