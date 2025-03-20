import React from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import MobileDialog from '@/components/shared_ui/mobile-dialog';
import Text from '@/components/shared_ui/text';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { Icon } from '@/utils/tmp/dummy';
import { getWalletUrl } from '@/utils/traders-hub-redirect';
import { Localize } from '@deriv-com/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet-mobile.scss';

type TAccountSwitcherWalletMobile = {
    loginid: string;
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWalletMobile = observer(({ is_visible, toggle }: TAccountSwitcherWalletMobile) => {
    const { data: wallet_list, has_wallet = false } = useStoreWalletAccountsList() || {};

    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    const handleTradersHubRedirect = () => {
        closeAccountsDialog();
        let redirect_url = standalone_routes.traders_hub;
        if (has_wallet) {
            redirect_url = standalone_routes.cfds;
        }
        window.location.assign(redirect_url);
    };

    const handleManageFundsRedirect = () => {
        closeAccountsDialog();
        // Directly redirect to the wallet page in Trader's Hub if conditions are met
        if (has_wallet) {
            const wallet_url = getWalletUrl();
            window.location.assign(wallet_url);
        } else {
            // Fallback to the default wallet transfer page if conditions are not met
            window.location.assign(standalone_routes.wallets_transfer);
        }
    };

    const footer = (
        <React.Fragment>
            <hr className='account-switcher-wallet-mobile__divider' />
            <button className='account-switcher-wallet-mobile__footer' onClick={handleTradersHubRedirect} type='button'>
                <Text weight='normal' size='xs'>
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
                </Text>
                <Icon icon={'IcChevronRightBold'} />
            </button>
        </React.Fragment>
    );

    return (
        <MobileDialog
            portal_element_id='modal_root'
            footer={footer}
            visible={is_visible}
            onClose={closeAccountsDialog}
            has_close_icon
            has_full_height
            title={<Localize i18n_default_text='Options accounts' />}
        >
            <div className='account-switcher-wallet-mobile'>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
                <Button
                    className='account-switcher-wallet-mobile__button'
                    has_effect
                    primary
                    large
                    onClick={handleManageFundsRedirect}
                >
                    <Localize i18n_default_text='Manage funds' />
                </Button>
            </div>
        </MobileDialog>
    );
});
