const AZURE_ENDPOINT =
  process.env.AZURE_ENDPOINT ||
  "https://vmute-mio2aqwz-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview";
const AZURE_API_KEY =
  process.env.AZURE_API_KEY ||
  "CC2ya28YUlW5gtlHlkE1YyEgUhuvvgGuPM26yRxFW0eLFQ7luDMNJQQJ99BLACHYHv6XJ3w3AAAAACOGY69n";

export async function generateCreditData(count: number = 50) {
  const prompt = `Generate exactly ${count} realistic credit user profiles as a valid JSON array. Each profile must be a JSON object with these exact fields:
{
  "id": "string (unique identifier)",
  "name": "string (full name)",
  "email": "string (email address)",
  "currentCreditScore": number (300-850),
  "creditHistory": [array of 12-24 objects with: {"date": "ISO string", "creditScore": number, "paymentStatus": "on-time"|"late"|"missed", "amount": number, "event": "string"}],
  "debtToIncomeRatio": number (0.1-0.8),
  "totalDebt": number (10000-200000),
  "monthlyIncome": number (3000-15000),
  "paymentHistory": {"onTime": number, "late": number, "missed": number},
  "accountAge": number (6-120),
  "creditUtilization": number (10-90),
  "riskLevel": "low"|"medium"|"high",
  "status": "active"|"inactive"|"flagged",
  "lastUpdated": "ISO date string"
}

CRITICAL: Return ONLY valid JSON array format. No markdown, no code blocks, no explanations. Start with [ and end with ]. All strings must use double quotes. All numbers must be actual numbers, not strings.`;

  try {
    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Try to extract JSON from the response
    let jsonStr = content.trim();

    // Remove markdown code blocks
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```\n?/g, "");
    }

    // Try to find JSON array in the content
    const jsonArrayMatch = jsonStr.match(/\[[\s\S]*/);
    if (jsonArrayMatch) {
      jsonStr = jsonArrayMatch[0];
    }

    // Function to extract complete objects from potentially truncated JSON
    const extractCompleteObjects = (str: string): string => {
      let depth = 0;
      let inString = false;
      let escapeNext = false;
      let objectStart = -1;
      const completeObjects: string[] = [];

      for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === "\\") {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === "{") {
          if (depth === 0) {
            objectStart = i;
          }
          depth++;
        } else if (char === "}") {
          depth--;
          if (depth === 0 && objectStart !== -1) {
            // Found a complete object
            const objectStr = str.substring(objectStart, i + 1);
            try {
              // Validate it's valid JSON
              JSON.parse(objectStr);
              completeObjects.push(objectStr);
            } catch {
              // Invalid object, skip it
            }
            objectStart = -1;
          }
        }
      }

      if (completeObjects.length > 0) {
        return "[" + completeObjects.join(",") + "]";
      }

      return str;
    };

    // Try to extract complete objects first
    jsonStr = extractCompleteObjects(jsonStr);

    // Clean up common JSON issues
    jsonStr = jsonStr
      .replace(/,\s*}/g, "}") // Remove trailing commas before }
      .replace(/,\s*]/g, "]") // Remove trailing commas before ]
      .trim();

    // Only replace single quotes that are clearly string delimiters
    jsonStr = jsonStr
      .replace(/'([^']*)':/g, '"$1":') // Replace 'key': with "key":
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace : 'value' with : "value"
      .replace(/,\s*'([^']*)'/g, ', "$1"'); // Replace , 'value' with , "value"

    // Ensure array is properly closed
    if (!jsonStr.endsWith("]")) {
      const openBracketsCount = (jsonStr.match(/\[/g) || []).length;
      const closeBracketsCount = (jsonStr.match(/\]/g) || []).length;
      if (openBracketsCount > closeBracketsCount) {
        jsonStr += "]";
      } else if (openBracketsCount === 0 && jsonStr.trim().startsWith("{")) {
        // Single object, wrap in array
        jsonStr = "[" + jsonStr + "]";
      }
    }

    try {
      const users = JSON.parse(jsonStr);

      // Validate that we got an array
      if (!Array.isArray(users) || users.length === 0) {
        throw new Error("Invalid response: not an array or empty");
      }

      // Validate and clean user data
      const cleanedUsers = users
        .slice(0, count)
        .map((user: Record<string, unknown>, index: number) => ({
          id: user.id || `user-${index + 1}`,
          name: user.name || `User ${index + 1}`,
          email: user.email || `user${index + 1}@example.com`,
          currentCreditScore: Math.max(
            300,
            Math.min(850, Number(user.currentCreditScore) || 650)
          ),
          creditHistory: Array.isArray(user.creditHistory)
            ? user.creditHistory
            : [],
          debtToIncomeRatio: Math.max(
            0.1,
            Math.min(0.8, Number(user.debtToIncomeRatio) || 0.3)
          ),
          totalDebt: Math.max(
            10000,
            Math.min(200000, Number(user.totalDebt) || 50000)
          ),
          monthlyIncome: Math.max(
            3000,
            Math.min(15000, Number(user.monthlyIncome) || 5000)
          ),
          paymentHistory: {
            onTime:
              Number(
                (user.paymentHistory as Record<string, unknown>)?.onTime
              ) || 0,
            late:
              Number((user.paymentHistory as Record<string, unknown>)?.late) ||
              0,
            missed:
              Number(
                (user.paymentHistory as Record<string, unknown>)?.missed
              ) || 0,
          },
          accountAge: Math.max(6, Math.min(120, Number(user.accountAge) || 24)),
          creditUtilization: Math.max(
            10,
            Math.min(90, Number(user.creditUtilization) || 30)
          ),
          riskLevel: ["low", "medium", "high"].includes(
            user.riskLevel as string
          )
            ? (user.riskLevel as "low" | "medium" | "high")
            : "medium",
          status: ["active", "inactive", "flagged"].includes(
            user.status as string
          )
            ? (user.status as "active" | "inactive" | "flagged")
            : "active",
          lastUpdated: user.lastUpdated || new Date().toISOString(),
        }));

      return cleanedUsers;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Attempted to parse:", jsonStr.substring(0, 500));
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating credit data from Azure AI:", error);
    console.log("Falling back to generated data...");
    // Return fallback data if API fails
    return generateFallbackData(count);
  }
}

function generateFallbackData(count: number) {
  const names = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Martinez",
    "Christopher Anderson",
    "Amanda Taylor",
    "Matthew Thomas",
    "Ashley Jackson",
    "James White",
    "Lauren Harris",
    "Robert Martin",
    "Megan Thompson",
    "Daniel Garcia",
    "Nicole Rodriguez",
    "William Lewis",
    "Stephanie Walker",
    "Joseph Hall",
    "Rachel Young",
    "Charles Allen",
    "Michelle King",
    "Thomas Wright",
    "Kimberly Lopez",
    "Christopher Hill",
    "Jennifer Scott",
    "Daniel Green",
    "Lisa Adams",
    "Mark Baker",
    "Angela Gonzalez",
    "Paul Nelson",
    "Samantha Carter",
    "Steven Mitchell",
    "Brittany Perez",
    "Kevin Roberts",
    "Amanda Turner",
    "Brian Phillips",
    "Melissa Campbell",
    "Jason Parker",
    "Heather Evans",
    "Ryan Edwards",
    "Tiffany Collins",
    "Justin Stewart",
    "Rebecca Sanchez",
    "Brandon Morris",
    "Crystal Rogers",
    "Eric Reed",
    "Danielle Cook",
    "Kyle Morgan",
    "Amber Bell",
  ];

  const users = [];
  for (let i = 0; i < count; i++) {
    const creditScore = Math.floor(Math.random() * 550) + 300;
    const monthlyIncome = Math.floor(Math.random() * 12000) + 3000;
    const totalDebt = Math.floor(Math.random() * 190000) + 10000;
    const debtToIncome = totalDebt / (monthlyIncome * 12);
    const accountAge = Math.floor(Math.random() * 114) + 6;
    const creditUtilization = Math.floor(Math.random() * 80) + 10;

    const paymentHistory = {
      onTime: Math.floor(Math.random() * 90) + 10,
      late: Math.floor(Math.random() * 20),
      missed: Math.floor(Math.random() * 10),
    };

    let riskLevel: "low" | "medium" | "high" = "low";
    if (creditScore < 580 || debtToIncome > 0.5 || paymentHistory.missed > 5) {
      riskLevel = "high";
    } else if (
      creditScore < 670 ||
      debtToIncome > 0.4 ||
      paymentHistory.late > 10
    ) {
      riskLevel = "medium";
    }

    const statuses: ("active" | "inactive" | "flagged")[] = [
      "active",
      "active",
      "active",
      "inactive",
      "flagged",
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const creditHistory = [];
    const months = Math.floor(Math.random() * 12) + 12;
    for (let j = 0; j < months; j++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - j));
      const scoreVariation = Math.floor(Math.random() * 50) - 25;
      const paymentStatuses: ("on-time" | "late" | "missed")[] = [
        "on-time",
        "on-time",
        "on-time",
        "late",
        "missed",
      ];

      creditHistory.push({
        date: date.toISOString(),
        creditScore: Math.max(300, Math.min(850, creditScore + scoreVariation)),
        paymentStatus:
          paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        amount: Math.floor(Math.random() * 5000) + 500,
        event: `Payment ${j + 1}`,
      });
    }

    users.push({
      id: `user-${i + 1}`,
      name: names[i % names.length],
      email: `user${i + 1}@example.com`,
      currentCreditScore: creditScore,
      creditHistory,
      debtToIncomeRatio: Math.round(debtToIncome * 100) / 100,
      totalDebt,
      monthlyIncome,
      paymentHistory,
      accountAge,
      creditUtilization,
      riskLevel,
      status,
      lastUpdated: new Date().toISOString(),
    });
  }

  return users;
}
