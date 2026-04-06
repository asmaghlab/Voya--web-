// import express from "express";
// import cors from "cors";
// import OpenAI from "openai";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // Simple in-memory store to prevent repeated responses per user/session
// const lastResponses = {};

// app.post("/ai", async (req, res) => {
//   try {
//     const { userId, action, preferences, data, step, message, availableCountries } = req.body;

//     if (!userId) return res.status(400).json({ error: "userId is required" });

//     let prompt = "";
//     let systemPrompt = "You are a friendly and helpful travel assistant. Always respond in a natural, conversational way.";

//     // --- ASK QUESTION ---
//     if (action === 'ask_question') {
//       const questionPrompts = [
//         {
//           system: "You are asking about travel destination. Be friendly and suggest popular places.",
//           user: `The user is planning a trip. Ask them where they would like to go.
// Available destinations include: ${availableCountries?.slice(0, 8).join(', ')}, and more.

// Respond ONLY with valid JSON in this exact format:
// {
//   "question": "Where would you like to travel? We have amazing destinations like Egypt, Dubai, Turkey, and many more!",
//   "options": ["${availableCountries?.[0]}", "${availableCountries?.[1]}", "${availableCountries?.[2]}", "${availableCountries?.[3]}", "Surprise me"]
// }`
//         },
//         {
//           system: "You are asking about accommodation budget.",
//           user: `The user wants to go to: ${preferences?.destination || 'their chosen destination'}.
// Now ask about their budget for accommodation per night.

// Respond ONLY with valid JSON:
// {
//   "question": "Great choice! What's your budget per night for accommodation?",
//   "options": ["Under $100", "$100-$250", "$250-$400", "$400+", "Flexible"]
// }`
//         },
//         {
//           system: "You are asking about trip duration.",
//           user: `The user's budget is: ${preferences?.budget || 'set'}.
// Ask how many nights they plan to stay.

// Respond ONLY with valid JSON:
// {
//   "question": "Perfect! How many nights are you planning to stay?",
//   "options": ["2-3 nights", "4-5 nights", "6-7 nights", "1 week+"]
// }`
//         },
//         {
//           system: "You are asking about preferred travel season.",
//           user: `They plan to stay for: ${preferences?.duration || 'several nights'}.
// Ask when they would like to travel.

// Respond ONLY with valid JSON:
// {
//   "question": "When would you like to travel?",
//   "options": ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Autumn 🍂", "Anytime"]
// }`
//         },
//         {
//           system: "You are asking about number of travelers.",
//           user: `They want to travel in: ${preferences?.season || 'their preferred season'}.
// Ask how many people will be traveling.

// Respond ONLY with valid JSON:
// {
//   "question": "How many people will be traveling?",
//   "options": ["Solo traveler", "Couple (2)", "Family (3-4)", "Group (5+)"]
// }`
//         }
//       ];

//       const currentPrompt = questionPrompts[step] || questionPrompts[0];
//       systemPrompt = currentPrompt.system;
//       prompt = currentPrompt.user;

//       // Call OpenAI
//       const completion = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: prompt }
//         ],
//         temperature: 0.7
//       });

//       let aiResponse = completion.choices[0].message.content;

//       // Clean JSON
//       try {
//         let jsonStr = aiResponse.trim();
//         const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
//         if (jsonMatch) jsonStr = jsonMatch[0];
//         const parsed = JSON.parse(jsonStr);

//         // --- Prevent repeated response ---
//         const lastKey = `${userId}_${step}`;
//         if (lastResponses[lastKey] && JSON.stringify(lastResponses[lastKey]) === JSON.stringify(parsed)) {
//           return res.json({
//             question: "⚠️ You've already seen this question. Try a different option!",
//             options: parsed.options
//           });
//         }

//         lastResponses[lastKey] = parsed; // save for next comparison
//         return res.json(parsed);

//       } catch (e) {
//         console.error('JSON Parse Error:', e);
//         return res.status(500).json({ error: "Failed to parse AI JSON response." });
//       }

//     // --- SEARCH RECOMMENDATIONS ---
//     } else if (action === 'search_recommendations') {
//       const { countries, hotels, flights } = data;

//       let filteredHotels = hotels || [];
//       const budget = preferences.budget || "";
//       const destination = preferences.destination?.toLowerCase() || "";

