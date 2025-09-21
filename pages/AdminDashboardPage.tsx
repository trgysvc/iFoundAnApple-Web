import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.tsx';
import { UserRole } from '../types';
import Container from '../components/ui/Container';
import { Users, Smartphone, BarChart2 } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
    const { users, devices, t } = useAppContext();

    const getRoleName = (role: UserRole) => {
        switch (role) {
            case UserRole.USER: return t('user');
            case UserRole.ADMIN: return t('admin');
            default: return role;
        }
    };
    
    const usersWithoutAdmin = users.filter(u => u.role !== UserRole.ADMIN);
    const devicesByStatus = devices.reduce((acc, device) => {
        acc[device.status] = (acc[device.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Container>
            <h1 className="text-3xl font-bold text-brand-gray-600 mb-8">{t('adminDashboard')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-brand-gray-500">{t('totalUsers')}</p>
                        <p className="text-2xl font-bold text-brand-gray-600">{usersWithoutAdmin.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                     <div className="p-3 bg-green-100 rounded-full">
                        <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-brand-gray-500">{t('totalDevices')}</p>
                        <p className="text-2xl font-bold text-brand-gray-600">{devices.length}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                     <div className="p-3 bg-indigo-100 rounded-full">
                        <BarChart2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-brand-gray-500">Completed</p>
                        <p className="text-2xl font-bold text-brand-gray-600">{devicesByStatus['Completed'] || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* All Users Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-gray-600 mb-4">{t('allUsers')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-brand-gray-500">
                            <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('fullName')}</th>
                                    <th scope="col" className="px-6 py-3">{t('email')}</th>
                                    <th scope="col" className="px-6 py-3">{t('role')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersWithoutAdmin.map(user => (
                                    <tr key={user.id} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-brand-gray-900 whitespace-nowrap">{user.fullName}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                user.role === UserRole.ADMIN 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {getRoleName(user.role)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* All Devices Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-gray-600 mb-4">{t('allDevices')}</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-brand-gray-500">
                            <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('model')}</th>
                                    <th scope="col" className="px-6 py-3">{t('serialNumber')}</th>
                                    <th scope="col" className="px-6 py-3">{t('status')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map(device => {
                                    const user = users.find(u => u.id === device.userId);
                                    return (
                                        <tr key={device.id} className="bg-white border-b">
                                            <td className="px-6 py-4 font-medium text-brand-gray-900 whitespace-nowrap">{device.model}</td>
                                            <td className="px-6 py-4">{device.serialNumber}</td>
                                            <td className="px-6 py-4">{device.status}</td>
                                            <td className="px-6 py-4">{user ? user.email : 'N/A'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminDashboardPage;