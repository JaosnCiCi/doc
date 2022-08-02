/\*\*

- 加密消息
-
- @param {WordArray|string} message 加密字符串
- @param {WordArray|string} key 密码
- @param {Object} cfg (可选) 加密配置选项.
-
- Default cfg:
- {
-      iv: WordArray,               // IV
-      mode: CryptoJS.mode.CBC,     // mode 支持 CBC,CFB,CTR,ECB,OFB
-      padding: CryptoJS.pad.Pkcs7, // padding 支持 Pkcs7,AnsiX923,Iso10126, NoPadding,ZeroPadding
-      kdf: CryptoJS.kdf.OpenSSL,   // EvpKDF
- }
-
- @return {CipherParams} A cipher params object.
  \*/
  CryptoJS.AES.encrypt(str, key, cfg);

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

console.log(ciphertext.toString()); //这里每次得到的结果都是不一样的

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
以上执行每次得到的加密结果都不一样, 是属于随机密钥.

那官方提供的例子, key 为 string 类型, 会经过什么样的处理呢?
如果 key 为 string 类型, 会经过 CryptoJS.lib.PasswordBasedCipher 处理, 使用 cfg.kdf 生成新的 WordArray, cfg.kdf 默认是 CryptoJS.kdf.OpenSSL(即 EvpKDF).
