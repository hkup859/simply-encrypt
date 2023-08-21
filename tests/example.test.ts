import { encrypt, decrypt } from '../index'
describe('Initial Test Suite', () => {
  it('Encrypt String', () => {
    const secretMessage = 'This is TOP secret'
    const encryptedMessage = encrypt(Buffer.from(secretMessage), 'testpassword', 'aes-256-cbc')
    const decryptedMessage = decrypt(encryptedMessage, 'testpassword', 'aes-256-cbc').toString('utf-8')
    expect(secretMessage).toEqual(decryptedMessage)
  })
})