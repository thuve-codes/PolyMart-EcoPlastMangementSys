const Bottle = require('../models/Bottle');  // Import the Bottle model

// Handle report generation
async function handleGenerateReport(req, res) {
    try {
        const reportData = await Bottle.aggregate([
            {
                $group: {
                    _id: "$email",  // Group by email
                    totalPickups: { $sum: 1 },  // Count the number of entries for each email
                    totalPoints: { $sum: "$points" }  // Sum the points for each email
                }
            },
            {
                $project: {
                    email: "$_id",  // Rename _id field to email
                    totalPickups: 1,  // Include totalPickups
                    totalPoints: 1,  // Include totalPoints
                    _id: 0  // Exclude _id field from the result
                }
            }
        ]);

        // Sending the report data as a response
        res.json({ success: true, report: reportData });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { handleGenerateReport };
