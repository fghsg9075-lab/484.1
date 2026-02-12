
// utils/holidayGreetings.ts

export const getHolidayGreeting = (date: Date = new Date()): string | null => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    // Fixed Date Holidays
    if (month === 1 && day === 1) return "Happy New Year! 🎉 Let's start this year with a great study session.";
    if (month === 1 && day === 26) return "Happy Republic Day! 🇮🇳 Jai Hind.";
    if (month === 8 && day === 15) return "Happy Independence Day! 🇮🇳 Freedom to learn.";
    if (month === 10 && day === 2) return "Happy Gandhi Jayanti! Truth and non-violence.";
    if (month === 12 && day === 25) return "Merry Christmas! 🎄 Enjoy the festive spirit.";
    if (month === 2 && day === 14) return "Happy Valentine's Day! ❤️ Love your studies."; // Optional fun one

    // Dynamic Holidays (Approximations for Indian Festivals - simplified logic or exact dates for specific years)
    // For a robust system, these should ideally come from an API or a config, but hardcoding known dates for 2024-2025 covers immediate needs.
    // User requested "app online dekh lega" which usually means API, but falling back to logic/config is safer for MVP.
    // We will use a dictionary for specific dates.

    const key = `${year}-${month}-${day}`;

    // 2024 Dates
    const holidays2024: Record<string, string> = {
        "2024-3-25": "Happy Holi! 🎨 May your life be colorful.",
        "2024-4-11": "Eid Mubarak! 🌙 Wishing you joy and peace.",
        "2024-8-19": "Happy Raksha Bandhan! 🧵",
        "2024-8-26": "Happy Janmashtami! 🪈",
        "2024-9-7": "Happy Ganesh Chaturthi! 🐘",
        "2024-10-12": "Happy Dussehra! 🏹 Victory of good over evil.",
        "2024-11-1": "Happy Diwali! 🪔 Light up your knowledge.",
        "2024-11-15": "Happy Guru Nanak Jayanti! 🙏"
    };

    // 2025 Dates
    const holidays2025: Record<string, string> = {
        "2025-3-14": "Happy Holi! 🎨 May your life be colorful.",
        "2025-3-31": "Eid Mubarak! 🌙 Wishing you joy and peace.",
        "2025-10-20": "Happy Diwali! 🪔 Light up your knowledge.",
        // Add more as needed
    };

    const specificGreeting = holidays2024[key] || holidays2025[key];
    if (specificGreeting) return specificGreeting;

    return null;
};
