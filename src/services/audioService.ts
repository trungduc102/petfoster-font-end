import { Howl, Howler } from 'howler';

const messageAudio = () => {
    const audio = new Howl({
        src: '/audio/audio-new-message.mp3',
        volume: 0.2,
    });

    return audio;
};

const audioService = {
    messageAudio,
};

export default audioService;
