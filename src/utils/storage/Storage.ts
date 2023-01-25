import Account, { AccountKey } from "./Account";
import Auth from "./Auth";
import Vault from "./Vault";

const VAULT = "vault";

export default class Storage {
  #storage: chrome.storage.StorageArea;
  #auth: Auth;

  constructor(auth: Auth) {
    this.#storage = chrome.storage.local;
    this.#auth = auth;
  }

  getStorage(): chrome.storage.StorageArea {
    return this.#storage;
  }

  async initVault() {
    const vault = await this.getVault();
    if (!vault) {
      this.setVault(new Vault());
    }
  }

  async getVault() {
    const encryptedVault = await this.#storage.get(VAULT);
    return this.#auth.decryptVault(encryptedVault.vault);
  }

  async setVault(vault: Vault, callback?: () => void) {
    const encryptedVault = await this.#auth.encryptVault(vault);
    this.#storage.set({ [VAULT]: encryptedVault }, callback);
  }

  removeVault(callback?: () => void) {
    this.#storage.remove(VAULT, callback);
  }

  async saveAccount(account: Account, callback?: () => void) {
    const vault = await this.getVault();
    if (!vault) throw new Error("Vault is not initialized");
    if (vault.accounts[account.key]) throw new Error("Account already exists");
    vault.accounts[account.key] = account;
    this.setVault(vault, callback);
  }

  async removeAccount(key: AccountKey, callback?: () => void) {
    const vault = await this.getVault();
    if (!vault) throw new Error("Vault is not initialized");
    if (!vault.accounts[key]) throw new Error("Account does not exist");
    delete vault.accounts[key];
    this.setVault(vault, callback);
  }

  async getAccount(key: AccountKey): Promise<Account | undefined> {
    const vault = await this.getVault();
    if (!vault) throw new Error("Vault is not initialized");
    return vault.accounts[key];
  }
}
