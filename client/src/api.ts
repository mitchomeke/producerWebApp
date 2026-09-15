// client/src/api.ts
import { API_URL } from './config';

// 1. Audio stream URL helper (used in your audio player)
export const getBeatPreviewUrl = (beatId: number): string => {
    return `${API_URL}/api/beats/preview/beats/${beatId}`;
};

export const getSongPreviewUrl = (songId: number): string => {
    return `${API_URL}/api/beats/preview/songs/${songId}`;
};
