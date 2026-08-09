import dotenv from 'dotenv';
import { TenderRegService } from './src/services/tenderRegService.js';

dotenv.config();

async function testLLMConnection() {
  console.log("=" * 60);
  console.log("🔍 Testing LLM Provider Connection & Key Validity...");
  console.log("=" * 60);

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  console.log("Configured Keys in .env:");
  console.log("  • GEMINI_API_KEY    :", geminiKey ? `${geminiKey.substring(0, 8)}...` : "NONE (Empty)");
  console.log("  • OPENROUTER_API_KEY:", openrouterKey ? `${openrouterKey.substring(0, 8)}...` : "NONE (Empty)");
  console.log("  • OPENAI_API_KEY    :", openaiKey ? `${openaiKey.substring(0, 8)}...` : "NONE (Empty)");
  console.log("-" * 60);

  if (!geminiKey && !openrouterKey && !openaiKey) {
    console.log("⚠️  No API Key detected in backend/.env.");
    console.log("    To test a live LLM model, open backend/.env and paste your key under GEMINI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.");
    console.log("    (Don't worry: The built-in deterministic fallback engine is active and ensures the app works smoothly even without an API key).\n");
    return;
  }

  console.log("🚀 Sending test prompt to configured LLM service...");
  const prompt = "Confirm in 1 sentence that TenderReg AI connection is active.";
  
  const response = await TenderRegService.callLLM(prompt);

  if (response) {
    console.log("\n✅ LLM KEY VALIDATION SUCCESSFUL!");
    console.log("Response from Model:", `"${response.trim()}"\n`);
  } else {
    console.log("\n❌ LLM Call Failed or Invalid Key.");
    console.log("   Check your API key in backend/.env for typos or quota limits.\n");
  }
}

testLLMConnection();
