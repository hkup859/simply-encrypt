# simply-encrypt

Encrypting data in Typescript is harder than it needs to be. The goal of this package is to create a reasonably secure encryption package that is dead simple to use. Simply give it the data and a password of any length, it handles all the rest. There are options that give you more control if you want, but by default you aren't required to pass any more information or choose any other options.

### What does "reasonably secure" mean?

In the context of this package "reasonably secure" means that the algorithms, encryption, and pieces of data (such as encrypted data, key, iv, auth tag, etc) are handled in a safe and proper way. I'm not a cryptographer, but I did research on the "correct" way to work with the various algorithms implemented in this package and how to manage the secret and non-secret information. I believe I followed best practices while maintaining ease of use, but if you are knowledgeable on cryptography and the related implementations then I welcome any insight into better ways to improve this package.

### Which algorithm should I use?

By default this package uses AES-256-GCM, which at the time of writing seems to be a solid industry standard. It uses both an IV (initial vector) and is authenticated, both of which make it more secure. It does have some drawbacks though, namely speed. If you want more speed then you should consider AES-256-CBC or CHACHA-20-POLY1305, both of which are also secure but are faster than AES-256-GCM.

On the contrary, if speed is not a concern to you I recommend using the multiEncrypt/multiDecrypt functions rather than regular encryption. This adds multiple layers of security and some obscurity to the data. Is it overkill? Almost certainly, however it enhances the data through additional layers of encryption with various algorithms and adds some header info that is encrypted with a different key, so any attempts to decrypt the data as a whole will fail. You must know (or guess) that there is some information at the beginning that is separately encrypted and remove the right number of bytes. Of course if you know the data was encrypted with this package then it's pretty simple to reverse engineer (or just use this package with the right password), but knowing that and or finding this package based on the encrypted information alone is hard to do, depending on the way the information was hacked. The header information itself contains the data to tell this package what algorithm to decrypt at each layer, but that information is itself encrypted and not stored in plain text in this project. Lastly, using multiple layers of encryption might protect you if a particular algorithm becomes susceptible to hacks through future discovereries or technological advances. Nothing is hack proof, but this tries to make it very difficult to break without having the required information.  

### How do I use this?

```
import { encrypt, decrypt } from 'simply-encrypt'

const data = 'Your data'
const encryptedData = encrypt(Buffer.from(data), 'your_password_here')
const decryptedData = decrypt(encryptedData, 'your_password_here')
const convertedDecryptedData = decryptedData.toString('utf-8') // This will vary based on your original data type
```

#### Define an encryption algorithm
```
encrypt(Buffer.from(data), 'your_password_here', 'AES_CBC_256')
```

#### Use multiEncrypt for additional security
```
multiEncrypt(Buffer.from(data), 'your_password_here', ['AES_CBC_256', 'CHACHA_20_POLY_1305'])
```

### Why don't you support _____ feature?

I built this to serve a pretty simple purpose, encrypt filenames for a backup process. It has expanded to serve more than just that and my goal for this package is to be a one stop shop for encryption. If there is something you want to see implemented, please add a feature request in github. I value your use case just as much as mine and I want to see this package serve your encryption needs.