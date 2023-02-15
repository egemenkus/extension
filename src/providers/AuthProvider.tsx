import { useToast } from "../hooks";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import Extension from "../Extension";
import { AccountFormType } from "../pages/accountForm/AccountForm";

interface InitialState {
  isInit: boolean;
}

const initialState: InitialState = {
  isInit: true,
};

interface AuthContext {
  state: InitialState;
  createAccount: (account: AccountFormType) => Promise<boolean>;
  importAccount: (account: AccountFormType) => Promise<boolean>;
  deriveAccount: (account: AccountFormType) => Promise<boolean>;
  restorePassword: (account: AccountFormType) => Promise<boolean>;
}

const AuthContext = createContext({} as AuthContext);

const reducer = (state: InitialState, action: any): InitialState => {
  switch (action.type) {
    case "init": {
      return {
        ...action.payload,
        isInit: false,
      };
    }
    default:
      return state;
  }
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showErrorToast } = useToast();

  const [state] = useReducer(reducer, initialState);

  const createAccount = async ({
    name,
    password,
    seed,
    isSignUp,
  }: AccountFormType) => {
    try {
      await Extension.createAccounts({ name, password, seed, isSignUp });
      return true;
    } catch (error) {
      showErrorToast(error as Error);
      return false;
    }
  };

  const importAccount = async ({
    name,
    privateKeyOrSeed,
    password,
    accountType,
    isSignUp,
  }: AccountFormType) => {
    try {
      const isUnlocked = await Extension.isUnlocked();
      if (!password && !isUnlocked) {
        throw new Error("Password is required");
      }
      await Extension.importAccount({
        name,
        privateKeyOrSeed,
        password,
        accountType,
        isSignUp,
      });

      return true;
    } catch (error) {
      showErrorToast(error as Error);
      return false;
    }
  };

  const deriveAccount = async ({ name, accountType }: AccountFormType) => {
    try {
      const isUnlocked = await Extension.isUnlocked();
      if (!isUnlocked) {
        throw new Error("Extension is locked");
      }
      const account = await Extension.deriveAccount({ name, accountType });
      await Extension.setSelectedAccount(account);
      return true;
    } catch (error) {
      showErrorToast(error as Error);
      return false;
    }
  };

  const restorePassword = async ({
    privateKeyOrSeed: recoveryPhrase,
    password: newPassword,
  }: AccountFormType) => {
    try {
      if (!recoveryPhrase) throw new Error("Recovery phrase is required");
      if (!newPassword) throw new Error("New password is required");
      await Extension.restorePassword(recoveryPhrase, newPassword);
      return true;
    } catch (error) {
      showErrorToast(error as Error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        createAccount,
        importAccount,
        deriveAccount,
        restorePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
