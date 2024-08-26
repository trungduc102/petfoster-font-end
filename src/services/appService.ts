import { updatePrintForOrder } from '@/apis/admin/orders';
import { IOrderAdminItem } from '@/configs/interface';
import { links } from '@/datas/links';
import { contants } from '@/utils/contants';
import { addPreviousUrl } from '@/utils/session';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { toast } from 'react-toastify';

const handleNonLogin = (pathname: string, router: AppRouterInstance) => {
    addPreviousUrl(pathname);
    router.push(links.auth.login);
};

const handleSetPrint = async (id: number, callback?: (response: IOrderAdminItem) => void) => {
    try {
        const response = await updatePrintForOrder(id);

        if (!response) return toast.warn(contants.messages.errors.handle);

        if (response.errors) return toast.warn(response.message);

        if (callback) {
            callback(response.data);
        }
    } catch (error) {
        toast.error(contants.messages.errors.server);
    }
};

export const appService = { handleNonLogin, handleSetPrint };
