exports.normalize = (transactions) => {
    return transactions.map((t, index) => {
        return {
            id: t.id || `txn-${Date.now()}-${index}`,
            date: t.date || new Date().toISOString(),
            title: t.title || 'Unknown Transaction',
            amount: Math.abs(Number(t.amount)) || 0,
            type: t.type || (Number(t.amount) < 0 ? 'expense' : 'income'),
            category: t.category || 'Other',
            paymentMethod: t.paymentMethod || 'Bank',
            sourceType: t.sourceType || 'unknown'
        };
    }).filter(t => t.amount >= 0);
};
