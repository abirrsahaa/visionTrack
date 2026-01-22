
// Mock Unsplash Image Search
// In a real app, this would use the Unsplash API

const MOCK_IMAGES: Record<string, string[]> = {
    "default": [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1481487484168-9b930d55208d?w=800&auto=format&fit=crop",
    ],
    "career": [
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
    ],
    "health": [
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544367563-12123d8966cd?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?w=800&auto=format&fit=crop",
    ],
    "travel": [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
    ],
    "finance": [
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565514020179-0222d7b219fb?w=800&auto=format&fit=crop",
    ],
    "relationships": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop",
    ],
    "creativity": [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1491245338813-c6832976196e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop",
    ],
};

export const imagesApi = {
    search: async (query: string): Promise<string[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));

        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("career") || lowerQuery.includes("work") || lowerQuery.includes("coding")) {
            return MOCK_IMAGES.career;
        }
        if (lowerQuery.includes("health") || lowerQuery.includes("fitness") || lowerQuery.includes("yoga")) {
            return MOCK_IMAGES.health;
        }
        if (lowerQuery.includes("travel") || lowerQuery.includes("trip") || lowerQuery.includes("nature")) {
            return MOCK_IMAGES.travel;
        }
        if (lowerQuery.includes("finance") || lowerQuery.includes("money") || lowerQuery.includes("wealth")) {
            return MOCK_IMAGES.finance;
        }
        if (lowerQuery.includes("relationship") || lowerQuery.includes("family") || lowerQuery.includes("love")) {
            return MOCK_IMAGES.relationships;
        }
        if (lowerQuery.includes("creative") || lowerQuery.includes("art") || lowerQuery.includes("paint")) {
            return MOCK_IMAGES.creativity;
        }

        // Return random mix if no match
        return MOCK_IMAGES.default;
    }
};
