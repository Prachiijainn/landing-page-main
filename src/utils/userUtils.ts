// Utility functions for user display

export interface User {
    email?: string;
    displayName?: string;
    name?: string;
}

// Get user display name with fallbacks
export const getUserDisplayName = (user: User | null | undefined): string => {
    if (!user) return 'Anonymous';

    // Priority: displayName > name > email prefix > 'Anonymous'
    if (user.displayName && user.displayName.trim()) {
        return user.displayName.trim();
    }

    if (user.name && user.name.trim()) {
        return user.name.trim();
    }

    if (user.email) {
        // Extract name from email as last resort
        const emailPrefix = user.email.split('@')[0];
        // Convert email prefix to readable name (remove dots, underscores, numbers)
        const cleanName = emailPrefix
            .replace(/[._]/g, ' ')
            .replace(/\d+/g, '')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        return cleanName || 'User';
    }

    return 'Anonymous';
};

// Get user initials for avatars
export const getUserInitials = (user: User | null | undefined): string => {
    const displayName = getUserDisplayName(user);

    if (displayName === 'Anonymous' || displayName === 'User') {
        return 'U';
    }

    // Get initials from display name
    const words = displayName.split(' ').filter(word => word.length > 0);

    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    if (words.length >= 2) {
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }

    return displayName.charAt(0).toUpperCase();
};

// Format user name for display (proper case)
export const formatUserName = (name: string): string => {
    if (!name || !name.trim()) return 'Anonymous';

    return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Check if user name looks like an email prefix
export const isEmailPrefix = (name: string): boolean => {
    if (!name) return false;

    // Check for common email prefix patterns
    const emailPrefixPattern = /^[a-zA-Z0-9._-]+$/;
    const hasNumbers = /\d/.test(name);
    const hasUnderscoreOrDot = /[._]/.test(name);
    const isAllLowercase = name === name.toLowerCase();
    const noSpaces = !name.includes(' ');

    return emailPrefixPattern.test(name) &&
        (hasNumbers || hasUnderscoreOrDot) &&
        isAllLowercase &&
        noSpaces;
};

// Convert email prefix to readable name
export const emailPrefixToName = (emailPrefix: string): string => {
    if (!emailPrefix) return 'User';

    return emailPrefix
        .replace(/[._]/g, ' ')
        .replace(/\d+/g, '')
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') || 'User';
};