export const addPreviousUrl = (links: string) => {
    sessionStorage.setItem('prevUrl', links);
};

export const getPreviousUrl = () => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const url = sessionStorage?.getItem('prevUrl');

    console.log(url);

    if (!url) {
        return undefined;
    }
    addPreviousUrl('');

    return url;
};
