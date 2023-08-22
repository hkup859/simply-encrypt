import { encrypt, decrypt } from '../index'
describe('Initial Test Suite', () => {
  it('Encrypt String Buffer', () => {
    const secretMessage = 'This is TOP secret'
    const encryptedMessage = encrypt(Buffer.from(secretMessage), 'testpassword', 'AES_CBC_256')
    const decryptedMessage = decrypt(encryptedMessage, 'testpassword', 'AES_CBC_256').toString('utf-8')
      expect(secretMessage).toEqual(decryptedMessage)
  })
  it('Encrypt Simple JSON Buffer', () => {
    const secretMessage = {data: 'This is TOP secret'}
    const encryptedMessage = encrypt(Buffer.from(JSON.stringify(secretMessage)), 'testpassword', 'AES_CBC_256')
    const decryptedMessage = JSON.parse(decrypt(encryptedMessage, 'testpassword', 'AES_CBC_256').toString('utf-8'))
      expect(secretMessage).toEqual(decryptedMessage)
  })
    it('Encrypt Number Buffer', () => {
    const secretMessage = 123
    const encryptedMessage = encrypt(Buffer.from(secretMessage.toString()), 'testpassword', 'AES_CBC_256')
    const decryptedMessage = decrypt(encryptedMessage, 'testpassword', 'AES_CBC_256').toString('utf-8')
      expect(secretMessage).toEqual(Number(decryptedMessage))
  })
  // TODO - waiting on function changes
  /*it('Encrypt Simple JSON - Raw', () => {
    const secretMessage = {data: 'This is TOP secret'}
    const encryptedMessage = encrypt(secretMessage, 'testpassword', 'AES_CBC_256')
    const decryptedMessage = decrypt(encryptedMessage, 'testpassword', 'AES_CBC_256')
       expect(secretMessage).toEqual(decryptedMessage)
  })*/
})