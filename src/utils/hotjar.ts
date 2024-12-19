import { epochToMoment, toMoment } from '@/components/shared/utils/date/date-time';
import { TStores } from '@deriv/stores/types';

const initHotjar = (client: TStores['client']) => {
    // To initialize only on staging and production links

    /**
     * Inject: External Script - Hotjar
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (function (h: any, o, t, j) {
        /* eslint-disable */
        h.hj =
            h.hj ||
            function () {
                (h.hj.q = h.hj.q || []).push(arguments);
            };
        /* eslint-enable */
        h._hjSettings = { hjid: 3050531, hjsv: 6 };
        const a = o.getElementsByTagName('head')[0];
        const r = o.createElement('script');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);

        // Hotjar attribution code for user segmentation
        const user_id = client.loginid;
        const account_type = client.is_virtual ? 'Demo' : 'Real';
        const account_open_date = client.account_open_date ? epochToMoment(client.account_open_date) : undefined;
        console.log(account_open_date);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).hj('identify', user_id, {
            'Account created': account_open_date ? toMoment(account_open_date).format('YYYY-MM-DD') : '',
            'Account type': account_type,
            'User country': client.clients_country,
        });
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
};

export default initHotjar;
