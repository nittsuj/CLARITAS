import React from 'react';
import { IconType } from 'react-icons';

interface Props {
  icon: IconType;
  title: string;
  description: string;
}

/**
 * Simple card used to list key features on the landing page.
 */
const FeatureCard: React.FC<Props> = ({ icon: Icon, title, description }) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ fontSize: '2rem', color: '#2563eb' }}>
        <Icon />
      </div>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{description}</p>
    </div>
  );
};

export default FeatureCard;