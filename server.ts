/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Error creating Gemini client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Falling back to procedural lead generation.");
}

// Procedural high-fidelity generation fallback
function generateProceduralLeads(city: string, niche: string, count: number) {
  const cleanCity = city.trim();
  const cleanNiche = niche.trim();
  const leads: any[] = [];
  
  // Custom prefix / suffix list for business name variations
  const prefixes = [
    "Apex", "Summit", "Horizon", "Cascade", "Blue Ribbon", "Core", "Vanguard", 
    "Nexus", "Pinnacle", "Aero", "Urban", "Metro", "Main Street", "Beacon"
  ];
  
  const suffixes = [
    "Group", "Partners", "Hub", "Lab", "Studio", "Inc", "Solutions", 
    "Associates", "Plaza", "HQ", "Zone", "Co."
  ];

  // Map representation for email first names / domains
  const firstNames = ["Sarah", "Michael", "David", "Jessica", "James", "Emily", "Robert", "John", "Amanda", "Daniel"];
  const lastNames = ["Smith", "Jones", "Miller", "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "White", "Harris"];
  
  const statuses = ["Prospect", "Contacted", "Meeting Scheduled", "Qualified", "Do Not Contact"];

  // Normalize inputs for domain generator
  const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nicheSlug = cleanNiche.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (let i = 0; i < count; i++) {
    const isPrefix = i % 2 === 0;
    const word1 = prefixes[i % prefixes.length];
    const word2 = suffixes[(i + 3) % suffixes.length];
    
    // Formulate a beautiful business name
    let businessName = "";
    if (i === 0) {
      businessName = `${cleanCity} ${cleanNiche} ${word2}`;
    } else if (i === 1) {
      businessName = `${word1} ${cleanNiche}`;
    } else if (isPrefix) {
      businessName = `${word1} ${cleanNiche} ${word2}`;
    } else {
      businessName = `${cleanCity} ${word1} ${cleanNiche}`;
    }

    const brandSlug = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Create authentic domains
    const domains = [
      `${brandSlug}.com`,
      `the${brandSlug}.com`,
      `go${brandSlug}.io`,
      `${nicheSlug}${citySlug}.org`
    ];
    const website = `https://www.${domains[i % domains.length]}`;

    // Contact details
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i + 7) % lastNames.length];
    
    const emailFormats = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[i % domains.length]}`,
      `contact@${domains[i % domains.length]}`,
      `info@${domains[i % domains.length]}`,
      `${firstName.toLowerCase()}@${domains[i % domains.length]}`
    ];
    const email = emailFormats[i % emailFormats.length];

    // Phone numbers with regional format
    const phonePrefixes = ["+1 (415) ", "+1 (650) ", "+1 (212) ", "+1 (312) ", "+1 (206) ", "+1 (512) "];
    const basePhonePrefix = phonePrefixes[Math.abs(citySlug.charCodeAt(0) || 0) % phonePrefixes.length];
    const numPart1 = 100 + (i * 17) % 900;
    const numPart2 = 1000 + (i * 329) % 9000;
    const phone = `${basePhonePrefix}${numPart1}-${numPart2}`;

    // Custom street addresses
    const streetNumbers = 100 + i * 143;
    const streets = ["Market St", "Broadway", "Pine St", "Oak Ave", "Sunset Blvd", "Mission St", "Washington Rd", "Cedar Lane"];
    const suite = i % 3 === 0 ? `Suite ${100 + i * 5}` : "";
    const address = `${streetNumbers} ${streets[i % streets.length]}${suite ? ', ' + suite : ''}, ${cleanCity}`;

    // Random but realistic reviews
    const rating = parseFloat((4.0 + (i * 0.17 % 1.0)).toFixed(1));
    const reviews = 5 + (i * 47) % 450;

    const descriptions = [
      `A premium ${cleanNiche} focused on high-quality service, local community integration, and exceptional customer satisfaction.`,
      `Leading provider of modern ${cleanNiche} services in the ${cleanCity} marketplace. Established and trusted with top-tier reviews.`,
      `Dedicated team of experienced professionals offering tailored ${cleanNiche} solutions for individuals and corporate clients.`,
      `Innovative boutique ${cleanNiche} shop offering personalized experiences and state-of-the-art service delivery.`
    ];
    const description = descriptions[i % descriptions.length];

    // Status matching grid
    const status = statuses[i % statuses.length] as any;

    // Socials
    const socials = {
      linkedin: `https://linkedin.com/company/${brandSlug}`,
      twitter: `https://twitter.com/${brandSlug}`,
      facebook: `https://facebook.com/${brandSlug}`,
      instagram: `https://instagram.com/${brandSlug}`
    };

    // Prepopulate CRM Notes
    const notes = [
      {
        id: `note-${i}-1`,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        content: `Lead identified during local ${cleanNiche} market intelligence scan in ${cleanCity}. Initial digital touchpoints verified.`
      },
      ...((i % 3 === 0) ? [
        {
          id: `note-${i}-2`,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          content: `Checked website loading health. Social channels are highly active- excellent target for personalized email outreach.`
        }
      ] : [])
    ];

    leads.push({
      id: `lead-${i + 1}-${Date.now()}`,
      businessName,
      category: cleanNiche.charAt(0).toUpperCase() + cleanNiche.slice(1),
      city: cleanCity,
      phone,
      email,
      website,
      rating,
      reviews,
      address,
      status,
      description,
      socials,
      notes,
      createdAt: new Date().toISOString()
    });
  }

  return leads;
}

