
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats } from "../../actions/adminActions";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { stats } = useSelector(state => state.adminStats);

    useEffect(() => {
        dispatch(getAdminStats());
    }, [dispatch]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Admin Dashboard</h1>

                <div className="row pr-4">
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-success o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Users<br /> <b>{stats?.users}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                <span className="float-left">View Details</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-primary o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Recycling Requests<br /> <b>{stats?.recyclingRequests}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/recycling">
                                <span className="float-left">View Details</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-warning o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Rewards Distributed<br /> <b>{stats?.rewards}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/rewards">
                                <span className="float-left">View Details</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="card text-white bg-danger o-hidden h-100">
                            <div className="card-body">
                                <div className="text-center card-font-size">Total Orders<br /> <b>{stats?.orders}</b></div>
                            </div>
                            <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                <span className="float-left">View Details</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row pr-4">
                    <div className="col-xl-6">
                        <h4 className="text-center">Recycling Statistics</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.recyclingData}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#00C49F" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="col-xl-6">
                        <h4 className="text-center">User Engagement</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={stats?.userActivity} dataKey="value" nameKey="name" outerRadius={100}>
                                    {stats?.userActivity.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}