// UTM params
class UTMParams {
    private storageKey = "maistro_utm"
    private keys: string[] = []

    constructor(keys: string[]) {
        this.keys = keys
    }

    persistUTMsFromURL(): void {
        const params = new URLSearchParams(window.location.search);
        const utms: Record<string, string> = {};

        this.keys.forEach((key) => {
            const value = params.get(key);
            if (value) {
                utms[key] = value;
            }
        });

        if (Object.keys(utms).length > 0) {
            localStorage.setItem(this.storageKey, JSON.stringify(utms));
        }
    }

    getPersistedUTMs(): Record<string, string> {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }
}

export const utmParams = new UTMParams(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'])

// TRACK events
export enum TrackEvent {
    vsl_page_view = "vsl_page_view",
    vsl_page_video_unmuted = "vsl_page_video_unmuted",
    vsl_page_video_progress_0 = "vsl_page_video_progress_0",
    vsl_page_video_progress_25 = "vsl_page_video_progress_25",
    vsl_page_video_progress_50 = "vsl_page_video_progress_50",
    vsl_page_video_progress_100 = "vsl_page_video_progress_100",
    vsl_page_cta_revealed = "vsl_page_cta_revealed",
    vsl_page_cta_clicked = "vsl_page_cta_clicked",
    vsl_page_cta_sticky_clicked = "vsl_page_cta_sticky_clicked",
    vsl_page_exit_intent = "vsl_page_exit_intent",
    vsl_page_exit_intent_cta = "vsl_page_exit_intent_cta",
    success_page_view = "success_page_view",
    success_page_cta_clicked = "success_page_cta_clicked",
    success_page_upsell_clicked = "success_page_upsell_clicked",
    success_page_help_clicked = "success_page_help_clicked",
}

export const trackEvent = (event: TrackEvent, params = {}) => {
  const eventUtmParams = utmParams.getPersistedUTMs();

  (window as any)?.gtag('event', event, {
    ...params,
    ...eventUtmParams,
  });
}
