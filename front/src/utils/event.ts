import type {NavigateFunction} from "react-router-dom";

export function bindNavigateEventToTarget(selectors: string, navigate: NavigateFunction, url: string, eventType: string = 'clcik') {
    const link: HTMLElement | null = document.querySelector(selectors) as HTMLElement;
    if (link) {
        link.addEventListener(eventType, (event) => {
            event.preventDefault();
            navigate(url);
        });
    }
}



