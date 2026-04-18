import type { UrlListProps } from "../../types/url";
import { UrlItem } from "./UrlItem";

export const UrlList = ({ urls, loading, removeUrl }: UrlListProps) => {
    if (loading) {
        return <p className="page-loader">Loading URLs...</p>;
    }

    return (
        <div className="url-list">
            {urls.map(url => (
                <UrlItem
                    key={url.id}
                    url={url}
                    removeUrl={removeUrl}
                />
            ))}
        </div>
    );
};