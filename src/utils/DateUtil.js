const formatDate = (date) => {
    //   In style of 5 months ago
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 5) {
        return "Just now";
    }
    if (diff < 60) {
        return Math.floor(diff) + " seconds ago";
    }
    if (diff < 3600) {
        return Math.floor(diff / 60) + " minutes ago";
    }
    if (diff < 3600 * 24) {
        return Math.floor(diff / 3600) + " hours ago";
    }
    if (diff < 3600 * 24 * 30) {
        return Math.floor(diff / (3600 * 24)) + " days ago";
    }
    if (diff < 3600 * 24 * 30 * 12) {
        return Math.floor(diff / (3600 * 24 * 30)) + " months ago";
    }
    return Math.floor(diff / (3600 * 24 * 30 * 12)) + " years ago";
};

export default formatDate;