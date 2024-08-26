import { db } from '@/configs/firebase';
import { IConversation, IConversationId, IMessage, INavChatItemData, IUserFirebase } from '@/configs/interface';
import firebaseService from '@/services/firebaseService';
import { contants } from '@/utils/contants';
import { convertFirestoreTimestampToString } from '@/utils/format';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function useGetInfoNavbarItem(conversation: IConversationId) {
    const [lastMessage, setLastMessage] = useState<IMessage | null>(null);

    const usernameUser = conversation?.users?.find((user) => user !== contants.usernameAdmin) || '';
    const idFirstMessage = conversation?.newMessage;

    const [userSnapshot] = useCollection(firebaseService.querys.getUserByUsername(usernameUser));
    const [messageSnapshot] = useCollection(firebaseService.querys.getMessageWithId(idFirstMessage));

    const user = {
        ...(userSnapshot?.docs[0]?.data() as IUserFirebase),
        lassSeen: convertFirestoreTimestampToString(userSnapshot?.docs[0]?.data().lassSeen),
    } as IUserFirebase;

    useEffect(() => {
        (async () => {
            if (!idFirstMessage) return;
            const messageRef = doc(db, 'messages', idFirstMessage);
            const messageSnapshot = await getDoc(messageRef);

            setLastMessage({
                ...(messageSnapshot?.data() as IMessage),
                id: messageSnapshot.id,
            });
        })();
    }, [idFirstMessage]);

    return {
        user,
        lastMessage,
    };
}
