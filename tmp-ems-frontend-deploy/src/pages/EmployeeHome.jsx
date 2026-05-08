import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function EmployeeHome() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.employeeName || 'Employee'}!</h2>
        <p className="text-slate-600 mb-2">
          You are logged in as <span className="font-semibold">{user?.email}</span>.
        </p>
        <p className="text-slate-600">
          This is your personal dashboard. From here, you can view the company rules and basic information.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-cyan-600">Company Rules & Guidelines</h3>
        <ul className="list-disc pl-5 space-y-3 text-slate-700">
          <li><strong>Punctuality:</strong> Core working hours are 9:00 AM to 5:00 PM. Please ensure you are available during these times.</li>
          <li><strong>Communication:</strong> Always use official channels (email, Slack) for company communications.</li>
          <li><strong>Leave Policy:</strong> All leave requests must be submitted at least one week in advance.</li>
          <li><strong>Data Security:</strong> Do not share sensitive company information or credentials with external parties.</li>
          <li><strong>Respect:</strong> Maintain a respectful and inclusive environment for all team members.</li>
        </ul>
      </div>
    </div>
  );
}
