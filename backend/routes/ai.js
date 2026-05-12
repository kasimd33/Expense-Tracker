const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getFinancialContext = async (userId) => {
  const expenses = await Expense.find({ user: userId });
  let totalExpenses = 0;
  let totalIncome = 0;
  const categoryTotals = {};

  expenses.forEach(e => {
    if (e.type === 'expense') {
      totalExpenses += e.amount;
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    } else {
      totalIncome += e.amount;
    }
  });

  return `
    Financial Context for this user:
    Total Income: ₹${totalIncome}
    Total Expenses: ₹${totalExpenses}
    Category Breakdown: ${JSON.stringify(categoryTotals)}
    Recent Transactions (Max 10): ${JSON.stringify(expenses.slice(0, 10).map(e => ({title: e.title, amount: e.amount, type: e.type, date: e.date})))}
  `;
};

// @route   GET api/ai/insights
// @desc    Get AI generated financial insights
// @access  Private
router.get('/insights', auth, async (req, res) => {
  try {
    const context = await getFinancialContext(req.user.id);
    const prompt = `As an expert financial advisor, analyze this monthly spending data and provide 3 short, personalized insights or recommendations for better budgeting. Use markdown formatting to make it readable (bolding, bullet points). \n${context}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ insights: response.text });
  } catch (err) {
    // Fallback for missing/invalid API key (Great for portfolio demos!)
    if (err.message.includes("API key not valid") || err.message.includes("API key")) {
      return res.json({ 
        insights: "### 💡 Demo Mode Active\n\nIt looks like your Gemini API key is missing or invalid. In a production environment, you would see tailored insights here!\n\n**Example Insights:**\n- You are spending a lot on Food this month. Consider cooking at home.\n- Your income is stable, try investing 10% into savings." 
      });
    }
    res.status(500).send('AI Service Error');
  }
});

// @route   POST api/ai/chat
// @desc    Chat with AI Financial Advisor
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: 'Message is required' });

    const context = await getFinancialContext(req.user.id);
    const prompt = `You are an expert, friendly AI personal finance advisor for this user. 
    Here is their current financial data context:
    ${context}
    
    The user is asking: "${message}"
    
    Respond directly to the user's question using the context above. Keep it concise, helpful, and use professional markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    // Fallback for missing/invalid API key
    if (err.message.includes("API key not valid") || err.message.includes("API key")) {
      return res.json({ 
        reply: "**[Demo Mode]** It looks like the Gemini API key provided is invalid. \n\nIf this was a live environment, I would answer: *\"Based on your recent transaction history, you are spending mostly on Food. Try creating a hard cap limit for dining out this weekend!\"*" 
      });
    }
    res.status(500).send('AI Service Error');
  }
});

module.exports = router;
