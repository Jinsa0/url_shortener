import type { ShortenedURL } from "../../types/url";

type UrlItemProps = {
    url: ShortenedURL;
    removeUrl?: (id: number) => void;
};

export const UrlItem = ({ url, removeUrl }: UrlItemProps) => {
    const BASE = 'http://127.0.0.1:8000/api/';

    return (
        <div className="url-card card card--bordered card--shadow-sm card--p-md">

            <div className="url-card__top">
                <div>
                    <p className="url-card__label">Original URL</p>
                    <p className="url-card__value">{url.original_url}</p>
                </div>

                <span className="url-card__clicks">
                    {url.clicks} clicks
                </span>
            </div>

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

            {url.notes && (
                <p className="url-card__notes">
                    📝 {url.notes}
                </p>
            )}

            {removeUrl && (
                <div className="card__footer">
                    <button
                        className="btn btn--danger btn--sm"
                        onClick={() => removeUrl(url.id)}
                    >
                        Delete
                    </button>
                </div>
            )}

        </div>
    );
};