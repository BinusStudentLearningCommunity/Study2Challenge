import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';

interface DashboardData {
  message: string;
  // masih template schema random
}

const ParticipantDashboardPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<DashboardData>('/dashboard');
                setMessage(response.data.message);
            } catch (err: unknown) {
                setError('Failed to fetch dashboard data. Please log in again.');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Participant Dashboard</h1>
            {error ? <p style={{ color: 'red' }}>{error}</p> : <p>{message}</p>}
        </div>
    );
};

export default ParticipantDashboardPage;