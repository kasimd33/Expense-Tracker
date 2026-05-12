exports.categorize = (transactions) => {
    return transactions.map(t => {
        const titleLower = String(t.title).toLowerCase();
        if (titleLower.includes('uber') || titleLower.includes('ola') || titleLower.includes('irctc') || titleLower.includes('rapido')) t.category = 'Transport';
        else if (titleLower.includes('swiggy') || titleLower.includes('zomato') || titleLower.includes('starbucks') || titleLower.includes('kfc') || titleLower.includes('mcdonald')) t.category = 'Food';
        else if (titleLower.includes('amazon') || titleLower.includes('flipkart') || titleLower.includes('myntra') || titleLower.includes('reliance')) t.category = 'Shopping';
        else if (titleLower.includes('netflix') || titleLower.includes('spotify') || titleLower.includes('prime') || titleLower.includes('hotstar')) t.category = 'Entertainment';
        else if (titleLower.includes('salary') || titleLower.includes('payroll')) { t.category = 'Salary'; t.type = 'income'; }
        else if (titleLower.includes('jio') || titleLower.includes('airtel') || titleLower.includes('bescom') || titleLower.includes('electricity')) t.category = 'Bills';
        return t;
    });
};
