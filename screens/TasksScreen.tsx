import React, { useState, useMemo } from 'react';
import { Task, User, Profile, Team } from '../types';
import { MOCK_TASKS } from '../constants';
import { PlusCircle, ClipboardCheck, Edit, Trash2, CheckCircle } from '../components/icons/Icons';

interface TasksScreenProps {
  currentUser: User;
  currentUserProfile: Profile;
  currentUserTeam: Team | null;
}

const statusColors: { [key in Task['status']]: string } = {
  'Not Started': 'bg-gray-200 text-gray-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
};

const TasksScreen: React.FC<TasksScreenProps> = ({ currentUser, currentUserProfile, currentUserTeam }) => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    
    const permissions = currentUserProfile.permissions.tasks;

    const tasksForUser = useMemo(() => {
        const { role } = currentUser;
        if (role === 'Admin' || role === 'Director') {
            return tasks;
        }
        if (role === 'Manager') {
            const teamMemberIds = currentUserTeam?.memberIds || [];
            return tasks.filter(task => teamMemberIds.includes(task.assignedTo.id) || task.assignedTo.id === currentUser.id);
        }
        return tasks.filter(task => task.assignedTo.id === currentUser.id);
    }, [tasks, currentUser, currentUserTeam]);

    const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
        if (!permissions.update) {
            alert("You don't have permission to update tasks.");
            return;
        };
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    };

    const handleDelete = (taskId: number) => {
        if (!permissions.delete) {
            alert("You don't have permission to delete tasks.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Tasks</h2>
                    {permissions.create && (
                        <button className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Task
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-neutral-100">
                        <tr>
                            <th className="p-4 font-semibold">Subject</th>
                            <th className="p-4 font-semibold">Related To</th>
                            <th className="p-4 font-semibold">Assigned To</th>
                            <th className="p-4 font-semibold">Due Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksForUser.map((task) => (
                        <tr key={task.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{task.subject}</td>
                            <td className="p-4">{task.relatedTo.name} <span className="text-xs text-neutral-400">({task.relatedTo.type})</span></td>
                            <td className="p-4">
                                <div className="flex items-center">
                                    <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-8 h-8 rounded-full mr-2" />
                                    <span>{task.assignedTo.name}</span>
                                </div>
                            </td>
                            <td className="p-4">{task.dueDate}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center space-x-2">
                                    {permissions.update && task.status !== 'Completed' && (
                                         <button onClick={() => handleStatusChange(task.id, 'Completed')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" title="Mark as Complete">
                                            <CheckCircle className="w-5 h-5"/>
                                        </button>
                                    )}
                                     {permissions.update && (
                                         <button onClick={() => alert('Edit functionality to be implemented.')} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg" title="Edit">
                                            <Edit className="w-5 h-5"/>
                                        </button>
                                    )}
                                    {permissions.delete && (
                                         <button onClick={() => handleDelete(task.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg" title="Delete">
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                 {tasksForUser.length === 0 && (
                    <div className="text-center py-12 text-neutral-400">
                        <ClipboardCheck className="w-12 h-12 mx-auto mb-2"/>
                        <p>No tasks found.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default TasksScreen;