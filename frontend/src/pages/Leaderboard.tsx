import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { communityApi } from '@/lib/api';
import { Search, Trophy, Medal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardUser {
    _id: string;
    username: string;
    email: string;
    avgScore: number;
    totalInterviews: number;
    rank: number;
}

const Leaderboard: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await communityApi.getLeaderboard({ page, limit, search });
            setUsers(data.users);
            setTotalPages(data.pages);
            setTotalUsers(data.total);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchLeaderboard();
        }, 300);
        return () => clearTimeout(debounce);
    }, [page, limit, search]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400" />;
            case 3: return <Medal className="w-5 h-5 text-amber-600" />;
            default: return <span className="text-gray-900 font-bold bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full text-xs">{rank}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Leaderboard</h1>
                    <p className="text-gray-600">Top performers across the platform</p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Show:</span>
                                <Select
                                    value={limit.toString()}
                                    onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}
                                >
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Rank</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead className="text-center">Interviews Completed</TableHead>
                                                <TableHead className="text-right">Average Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.length > 0 ? (
                                                users.map((u) => (
                                                    <TableRow key={u._id} className={user?.id === u._id ? "bg-blue-50" : ""}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center justify-center w-8 h-8">
                                                                {getRankIcon(u.rank)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{u.username}</div>
                                                                {user?.id === u._id && (
                                                                    <Badge variant="secondary" className="mt-1 text-xs">You</Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline">{u.totalInterviews}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {u.totalInterviews > 0 ? (
                                                                <span className={`font-bold ${u.avgScore >= 90 ? 'text-green-600' : u.avgScore >= 75 ? 'text-blue-600' : 'text-gray-900'}`}>
                                                                    {Math.round(u.avgScore)}%
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 font-medium">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        No users found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between p-4 border-t">
                                    <div className="text-sm text-gray-500">
                                        Showing {users.length} of {totalUsers} users
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Leaderboard;
