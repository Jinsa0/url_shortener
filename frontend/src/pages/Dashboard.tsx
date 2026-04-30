// src/pages/Dashboard.tsx
import { useState } from 'react';
import { useUrls } from '../hooks/useUrls';
import { UrlList } from '../components/ui/UrlList';
import Modal from '../components/ui/Modal';
import { AddUrlForm } from '../components/ui/AddUrlForm';
import Button from '../components/ui/Button';

export const Dashboard = () => {
    const urlsData = useUrls();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="app-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Мої посилання</h1>
                
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Скоротити URL
                </Button>
            </div>

            <UrlList
                urls={urlsData.urls}
                loading={urlsData.loading}
                removeUrl={urlsData.removeUrl}
            />

            {/* Модальне вікно створення URL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Скоротити новий URL"
                size="md"
            >
                <AddUrlForm 
                    addUrl={urlsData.addUrl} 
                    onSuccess={() => setIsAddModalOpen(false)}
                />
            </Modal>
        </div>
    );
};