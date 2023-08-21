import { encrypt, decrypt } from '../index'
describe('Initial Test Suite', () => {
  it('Encrypt String', () => {
    const secretMessage = 'This is TOP secret'
    const encryptedMessage = encrypt(Buffer.from(secretMessage), 'testpassword', 'AES_CBC_256')
    const decryptedMessage = decrypt(encryptedMessage, 'testpassword', 'AES_CBC_256').toString('utf-8')
    expect(secretMessage).toEqual(decryptedMessage)
  })
})