import { useUrls } from '../hooks/useUrls';
import { AddUrlForm } from '../components/ui/AddUrlForm';
import { UrlList } from '../components/ui/UrlList';

export const Dashboard = () => {
    const urlsData = useUrls();

    return (
        <div>
            <h1>My URLs</h1>

            <AddUrlForm addUrl={urlsData.addUrl} />

            <UrlList
                urls={urlsData.urls}
                loading={urlsData.loading}
                removeUrl={urlsData.removeUrl}
            />
        </div>
    );
};