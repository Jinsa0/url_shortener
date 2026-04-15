import type { UrlListProps } from "../../types/url";

export const UrlList = ({ urls, loading, removeUrl }: UrlListProps) => {
    const BASE = 'http://127.0.0.1:8000/api/';

    if (loading) {
        return <p className="page-loader">Loading URLs...</p>;
    }

    return (
        <div className="url-list">
            {urls.map(url => (
                <div key={url.id} className="url-card card card--bordered card--shadow-sm card--p-md">

                    {/* TOP */}
                    <div className="url-card__top">
                        <div>
                            <p className="url-card__label">Original URL</p>
                            <p className="url-card__value">{url.original_url}</p>
                        </div>

                        <span className="url-card__clicks">
                            {url.clicks} clicks
                        </span>
                    </div>

                    {/* SHORT LINK */}
                    <div className="url-card__middle">
                        <a
                            className="url-card__short"
                            href={`${BASE}${url.short_code}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {BASE}{url.short_code}
                        </a>
                    </div>

                    {/* NOTES */}
                    {url.notes && (
                        <p className="url-card__notes">
                            📝 {url.notes}
                        </p>
                    )}

                    {/* ACTIONS */}
                    <div className="card__footer">
                        <button
                            className="btn btn--danger btn--sm"
                            onClick={() => removeUrl(url.id)}
                        >
                            Delete
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
};