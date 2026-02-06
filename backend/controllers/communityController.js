const User = require('../models/userModel');
const CourseProgress = require('../models/courseProgressModel');

exports.getCommunityStats = async (req, res) => {
    try {
        const userId = req.query.userId;

        // 1. Total Registered Users
        const activeUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        // 2. Interviews Taken Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const interviewsToday = await CourseProgress.countDocuments({
            updatedAt: { $gte: startOfDay }
        });

        // 3. User Rank
        let rank = 0;

        if (userId) {
            // Rank logic consistent with leaderboard
            const pipeline = [
                { $match: { role: { $ne: 'admin' } } },
                {
                    $lookup: {
                        from: "courseprogresses",
                        localField: "_id",
                        foreignField: "userId",
                        as: "progressHistory"
                    }
                },
                {
                    $addFields: {
                        completedInterviews: {
                            $filter: {
                                input: "$progressHistory",
                                as: "ph",
                                cond: { $eq: ["$$ph.progress", 100] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        totalInterviews: { $size: "$completedInterviews" },
                        avgScore: {
                            $cond: {
                                if: { $gt: [{ $size: "$completedInterviews" }, 0] },
                                then: { $avg: "$completedInterviews.score" },
                                else: 0
                            }
                        }
                    }
                },
                { $sort: { avgScore: -1, totalInterviews: -1 } }
            ];

            const allUsersRanked = await User.aggregate(pipeline);
            const userIndex = allUsersRanked.findIndex(u => u._id.toString() === userId);

            if (userIndex !== -1) {
                // If user has 0 interviews, do we rank them? 
                // Leaderboard shows everyone, so yes.
                rank = userIndex + 1;
            }
        }

        res.json({
            activeUsers,
            interviewsToday,
            userRank: rank
        });

    } catch (error) {
        console.error("Community stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Aggregation pipeline starting from User to include everyone
        const pipeline = [
            { $match: { role: { $ne: 'admin' } } },
            {
                $lookup: {
                    from: "courseprogresses",
                    localField: "_id",
                    foreignField: "userId",
                    as: "progressHistory"
                }
            },
            {
                $addFields: {
                    completedInterviews: {
                        $filter: {
                            input: "$progressHistory",
                            as: "ph",
                            cond: { $eq: ["$$ph.progress", 100] }
                        }
                    }
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    totalInterviews: { $size: "$completedInterviews" },
                    avgScore: {
                        $cond: {
                            if: { $gt: [{ $size: "$completedInterviews" }, 0] },
                            then: { $avg: "$completedInterviews.score" },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { avgScore: -1, totalInterviews: -1 } }
        ];

        let aggregatedData = await User.aggregate(pipeline);

        // Add rank
        aggregatedData = aggregatedData.map((item, index) => ({
            ...item,
            rank: index + 1
        }));

        if (search) {
            aggregatedData = aggregatedData.filter(item =>
                item.username.toLowerCase().includes(search.toLowerCase())
            );
        }

        const total = aggregatedData.length;
        const paginatedData = aggregatedData.slice(skip, skip + Number(limit));

        res.json({
            users: paginatedData,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
