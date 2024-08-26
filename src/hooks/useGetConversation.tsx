import { db } from '@/configs/firebase';
import { IConversationId } from '@/configs/interface';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export default function useGetConversation(idConversation: string) {
    const [conversationSnapshot, setConversationSnapshot] = useState<IConversationId | null>(null);

    useEffect(() => {
        (async () => {
            const conversationRef = doc(db, 'conversations', idConversation);
            const conversationRefShapshot = await getDoc(conversationRef);

            setConversationSnapshot({
                ...(conversationRefShapshot.data() as IConversationId),
                id: conversationRefShapshot.id,
            });
        })();
    }, [idConversation]);

    return conversationSnapshot;
}