// API Routes
app.post("/api/generate-leads", async (req, res) => {
  const { city, niche, count } = req.body;

  if (!city || !niche) {
    return res.status(400).json({ error: "City and Niche parameters are required" });
  }

  const requestedCount = Math.min(Math.max(Number(count) || 10, 5), 50);

  // If Gemini client exists, attempt to generate content
  if (ai) {
    try {
      console.log(`Querying Gemini to discover ${requestedCount} leads for Niche: "${niche}" in City: "${city}"...`);
      
      const prompt = `Generate exactly ${requestedCount} realistic local businesses of niche/category "${niche}" located in the city of "${city}".
Provide the response as a JSON array of objects. Each object MUST represent a business matching the following details and constraints:
- "businessName": Name of the business. Be highly creative and realistic for "${niche}" in "${city}".
- "category": Match the category "${niche}" in title-case.
- "city": Must be exactly "${city}".
- "phone": Standard realistic USA or local telephone number for the region. Matches standard format +1 (XXX) XXX-XXXX.
- "email": Highly realistic email domain matching the business name, containing a standard name or contact alias, like contact@domain.com or first_name@domain.com.
- "website": A standard website address pointing. Uses a logical domain matching the business name, e.g., https://www.domain.com.
- "rating": Average customer rating between 3.5 and 5.0 (can be decimal).
- "reviews": Total customer review count (integer, between 5 and 500).
- "address": A realistic physical street address in "${city}". Include street name, suite/number, city, and zip code if applicable.
- "status": One of: "Prospect", "Contacted", "Meeting Scheduled", "Qualified", "Do Not Contact". Hand out various realistic assignments.
- "description": A short 1-2 sentence description summarizing what the business does and their unique selling point within "${niche}".
- "socials": An object containing optional links: "linkedin", "twitter", "facebook", "instagram" based on their name.
- "notes": An array of 1-2 initial notes objects. Each notes object contains:
    - "id": A unique string ID.
    - "createdAt": ISO date string representing a past date.
    - "content": A professional CRM activity entry like "Discovered during market intelligence sweep.", "Website reviewed, verified email address.", or "Marked as high-intent opportunity."

Your output MUST be a strict, valid JSON array. Do not wrap in markdown unless the system requires it. Standard JSON array output only. Make sure all lead entries are diverse, highly localized to "${city}", and authentic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, highly professional B2B lead generation extractor database tool. You take city and business niche instructions to synthesize top-tier leads that reflect authentic-looking business details, precise contact information, and CRM notes. Return JSON ONLY.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                businessName: { type: Type.STRING },
                category: { type: Type.STRING },
                city: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                website: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                reviews: { type: Type.INTEGER },
                address: { type: Type.STRING },
                status: { type: Type.STRING, description: "One of: Prospect, Contacted, Meeting Scheduled, Qualified, Do Not Contact" },
                description: { type: Type.STRING },
                socials: {
                  type: Type.OBJECT,
                  properties: {
                    linkedin: { type: Type.STRING },
                    twitter: { type: Type.STRING },
                    facebook: { type: Type.STRING },
                    instagram: { type: Type.STRING }
                  }
                },
                notes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      createdAt: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ["id", "createdAt", "content"]
                  }
                }
              },
              required: ["businessName", "category", "city", "phone", "email", "website", "rating", "reviews", "address", "status", "description"]
            }
          }
        }
      });

      const text = response.text ? response.text.trim() : "";
      if (text) {
        const parsedLeads = JSON.parse(text);
        if (Array.isArray(parsedLeads) && parsedLeads.length > 0) {
          // Add system generated ID and standard date timestamps
          const finalizedLeads = parsedLeads.map((item: any, idx: number) => ({
            id: `gemini-lead-${idx + 1}-${Date.now()}`,
            businessName: item.businessName || "Unnamed Business",
            category: item.category || niche,
            city: item.city || city,
            phone: item.phone || "No Phone",
            email: item.email || "No Email",
            website: item.website || "No Website",
            rating: Number(item.rating) || 4.2,
            reviews: Number(item.reviews) || 12,
            address: item.address || "No Address Available",
            status: item.status || "Prospect",
            description: item.description || "Synthesized B2B lead.",
            socials: item.socials || {},
            notes: Array.isArray(item.notes) ? item.notes : [
              {
                id: `lead-note-1`,
                createdAt: new Date().toISOString(),
                content: "Discovered and cataloged on-the-fly using AI extraction engine."
              }
            ],
            createdAt: new Date().toISOString()
          }));
          
          return res.json({ leads: finalizedLeads, source: "gemini" });
        }
      }
    } catch (error) {
      console.error("Gemini query failed, falling back to procedural generation:", error);
    }
  }

  // Fallback to high-fidelity procedural generation
  const leads = generateProceduralLeads(city, niche, requestedCount);
  return res.json({ leads, source: "procedural" });
});

// Serve Frontend code
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite as Middleware in Dev Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted as Express middleware.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
