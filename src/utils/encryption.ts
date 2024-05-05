import { AES, enc } from "crypto-ts";
import { hashSync, compareSync } from "bcryptjs";

export default new (class Encryption {
  public encrypt(data: string): string {
    return AES.encrypt(
      data.replace(/\s/g, "_"),
      process.env.ENCRYPTION_KEY
    ).toString();
  }

  public decrypt(data: string): string {
    return AES.decrypt(data, process.env.ENCRYPTION_KEY)
      .toString(enc.Utf8)
      .replace(/_/g, " ");
  }

  public hash(data: string) {
    return hashSync(data, 10);
  }

  public compareEncryption(data: string, hashData: string) {
    return compareSync(data, hashData);
  }
})();
