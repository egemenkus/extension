import AccountManager, { AccountType } from "./handlers/AccountManager";
import EVMHandler from "./handlers/EVMHandler";
import WASMHandler from "./handlers/WASMHandler";
import Account, { AccountKey } from "./storage/Account";
import Auth from "./storage/Auth";
import Storage from "./storage/Storage";
import Vault from "./storage/Vault";

const storage = chrome.storage.local;

export default class Extension {
  #accountType: AccountType;
  #auth: Auth;
  #storage: Storage;

  constructor(accountType: AccountType = AccountType.EVM) {
    this.#accountType = accountType;
    this.#auth = new Auth();
    this.#storage = new Storage(this.#auth);
  }

  get accountType(): AccountType {
    return this.#accountType;
  }

  set accountType(accountType: AccountType) {
    this.#accountType = accountType;
  }

  get accountManager(): AccountManager {
    switch (this.#accountType) {
      case AccountType.EVM:
        return new EVMHandler(this.#storage);
      case AccountType.WASM:
        return new WASMHandler(this.#storage);
      default:
        throw new Error("Invalid account type");
    }
  }

  async signUp({ seed, name, password }: any) {
    await this.#auth.signUp({ password });
    const vault = new Vault();
    await this.#storage.setVault(vault);
    this.addAccount({ seed, name });
  }

  addAccount({ seed, name }: any) {
    this.#storage.getVault()
    this.accountManager.addAccount(seed, name);
  }

  removeAccount(key: AccountKey) {
    this.accountManager.forget(key);
  }

  changeAccountName({ key, newName }: any) {
    this.accountManager.changeName(key, newName);
  }

  changePassword(seedOrPrivateKey: string, newPassword: string) {
    this.auth.changePassword(seedOrPrivateKey, newPassword);
  }

  async signIn(password: string) {
    const vault = await this.accountManager.getEncryptedVault();
    this.auth.signIn(password, vault);
  }

  exportAccount() {
    //this.accountManager.export();
  }

  async getAccount(key: AccountKey): Promise<Account | undefined> {
    return this.accountManager.getAccount(key);
  }

  async getAllAccounts(): Promise<Account[]> {
    const accounts: Account[] = [];
    const accountsInStorage = await storage.get(null);
    Object.keys(accountsInStorage).forEach((key) => {
      if (key.includes("WASM") || key.includes("EVM")) {
        accounts.push(new Account(key as AccountKey, accountsInStorage[key]));
      }
    });

    return accounts;
  }
}
