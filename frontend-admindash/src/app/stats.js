export default function handler(req, res) {
    res.status(200).json({
        users: 120,
        recyclingRequests: 45,
        rewards: 30,
        orders: 98
    });
}