//       if (budget.includes("Under $100")) filteredHotels = hotels.filter(h => h.pricePerNight < 100);
//       else if (budget.includes("$100-$250")) filteredHotels = hotels.filter(h => h.pricePerNight >= 100 && h.pricePerNight <= 250);
//       else if (budget.includes("$250-$400")) filteredHotels = hotels.filter(h => h.pricePerNight >= 250 && h.pricePerNight <= 400);
//       else if (budget.includes("$400+")) filteredHotels = hotels.filter(h => h.pricePerNight >= 400);

//       if (destination && destination !== "surprise me") {
//         filteredHotels = filteredHotels.filter(h =>
//           h.countryId?.toLowerCase().includes(destination) ||
//           countries.some(c => c.name.toLowerCase().includes(destination) && c.id === h.countryId)
//         );
//       }

//       const topHotels = filteredHotels.sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,3);

//       let relevantFlights = flights || [];
//       if (destination && destination !== "surprise me") {
//         relevantFlights = flights.filter(f => f.to?.toLowerCase().includes(destination) || f.from?.toLowerCase().includes(destination));
//       }
//       const topFlights = relevantFlights.sort((a,b) => (a.price || 0) - (b.price || 0)).slice(0,3);

//       systemPrompt = "You are an expert travel advisor. Create engaging, personalized recommendations.";

//       prompt = `Create a personalized travel recommendation based on:

// **User Preferences:**
// - Destination: ${preferences.destination}
// - Budget: ${preferences.budget}
// - Duration: ${preferences.duration}
// - Season: ${preferences.season}
// - Travelers: ${preferences.travelers}

// **Top Hotels Found (${topHotels.length}):**
// ${topHotels.map((h, i) => `${i+1}. **${h.name}**
//    - Price: $${h.pricePerNight}/night
//    - Rating: ${h.rating || 'N/A'}/5 | ${h.stars || 0} Stars
//    - Special Offers: ${h.offers?.join(', ') || 'None'}
//    - Top Amenities: ${h.amenities?.slice(0, 3).join(', ') || 'N/A'}`).join('\n\n')}

// **Top Flights Found (${topFlights.length}):**
// ${topFlights.map((f, i) => `${i+1}. **${f.airline}**
//    - Route: ${f.from} → ${f.to}
//    - Price: $${f.price}
//    - Duration: ${f.duration}
//    - Special Offer: ${f.offer}`).join('\n\n')}

// Write a warm, enthusiastic message that:
// 1. Acknowledges their preferences
// 2. Highlights the top 2-3 hotels with key selling points
// 3. Shows the best 2-3 flight options
// 4. Mentions any special offers
// 5. Asks if they want more details or have questions

// Use emojis appropriately (🏨✈️💰⭐🎁) and keep it conversational!`;

//       const completion = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: prompt }
//         ],
//         temperature: 0.7
//       });

//       const aiResponse = completion.choices[0].message.content;

//       // Prevent repeated recommendations for same user + preferences
//       const lastKey = `${userId}_recommendations`;
//       if (lastResponses[lastKey] && lastResponses[lastKey] === aiResponse) {
//         return res.json({ recommendations: "⚠️ You've already seen these recommendations. Try adjusting your preferences!" });
//       }
//       lastResponses[lastKey] = aiResponse;

//       return res.json({ recommendations: aiResponse });

//     } else { // GENERAL CONVERSATION
//       systemPrompt = `You are a helpful travel assistant chatbot helping users plan trips.
// Context:
// - User preferences: ${JSON.stringify(preferences)}
// - Available data: ${req.body.countriesCount} countries, ${req.body.hotelsCount} hotels, ${req.body.flightsCount} flights
// Your role:
// - Answer travel-related questions naturally
// - Be friendly, concise (2-3 sentences), and helpful`;

//       prompt = `User says: "${message}"
// Respond naturally and helpfully.`;

//       const completion = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: prompt }
//         ],
//         temperature: 0.7
//       });

//       const aiResponse = completion.choices[0].message.content;
//       return res.json({ reply: aiResponse });
//     }

//   } catch (err) {
//     console.error('AI Error:', err);
//     res.status(500).json({ 
//       error: "Error processing request",
//       reply: "I'm having trouble right now. Please try again!"
//     });
//   }
// });

// app.listen(5000, () => {
//   console.log("🤖 AI Travel Server running on port 5000");
// });
