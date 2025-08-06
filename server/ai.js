const express = require('express');
const router = express.Router();

// AI Code Review endpoint
router.post('/review', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        // Simple code review logic (in a real app, this would integrate with an AI service)
        const review = analyzeCode(code);
        
        res.json({ review });
    } catch (error) {
        console.error('Error in AI review:', error);
        res.status(500).json({ error: 'Error processing AI review' });
    }
});

function analyzeCode(code) {
    let review = "Code Review Analysis:\n\n";
    
    // Basic code analysis
    const lines = code.split('\n');
    const lineCount = lines.length;
    
    review += `📊 Code Statistics:\n`;
    review += `- Total lines: ${lineCount}\n`;
    review += `- Characters: ${code.length}\n\n`;
    
    // Check for common issues
    const issues = [];
    
    if (lineCount > 100) {
        issues.push("⚠️  Consider breaking down large functions into smaller, more manageable pieces");
    }
    
    if (code.includes('console.log')) {
        issues.push("⚠️  Remove console.log statements before production");
    }
    
    if (code.includes('TODO') || code.includes('FIXME')) {
        issues.push("⚠️  Address TODO/FIXME comments");
    }
    
    if (code.includes('var ')) {
        issues.push("💡 Consider using 'const' or 'let' instead of 'var' for better scoping");
    }
    
    // Check for good practices
    const goodPractices = [];
    
    if (code.includes('const ') || code.includes('let ')) {
        goodPractices.push("✅ Good use of modern JavaScript variable declarations");
    }
    
    if (code.includes('function') || code.includes('=>')) {
        goodPractices.push("✅ Functions are properly defined");
    }
    
    if (code.includes('try') && code.includes('catch')) {
        goodPractices.push("✅ Error handling is implemented");
    }
    
    if (issues.length > 0) {
        review += "🔍 Issues Found:\n";
        issues.forEach(issue => {
            review += `${issue}\n`;
        });
        review += "\n";
    }
    
    if (goodPractices.length > 0) {
        review += "✅ Good Practices:\n";
        goodPractices.forEach(practice => {
            review += `${practice}\n`;
        });
        review += "\n";
    }
    
    review += "💡 General Recommendations:\n";
    review += "- Add meaningful comments to explain complex logic\n";
    review += "- Consider edge cases and error handling\n";
    review += "- Optimize for performance where necessary\n";
    review += "- Follow consistent naming conventions\n";
    
    return review;
}

module.exports = router; 