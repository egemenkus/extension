import { useEffect } from "react";
import Extension from "../utils/Extension";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { Account } from "@src/utils/storage/entities/Accounts";
import { useToast } from "../hooks";
import { useNetworkContext } from "./NetworkProvider";
import { transformAddress } from "@src/utils/account-utils";

interface InitialState {
  accounts: Account[];
  isLoadingAccounts: boolean;
  selectedAccount: Account;
}

const initialState: InitialState = {
  accounts: [],
  isLoadingAccounts: true,
  selectedAccount: {} as Account,
};

const AccountContext = createContext(
  {} as {
    state: InitialState;
    getAllAccounts: () => Promise<Account[]>;
    getSelectedAccount: () => Promise<Account | undefined>;
    setSelectedAccount: (account: Account) => void;
  }
);

const reducer = (state: InitialState, action: any): InitialState => {
  switch (action.type) {
    case "set-accounts": {
      const { accounts } = action.payload;

      return {
        ...state,
        accounts,
        isLoadingAccounts: false,
      };
    }
    case "set-selected-account": {
      const { selectedAccount } = action.payload;

      return {
        ...state,
        selectedAccount,
      };
    }
    case "change-selected-address-format": {
      const { address } = action.payload;

      return {
        ...state,
        selectedAccount: {
          ...(state.selectedAccount as any),
          value: {
            ...state.selectedAccount.value,
            address,
          },
        },
      };
    }
    default:
      return state;
  }
};

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    state: { selectedChain },
  } = useNetworkContext();

  const { showErrorToast } = useToast();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getAllAccounts = async () => {
    try {
      const accounts = await Extension.getAllAccounts();
      dispatch({
        type: "set-accounts",
        payload: {
          accounts,
        },
      });
      return accounts;
    } catch (error) {
      showErrorToast(error);
      return [];
    }
  };

  useEffect(() => {
    if (state.selectedAccount?.value?.address) {
      const newAddress = transformAddress(
        state.selectedAccount.value.address,
        selectedChain?.addressPrefix
      );
      dispatch({
        type: "change-selected-address-format",
        payload: {
          address: newAddress,
        },
      });
    }
  }, [selectedChain?.name, state?.selectedAccount?.key]);

  const getSelectedAccount = async () => {
    try {
      const selectedAccount = await Extension.getSelectedAccount();

      dispatch({
        type: "set-selected-account",
        payload: {
          selectedAccount: {
            ...selectedAccount,
            value: {
              ...selectedAccount?.value,
              address: transformAddress(
                selectedAccount?.value?.address as string,
                selectedChain?.addressPrefix
              ),
            },
          },
        },
      });
      return selectedAccount;
    } catch (error) {
      showErrorToast(error);
    }
  };

  const setSelectedAccount = async (account: Account) => {
    try {
      await Extension.setSelectedAccount(account);
      getSelectedAccount();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        state,
        getAllAccounts,
        getSelectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
