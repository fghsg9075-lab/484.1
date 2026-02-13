import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Video, Play, ExternalLink } from 'lucide-react';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { rtdb, getChapterData } from '../firebase';

interface Props {
    onBack: () => void;
    mode?: 'UPDATES' | 'VIDEOS';
}

export const UniversalInfoPage: React.FC<Props> = ({ onBack, mode = 'UPDATES' }) => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'UPDATES' | 'VIDEOS'>(mode);

    useEffect(() => {
        if (activeTab === 'UPDATES') {
            // Mark as read
            localStorage.setItem('nst_last_read_update', Date.now().toString());

            const q = query(ref(rtdb, 'universal_updates'), limitToLast(50));
            const unsubscribe = onValue(q, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const list = Object.entries(data).map(([k, v]: any) => ({
                        id: k,
                        ...v
                    })).reverse(); // Newest first
                    setUpdates(list);
                } else {
                    setUpdates([]);
                }
            });
            return () => unsubscribe();
        } else {
            // Fetch Videos
            getChapterData('nst_universal_playlist').then(data => {
                if (data && data.videoPlaylist) {
                    setVideos(data.videoPlaylist);
                }
            });
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in slide-in-from-right">
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <ArrowLeft size={20} />
                </button>
                <h3 className="font-bold text-slate-800">
                    {activeTab === 'VIDEOS' ? 'Universal Videos' : 'Universal Information'}
                </h3>
            </div>

            {/* Tab Switcher if needed, or just follow mode */}
            <div className="flex p-4 gap-2">
                <button
                    onClick={() => setActiveTab('UPDATES')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs ${activeTab === 'UPDATES' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border'}`}
                >
                    Updates
                </button>
                <button
                    onClick={() => setActiveTab('VIDEOS')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs ${activeTab === 'VIDEOS' ? 'bg-rose-600 text-white' : 'bg-white text-rose-500 border'}`}
                >
                    Videos
                </button>
            </div>

            <div className="p-4 space-y-4">
                {activeTab === 'UPDATES' && (
                    <>
                        {updates.length === 0 && (
                            <div className="text-center py-10 text-slate-400">
                                <Bell size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No new updates.</p>
                            </div>
                        )}

                        {updates.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm mb-1">{item.text}</p>
                                    <p className="text-[10px] text-slate-400">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'VIDEOS' && (
                    <>
                        {videos.length === 0 && (
                            <div className="text-center py-10 text-slate-400">
                                <Video size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No universal videos available.</p>
                            </div>
                        )}

                        {videos.map((vid, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex gap-3 group hover:border-rose-300 transition-all">
                                <div className="w-24 h-16 bg-slate-900 rounded-lg flex items-center justify-center relative shrink-0">
                                    <Play size={20} className="text-white opacity-80" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">{vid.title}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                                        vid.access === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {vid.access || 'FREE'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => window.open(vid.url, '_blank')}
                                    className="p-3 bg-rose-50 text-rose-600 rounded-xl self-center hover:bg-rose-100 active:scale-95 transition-all"
                                >
                                    <Play size={18} fill="currentColor" />
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
