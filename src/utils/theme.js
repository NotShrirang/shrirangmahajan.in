const getTheme = () => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";


    return theme;
};

export default getTheme;